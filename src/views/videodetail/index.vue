<template>
    <div class="main-container">
        <div class="left-video">
            <h5 @click="toprev">
                <el-icon>
                    <ArrowLeftBold />
                </el-icon>
                视频详情
            </h5>
            <video :src="videoUrl" preload="auto" controls></video>
            <div class="video-info">
                <div class="artists-container">
                    <div class="artist middle" v-if="videoData.creator">
                        <img :src="videoData.creator.avatarUrl" alt="">
                        <span>{{ videoData.creator.nickname }}</span>
                    </div>
                </div>
                <div class="videodetail">
                    <h1>
                        {{ videoData.title }}
                        <span class="showdes middle" v-if="!showdes && videoData.description" @click="showdes = !showdes">
                            <el-icon>
                                <CaretBottom />
                            </el-icon>
                        </span>
                        <span class="showdes middle" v-if="showdes && videoData.description" @click="showdes = !showdes">
                            <el-icon>
                                <CaretTop />
                            </el-icon>
                        </span>
                    </h1>
                    <div class="playcount">
                        <span>发布：{{ timestampToTime(videoData.publishTime) }}</span>
                        <span>播放：{{ numberFormat(videoData.playTime) }}</span>
                    </div>
                    <div class="tags">
                        <span class="tag" v-for="(tag, index) in videoData.videoGroup" :key="index">
                            <el-tag color="#f7f7f7" round>
                                {{ tag.name }}
                            </el-tag>
                        </span>
                    </div>
                    <div class="describe" v-if="showdes && videoData.description">
                        <p>
                            {{ videoData.description }}
                        </p>
                    </div>
                    <div class="operation">
                        <el-button>
                            <el-icon>
                                <Star />
                            </el-icon>
                            <span>赞({{ videoOthoerData.likedCount }})</span>
                        </el-button>
                        <el-button>
                            <el-icon size="17px">
                                <FolderAdd />
                            </el-icon>
                            <span>收藏({{ videoData.subscribeCount }})</span>
                        </el-button>
                        <el-button>
                            <el-icon>
                                <Promotion />
                            </el-icon>
                            <span>
                                分享({{ videoOthoerData.shareCount }})
                            </span>
                        </el-button>
                        <a>
                            举报
                        </a>
                    </div>
                </div>
            </div>
            <div class="commtents">
                <h4>评论<span>({{ videoOthoerData.commentCount }})</span></h4>
                <commtentsPage father-componet="videodetail" :main-id="videoId"></commtentsPage>
            </div>
        </div>
        <div class="right-command">
            <h5>相关推荐</h5>
            <div class="simivideos">
                <div class="simivideo" v-for="(item, index) in simiVideos" :key="index" @click="tothisvideo(item.vid)">
                    <div class="img-container">
                        <img :src="item.coverUrl" alt="" />
                        <span class="playcount common">
                            <el-icon size="15px">
                                <VideoPlay />
                            </el-icon>
                            {{ numberFormat(item.playTime) }}
                        </span>
                        <span class="duration common">{{ formatTime(item.durationms) }}</span>
                    </div>
                    <div class="simivideo-info">
                        <h3>{{ item.title }}</h3>
                        <h4>by
                            <span v-for="(creator, index) in item.creator" :key="index">
                                {{ creator.userName }}
                            </span>
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
    
<script setup>
import commtentsPage from '../../components/commtentsPage.vue'
import { getVideoDetail, getVideoUrl, getvideoOtherdata, getSimiVideo } from '../../api/index'
import { numberFormat, formatTime, timestampToTime } from '../../methods/utils'
import { useRoute, useRouter } from 'vue-router';
import { ref, inject, watch } from 'vue';

const route = useRoute()
const router = useRouter()
const videoId = route.params.videoId;
const videoData = ref({})
const videoUrl = ref('')
const videoOthoerData = ref({})
const simiVideos = ref([])
const reload = inject('reload')
const showdes = ref(false)
// 初始化
const getVideoDetailF = async () => {
    let res = await getVideoDetail(videoId);
    videoData.value = res.data;
    let result = await getVideoUrl(videoId);
    videoUrl.value = result.urls[0].url;
    videoOthoerData.value = await getvideoOtherdata(videoId);
    let simi = await getSimiVideo(videoId);
    simiVideos.value = simi.data
}
getVideoDetailF()
const toprev = () => {
    router.go(-1)
}

const tothisvideo = (videoId) => {
    router.push({
        name: 'videodetail',
        params: {
            videoId
        }
    })
}
// 监听路由参数变化 更新页面
watch(() => route.params.videoId, (newVale, oldValue) => {
    if (newVale !== oldValue) {
        reload();
    }
});

</script>
    
<style lang="less" scoped>
.main-container {
    display: flex;
    justify-content: center;
    width: 100%;

    .left-video {
        width: 30rem;
        margin-right: 2.5rem;

        h5 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 30px;
            width: 80px;
            line-height: 30px;
            margin-bottom: 10px;
            padding-right: 10px;
            font-size: 15px;
            font-weight: bold;
            cursor: pointer;
        }

        video {
            width: 100%;
            margin-bottom: 10px;
        }

        .video-info {
            margin-bottom: 30px;

            .artists-container {
                display: flex;
                justify-content: space-between;
                margin: 10px 0 20px 0;

                .artist {

                    img {
                        width: 60px;
                        height: 58px;
                        border-radius: 50%;
                        cursor: pointer;
                    }

                    span {
                        margin-left: 5px;
                        color: #666;
                        cursor: pointer;

                        &:hover {
                            color: #000;
                        }
                    }
                }
            }

            .videodetail {
                h1 {
                    font-size: 22px;
                    font-weight: bolder;
                    color: #333;

                    .showdes {
                        float: right;

                    }
                }

                .playcount {
                    padding: 10px 0;
                    color: #ccc;
                    font-size: 12px;

                    span {
                        margin-right: 25px;
                    }
                }

                .tags {
                    padding: 10px 0 20px;

                    .tag {
                        margin-right: 5px;
                        cursor: pointer;
                    }
                }

                .describe {
                    margin: 10px 0 30px;
                    font-size: 12px;
                }

                .operation {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;

                    a {
                        font-size: 13px;
                        color: #666;
                        text-decoration: underline;
                        cursor: default;

                        &:hover {
                            color: #000;
                        }
                    }
                }
            }
        }

        .commtents {
            h4 {
                padding: 10px 0;
                font-size: larger;
                font-weight: bolder;
            }

            span {
                font-size: 10px;
                font-weight: normal;
                color: #ccc;
            }
        }
    }

    .right-command {
        width: 30rem;

        h5 {
            height: 40px;
            line-height: 30px;
            color: #333;
            font-size: 15px;
            font-weight: bold;
        }

        .simivideos {
            .simivideo {
                display: flex;
                margin-bottom: 25px;

                .img-container {
                    position: relative;
                    cursor: pointer;

                    img {
                        height: 5rem;
                        width: 10rem;
                        border-radius: 5px;

                    }

                    .common {
                        position: absolute;
                        right: 5px;
                        font-size: 10px;
                        color: rgb(243, 243, 243);
                    }

                    .playcount {
                        display: flex;
                        align-items: center;
                        top: 5px;
                    }

                    .duration {
                        bottom: 5px;
                    }
                }

                .simivideo-info {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    margin-left: 10px;

                    h3 {
                        font-size: 14px;
                    }

                    h4 {
                        color: #999;
                        font-size: 11px;

                    }
                }
            }
        }
    }
}
</style>