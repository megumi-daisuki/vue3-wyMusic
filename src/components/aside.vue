<template>
    <div class="container">
        <el-menu router background-color="#3f3c3e" text-color="#ccc" :default-active="defaultActive">
            <el-menu-item v-for="(item, index) in menuList" :key="item.path" :index="item.path">
                <span>{{ item.label }}</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>
    
<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute()
const router = useRouter();
// 左侧菜单列表
const menuList = [
    { label: '发现音乐', path: '/findmusic' },
    { label: '视频', path: '/recvideo' },
    { label: '私人FM', path: '/personFM' },
];
const defaultActive = ref('/findmusic')

watch(() => route.path, () => {
    // 清除findmusic的tab缓存
    sessionStorage.removeItem('findmusicTab')
    let pathArr = route.path.split('/');
    defaultActive.value = '/' + pathArr[1];

})

</script>
    
<style lang="less" scoped>
.container {
    height: 100%;
    background-color: #3f3c3e;

    h4 {
        text-indent: 15px;
        padding: 5px 0;
        background-color: #3f3c3e;
        color: #ccc;
    }

    .el-menu {
        .el-menu-item {
            justify-content: center;
        }
    }
}
</style>