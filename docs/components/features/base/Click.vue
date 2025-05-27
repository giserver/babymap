<template>
    <Maps @mapbox-loaded="mapboxLoaded" @maplibre-loaded="maplibreLoaded" :pitch="60" :center="center">
    </Maps>
</template>

<script setup lang="ts">
import maplibregl from 'maplibre-gl';
import * as BABYLON from '@babylonjs/core';
import { BabyMap } from '../../../../lib';
import Maps from '../../base/Maps.vue';

const center = [120, 30] as [number, number];

function mapboxLoaded(map: mapboxgl.Map) {
    const babymap = new BabyMap(map, {
        onPicked: (mesh) => {
            alert(mesh.id);
        }
    });
    const box = BABYLON.MeshBuilder.CreateBox("box", { size: 10 });
    const box_copy = box.clone();
    box.renderOverlay = true;

    babymap.addModel({
        id: "box",
        type: 'mesh',
        mesh: box,
        position: [...center, 5],
        units: 'meter',
        pickable: true
    });

    babymap.addModel({
        id: "box_copy",
        type: 'mesh',
        mesh: box_copy,
        position: [120.00015, 30, 5],
        units: 'meter',
    });
}

function maplibreLoaded(map: maplibregl.Map) {

    const babymap = new BabyMap(map, {
        onPicked: (mesh) => {
            alert(mesh.id);
        }
    });
    
    const box = BABYLON.MeshBuilder.CreateBox("box", { size: 10 });
    const box_copy = box.clone();
    box.renderOverlay = true;

    babymap.addModel({
        id: "box",
        type: 'mesh',
        mesh: box,
        position: [...center, 5],
        units: 'meter',
        pickable: true
    });

    babymap.addModel({
        id: "box_copy",
        type: 'mesh',
        mesh: box_copy,
        position: [120.00015, 30, 5],
        units: 'meter',
    });
}

</script>