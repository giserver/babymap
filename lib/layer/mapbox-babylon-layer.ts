import * as mapboxgl from "mapbox-gl";
import * as BABYLON from '@babylonjs/core';
import { GLTFFileLoader } from "@babylonjs/loaders";
import { GeoMesh } from '../types/geomesh';

export class MapboxBabylonLayer implements mapboxgl.CustomLayerInterface {
    readonly type: "custom" = "custom";
    readonly renderingMode?: "2d" | "3d" | undefined = "3d";

    private declare map: mapboxgl.Map;
    private declare bjsEngine: BABYLON.Engine;
    private geoMeshes = new Map<string, GeoMesh>();

    /**
     *
     */
    constructor(readonly id: string) {
        BABYLON.RegisterSceneLoaderPlugin(new GLTFFileLoader());
    }

    render(gl: WebGL2RenderingContext, matrix: Array<number>, projection?: mapboxgl.ProjectionSpecification, projectionToMercatorMatrix?: Array<number>, projectionToMercatorTransition?: number, centerInMercator?: Array<number>, pixelsPerMeterRatio?: number) {
        this.geoMeshes.forEach(geoMesh => {
            const cameraMatrix = BABYLON.Matrix.FromArray(matrix);
            const wvpMatrix = geoMesh.worldMatrix.multiply(cameraMatrix);
            geoMesh.camera.freezeProjectionMatrix(wvpMatrix);
            geoMesh.scene.render(false);
        });

        this.map.triggerRepaint();
    }

    onAdd(map: mapboxgl.Map, gl: WebGL2RenderingContext) {
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
    onRemove(map: mapboxgl.Map, gl: WebGL2RenderingContext) {

    }

    async addGltfModal(id: string, url: string, position: [number, number, number]) {
        const scene = new BABYLON.Scene(this.bjsEngine);
        scene.autoClear = false;
        scene.detachControl();
        scene.beforeRender = () => {
            this.bjsEngine.wipeCaches(true);
        };
        scene.createDefaultCameraOrLight();

        const container = await BABYLON.LoadAssetContainerAsync(url, scene);
        const rootMesh = container.createRootMesh();
        container.addAllToScene();

        return this.addGeoMesh(id, rootMesh, position);
    }

    addGeoMesh(id: string, mesh: BABYLON.AbstractMesh, position: [number, number, number]) {
        const geoMesh =  new GeoMesh(mesh, position);
        this.geoMeshes.set(id,geoMesh);
        return geoMesh;
    }
}