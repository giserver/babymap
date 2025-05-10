<template>
    <Maps @mapbox-loaded="handleMapboxLoaded" @maplibre-loaded="handleMaplibreLoaded"></Maps>
</template>

<script setup lang="ts">
import { BabylonMapLayer } from '../../lib';
import Maps from '../components/Maps.vue';

import url_model from '../assets/1.glb?url';

async function handleMapboxLoaded(map: mapboxgl.Map) {
    const mbLayer = new BabylonMapLayer("test");
    map.addLayer(mbLayer);
    const orgPosition = [120, 30, 0];
    const geomesh = await mbLayer.addGltfModal("1", url_model, orgPosition as any);
}

async function handleMaplibreLoaded(map: maplibregl.Map) {
    const mbLayer = new BabylonMapLayer("test");
    map.addLayer(mbLayer);
    const orgPosition = [120, 30, 0];
    const geomesh = await mbLayer.addGltfModal("1", url_model, orgPosition as any);
}

</script>

<style scoped></style>