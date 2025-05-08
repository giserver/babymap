<template>
    <div id="map">
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as mapboxgl from 'mapbox-gl';
import { MapboxBabylonLayer } from '../lib';

import url_model from './assets/1.glb?url';

onMounted(() => {
    const map = new mapboxgl.Map({
        container: "map",
        center: [120, 30],
        zoom: 20,
        pitch: 60
    });

    map.on('load',async () => {
        const mbLayer = new MapboxBabylonLayer("test");
        map.addLayer(mbLayer);

       const orgPosition = [120, 30, 0];

       const geomesh = await mbLayer.addGltfModal("1", url_model,orgPosition as any);
    });
})
</script>

<style scoped>
#map {
    height: 100vh;
    width: 100vw;
}
</style>