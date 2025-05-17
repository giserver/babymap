import * as BABYLON from '@babylonjs/core';
import { GLTFFileLoader } from '@babylonjs/loaders';
import { CameraSyncManager } from './camera';
import { TMap, TMeshUnits, TPosition } from './types';
import { GeoMesh } from './mesh';

export type TModelGeometryOptions = {
    position: TPosition,
    scale?: number,
    units?: TMeshUnits
}

export type TGltfModelOptions = {
    type: "gltf",
    id: string,
    url: string,
} & TModelGeometryOptions;

export type TAnyModelOptions = TGltfModelOptions

export class BabyMap {
    readonly customLayerId = "babymap-layer";
    readonly bjsEngine: BABYLON.Engine;
    readonly bjsScene: BABYLON.Scene;
    readonly cameraSyncManager: CameraSyncManager

    /**
     *
     */
    constructor(private map: TMap) {
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
            id: this.customLayerId,
            type: 'custom',
            renderingMode: '3d',

            onAdd(map: TMap, gl: any) {

            },
            render() {
                that.bjsScene.render(false);
                that.map.triggerRepaint();
            }
        });
    }

    async addModel(options: TAnyModelOptions) {
        if (options.type === 'gltf') {
            const container = await BABYLON.LoadAssetContainerAsync(options.url, this.bjsScene);

            return GeoMesh.fromAssetContainer({
                ...options,
                container,
                world: this.cameraSyncManager.world
            })
        }
    }
}