<template>
    <div id="maplibre"></div>
</template>

<script setup lang="ts">
import maplibregl from 'maplibre-gl';
import "maplibre-gl/dist/maplibre-gl.css";
import { onMounted } from 'vue';
import { TMapOptions } from '../../types';

type TOptions = TMapOptions & {
    onLoad(map: maplibregl.Map): void
}
const props = defineProps<TOptions>();

onMounted(() => {
    const map = new maplibregl.Map({
        container: "maplibre",
        style: 'https://demotiles.maplibre.org/style.json',
        ...props
    });

    map.on('load', () => {
        map.addLayer({
            id: "base-raster",
            type: 'raster',
            source: {
                type: 'raster',
                maxzoom: 18,
                tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"]
            },
        })

        props.onLoad(map);
    });
})
</script>

<style scoped>
#maplibre {
    height: 100%;
    width: 100vh;
}

:deep(.maplibregl-ctrl-attrib-button) {
    margin: 0;
}
</style>