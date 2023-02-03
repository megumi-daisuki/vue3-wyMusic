<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <mainHeader></mainHeader>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <mainAside></mainAside>
                </el-aside>
                <el-main>
                    <router-view v-if="isRouterAlive"></router-view>
                </el-main>
            </el-container>
            <player></player>
        </el-container>
    </div>
</template>
    
<script setup>
import mainHeader from '../components/head.vue'
import mainAside from '../components/aside.vue'
import player from '@/components/player/player.vue'
import { provide, ref, nextTick } from 'vue'





const isRouterAlive = ref(true);
const reload = () => {
    isRouterAlive.value = false;
    nextTick(() => {
        isRouterAlive.value = true;
    })
};
const backtop = () => {
    document.querySelector('main').scrollTop = 0
}
provide('reload', reload)
provide('backtop', backtop)
</script>
    
<style lang="less" scoped>
.common-layout {
    height: 100%;

    .el-container {
        height: 100%;
    }

    .el-header {
        background-color: #242023;
    }

    .el-main {
        overflow-y: scroll;

        &::after {
            content: '';
            display: block;
            height: 120px;
        }
    }

    .footer {
        height: 70px !important;
    }
}
</style>