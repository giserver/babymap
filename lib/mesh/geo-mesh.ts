import * as BABYLON from '@babylonjs/core';
import { TMeshUnits, TPosition } from '../types';
import { math } from '../utils';

type TGeoMeshFromAssetContainerOptions = {
    id: string,
    world: BABYLON.AbstractMesh,
    container: BABYLON.AssetContainer,
    position: TPosition,
    scale?: number,
    units?: TMeshUnits
};

type TGeoMeshFromAbstractMeshOptions = {
    id: string,
    world: BABYLON.AbstractMesh,
    mesh: BABYLON.AbstractMesh,
    position: TPosition,
    units?: TMeshUnits
}

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
        const s = math.projectedUnitsPerMeter(position[1]) * scale;
        rootMesh.scaling.set(-s, s, s);

        rootMesh.parent = world;

        // 不知道为什么，贴图贴反了
        container.materials.forEach(m => {
            m.sideOrientation = 1;
        });

        // 停止动画
        container.animationGroups.forEach(g => g.stop());

        container.addAllToScene();
        return new GeoMesh(id, rootMesh, container.meshes, container.animationGroups);
    }

    static fromAbstractMesh(options: TGeoMeshFromAbstractMeshOptions) {
        options.mesh.position = math.projectToWorld(options.position);
        options.mesh.parent = options.world;
        options.mesh.name = options.id;

        if (options.units === 'meter') {
            const position = math.positionArray(options.position);
            const s = math.projectedUnitsPerMeter(position[1]) * 1;
            options.mesh.scaling.set(-s, s, s);
        }

        return new GeoMesh(options.id, options.mesh, [options.mesh], []);
    }

    remove() {
        this.rootMesh.getScene().removeMesh(this.rootMesh);
    }

    setPosition(position: TPosition) {
        this.rootMesh.position = math.projectToWorld(position);
    }
}