<template>
    <div class="main-container" @click="toSonglistDetail" :style="{width}">
        <div class="img-contain" @mouseenter="showM" @mouseleave="closeM">
            <el-image :src="item.coverImgUrl || item.picUrl" alt="" lazy />
            <transition name="el-fade-in-linear">
                <div class="mask3 middle" v-show="isShowDetail">
                    <div class="text">查看详情></div>
                </div>
            </transition>
            <div class="user-name" v-if="item.creator">
                <el-icon color="#fff">
                    <User />
                </el-icon>
                <span style="cursor: default;">{{ item.creator.nickname }}</span>
            </div>
        </div>
        <h4>{{ item.name }}</h4>
        <div class="playcount middle">
            <el-icon size="15px">
                <Headset />
            </el-icon>
            <span style="cursor: default;">{{ numberFormat(item.playCount || item.playcount) }}</span>
        </div>
    </div>
</template>
    
<script setup>
import { numberFormat } from '@/methods/utils'
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps(['item', 'width'])
const router = useRouter()
const isShowDetail = ref(false)
// 动画
const showM = () => { isShowDetail.value = true }
const closeM = () => { isShowDetail.value = false }

// 跳转到songlistdetail
const toSonglistDetail = () => {
    router.push({
        name: 'songlistdetail',
        params: {
            songlistId: props.item.id
        }
    })
}

</script>
    
<style lang="less" scoped>
.main-container {
    position: relative;
    width: 225px;
    box-shadow: none;
    border: none;
    margin-bottom: 15px;



    .img-contain {
        position: relative;
        cursor: pointer;

        .el-image {
            width: 100%;
            border-radius: 5px;
        }

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



        .user-name {
            position: absolute;
            left: 5px;
            bottom: 5px;

            span {
                padding-left: 5px;
                font-size: 13px;
                color: #fff;
            }
        }

    }

    .playcount {
        position: absolute;
        right: 5px;
        top: 5px;
        color: #fff;

        span {
            padding-left: 5px;
            font-size: 13px;
        }
    }
}
</style>