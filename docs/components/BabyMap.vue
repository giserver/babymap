<template>
    <Maps @mapbox-loaded="handleMapboxLoaded" @maplibre-loaded="handleMaplibreLoaded" :zoom="17.5" :center="center"
        :pitch="60"></Maps>
</template>

<script setup lang="ts">
import "@babylonjs/inspector";
import { BabyMap } from '../../lib/babymap';
import Maps from './base/Maps.vue';
import url_soldier from '/soldier.glb?url';

const center = [120, 30] as [number, number];
const pointSource = {
    type: 'geojson',
    data: {
        type: "Point",
        coordinates: center
    }
} as const;

async function handleMapboxLoaded(map: mapboxgl.Map) {
    map.addLayer({
        id: "base-point",
        type: 'circle',
        source: pointSource,
        paint: {
            "circle-radius": 5,
            "circle-color": "red",
            "circle-stroke-color": "green",
            "circle-stroke-width": 1
        }
    })

    const babymap = new BabyMap(map);
    await babymap.addGltfModal(url_soldier, [...center, 0]);
}

async function handleMaplibreLoaded(map: maplibregl.Map) {
    map.addLayer({
        id: "base-point",
        type: 'circle',
        source: pointSource,
        paint: {
            "circle-radius": 5,
            "circle-color": "red",
            "circle-stroke-color": "green",
            "circle-stroke-width": 1
        }
    })

    const babymap = new BabyMap(map);
    await babymap.addGltfModal(url_soldier, [...center, 0]);
}

</script>

<style scoped></style>