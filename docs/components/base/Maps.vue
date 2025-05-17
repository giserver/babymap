<template>
    <div class="maps-container" :class="direction">
        <Mapbox style="width: 50vw;" @load="onMapboxLoaded" :bearing="bearing" :zoom="zoom" :center="center"
            :pitch="pitch"></Mapbox>
        <Maplibre style="width: 50vw;" @load="onMaplibreLoaded" :bearing="bearing" :zoom="zoom" :center="center"
            :pitch="pitch"></Maplibre>
    </div>
</template>

<script setup lang="ts">
import Mapbox from './Mapbox.vue';
import Maplibre from './Maplibre.vue';
import maplibregl from 'maplibre-gl';
import { TMapOptions } from '../../types';

withDefaults(defineProps<{
    onMapboxLoaded(map: mapboxgl.Map): void;
    onMaplibreLoaded(map: maplibregl.Map): void;
    direction?: "v" | "h"
} & TMapOptions>(), {
    zoom: 18,
    center: ([120, 30] as any),
    pitch: 60,
    bearing: 0,
    direction: "h"
});

</script>

<style scoped>
.maps-container {
    display: flex;
    height: 400px;
    width: 100%;
}

.maps-container.v{
    flex-direction: column;
    gap: 24px;
    height: 800px !important;
}

.maps-container.v > * {
    width: 100% !important;
}
</style>