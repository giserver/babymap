import * as BABYLON from "@babylonjs/core";
import { GLTFFileLoader } from "@babylonjs/loaders";
import { CameraSyncManager } from "./camera";
import { TMap } from "./types";
import {
  GeoMesh,
  GizmoManager,
  TGeoMeshFromAbstractMeshOptions,
  TGeoMeshFromAssetContainerOptions,
} from "./mesh";

export type TGltfModelOptions = {
  type: "gltf";
  url: string;
} & Omit<Omit<TGeoMeshFromAssetContainerOptions, "world">, "container">;

export type TModelOptions = {
  type: "mesh";
} & Omit<TGeoMeshFromAbstractMeshOptions, "world">;

export type TAnyModelOptions = TGltfModelOptions | TModelOptions;

export type TBabyMapOptions = {
  onPicked?: (mesh: GeoMesh) => void;
};

export class BabyMap {
  readonly customLayerId = "babymap-layer";
  readonly bjsEngine: BABYLON.Engine;
  readonly bjsScene: BABYLON.Scene;
  readonly cameraSyncManager: CameraSyncManager;
  readonly gizmoManager: GizmoManager;

  private geoMeshes = new Map<string, GeoMesh>();

  /**
   *
   */
  constructor(private map: TMap, options: TBabyMapOptions = {}) {
    BABYLON.RegisterSceneLoaderPlugin(new GLTFFileLoader());

    this.bjsEngine = new BABYLON.Engine(
      map.getCanvas(),
      true,
      { useHighPrecisionMatrix: true },
      true
    );
    const scene = new BABYLON.Scene(this.bjsEngine, {});
    scene.autoClear = false;
    scene.detachControl();
    scene.beforeRender = () => {
      this.bjsEngine.wipeCaches(true);
    };
    scene.createDefaultCamera(false, false, true);
    (scene.defaultMaterial as BABYLON.StandardMaterial).sideOrientation = 0;
    this.bjsScene = scene;

    this.cameraSyncManager = new CameraSyncManager(map, scene.activeCamera!);
    this.gizmoManager = new GizmoManager(this.bjsScene);

    const light1 = new BABYLON.HemisphericLight(
      "light-default1",
      new BABYLON.Vector3(0, -1.5, 1),
      scene
    );
    light1.intensity = 0.5;
    const light2 = new BABYLON.HemisphericLight(
      "light-default2",
      new BABYLON.Vector3(0, 0.5, 1),
      scene
    );
    light2.intensity = 0.5;

    const that = this;
    map.addLayer({
      id: this.customLayerId,
      type: "custom",
      renderingMode: "3d",

      onAdd(map: TMap, gl: any) {},
      render() {
        that.bjsScene.render(false);
        that.map.triggerRepaint();
      },
    });

    this.bjsScene.onPointerDown = (_, pickInfo) => {
      if (pickInfo.pickedMesh) {
        const geomesh = this.findGeoMeshBySubMesh(pickInfo.pickedMesh);
        if (geomesh?.pickable) {
          options.onPicked?.(geomesh);
        }
      }
    };

    // (map as any).on(
    //   "click",
    //   ({ point }: { point: { x: number; y: number } }) => {
    //     const geoMesh = this.getGeoMeshByScreenPoint(point.x, point.y);
    //     if (geoMesh) {
    //       console.log(geoMesh);
    //       options.onPicked?.(geoMesh);
    //     }
    //   }
    // );
  }

  async addModel(options: TAnyModelOptions) {
    if (this.geoMeshes.has(options.id))
      throw Error(`id: ${options.id} already existed`);

    let geoMesh: GeoMesh;

    if (options.type === "gltf") {
      const container = await BABYLON.LoadAssetContainerAsync(
        options.url,
        this.bjsScene
      );

      geoMesh = GeoMesh.fromAssetContainer({
        ...options,
        container,
        world: this.cameraSyncManager.world,
      });
    } else if (options.type === "mesh") {
      geoMesh = GeoMesh.fromAbstractMesh({
        ...options,
        world: this.cameraSyncManager.world,
      });
    }

    this.geoMeshes.set(options.id, geoMesh!);
  }

  /**
   * 删除geomesh
   * @param id
   */
  removeGeoMesh(id: string) {
    const geoMesh = this.geoMeshes.get(id);
    if (geoMesh) {
      geoMesh.remove();
      this.geoMeshes.delete(id);
    }
  }

  /**
   * 获取添加的geomeh时创建的rootmesh
   * @param id
   * @returns
   */
  getGeoMesh(id: string) {
    return this.geoMeshes.get(id);
  }

  /**
   * 根据屏幕坐标获取mesh
   * @param x
   * @param y
   * @returns
   */
  getGeoMeshByScreenPoint(x: number, y: number) {
    const mesh = this.bjsScene.pick(x, y, (m) => {
      const pm = this.findGeoMeshBySubMesh(m);
      return pm?.pickable === true;
    }).pickedMesh;

    if (mesh !== null) {
      return this.findGeoMeshBySubMesh(mesh);
    }
  }

  /**
   * 根据子节点找到对应的父级mesh
   *
   * 如：点击事件获取的是子mesh，查询创建geomesh时的rootmesh
   * @param subMesh
   * @returns
   */
  findGeoMeshBySubMesh(subMesh: BABYLON.Node) {
    function findParent(
      sub: BABYLON.Node,
      callback: (p: BABYLON.Node) => boolean
    ) {
      if (callback(sub)) return;

      if (sub.parent !== null) findParent(sub.parent, callback);
    }

    let result: GeoMesh | undefined;
    findParent(subMesh, (p) => {
      result = this.getGeoMesh(p.name);
      return result !== undefined;
    });

    return result;
  }
}
