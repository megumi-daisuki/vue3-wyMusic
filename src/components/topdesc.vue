<template>
    <div class="top-desc" v-if="Object.keys(mainInfo).length">
        <div class="left-img">
            <img :src="(mainInfo.coverImgUrl || mainInfo.blurPicUrl || mainInfo.cover)" alt="">
        </div>
        <div class="right-desc">
            <div class="title">
                <el-tag effect="plain" type="danger" v-if="title !== 'singer'">{{ titleObj[title] }}</el-tag>
                <h2>{{ mainInfo.name || '' }}</h2>
            </div>
            <!-- 作者相关信息 -->
            <div class="creator-info" v-if="title !== 'singer'">
                <!-- 头像 -->
                <div class="avatar" v-if="(title !== 'album' && title !== 'singer')">
                    <img :src="mainInfo.creator.avatarUrl" alt="" />
                </div>
                <!-- 名字 -->
                <div class="uname">
                    <span v-if="title === 'album'">歌手：</span>
                    <span style=" color: #409eff;">{{
                        mainInfo.creator?.nickname ||
                            mainInfo.artist?.name || mainInfo.name
                    }}</span>
                </div>
                <!-- 创建时间 -->
                <div class="creat-time" style="  cursor: default;">
                    <p>创建时间：{{
                        timestampToTime(mainInfo.createTime || mainInfo.publishTime)
                    }}</p>
                </div>
            </div>
            <!-- 相关操作 -->
            <div class="operation">
                <el-button type="danger" icon="el-icon-video-play" v-if="title !== 'singer'" @click="playAll">
                    <el-icon size="17px">
                        <VideoPlay />
                    </el-icon>
                    <span>播放全部</span>
                </el-button>
                <el-button>
                    <el-icon size="17px">
                        <FolderAdd />
                    </el-icon>
                    <span>收藏 <span v-if="title !== 'singer'">({{
                        numberFormat(mainInfo.subscribedCount ||
                            submain?.subCount)
                    }})</span></span>
                </el-button>
                <el-button v-if="title !== 'singer'">分享({{ mainInfo.shareCount ?? submain.shareCount }})</el-button>
            </div>
            <!-- 歌单标签 -->
            <div class="tags" v-if="title === 'songlist'">
                <span>标签：</span>
                <span v-for="(item, index) in mainInfo.tags" :key="index" class="tags-item" @click="toSonglist(item)">
                    <el-tag effect="plain" size="small">{{ item }}</el-tag>
                </span>
            </div>
            <!-- 歌曲数量 歌单播放量 -->
            <div class="song-count" v-if="(title !== 'album' && title !== 'singer')">
                <span>歌曲：{{ mainInfo.trackIds.length }}</span>
                <span>播放：{{ numberFormat(mainInfo.playCount) }}</span>
            </div>
            <!-- 歌曲数量 mv数量 专辑数量 singer -->
            <div class="song-count" v-if="title === 'singer'">
                <span>单曲数：{{ mainInfo.musicSize }}</span>
                <span>专辑数：{{ mainInfo.albumSize }}</span>
                <span>MV数： {{ mainInfo.mvSize }}</span>
            </div>
            <!-- 歌单简介 -->
            <div class="desc-info" v-if="(title !== 'album' && title !== 'singer')">
                <p v-if="mainInfo.description" :title="mainInfo.description">简介：{{ mainInfo.description }}</p>
                <span v-else>简介：暂无简介</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { timestampToTime, numberFormat } from '../methods/utils'
import { usePlayerStore } from '../stores/index'
const router = useRouter()
const props = defineProps(['mainInfo', 'submain', 'songs', 'title'])
const titleObj = {
    songlist: '歌单',
    album: '专辑',
}
const playerStore = usePlayerStore()
const playAll = () => {
    if (!playerStore.playingList.length) {
        playerStore.isPlay = true;
        playerStore.saveNowSong(props.songs[0].id)
        playerStore.saveSongUrl(props.songs[0].id)
    };
    playerStore.playingList.push(...props.songs);
}

// 路由跳转
const toSonglist = (tagname) => {
    router.replace({
        path: '/findmusic/songlist',
        query: {
            tagname
        }
    })
}
</script>
    
<style lang="less" scoped>
.top-desc {
    display: flex;

    .left-img {
        width: 220px;
        height: 220px;


        img {
            border-radius: 5px;
            object-fit: cover;
        }
    }

    .right-desc {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 20px;
        flex: 1;

        .title {
            display: flex;
            align-items: center;

            h2 {
                margin-left: 10px;
                font-weight: bolder;
                font-size: 20px;
                color: #333;
            }
        }

        .creator-info {
            display: flex;
            align-items: center;
            margin-top: 10px;

            .avatar {
                width: 30px;
                cursor: default;

                img {
                    border-radius: 50%;
                }
            }

            .uname {
                padding: 0 10px;

                cursor: default;
            }
        }

        .operation {
            margin: 5px 0;
        }

        .tags {

            margin-bottom: 5px;
            color: rgb(115, 115, 115);
            cursor: default;

            .tags-item {
                margin: 0 5px;
                cursor: pointer;
            }
        }

        .song-count {
            margin-top: 10px;
            color: rgb(115, 115, 115);

            span {
                padding-right: 10px;
            }
        }

        .desc-info {
            margin-top: 5px;
            color: rgb(115, 115, 115);

            p {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }
        }
    }
}
</style>