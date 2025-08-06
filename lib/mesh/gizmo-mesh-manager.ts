import { GeoMesh } from "./geo-mesh";
import * as BABYLON from "@babylonjs/core";

export class GizmoManager {
  gizmoManager: BABYLON.GizmoManager;
  isKeyDown = false;
  constructor(public bjsScene: BABYLON.Scene) {
    this.gizmoManager = new BABYLON.GizmoManager(bjsScene);
    this.gizmoManager.positionGizmoEnabled = true;
    // this.gizmoManager.scaleGizmoEnabled = true;
    this.gizmoManager.rotationGizmoEnabled = true;

    this.gizmoManager.usePointerToAttachGizmos = false;

    window.addEventListener("keydown", (e) => this.attachControl(e), false);
    window.addEventListener("keyup", (e) => this.detachControl(e), false);
  }

  private attachControl(e: KeyboardEvent) {
    if (e.key.toLowerCase() === "control" && !this.isKeyDown) {
      this.isKeyDown = true;
      this.bjsScene.attachControl();
    }
  }
  private detachControl(e: KeyboardEvent) {
    if (e.key.toLowerCase() === "control") {
      this.isKeyDown = false;
      this.gizmoManager.attachToMesh(null);
      this.gizmoManager.attachableMeshes = [];
      this.bjsScene.detachControl();
    }
  }

  setMesh(mesh: GeoMesh) {
    if (this.isKeyDown) {
      console.log(mesh);
      this.gizmoManager.attachableMeshes = [mesh.rootMesh];
      this.gizmoManager.attachToMesh(mesh.rootMesh);
    }
  }

  destory() {
    window.removeEventListener("keydown", (e) => this.attachControl(e));
    window.removeEventListener("keyup", (e) => this.detachControl(e));
  }
}
