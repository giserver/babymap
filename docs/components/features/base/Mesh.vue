<template>
    <Maps @mapbox-loaded="mapboxLoaded" @maplibre-loaded="maplibreLoaded" :pitch="60" :center="center" direction="v">
    </Maps>
</template>

<script setup lang="ts">
import maplibregl from 'maplibre-gl';
import * as BABYLON from '@babylonjs/core';
import { BabyMap } from '../../../../lib';
import Maps from '../../base/Maps.vue';

const center = [120, 30] as [number, number];

function mapboxLoaded(map: mapboxgl.Map) {
    const babymap = new BabyMap(map);
    const box = BABYLON.MeshBuilder.CreateBox("box", { size: 10 });
    babymap.addModel({
        id: "box",
        type: 'mesh',
        mesh: box,
        position: [...center, 5]
    });
}

function maplibreLoaded(map: maplibregl.Map) {

    const babymap = new BabyMap(map);
}

</script>