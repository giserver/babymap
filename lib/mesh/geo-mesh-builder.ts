import * as BABYLON from '@babylonjs/core';
import { TPosition } from "../types";
import { math } from "../utils";

export namespace GeoMeshBuilder {
    type TResult<TMesh extends BABYLON.AbstractMesh = BABYLON.AbstractMesh> = {
        mesh: TMesh;
        position: TPosition;
    }

    export function createGreasedLine(options: {
        id: string,
        points: TPosition[],
        lineMeshBuilderOptions?: Omit<BABYLON.GreasedLineMeshBuilderOptions, "points">,
        lineMaterialBuilderOptions?: BABYLON.GreasedLineMaterialBuilderOptions,
        scene?: BABYLON.Scene
    }): TResult<BABYLON.GreasedLineBaseMesh | BABYLON.GreasedLineMesh | BABYLON.GreasedLineRibbonMesh> {
        const projectPoints = options.points.map(p => {
            return math.projectToWorld(p);
        });

        const lPoints = projectPoints.reduce((p, c) => {
            p.push(c.subtract(projectPoints[0]))
            return p;
        }, new Array<BABYLON.Vector3>);

        const lineMeshBuilderOptions = options.lineMeshBuilderOptions ?? {};
        const lineMaterialBuilderOptions = options.lineMaterialBuilderOptions ?? {};
         lineMaterialBuilderOptions.width ??= 5;

        const mesh = BABYLON.CreateGreasedLine(options.id, {
            points: lPoints,
            ...lineMeshBuilderOptions
        }, lineMaterialBuilderOptions, options.scene);

        return {
            mesh,
            position: options.points[0]
        }
    }
}