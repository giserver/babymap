import * as BABYLON from '@babylonjs/core';
import { CameraSyncManager } from './camera-sync-manager';
import { math } from './utils/math';
import { GLTFFileLoader } from '@babylonjs/loaders';

export class BabyMap {
    readonly declare bjsEngine: BABYLON.Engine;
    readonly declare bjsScene: BABYLON.Scene;
    readonly declare cameraSyncManager: CameraSyncManager

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
        scene.createDefaultCameraOrLight();
        this.bjsScene = scene;

        this.cameraSyncManager = new CameraSyncManager(map, scene.activeCamera!);

        const sunlight = new BABYLON.DirectionalLight("123", new BABYLON.Vector3(0, -1, 0), scene);
        sunlight.position.set(0, 80000000, 100000000);
        sunlight.autoUpdateExtends = true;
        sunlight.parent = this.cameraSyncManager.world;

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
        container.addAllToScene();
        rootMesh.parent = this.cameraSyncManager.world;
    }
}