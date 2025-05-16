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

const props = withDefaults(defineProps<{
    onMapboxLoaded(map: mapboxgl.Map): void;
    onMaplibreLoaded(map: maplibregl.Map): void;
    zoom?: number,
    center?: [number, number],
    pitch?: number,
}>(), {
    zoom: 18,
    center: [120, 30] as any,
    pitch: 60,
});

onMounted(() => {
    const boxMap = new mapboxgl.Map({
        container: "mapbox",
        center: props.center,
        zoom: props.zoom,
        pitch: props.pitch,
        projection: "mercator"
    });

    boxMap.on('load', () => {
        props.onMapboxLoaded(boxMap);
    });

    const libreMap = new maplibregl.Map({
        container: "maplibre",
        style: 'https://demotiles.maplibre.org/style.json',
        center: props.center,
        zoom: props.zoom,
        pitch:  props.pitch,
        maxPitch: 85
    });

    libreMap.on('load', () => {
        libreMap.addLayer({
            id: "base-raster",
            type: 'raster',
            source:{
                type: 'raster',
                tiles:["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"]
            }
        })
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