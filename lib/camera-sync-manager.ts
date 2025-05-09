import { IMap } from './types'
import * as BABYLON from '@babylonjs/core';
import { constants } from './utils';

export class CameraSyncManager {
    private state = {
        fov: 0.6435011087932844,
        translateCenter: new BABYLON.Matrix(),
        worldSizeRatio: 512 / constants.WORLD_SIZE
    };

    /**
     *
     */
    constructor(private map: IMap, private camera: BABYLON.Camera, private world?: BABYLON.AbstractMesh) {
        this.world ??= new BABYLON.Mesh("babylon-map-world", camera.getScene());
        this.world.position.x = this.world.position.y = constants.WORLD_SIZE / 2;

        this.state.translateCenter.setTranslation(new BABYLON.Vector3(constants.WORLD_SIZE / 2, -constants.WORLD_SIZE / 2, 0));

        map.on("move",()=>{
            this.updateCamera();
        });

        map.on("resize",()=>{
            this.setupCamera();
        });

        this.setupCamera();
    }

    setupCamera(){
        
    }

    updateCamera(){

    }
}