<template>
    <Maps @mapbox-loaded="mapboxLoaded" @maplibre-loaded="maplibreLoaded" :bearing="-45" :center="[120.0003, 30.00005]">
    </Maps>
</template>

<script setup lang="ts">
import maplibregl from 'maplibre-gl';
import mapboxgl from 'mapbox-gl';
import * as BABYLON from '@babylonjs/core';
import { BabyMap, GeoMeshBuilder } from '../../../../lib';
import Maps from '../../base/Maps.vue';

const points = [[120, 30], [120, 30.0005], [120.0003, 30.0005]] as Array<[number, number]>;

function mapboxLoaded(map: mapboxgl.Map) {
    points.forEach(p => {
        new mapboxgl.Marker({}).setLngLat(p).addTo(map);
    });

    const babymap = new BabyMap(map);
    const line = GeoMeshBuilder.createGreasedLine({
        id: "line",
        points,
        lineMaterialBuilderOptions:{
            color: BABYLON.Color3.Red()
        }
    });
    babymap.addModel({
        id: "line",
        type: 'mesh',
        ...line
    });
}

function maplibreLoaded(map: maplibregl.Map) {
    points.forEach(p => {
        new maplibregl.Marker({}).setLngLat(p).addTo(map);
    });

    const babymap = new BabyMap(map);
    const line = GeoMeshBuilder.createGreasedLine({
        id: "line",
        points,
        lineMaterialBuilderOptions:{
            color: BABYLON.Color3.Red()
        }
    });
    babymap.addModel({
        id: "line",
        type: 'mesh',
        ...line
    });
}
</script>

<style scoped></style>