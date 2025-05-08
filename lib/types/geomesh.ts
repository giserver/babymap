import * as BABYLON from '@babylonjs/core';

import { MercatorCoordinate } from '../utils/mercator-coordinate';

export class GeoMesh {
    /**
     *
     */
    constructor(readonly mesh: BABYLON.AbstractMesh, private position: [number, number, number]) {

    }

    get scene() {
        return this.mesh._scene;
    }

    get camera(){
        return this.scene.activeCamera!;
    }

    get worldMatrix() {

        // Babylon.js default coordinate system
        // +x east, +y up, +z north
        const worldRotate = [Math.PI / 2, 0, 0];


        // Calculate mercator coordinates and scale
        const worldOriginMercator = MercatorCoordinate.fromLngLat(
            [this.position[0], this.position[1]],
            this.position[2]
        );
        const worldScale = worldOriginMercator.meterInMercatorCoordinateUnits();

        return BABYLON.Matrix.Compose(
            new BABYLON.Vector3(worldScale, worldScale, worldScale),
            BABYLON.Quaternion.FromEulerAngles(
                worldRotate[0],
                worldRotate[1],
                worldRotate[2]
            ),
            new BABYLON.Vector3(
                worldOriginMercator.x,
                worldOriginMercator.y,
                worldOriginMercator.z
            ));
    }

    setLngLat(lnglat: [number, number]) {
        this.position[0] = lnglat[0];
        this.position[1] = lnglat[1];
    }

    setAltitude(altitude: number) {
        this.position[2] = altitude;
    }
}