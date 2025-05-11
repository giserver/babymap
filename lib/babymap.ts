import * as BABYLON from '@babylonjs/core';
import { GLTFFileLoader } from '@babylonjs/loaders';
import { CameraSyncManager } from './camera-sync-manager';
import { math } from './utils';

export class BabyMap {
    readonly bjsEngine: BABYLON.Engine;
    readonly bjsScene: BABYLON.Scene;
    readonly cameraSyncManager: CameraSyncManager

    /**
     *
     */
    constructor(private map: IMap) {
        BABYLON.RegisterSceneLoaderPlugin(new GLTFFileLoader());

        this.bjsEngine = new BABYLON.Engine(map.getCanvas(), true, { useHighPrecisionMatrix: true }, true);
        const scene = new BABYLON.Scene(this.bjsEngine, {});
        scene.autoClear = false;
        scene.detachControl();
        scene.beforeRender = () => {
            this.bjsEngine.wipeCaches(true);
        };
        scene.createDefaultCameraOrLight(false, false, true);
        this.bjsScene = scene;

        this.cameraSyncManager = new CameraSyncManager(map, scene.activeCamera!);

        (scene.lights[0] as BABYLON.HemisphericLight).direction.y = -0.5;
        const sunlight = new BABYLON.DirectionalLight("babymap-sun-light", new BABYLON.Vector3(0, 0.5, 0), scene);
        sunlight.position.set(0, 80000000, -100000000);
        sunlight.autoUpdateExtends = true;

        scene.lights.forEach(l => {
            l.parent = this.cameraSyncManager.world;
        });

        const that = this;
        map.addLayer({
            id: "babymap-layer",
            type: 'custom',
            renderingMode: '3d',

            onAdd(map: IMap, gl: any) {

            },
            render() {
                that.bjsScene.render(false);
                that.map.triggerRepaint();
            }
        });
    }

    async addGltfModal(url: string, position: [number, number, number]) {
        const container = await BABYLON.LoadAssetContainerAsync(url, this.bjsScene);
        const rootMesh = container.createRootMesh();
        rootMesh.position = math.projectToWorld(position);
        rootMesh.rotation.x = Math.PI / 2;
        rootMesh.scaling.x = -1;
        // const s = math.projectedUnitsPerMeter(position[1]);
        // rootMesh.scaling.set(s,s,s);
        container.addAllToScene();
        rootMesh.parent = this.cameraSyncManager.world;

        container.meshes.forEach(m => {
            if (m.material) {
                // m.material.backFaceCulling = false;
                m.material.sideOrientation = 1;
            }
        });
    }
}