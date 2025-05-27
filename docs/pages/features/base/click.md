<script setup>
import Click from '../../../components/features/base/Click.vue';
</script>

## 点击
设置模型可以点击，触发`babymap`参数中的`onPicked`回调

<Click></Click>

```ts

const babymap = new BabyMap(map, {
    onPicked: (mesh) => {      // 设置回调
        alert(mesh.id);
    }
});

const box = BABYLON.MeshBuilder.CreateBox("box", { size: 10 });
babymap.addModel({
    id: "box",
    type: 'mesh',
    mesh: box,
    position: [...center, 5],
    units: 'meter',
    pickable: true            // 设置mesh可以点击
});

```