<template>
    <div class="topalbumlist">
        <div class="card" v-for="(item, index) in albumlist" :key="index">
            <topalbumItem :albumItem="item"></topalbumItem>
        </div>
    </div>
</template>

<script setup>
import topalbumItem from './topalbumItem.vue';

defineProps(['albumlist'])



</script>

<style lang="less" scoped>
.topalbumlist {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;


    .card {
        width: 200px;
        margin-bottom: 20px;


    }
}
</style>