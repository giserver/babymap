<template>
    <div class="maps-container">
        <Mapbox style="width: 50vw;" @load="onMapboxLoaded" :zoom="zoom" :center="center" :pitch="pitch"></Mapbox>
        <Maplibre style="width: 50vw;" @load="onMaplibreLoaded" :zoom="zoom" :center="center" :pitch="pitch"></Maplibre>
    </div>
</template>

<script setup lang="ts">
import Mapbox from './Mapbox.vue';
import Maplibre from './Maplibre.vue';
import maplibregl from 'maplibre-gl';
import {TMapOptions} from '../../types';

defineProps<{
    onMapboxLoaded(map: mapboxgl.Map): void;
    onMaplibreLoaded(map: maplibregl.Map): void;
} & TMapOptions>();

</script>

<style scoped>
.maps-container {
    display: flex;
    height: 100vh;
    width: 100vw;
}
</style>