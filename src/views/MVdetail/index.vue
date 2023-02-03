<template>
    <div class="main-container">
        <div class="left-video">
            <h5 @click="toprev">
                <el-icon>
                    <ArrowLeftBold />
                </el-icon>
                MV详情
            </h5>
            <video :src="MVUrl" preload="auto" controls></video>
            <div class="mv-info">
                <div class="artists-container">
                    <div class="artist middle" v-for="(item, index) in MVdata.artists" :key="index"
                        @click="toSinger(item.id)">
                        <img :src="item.img1v1Url" alt="">
                        <span>{{ item.name }}</span>
                    </div>
                </div>
                <div class="mvdetail">
                    <h1>
                        {{ MVdata.name }}
                        <span class="showdes middle" v-if="!showdes && MVdata.desc" @click="showdes = !showdes">
                            <el-icon>
                                <CaretBottom />
                            </el-icon>
                        </span>
                        <span class="showdes middle" v-if="showdes && MVdata.desc" @click="showdes = !showdes">
                            <el-icon>
                                <CaretTop />
                            </el-icon>
                        </span>
                    </h1>
                    <div class="playcount">
                        <span>发布：{{ MVdata.publishTime }}</span>
                        <span>播放：{{ numberFormat(MVdata.playCount) }}</span>
                    </div>
                    <div class="tags">
                        <span class="tag" v-for="(tag, index) in MVdata.videoGroup" :key="index"
                            v-if="MVdata.videoGroup?.length">
                            <el-tag color="#f7f7f7" round>
                                {{ tag.name }}
                            </el-tag>
                        </span>
                    </div>
                    <div class="describe" v-if="showdes && MVdata.desc">
                        <p>
                            {{ MVdata.desc }}
                        </p>
                    </div>
                    <div class="operation">
                        <el-button>
                            <el-icon>
                                <Star />
                            </el-icon>
                            <span>赞({{ MVothoerData.likedCount }})</span>
                        </el-button>
                        <el-button>
                            <el-icon size="17px">
                                <FolderAdd />
                            </el-icon>
                            <span>收藏({{ MVdata.subCount }})</span>
                        </el-button>
                        <el-button>
                            <el-icon>
                                <Promotion />
                            </el-icon>
                            <span>
                                分享({{ MVothoerData.shareCount }})
                            </span>
                        </el-button>
                        <el-button>
                            <el-icon>
                                <Download />
                            </el-icon>
                            <span>
                                下载MV
                            </span>
                        </el-button>
                        <a>
                            举报
                        </a>
                    </div>
                </div>
            </div>
            <div class="commtents">
                <h4>评论<span>({{ MVothoerData.commentCount }})</span></h4>
                <commtentsPage father-componet="MVdetail" :main-id="MVId"></commtentsPage>
            </div>
        </div>
        <div class="right-command">
            <h5>相关推荐</h5>
            <div class="simimvs">
                <div class="simimv" v-for="(item, index) in simiMVs" :key="index" @click="tothismv(item.id)">
                    <div class="img-container">
                        <img :src="item.cover" alt="" />
                        <span class="playcount common">
                            <el-icon size="15px">
                                <VideoPlay />
                            </el-icon>
                            {{ numberFormat(item.playCount) }}
                        </span>
                        <span class="duration common">{{ formatTime(item.duration) }}</span>
                    </div>
                    <div class="simimv-info">
                        <h3>{{ item.name }}</h3>
                        <h4>by <span>{{ item.artistName }}</span></h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
    
<script setup>
import commtentsPage from '../../components/commtentsPage.vue'
import { getMVDetail, getMVUrl, getMVOtherData, getsimiMv } from '../../api/index'
import { numberFormat, formatTime } from '../../methods/utils'
import { useRoute, useRouter } from 'vue-router';
import { ref, inject, watch } from 'vue';

const route = useRoute()
const router = useRouter()
const MVId = route.params.MVId;
const MVdata = ref({});
const MVUrl = ref('');
const MVothoerData = ref({})
const simiMVs = ref([])
const reload = inject('reload')
const showdes = ref(false)


// 初始化
const getMVdetail = async () => {
    let res = await getMVDetail(MVId);
    MVdata.value = res.data;
    let result = await getMVUrl(MVId);
    MVUrl.value = result.data.url;
    MVothoerData.value = await getMVOtherData(MVId);
    let siMV = await getsimiMv(MVId);
    simiMVs.value = siMV.mvs
}
getMVdetail()

const toprev = () => {
    router.go(-1)
}

const tothismv = (MVId) => {
    router.push({
        name: 'MVdetail',
        params: {
            MVId
        }
    })
}
const toSinger = (singerId) => {
    router.push({
        name: 'singerdetail',
        params: {
            singerId
        }
    })
}
// 监听路由参数变化 更新页面
watch(() => route.params.MVId, (newVale, oldValue) => {
    if (newVale !== oldValue) {
        reload();
    }
});

</script>
    
<style lang="less" scoped>
.main-container {
    display: flex;
    justify-content: center;
    min-width: 1000px;

    .left-video {
        width: 650px;
        margin-right: 25px;

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

        .mv-info {
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

            .mvdetail {
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
        width: 325px;

        h5 {
            height: 40px;
            line-height: 30px;
            color: #333;
            font-size: 15px;
            font-weight: bold;

        }

        .simimvs {
            .simimv {
                display: flex;
                margin-bottom: 25px;

                .img-container {
                    position: relative;
                    cursor: pointer;

                    img {
                        height: 120px;
                        width: 200px;
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

                .simimv-info {
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