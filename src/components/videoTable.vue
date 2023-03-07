<template>
    <div class="video-container">
        <div class="card" shadow="never" v-for="item in videoList" :key="item.vid">
            <videoItem :item="item"></videoItem>
        </div>
    </div>
</template>
    
<script setup>
import videoItem from './videoItem.vue'

const props = defineProps({
    videoList: Array
})



</script>
    
<style lang="less" scoped>
.video-container {
    display: flex;
    flex-wrap: wrap;


    

}
</style>