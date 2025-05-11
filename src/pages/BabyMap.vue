<template>
    <!-- <Maps @mapbox-loaded="handleMapboxLoaded" @maplibre-loaded="handleMaplibreLoaded"></Maps> -->
    <div id="map"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import mapboxgl from 'mapbox-gl';
import "@babylonjs/inspector";

import { BabyMap } from '../../lib/babymap';
import Maps from '../components/Maps.vue';
import url_model from '../assets/1.glb?url';
import url_soldier from '../assets/soldier.glb?url';

onMounted(()=>{
    const map = new mapboxgl.Map({
        container: "map",
        center: [120, 30],
        zoom: 18,
        pitch: 60,
        // projection: "mercator"
    });

    map.on('load',()=>{
        handleMapboxLoaded(map);
    })
});

async function handleMapboxLoaded(map: mapboxgl.Map) {
    const babymap = new BabyMap(map);

    await babymap.addGltfModal(url_model, [120, 30, 12]);
    await babymap.addGltfModal(url_soldier, [120, 30.001, 0]);

    babymap.bjsScene.debugLayer.show();
}

function handleMaplibreLoaded(map: maplibregl.Map) {
    const babymap = new BabyMap(map);
}

</script>

<style scoped>
#map{
    height:100vh;
    width: 100vw;
}
</style>