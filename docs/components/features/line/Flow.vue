<template>
    <Maps @mapbox-loaded="mapboxLoaded" @maplibre-loaded="maplibreLoaded" :center="[120, 30]" :zoom="14" direction="v">
    </Maps>
</template>

<script setup lang="ts">
import maplibregl from 'maplibre-gl';
import * as BABYLON from "@babylonjs/core";
import { BabyMap, GeoMeshBuilder } from '../../../../lib';
import Maps from '../../base/Maps.vue';

const points = [
    [119.987, 30.0026],
    [119.988, 30.0023],
    [119.989, 30.0021],
    [119.990, 30.0020],
    [119.991, 30.0019],
    [119.992, 30.0018],
    [119.993, 30.0017],
    [119.994, 30.0016],
    [119.995, 30.0015],
    [119.996, 30.0014],
    [119.997, 30.0013],
    [119.998, 30.0012],
    [119.999, 30.0011],
    [120.001, 30.0012],
    [120.002, 30.0013],
    [120.003, 30.0016],
    [120.004, 30.0019],
    [120.005, 30.0022],
    [120.006, 30.0028],
    [120.007, 30.0033],
    [120.008, 30.0038],
    [120.009, 30.0044],
    [120.010, 30.0052],
    [120.011, 30.0058],
    [120.012, 30.0068],
    [120.013, 30.0074],
    [120.014, 30.0080],
    [120.015, 30.0086],
    [120.016, 30.0091],
    [120.018, 30.0095],
    [120.019, 30.0100],
    [120.020, 30.0105],
    [120.021, 30.0110],] as Array<[number, number]>;

function mapboxLoaded(map: mapboxgl.Map) {
    const babymap = new BabyMap(map);
    const glow = new BABYLON.GlowLayer('glow', babymap.bjsScene, {
        blurKernelSize: 32,
    });
    glow.intensity = 2;

    const line = GeoMeshBuilder.createGreasedLine({
        id: "line",
        points,
        lineMeshBuilderOptions: {
            updatable: true
        },
        lineMaterialBuilderOptions: {
            color: BABYLON.Color3.FromHexString('#00D8E6'),
            colorMode: BABYLON.GreasedLineMeshColorMode.COLOR_MODE_MULTIPLY,
            useDash: true,
            dashRatio: 0.8,
            dashCount: 1
        }
    });

    glow.referenceMeshToUseItsOwnMaterial(line.mesh);

    babymap.bjsScene.onBeforeRenderObservable.add(() => {
        const animRatio = babymap.bjsScene.getAnimationRatio();
        line.mesh.greasedLineMaterial!.dashOffset += 0.1 * animRatio;
    })
    babymap.addModel({
        id: "line",
        type: 'mesh',
        ...line
    });
}

function maplibreLoaded(map: maplibregl.Map) {
    const babymap = new BabyMap(map);
    const glow = new BABYLON.GlowLayer('glow', babymap.bjsScene, {
        blurKernelSize: 32,
    });
    glow.intensity = 2;

    const line = GeoMeshBuilder.createGreasedLine({
        id: "line",
        points,
        lineMeshBuilderOptions: {
            updatable: true
        },
        lineMaterialBuilderOptions: {
            color: BABYLON.Color3.FromHexString('#00D8E6'),
            colorMode: BABYLON.GreasedLineMeshColorMode.COLOR_MODE_MULTIPLY,
            useDash: true,
            dashRatio: 0.6,
            dashCount: 5,
        }
    });

    glow.referenceMeshToUseItsOwnMaterial(line.mesh);

    babymap.bjsScene.onBeforeRenderObservable.add(() => {
        const animRatio = babymap.bjsScene.getAnimationRatio();
        line.mesh.greasedLineMaterial!.dashOffset -= 0.1 * animRatio;
    })
    babymap.addModel({
        id: "line",
        type: 'mesh',
        ...line
    });
}
</script>

<style scoped></style>