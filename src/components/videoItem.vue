<template>
    <div @click="toVideodetail" class="main-div">
        <div class="img-div" @mouseenter="showM" @mouseleave="closeM">
            <el-image :src='item.coverUrl ?? item.imgurl ?? item.data?.coverUrl ?? item.cover' class="image" />
            <transition name="el-fade-in-linear">
                <div class="mask3" v-show="isShowDetail">
                    <div class="text">查看详情></div>
                </div>
            </transition>
            <span class="durationms">
                {{ formatTime(item.durationms || item.duration || item.data.durationms || item.data.duration) }}
            </span>
            <span class="playTime middle">
                <el-icon size="16px">
                    <VideoPlay />
                </el-icon>
                <span>
                    {{ numberFormat(item.playTime || item.playCount || item.data.playTime || item.data.playCount) }}
                </span>
            </span>
        </div>
        <h4 class="title">
            <span class="mv-sign" v-if="item.type === 0">MV</span>
            {{ item.title || item.name || item.data.title || item.data.name }}
        </h4>
        <div class="creators" v-if="item.userName">
            <span class="by creator">by</span>
            <span class="creator" :class="i.userName === keywords ? 'actcreator' : ''" v-for="(i, idx) in item.creator"
                :key="idx">{{
                    i.userName
                }} <span v-if="(idx !== item.creator.length - 1)" style="color: #ccc;">/</span> </span>
        </div>
    </div>
</template>
    
<script setup>
import { useRoute, useRouter } from 'vue-router';
import { formatTime, numberFormat } from '@/methods/utils'
import { ref } from 'vue';
const props = defineProps(['item'])

const route = useRoute()
const router = useRouter()
const keywords = route.params.keywords

const isShowDetail = ref(false)
// 动画
const showM = () => { isShowDetail.value = true }
const closeM = () => { isShowDetail.value = false }

const toVideodetail = () => {
    // type == 0 mv   type == 1 video
    if (!props.item.type) {
        // mv
        if (props.item.type === 0) {
            router.push({
                name: "MVdetail",
                params: {
                    MVId: props.item.vid
                }
            })
        } else {
            router.push({
                name: "MVdetail",
                params: {
                    MVId: props.item.id
                }
            })
        }
    } else {
        router.push({
            name: "videodetail",
            params: {
                videoId: props.item.vid ?? props.item.data.vid
            }
        })
    }
}
</script>
    
<style lang="less" scoped>
.main-div {
    width: 12rem;
    height: 12rem;
    border: none;
    margin: 1rem 30px;

    .img-div {
        position: relative;
        height: 100%;
        cursor: pointer;

        .mask3 {
            position: absolute;
            top: 0%;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            background: rgba(100, 100, 100, 0.3);

            .text {
                text-align: center;
                font-size: 16px;
                color: #fff;
                padding: 8px 15px;
                border: 1px solid #fff;
            }
        }

        .durationms {
            position: absolute;
            bottom: 5px;
            right: 5px;
            font-size: 12px;
            color: #fff;
        }

        .playTime {
            position: absolute;
            top: 5px;
            right: 5px;
            color: #fff;
            font-size: 12px;
        }



        .image {
            width: 100%;
            height: 100%;
            border-radius: 5px;
        }
    }


    .title {
        font-size: 13px;
        font-weight: bold;
        color: #393636;
        text-indent: 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;

        &:hover {
            color: #000;
        }

        .mv-sign {
            padding: 1px 2px;
            color: red;
            border: 1px solid red;

        }
    }

    .creators {
        .by {
            padding-right: 5px;
        }

        .creator {
            font-size: 12px;
            color: #ccc;
        }

        .actcreator {
            color: #409eff;
        }
    }
}
</style>