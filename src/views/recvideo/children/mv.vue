<template>
    <div class="navtags-container">
        <div class="navtags">
            <span>地区：</span>
            <tagbar :tagItems="area" width="60px" @handleTagItem="changeArea"></tagbar>
        </div>
        <div class="navtags">
            <span>类型：</span>
            <tagbar :tagItems="type" width="60px" @handleTagItem="changeType"></tagbar>
        </div>
        <div class="navtags">
            <span>排序：</span>
            <tagbar :tagItems="order" width="60px" @handleTagItem="changeOrder"></tagbar>
        </div>
    </div>
    <div class="mv-table" v-loading="loading">
        <videotable :videoList="allMVs"></videotable>
    </div>
    <div class="middle">
        <el-pagination layout="prev, pager, next" :total="total" :page-size="32" @current-change="getAllMVsF" />
    </div>
</template>
    
<script setup>
import tagbar from '@/components/tagbar.vue'
import videotable from '@/components/videoTable.vue'
import { getAllMVs } from '@/api/index'
import { ref } from 'vue';

const allMVs = ref([]);
const total = ref(0)
const loading = ref(false)
const area = [
    { name: '全部' },
    { name: '内地' },
    { name: '港台' },
    { name: '欧美' },
    { name: '日本' },
    { name: '韩国' }
];
const areaVal = ref('全部');
const changeArea = (tag) => {
    if (tag.name === areaVal.value) return;
    areaVal.value = tag.name;

    getAllMVsF()
}

const type = [
    { name: '全部' },
    { name: '官方版' },
    { name: '原声' },
    { name: '现场版' },
    { name: '网易出品' }
];
const typeVal = ref('全部')
const changeType = (tag) => {
    if (tag.name === typeVal.value) return;
    typeVal.value = tag.name;

    getAllMVsF()
}

const order = [
    { name: '上升最快' },
    { name: '最热' },
    { name: '最新' }
];
const orderVal = ref('上升最快')
const changeOrder = (tag) => {
    if (tag.name === orderVal.value) return;
    orderVal.value = tag.name;
    getAllMVsF()
}


const getAllMVsF = async (page = 1) => {
    loading.value = true;
    let offset = (page - 1) * 32;
    let res = await getAllMVs(areaVal.value, typeVal.value, orderVal.value, offset)
    total.value = res.count;
    allMVs.value = res.data;
    loading.value = false
}


// 初始化
const init = () => {
    getAllMVsF()
}
init()

</script>
    
<style lang="less" scoped>
.navtags-container {
    padding: 20px 30px;

    .navtags {
        display: flex;
        align-items: center;
    }
}
</style>