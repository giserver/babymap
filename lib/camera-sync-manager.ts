import * as BABYLON from '@babylonjs/core';
import { constants } from './utils';
import { math } from './utils/math';

export class CameraSyncManager {
    readonly world: BABYLON.AbstractMesh;

    private state = {
        fov: 0.6435011087932844,
        translateCenter: BABYLON.Matrix.Translation(constants.WORLD_SIZE / 2, -constants.WORLD_SIZE / 2, 0),
        worldSizeRatio: 512 / constants.WORLD_SIZE,
        cameraToCenterDistance: 0,
        cameraTranslateZ: new BABYLON.Matrix(),
        topHalfSurfaceDistance: 0
    };

    /**
     *
     */
    constructor(private map: IMap, private camera: BABYLON.Camera, world?: BABYLON.AbstractMesh) {
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
        const map = this.map as (maplibregl.Map | mapboxgl.Map);
        const t = map.transform;
        const halfFov = this.state.fov / 2;
        const cameraToCenterDistance = 0.5 / Math.tan(halfFov) * t.height;
        const groundAngle = Math.PI / 2 + math.radify(t.pitch);

        this.state.cameraToCenterDistance = cameraToCenterDistance;
        this.state.cameraTranslateZ = BABYLON.Matrix.Translation(0, 0, cameraToCenterDistance);
        this.state.topHalfSurfaceDistance = Math.sin(halfFov) * cameraToCenterDistance / Math.sin(Math.PI - groundAngle - halfFov);

        this.updateCamera();
    }

    updateCamera() {
        const map = this.map as (maplibregl.Map | mapboxgl.Map);
        const t = map.transform;

        // Calculate z distance of the farthest fragment that should be rendered.
        const furthestDistance = Math.cos(Math.PI / 2 - math.radify(t.pitch)) * this.state.topHalfSurfaceDistance + this.state.cameraToCenterDistance;

        // Add a bit extra to avoid precision problems when a fragment's distance is exactly `furthestDistance`
        const farZ = furthestDistance * 1.01;
    
        this.camera.freezeProjectionMatrix(math.makePerspectiveMatrix(this.state.fov, t.width / t.height, 1, farZ));

        const rotatePitch = BABYLON.Matrix.RotationX(math.radify(t.pitch));
        const rotateBearing = BABYLON.Matrix.RotationZ(-math.radify(t.bearing));

        const cameraWorldMatrix = BABYLON.Matrix.Identity()
            .multiply(this.state.cameraTranslateZ)
            .multiply(rotatePitch)
            .multiply(rotateBearing);

        const cameraRotationQuaternion = BABYLON.Quaternion.Zero();
        const cameraPosition = BABYLON.Vector3.Zero();
        cameraWorldMatrix.decompose(undefined, cameraRotationQuaternion, cameraPosition);

        (this.camera as BABYLON.FreeCamera).rotationQuaternion = cameraRotationQuaternion;
        this.camera.position = cameraPosition;

        const zoomPow = t.scale * this.state.worldSizeRatio;
        // Handle scaling and translation of objects in the map in the world's matrix transform, not the camera
        const scale = BABYLON.Matrix.Scaling(zoomPow, zoomPow, zoomPow);
        const p = (t as any).point ?? (t as any)._cameraPosition;
        const x = p instanceof Array ? p[0] : p.x;
        const y = p instanceof Array ? p[1] : p.y;
        const translateMap = BABYLON.Matrix.Translation(-x, y, 0);
        const rotateMap = BABYLON.Matrix.RotationZ(Math.PI);

        this.world!.freezeWorldMatrix(BABYLON.Matrix.Identity()
            .multiply(rotateMap)
            .multiply(this.state.translateCenter)
            .multiply(scale)
            .multiply(translateMap));
    }
}