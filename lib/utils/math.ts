import * as BABYLON from '@babylonjs/core';
import { constants } from './constants';
import { TPosition } from '../types';

const MAX_VALID_LATITUDE = 85.051129;
export namespace math {
    export function prettyPrintMatrix(matrix: BABYLON.Matrix) {
        console.log("--------- matrix ---------")
        const arr = matrix.asArray();
        for (let i = 0; i < 4; i++) {
            const quartet = [
                arr[i],
                arr[i + 4],
                arr[i + 8],
                arr[i + 12]];

            console.log(quartet.map(function (num) { return num.toFixed(4) }))
        }

        console.log("--------- ----- ---------")
    }

    export function radify(deg: number): number;
    export function radify(deg: Array<number>): Array<number>;
    export function radify(deg: { x: number, y: number, z: number }): { x: number, y: number, z: number };
    export function radify(deg: number | Array<number> | { x: number, y: number, z: number }): number | Array<number> | { x: number, y: number, z: number } {
        if (typeof deg === 'number') return deg * constants.DEG2RAD;
        if (deg instanceof Array) return deg.map(x => x * constants.DEG2RAD);
        else return { x: deg.x * constants.DEG2RAD, y: deg.y * constants.DEG2RAD, z: deg.z * constants.DEG2RAD };
    }

    export function degreeify(rad: number): number;
    export function degreeify(rad: Array<number>): Array<number>;
    export function degreeify(rad: { x: number, y: number, z: number }): { x: number, y: number, z: number };
    export function degreeify(rad: number | Array<number> | { x: number, y: number, z: number }): number | Array<number> | { x: number, y: number, z: number } {
        if (typeof rad === 'number') return rad * constants.RAD2DEG;
        if (rad instanceof Array) return rad.map(x => x * constants.RAD2DEG);
        else return { x: rad.x * constants.RAD2DEG, y: rad.y * constants.RAD2DEG, z: rad.z * constants.RAD2DEG };
    }

    export function projectedUnitsPerMeter(latitude: number) {
        return Math.abs(constants.WORLD_SIZE / Math.cos(constants.DEG2RAD * latitude) / constants.EARTH_CIRCUMFERENCE);
    }

    export function projectToWorld(coords: number[]) {

        // Spherical mercator forward projection, re-scaling to WORLD_SIZE

        var projected = [
            -constants.MERCATOR_A * constants.DEG2RAD * coords[0] * constants.PROJECTION_WORLD_SIZE,
            -constants.MERCATOR_A * Math.log(Math.tan((Math.PI * 0.25) + (0.5 * constants.DEG2RAD * coords[1]))) * constants.PROJECTION_WORLD_SIZE
        ];

        //z dimension, defaulting to 0 if not provided

        if (!coords[2]) projected.push(0)
        else {
            var pixelsPerMeter = projectedUnitsPerMeter(coords[1]);
            projected.push(coords[2] * pixelsPerMeter);
        }

        return new BABYLON.Vector3(projected[0], projected[1], projected[2]);
    }

    export function unprojectFromWorld(coords: BABYLON.Vector3): number[];
    export function unprojectFromWorld(coords: number[]): number[];
    export function unprojectFromWorld(coords: number[] | BABYLON.Vector3): number[] {
        if (!(coords instanceof Array)) {
            coords = [coords.x, coords.y, coords.z]
        }

        var unprojected = [
            -coords[0] / (constants.MERCATOR_A * constants.DEG2RAD * constants.PROJECTION_WORLD_SIZE),
            2 * (Math.atan(Math.exp(coords[1] / (constants.PROJECTION_WORLD_SIZE * (-constants.MERCATOR_A)))) - Math.PI / 4) / constants.DEG2RAD
        ];

        var pixelsPerMeter = projectedUnitsPerMeter(unprojected[1]);

        //z dimension
        var height = coords[2] || 0;
        unprojected.push(height / pixelsPerMeter);

        return unprojected;
    }

    export function clamp(n: number, min: number, max: number) {
        return Math.min(max, Math.max(min, n));
    }

    export function mercatorXfromLng(lng: number) {
        return (180 + lng) / 360;
    }

    export function mercatorYfromLat(lat: number) {
        return (180 - (180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)))) / 360;
    }

    export function projectToWorldCoordinates(worldSize: number, lnglat: { lng: number, lat: number }): { x: number, y: number } {
        const lat = clamp(lnglat.lat, -MAX_VALID_LATITUDE, MAX_VALID_LATITUDE);
        return { x: mercatorXfromLng(lnglat.lng) * worldSize, y: mercatorYfromLat(lat) * worldSize };
    }

    export function positionArray(position: TPosition): [number, number, number] {
        if (position instanceof Array) {
            if (position.length === 2)
                position.push(0);

            return position as [number, number, number];
        };
        return [position.lng, position.lat, position.alt ?? 0];
    }
}