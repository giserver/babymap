import * as BABYLON from '@babylonjs/core';
import { constants, math } from './utils';
import {TMap} from './types'

export class CameraSyncManager {
    readonly world: BABYLON.AbstractMesh;

    private state = {
        translateCenter: BABYLON.Matrix.Translation(constants.WORLD_SIZE / 2, -constants.WORLD_SIZE / 2, 0),
        worldSizeRatio: constants.TILE_SIZE / constants.WORLD_SIZE,
    };

    /**
     *
     */
    constructor(private map: TMap, private camera: BABYLON.Camera, world?: BABYLON.AbstractMesh) {
        this.world = world ?? new BABYLON.Mesh("babylon-map-world", camera.getScene());
        this.world.position.x = this.world.position.y = constants.WORLD_SIZE / 2;

        map.on("move", () => {
            this.updateCamera();
        });

        map.on("resize", () => {
            this.setupCamera();
        });

        this.setupCamera();
    }

    setupCamera() {
        // const map = this.map as (maplibregl.Map | mapboxgl.Map);
        // const t = map.transform;
        // const halfFov = t.fov / 2;
        // const cameraToCenterDistance = 0.5 / Math.tan(halfFov) * t.height;
        // const groundAngle = Math.PI / 2 + math.radify(t.pitch);

        // this.state.cameraToCenterDistance = cameraToCenterDistance;
        // this.state.cameraTranslateZ = BABYLON.Matrix.Translation(0, 0, cameraToCenterDistance);
        // this.state.topHalfSurfaceDistance = Math.sin(halfFov) * cameraToCenterDistance / Math.sin(Math.PI - groundAngle - halfFov);

        this.updateCamera();
    }

    updateCamera() {
        const map = this.map;
        const t = map.transform;

        const fovRad = math.radify(t.fov);
        const halfFov = fovRad / 2;
        const pitchRad = math.radify(t.pitch);
        const pitchAngle = Math.cos((Math.PI / 2) - pitchRad); //pitch seems to influence heavily the depth calculation and cannot be more than 60 = PI/3 < v1 and 85 > v2
        const groundAngle = Math.PI / 2 + pitchRad;
        const offset = t.centerOffset;
        const worldSize = t.tileSize * t.scale;
        const pixelsPerMeter = this.mercatorZfromAltitude(1, t.center.lat) * worldSize;
        const fovAboveCenter = fovRad * (0.5 + offset.y / t.height);
        const cameraToCenterDistance = 0.5 / Math.tan(halfFov) * t.height;

        const cameraZ = t._camera?.position[2] ?? 0;

        // Adjust distance to MSL by the minimum possible elevation visible on screen,
        // this way the far plane is pushed further in the case of negative elevation.
        const minElevationInPixels = t.elevation ? (typeof t.elevation === "number" ? (t as any).minElevationForCurrentTile : t.elevation.getMinElevationBelowMSL()) * pixelsPerMeter : 0;
        const cameraToSeaLevelDistance = ((cameraZ * worldSize) - minElevationInPixels) / Math.cos(pitchRad);
        const topHalfSurfaceDistance = Math.sin(fovAboveCenter) * cameraToSeaLevelDistance / Math.sin(math.clamp(Math.PI - groundAngle - fovAboveCenter, 0.01, Math.PI - 0.01));

        // Calculate z distance of the farthest fragment that should be rendered.
        const furthestDistance = cameraZ ? pitchAngle * topHalfSurfaceDistance + cameraToSeaLevelDistance :
            pitchAngle * Math.sin(halfFov) * cameraToCenterDistance / Math.sin(Math.PI - groundAngle - halfFov) + cameraToCenterDistance;

        // Add a bit extra to avoid precision problems when a fragment's distance is exactly `furthestDistance`
        const horizonDistance = (t as any)["_horizonShift"] ? cameraToSeaLevelDistance * (1 / (t as any)._horizonShift) : Number.MAX_VALUE;
        const farZ = Math.min(furthestDistance * 1.01, horizonDistance);
        const nz = (t.height / 50); //min near z as coded by @ansis
        const nearZ = Math.max(nz * pitchAngle, nz); //on changes in the pitch nz could be too low

        const cameraProjectionMatrix = BABYLON.Matrix.PerspectiveFovRH(fovRad, t.width / t.height, nearZ, farZ);
        cameraProjectionMatrix.addAtIndex(8, -offset.x * 2 / t.width);
        cameraProjectionMatrix.addAtIndex(9, offset.y * 2 / t.height);
        this.camera.freezeProjectionMatrix(cameraProjectionMatrix);

        //#region set babylonjs camera worldmatrix
        const cameraTranslateZ = BABYLON.Matrix.Translation(0, 0, cameraToCenterDistance);
        const rotatePitch = BABYLON.Matrix.RotationX(pitchRad);
        const rotateBearing = BABYLON.Matrix.RotationZ(-math.radify(t.bearing));

        const cameraWorldMatrix = BABYLON.Matrix.Identity()
            .multiply(cameraTranslateZ)
            .multiply(rotatePitch)
            .multiply(rotateBearing);
        if (t.elevation && cameraZ) cameraWorldMatrix.addAtIndex(14, cameraZ * worldSize);
        const cameraRotationQuaternion = BABYLON.Quaternion.Zero();
        const cameraPosition = BABYLON.Vector3.Zero();
        const cameraScale = BABYLON.Vector3.Zero();
        cameraWorldMatrix.decompose(cameraScale, cameraRotationQuaternion, cameraPosition);
        (this.camera as BABYLON.FreeCamera).rotationQuaternion = cameraRotationQuaternion;
        this.camera.position = cameraPosition;
        //#endregion


        //#region set world node worldmatrix
        const point = (t as any).point ?? math.projectToWorldCoordinates(t.worldSize, t.center); // adapt to maplibre v5
        const pointX = point.x;
        const pointY = point.y;
        const zoomPow = t.scale * this.state.worldSizeRatio;
        // Handle scaling and translation of objects in the map in the world's matrix transform, not the camera
        const scale = BABYLON.Matrix.Scaling(zoomPow, zoomPow, zoomPow);
        const translateMap = BABYLON.Matrix.Translation(-pointX, pointY, 0);
        const rotateMap = BABYLON.Matrix.RotationZ(Math.PI);

        this.world!.freezeWorldMatrix(BABYLON.Matrix.Identity()
            .multiply(rotateMap)
            .multiply(this.state.translateCenter)
            .multiply(scale)
            .multiply(translateMap));
        //#endregion
    }

    private mercatorZfromAltitude(altitude: number, lat: number) {
        return altitude / this.circumferenceAtLatitude(lat);
    }

    private circumferenceAtLatitude(latitude: number) {
        return constants.EARTH_CIRCUMFERENCE * Math.cos(math.radify(latitude));
    }
}