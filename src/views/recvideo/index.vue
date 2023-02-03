<template>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="changeRouter">
        <el-tab-pane :label="nav.mv.label" :name="nav.mv.name"></el-tab-pane>
        <el-tab-pane :label="nav.video.label" :name="nav.video.name"></el-tab-pane>
    </el-tabs>
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
</template>
    
<script  setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
const activeName = ref('MV')
const router = useRouter()
const nav = {
    video: {
        label: '视频',
        name: 'video',
    },
    mv: {
        label: 'MV',
        name: 'MV',

    }
}
const changeRouter = (pane) => {
    router.push({
        name: pane.paneName
    })
}

</script>
    
<style lang="less" scoped>

</style>