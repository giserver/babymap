import * as BABYLON from '@babylonjs/core';
import { TMeshUnits, TPosition } from '../types';
import { math } from '../utils';

export type TGeoMeshCreateOptions = {
    id: string,
    world: BABYLON.AbstractMesh,
    position: TPosition,
    scale?: number,
    units?: TMeshUnits
}

export type TGeoMeshFromAssetContainerOptions = TGeoMeshCreateOptions & {
    container: BABYLON.AssetContainer
};

export class GeoMesh {

    private constructor(
        readonly id: string,
        readonly rootMesh: BABYLON.AbstractMesh,
        readonly originMeshes: BABYLON.AbstractMesh[],
        readonly animationGroups: BABYLON.AnimationGroup[]) {
    }

    static fromAssetContainer(
        { id, container, position, world, units, scale }: TGeoMeshFromAssetContainerOptions) {

        position = math.positionArray(position);
        scale ??= 1;

        const rootMesh = container.createRootMesh();
        rootMesh.name = id;
        rootMesh.position = math.projectToWorld(position);
        rootMesh.rotation.x = Math.PI / 2;

        // x设置为复数的作用是模型左右反了
        if (units === 'lnglat') {
            rootMesh.scaling.set(-scale, scale, scale);
        } else {
            const s = math.projectedUnitsPerMeter(position[1]) * scale;
            rootMesh.scaling.set(-s, s, s);
        }

        // 不知道为什么，贴图贴反了
        container.materials.forEach(m => {
            m.sideOrientation = 1;
        });

        container.animationGroups.forEach(g=>g.stop());

        container.addAllToScene();
        rootMesh.parent = world;
        return new GeoMesh(id, rootMesh, container.meshes, container.animationGroups);
    }

    remove() {
        this.rootMesh.getScene().removeMesh(this.rootMesh);
    }

    setPosition(position: TPosition) {
        this.rootMesh.position = math.projectToWorld(math.positionArray(position));
    }
}