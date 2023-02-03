<template>
    <div class="tabs">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-change="changeRouter">
            <el-tab-pane v-for="item in tabList" :key="item.name" :label="item.label" :name="item.name">
            </el-tab-pane>
        </el-tabs>
    </div>
    <div class="viewport">
        <router-view></router-view>
    </div>
</template>
    
<script setup >
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeName = ref(sessionStorage.getItem('findmusicTab') ?? 'discover')  // 默认选中第一个


const tabList = ref([
    {
        label: '个性推荐',
        name: 'discover',
        path: '/discover'
    },
    {
        label: '歌单',
        name: 'songlist',

    },
    {
        label: '排行榜',
        name: 'rank',

    },
    {
        label: '歌手',
        name: 'singer',
    },
    {
        label: '最新音乐',
        name: 'newsongs'
    }
])

const changeRouter = (name) => {
    // 缓存当前tab标签,以免刷新页面后变成第一个
    sessionStorage.setItem('findmusicTab', activeName.value)
    router.push({
        name
    })
}


</script>
    
<style lang="less" scoped>
.viewport {

    width: 1200px;
    margin: 10px auto;

    &::after {
        content: '';
        display: table;
        height: 20px;
    }
}
</style>