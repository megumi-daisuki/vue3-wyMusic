<template>
    <div class="songlist-table">
        <div v-for="(item, index) in songlist" :key="index" class="songlist-item">
            <songlistItem :item="item" :width="width"></songlistItem>
        </div>
    </div>
</template>
    
<script setup>
import songlistItem from './songlistItem.vue';
defineProps(['songlist', "width"])



</script>
    
<style lang="less" scoped>
.songlist-table {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
</style>