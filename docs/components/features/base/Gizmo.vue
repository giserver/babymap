<template>
  <Mapbox
    :zoom="18"
    :pitch="60"
    :bearing="0"
    :center="center"
    @load="handleLoaded"
    style="height: 400px; width: 100%"
  ></Mapbox>
</template>

<script setup lang="ts">
import { BabyMap } from "../../../../lib";
import Mapbox from "../../base/Mapbox.vue";
import * as BABYLON from "@babylonjs/core";

const center = [120, 30] as [number, number];
let babymap: BabyMap;

function handleLoaded(map: mapboxgl.Map) {
  babymap = new BabyMap(map, {
    onPicked: (mesh) => {
      babymap.gizmoManager.setMesh(mesh);
    },
  });

  const box = BABYLON.MeshBuilder.CreateBox("box", { size: 10 });
  const box2 = box.clone();
  box2.renderOverlay = true;

  babymap.addModel({
    id: "box",
    type: "mesh",
    mesh: box,
    position: [...center, 5],
    units: "meter",
    pickable: true,
  });

  babymap.addModel({
    id: "box2",
    type: "mesh",
    mesh: box2,
    position: [120, 30.0008, 5],
    units: "meter",
    pickable: true,
  });
}
</script>

<style scoped></style>
