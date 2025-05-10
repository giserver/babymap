import * as BABYLON from '@babylonjs/core';
import { GLTFFileLoader } from "@babylonjs/loaders";
import { GeoMesh } from './geomesh';

export class BabylonMapLayer {
    readonly type: "custom" = "custom";
    readonly renderingMode?: "2d" | "3d" | undefined = "3d";

    private declare map: IMap;
    private declare bjsEngine: BABYLON.Engine;
    private geoMeshes = new Map<string, GeoMesh>();

    /**
     *
     */
    constructor(readonly id: string) {
        BABYLON.RegisterSceneLoaderPlugin(new GLTFFileLoader());
    }

    render(gl: WebGLRenderingContext | WebGL2RenderingContext, args: Array<number> | { defaultProjectionData: { mainMatrix: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number] | Float32Array<ArrayBufferLike> } }) {
        const matrix = args instanceof Array ? args : args.defaultProjectionData.mainMatrix;
        const cameraMatrix = BABYLON.Matrix.FromArray(matrix);

        this.geoMeshes.forEach(geoMesh => {
            const wvpMatrix = geoMesh.worldMatrix.multiply(cameraMatrix);
            geoMesh.camera.freezeProjectionMatrix(wvpMatrix);
            geoMesh.scene.render(false);
        });

        this.map.triggerRepaint();
    }

    onAdd(map: IMap, gl: WebGL2RenderingContext) {
        this.map = map;

        this.bjsEngine = new BABYLON.Engine(
            gl,
            true,
            {
                useHighPrecisionMatrix: true // Important to prevent jitter at mercator scale
            },
            true
        );
    }
    onRemove(map: IMap, gl: WebGL2RenderingContext) {

    }

    
    getGeoMesh(id: string){
        return this.geoMeshes.get(id);
    }

    async addGltfModal(id: string, url: string, position: [number, number, number]) {
        const scene = this.createScene();
        const container = await BABYLON.LoadAssetContainerAsync(url, scene);
        const rootMesh = container.createRootMesh();
        container.addAllToScene();

        return this.addGeoMesh(id, rootMesh, position);
    }

    async addMesh(id: string, mesh: BABYLON.AbstractMesh, position: [number, number, number]){
        const scene = this.createScene();
        scene.addMesh(mesh);
        return this.addGeoMesh(id, mesh, position);
    }

    private addGeoMesh(id: string, mesh: BABYLON.AbstractMesh, position: [number, number, number]) {
        const geoMesh = new GeoMesh(mesh, position);
        this.geoMeshes.set(id, geoMesh);
        return geoMesh;
    }

    private createScene(){
        const scene = new BABYLON.Scene(this.bjsEngine);
        scene.autoClear = false;
        scene.detachControl();
        scene.beforeRender = () => {
            this.bjsEngine.wipeCaches(true);
        };
        scene.createDefaultCameraOrLight();

        return scene;
    }
}