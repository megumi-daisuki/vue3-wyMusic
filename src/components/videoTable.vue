<template>
    <div class="video-container">
        <el-card :body-style="{ padding: '0px' }" class="card" shadow="never" v-for="item in videoList" :key="item.vid">
            <videoItem :item="item"></videoItem>
        </el-card>
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


    .card {
        width: 300px;
        height: 235px;
        border: none;
        margin: 10px 30px;
    }

}
</style>