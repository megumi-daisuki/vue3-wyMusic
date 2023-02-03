<template>
    <div class="singers">
        <div v-for="(item, index) in singerlist" :key="index" class="card">
            <singerItem :item="item"></singerItem>
        </div>
    </div>
</template>
    
<script setup>

import singerItem from './singerItem.vue';
defineProps(['singerlist'])



</script>
    
<style lang="less" scoped>
.singers {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 20px;
    overflow: auto;

    .card {

        margin-bottom: 20px;


    }
}
</style>