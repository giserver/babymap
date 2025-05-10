<template>
    <div class="maps-container">
        <div class="map" id="mapbox">
        </div>

        <div class="map" id="maplibre"></div>
    </div>

</template>

<script setup lang="ts">
import mapboxgl from 'mapbox-gl';
import maplibregl from 'maplibre-gl';
import { onMounted } from 'vue';

const props = defineProps<{
    onMapboxLoaded(map: mapboxgl.Map): void;
    onMaplibreLoaded(map: maplibregl.Map): void;
}>();

onMounted(() => {
    const boxMap = new mapboxgl.Map({
        container: "mapbox",
        center: [120, 30],
        zoom: 20,
        pitch: 60,
        projection: "mercator"
    });

    boxMap.on('load', () => {
        props.onMapboxLoaded(boxMap);
    });

    const libreMap = new maplibregl.Map({
        container: "maplibre",
        style: 'https://demotiles.maplibre.org/style.json',
        center: [120, 30],
        zoom: 20,
        pitch: 60
    });

    libreMap.on('load', () => {
        props.onMaplibreLoaded(libreMap);
    });
});

</script>

<style scoped>
.maps-container {
    display: flex;
    height: 100vh;
    width: 100vw;
}

.map {
    height: 100vh;
    width: 50vw;
}
</style>