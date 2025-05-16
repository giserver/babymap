<template>
    <Maps style="width: 100%;height: 400px !important;" @mapbox-loaded="handleMapboxLoaded"
        @maplibre-loaded="handleMaplibreLoaded" :zoom="17" :center="[120, 30]" :pitch="60"></Maps>
</template>

<script setup lang="ts">
import "@babylonjs/inspector";

import { BabyMap } from '../../lib/babymap';
import Maps from './base/Maps.vue';
//@ts-ignore
import url_model from "/monkey.glb?url";
//@ts-ignore
import url_soldier from '/soldier.glb?url';

async function handleMapboxLoaded(map: mapboxgl.Map) {
    map.addLayer({
        id: "base-point",
        type: 'circle',
        source: {
            type: 'geojson',
            data: {
                type: "Point",
                coordinates: [120, 30]
            }
        },
        paint: {
            "circle-radius": 5,
            "circle-color": "red",
            "circle-stroke-color": "green",
            "circle-stroke-width": 1
        }
    })

    const babymap = new BabyMap(map);
    await babymap.addGltfModal(url_model, [120, 30.001, 12]);
    await babymap.addGltfModal(url_soldier, [120, 30, 0]);
}

async function handleMaplibreLoaded(map: maplibregl.Map) {
    map.addLayer({
        id: "base-point",
        type: 'circle',
        source: {
            type: 'geojson',
            data: {
                type: "Point",
                coordinates: [120, 30]
            }
        },
        paint: {
            "circle-radius": 5,
            "circle-color": "red",
            "circle-stroke-color": "green",
            "circle-stroke-width": 1
        }
    })

    const babymap = new BabyMap(map);
    await babymap.addGltfModal(url_model, [120, 30.001, 12]);
    await babymap.addGltfModal(url_soldier, [120, 30, 0]);
}

</script>

<style scoped></style>