import * as BABYLON from '@babylonjs/core';
import { TPosition } from "../types";
import { math } from "../utils";

export namespace GeoMeshBuilder {
    type TResult = {
        mesh: BABYLON.AbstractMesh;
        position: TPosition;
    }

    export function createGreasedLine(options: {
        id: string,
        points: TPosition[],
        lineMeshBuilderOptions?: Omit<BABYLON.GreasedLineMeshBuilderOptions, "points">,
        lineMaterialBuilderOptions?: BABYLON.GreasedLineMaterialBuilderOptions
    }): TResult {
        const projectPoints = options.points.map(p => {
            return math.projectToWorld(p);
        });

        const lPoints = projectPoints.reduce((p, c) => {
            p.push(c.subtract(projectPoints[0]))
            return p;
        }, new Array<BABYLON.Vector3>);

        const lineMeshBuilderOptions = options.lineMeshBuilderOptions ?? {};
        lineMeshBuilderOptions.widths ??= new Array<number>(lPoints.length * 2).fill(50);

        const lineMaterialBuilderOptions = options.lineMaterialBuilderOptions ?? {};
        lineMaterialBuilderOptions.color ??= BABYLON.Color3.Red();

        const mesh = BABYLON.CreateGreasedLine(options.id, {
            points: lPoints,
            ...lineMeshBuilderOptions
        }, lineMaterialBuilderOptions);

        return {
            mesh,
            position: options.points[0]
        }
    }
}