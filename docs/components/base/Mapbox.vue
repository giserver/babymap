<template>
    <div id="mapbox"></div>
</template>

<script setup lang="ts">
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { onMounted } from 'vue';
import {TMapOptions} from "../../types";

mapboxgl.accessToken = import.meta.env.VITE_BASE_MAP_MAPBOX_TOKEN;

type TOptions = TMapOptions & {
    onLoad(map: mapboxgl.Map): void
};
const props = defineProps<TOptions>();

onMounted(() => {
    const boxMap = new mapboxgl.Map({
        container: "mapbox",
        ...props
    });

    boxMap.on('load', () => {
        props.onLoad(boxMap);
    });
})
</script>

<style scoped>
#mapbox {
    height: 100%;
    width: 100vh;
}
</style>