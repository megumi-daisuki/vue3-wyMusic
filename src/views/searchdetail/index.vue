<template>
    <div class="search-detail">
        <nav>
            <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
                <el-tab-pane :label="item.label" :name="item.name" v-for="item in tablist" :key="item.name">
                </el-tab-pane>
            </el-tabs>
        </nav>
        <div class="search-main">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
</template>
    
<script setup >
import { inject, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter()
const route = useRoute();

const activeName = ref(sessionStorage.getItem('searchTab') ?? 'songDtl');
const reload = inject('reload');

const tablist = [
    {
        name: 'songDtl',
        label: '单曲',
    },
    {
        name: 'albumDtl',
        label: '专辑',
    },
    {
        name: 'singerDtl',
        label: '歌手',
    },
    {
        name: 'songlistDtl',
        label: '歌单',
    },
    {
        name: 'videoDtl',
        label: '视频',
    }
]
const handleClick = (itemName) => {
    sessionStorage.setItem('searchTab', activeName.value)
    router.push({
        name: itemName,
        params: {
            keywords: route.params.keywords
        }
    })

};

// 监听路由参数变化 更新页面
watch(() => route.params.keywords, (newVale, oldValue) => {
    if (newVale !== oldValue) {
        reload();
    }
});



</script>
    
<style lang="less" scoped>


.search-detail::after {
    content: '';
    display: block;
    height: 70px;
}
</style>