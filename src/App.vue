<template>
    <div class="maps-container">
        <div class="map" id="mapbox">
        </div>

        <div class="map" id="maplibre"></div>
    </div>
   
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as mapboxgl from 'mapbox-gl';
import * as maplibregl from 'maplibre-gl';
import { BabylonMapLayer } from '../lib';
import url_model from './assets/1.glb?url';

onMounted(() => {
    const boxMap = new mapboxgl.Map({
        container: "mapbox",
        center: [120, 30],
        zoom: 20,
        pitch: 60
    });

    boxMap.on('load',async () => {
        const mbLayer = new BabylonMapLayer("test");
        boxMap.addLayer(mbLayer);

       const orgPosition = [120, 30, 0];

       const geomesh = await mbLayer.addGltfModal("1", url_model,orgPosition as any);
       geomesh.setBoundingBoxVisible(true);
    });


    const libreMap = new maplibregl.Map({
        container: "maplibre",
        style: 'https://demotiles.maplibre.org/style.json',
        center: [120, 30],
        zoom: 20,
        pitch: 60
    }); 

    libreMap.on('load',async () => {
        const mbLayer = new BabylonMapLayer("test");
        libreMap.addLayer(mbLayer);

       const orgPosition = [120, 30, 0];

       const geomesh = await mbLayer.addGltfModal("1", url_model,orgPosition as any);
       geomesh.toggleBoundingBoxVisible();
    });
})
</script>

<style scoped>
.maps-container{
    display: flex;
    height: 100vh;
    width: 100vw;
}

.map {
    height: 100vh;
    width: 50vw;
}
</style>