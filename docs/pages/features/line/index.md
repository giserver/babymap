<script setup>
import Base from '../../../components/features/line/Base.vue';
</script>

## 线
<Base></Base>

## code

```ts
import { BabyMap, GeoMeshBuilder } from 'babymap';

const babymap = new BabyMap(map);

const points = [[120, 30], [120, 30.0005], [120.0003, 30.0005]] as Array<[number, number]>;

// 创建一个简单的线 
const line = GeoMeshBuilder.createGreasedLine({
    id: "line",
    points
});

// 添加模型
babymap.addModel({
    id: "line",
    type: 'mesh',
    ...line
});
```