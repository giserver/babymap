<template>
    <!-- <Maps @mapbox-loaded="handleMapboxLoaded" @maplibre-loaded="handleMaplibreLoaded"></Maps> -->
    <div id="map"></div>
</template>

<script setup lang="ts">
import { BabyMap } from '../../lib/babymap';
import Maps from '../components/Maps.vue';
import url_model from '../assets/1.glb?url';
import { onMounted } from 'vue';
import mapboxgl from 'mapbox-gl';
import "@babylonjs/inspector";

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