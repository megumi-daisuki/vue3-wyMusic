<template>
    <div @click="toSingerdetail">
        <div class="img-contain" @mouseenter="showM" @mouseleave="closeM">
            <el-image :src="item.img1v1Url" alt="" lazy style="width: 100%;" />
            <transition name="el-fade-in-linear">
                <div class="mask3 middle" v-show="isShowDetail">
                    <div class="text">查看详情></div>
                </div>
            </transition>
        </div>
        <h4>{{ item.name }}</h4>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const props = defineProps(['item'])
const router = useRouter()
const isShowDetail = ref(false)
// 动画
const showM = () => { isShowDetail.value = true }
const closeM = () => { isShowDetail.value = false }

const toSingerdetail = () => {
    router.push({
        name: 'singerdetail',
        params: {
            singerId: props.item.id
        }
    })
}



</script>
    
<style lang="less" scoped>
.img-contain {
    position: relative;
    height: 10rem;
    width: 10rem;
    cursor: pointer;

    .mask3 {
        position: absolute;
        top: 0%;
        width: 100%;
        height: 100%;
        border-radius: 5px;
        background: rgba(100, 100, 100, 0.3);

        .text {
            text-align: center;
            font-size: 16px;
            color: #fff;
            padding: 8px 15px;
            border: 1px solid #fff;
        }
    }
}



.el-image {
    border-radius: 5px;
}
</style>