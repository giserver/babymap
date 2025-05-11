<template>
    <Maps @mapbox-loaded="handleMapboxLoaded" @maplibre-loaded="handleMaplibreLoaded"></Maps>
</template>

<script setup lang="ts">
import "@babylonjs/inspector";

import { BabyMap } from '../../lib/babymap';
import Maps from '../components/Maps.vue';
import url_model from '../assets/1.glb?url';
import url_soldier from '../assets/soldier.glb?url';

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