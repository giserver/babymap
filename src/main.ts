import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = import.meta.env.VITE_BASE_MAP_MAPBOX_TOKEN;

createApp(App).mount("#app");