<template>
    <div class="player-container">
        <audio :src="playerStore.nowSongUrl" autoplay ref="audio" id="audio" @timeupdate="timeUpdate"
            @loadedmetadata="loadedmetadata" @ended="endedCallback"></audio>
        <!-- 左边 歌曲基本信息 -->
        <div class="song-info-container">
            <div class="song-info">
                <div class="song">
                    <img :src="getImgUrl" alt="" style="width: 60px;height: 60px;">
                    <div class="open-detail">
                        <el-icon size="20px">
                            <ArrowUpBold />
                        </el-icon>
                    </div>
                </div>
                <div class="singer-info">
                    <p class="songname">{{ playerStore.nowSong.name || '网易云音乐' }}</p>
                    <p class="singer" v-if="Object.keys(playerStore.nowSong).length">{{
                        playerStore.nowSong.ar[0].name
                    }}</p>
                </div>
                <div class="love middle marg" v-if="playerStore.playingList.length">
                    <el-icon size="20px">
                        <Star />
                    </el-icon>
                </div>
                <div class="download middle marg" v-if="playerStore.playingList.length">
                    <el-icon size="20px">
                        <Download />
                    </el-icon>
                </div>
            </div>
        </div>
        <!-- 中间 播放器相关 -->
        <div class="player-center">
            <div class="change-play middle">
                <span class="check-box middle" @click="changeSong(0)" v-if="path != '/personFM'">
                    <el-icon>
                        <DArrowLeft />
                    </el-icon>
                </span>
                <span class="play-box middle" @click="play(!isPlay)">
                    <el-icon v-if="!isPlay">
                        <VideoPlay />
                    </el-icon>
                    <el-icon v-else>
                        <VideoPause />
                    </el-icon>
                </span>
                <span class="check-box middle" @click="changeSong(1)" v-if="path != '/personFM'">
                    <el-icon>
                        <DArrowRight />
                    </el-icon>
                </span>
            </div>
            <!-- 进度条 -->
            <div class="play-progress middle">
                <span>{{ formatTime(currentTime) }}</span>
                <div class="progress-bar">
                    <el-slider v-model="currentTime" :format-tooltip="formatTime" :max="duration" @change="slider" />
                </div>
                <span>{{ formatTime(duration) }}</span>
            </div>
            <!-- 播放模式 -->
            <div class="play-model middle" v-if="path != '/personFM'">
                <el-tooltip effect="dark" content="顺序播放" placement="top" v-if="playmodel === 1">
                    <span class="iconfont icon-orderplay" v-if="playmodel == 1" @click="changePlayModel"></span>
                </el-tooltip>
                <el-tooltip effect="dark" content="随机播放" placement="top" v-if="playmodel === 2">
                    <span class="iconfont icon-random" v-if="playmodel === 2" @click="changePlayModel"></span>
                </el-tooltip>
                <el-tooltip effect="dark" content="单曲循环" placement="top" v-if="playmodel === 3">
                    <span class="iconfont icon-repeat" v-if="playmodel === 3" @click="changePlayModel"></span>
                </el-tooltip>
                <span class="iconfont icon-lyrics"></span>
            </div>
            <!-- 声音控制 -->
            <div class="right-voice middle">
                <!-- 静音按钮 -->
                <span class="sound" @click="mutedVolume">
                    <i class="iconfont icon-mute" v-if="volume === 0"></i>
                    <i class="iconfont icon-loud" v-else></i>
                </span>
                <!-- 声音进度条 -->
                <div class="v-progress">
                    <el-slider size="small" v-model="volume" @input="getVolume"></el-slider>
                </div>
                <!-- 播放列表按钮 -->
                <el-tooltip effect="dark" content="播放列表" placement="top" v-if="path != '/personFM'">
                    <span id="listButton" class="iconfont icon-musiclist" @click="closePlayingList"></span>
                </el-tooltip>
            </div>
        </div>
        <!-- 右边播放列表 -->
        <div id="playinglist">
            <playingList></playingList>
        </div>
    </div>
</template>

<script setup>
import playingList from './playingList.vue';
import { useRoute } from 'vue-router';

import { getRandom } from '../../methods/utils'
import { useFMstore, usePlayerStore } from '../../stores/index';
import { computed, onMounted, provide, readonly, ref, reactive, watch, } from 'vue';
import { storeToRefs } from 'pinia';

const route = useRoute()
const path = computed(() => route.path)
const audio = ref();  // 播放器的标识
const playerStore = usePlayerStore();
const { currentTime, isPlay, playmodel } = storeToRefs(playerStore)
const FMstore = useFMstore()


const duration = ref(JSON.parse(localStorage.getItem('duration')) ?? 0);     // 总时长    格式化后的值  270s
const volume = ref(JSON.parse(localStorage.getItem('volume')) ?? 100); // 音量默认100
// 隐藏播放列表
const closeList = reactive({
    closelist: true    // key是类名
});


provide('closeList', readonly(closeList));
provide('resetDuration', { duration, resetDuration });
// provide('resetCurrentTime', { currentTime, resetCurrentTime });

const getImgUrl = computed(() => {
    // console.log(playerStore.nowSong);
    return Object.keys(playerStore.nowSong).length === 0 ? '/src/assets/img/logo.png' : playerStore.nowSong.al.picUrl
})
// 打开/关闭播放列表
const closePlayingList = () => {
    closeList.closelist = !closeList.closelist
}

// 格式化时间
const formatTime = (time) => {
    var duration = parseInt(time);
    var minute = parseInt(duration / 60);
    var sec = (duration % 60) + "";
    var isM0 = ":";
    if (minute === 0) {
        minute = "00";
    } else if (minute < 10) {
        minute = "0" + minute;
    }
    if (sec.length === 1) {
        sec = "0" + sec;
    }
    return minute + isM0 + sec;

}


// 音频加载完成缓存
const loadedmetadata = () => {
    localStorage.setItem('duration', duration.value);
    duration.value = audio.value.duration;
    audio.value.currentTime = currentTime.value
}

// 音频当前时间更新
const timeUpdate = () => {
    currentTime.value = audio.value.currentTime;
    localStorage.setItem('currentTime', currentTime.value)
}


// 初始化总时间
function resetDuration() {
    currentTime.value = 0;
    setTimeout(() => { duration.value = 0; }, 0)
}

// 点击播放
const play = (flag = isPlay.value) => {

    if (duration.value === 0) return;
    if (flag) {
        audio.value.play();
        isPlay.value = true;

    } else {
        audio.value.pause();
        isPlay.value = false;
    }
};



//正在被拖动时改变当前播放值
const slider = (val) => {
    if (duration.value !== 0) {
        audio.value.currentTime = val;
        play(true);
    } else return;
};



// 格式化音量
const formatVolume = (volume) => {
    return volume / 100;
}

// 获取目前音量大小
const getVolume = () => {
    audio.value.volume = formatVolume(volume.value);
}

// 点击静音
const mutedVolume = () => {
    if (volume.value !== 0) {
        volume.value = 0;
        audio.value.volume = volume.value;
    } else {
        volume.value = 100;
        audio.value.volume = formatVolume(volume.value);
    }
}


// 切模式
const changePlayModel = () => {
    // audio.value.loop = false;
    playmodel.value == 3 ? playmodel.value = 1 : playmodel.value++;
}

// 切歌
const changeSong = (type) => {
    // playerStore.isPlay = false;
    if (playerStore.playingList.length == 0) {
        ElMessage({
            showClose: true,
            message: '播放列表是空的',
            type: 'error',
            center: true
        });
    } else if (playerStore.playingList.length == 1) {
        play(true);
    } else {
        if (playmodel.value === 1 || playmodel.value === 3) {
            orderPlay(type);
        } else if (playmodel.value === 2) {
            randomPlay();
        }
    }
}


// 顺序播放  1
const orderPlay = (type) => {
    let nowIndex = playerStore.playingList.findIndex((item) => item.id === playerStore.nowSong.id);
    let nindex;
    switch (nowIndex) {
        case -1:
            nindex = 0;
            break;
        case 0:
            nindex = type === 0 ? playerStore.playingList.length - 1 : nowIndex + 1;
            break;
        case playerStore.playingList.length - 1:
            nindex = type === 0 ? nowIndex - 1 : 0
            break;
        default:
            nindex = type === 0 ? nowIndex - 1 : nowIndex + 1;
            break;
    }

    playerStore.saveNowSong(playerStore.playingList[nindex].id);
    playerStore.saveSongUrl(playerStore.playingList[nindex].id);
    // console.log('id', playerStore.playingList[nindex].id);
    play(true);
}

// 随机播放  2
const randomPlay = () => {
    let rindex = getRandom(0, playerStore.playingList.length - 1);
    // let sUrl = await getSongUrl(playerStore.playingList[rindex].id);
    // let song = await getSongdetail(playerStore.playingList[rindex].id);
    playerStore.saveNowSong(playerStore.playingList[rindex].id);
    playerStore.saveSongUrl(playerStore.playingList[rindex].id);
    play(true);
};

// 单曲循环  3
const repeatPlay = () => {
    currentTime.value = 0;
    play(true);
    // console.log('单曲循环');
}

// 播放结束的回调
const endedCallback = () => {
    if (route.path == '/personFM') {
        return FMstore.nextSong()
    } else {
        return playmodel === 3 ? repeatPlay() : changeSong()
    }
}

// 点击空白处关闭列表
const closeMusicList = function (event) {
    var playinglist = document.querySelector('#playinglist');
    var listButton = document.querySelector('#listButton');
    if (!listButton) return;
    if (playinglist || listButton) {
        if (!playinglist.contains(event.target) && !listButton.contains(event.target)) {
            closeList.closelist = true;
        }
    }
};

// 监听播放状态，私人fm用
watch(() => isPlay.value, (newVal, oldVal) => {
    play()
})
// console.log(route.path);

onMounted(() => {
    window.addEventListener('click', closeMusicList)
})

window.addEventListener('unload', () => {
    localStorage.setItem('volume', volume.value)
    localStorage.setItem('playmodel', playmodel.value)
    localStorage.setItem('nowSong', JSON.stringify(playerStore.nowSong))
    localStorage.setItem('nowSongUrl', playerStore.nowSongUrl)
    localStorage.setItem('playinglist', JSON.stringify(playerStore.playingList))
})


</script>
    
<style lang="less" scoped>
.player-container {
    display: flex;
    position: fixed;
    align-items: center;
    bottom: 0;
    height: 70px;
    width: 100%;
    z-index: 99;
    background-color: #f8f8ff;

    padding: 0 5px;

    audio {
        display: line-block;
        height: 0;
    }

    // 左边
    .song-info-container {
        width: 15%;

        .song-info {
            display: flex;
            align-items: center;

            .singer-info {
                .songname {
                    width: 100px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis
                }
            }

            .marg {
                padding: 5px;
                cursor: pointer;

                &:hover {
                    color: #409eff;
                }
            }

            .song {
                position: relative;
                width: 60px;

                &:hover .open-detail {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    translate: -50% -50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: 100%;
                    color: #fff;
                    background-color: rgba(100, 100, 100, 0.5);
                    cursor: pointer;
                }

                .open-detail {
                    display: none;
                }
            }

            .singer-info {
                padding-right: 30px;
            }

        }
    }

    // 中间
    .player-center {
        display: flex;
        flex: 1;
        margin-left: 20px;

        .change-play {
            width: 10%;

            .check-box {
                width: 25px;
                height: 30px;
                margin: 0 10px;
                font-size: 18px;
                cursor: pointer;

                &:hover {
                    color: #409eff;
                }
            }

            .play-box {
                width: 42px;
                height: 42px;
                font-size: 28px;
                cursor: pointer;

                &:hover {
                    color: #409eff;
                }

            }
        }

        // 进度条
        .play-progress {
            flex: 1;
            height: 70px;

            span {
                padding: 0 10px;
            }

            .progress-bar {
                width: 100%;
            }
        }

        // 播放模式
        .play-model {
            width: 6%;

            span {
                width: 25px;
                margin: 0 5px;

                &:hover {
                    color: #409eff;
                }
            }

            .icon-orderplay,
            .icon-random {
                font-size: 18px;
                // font-weight: 700;
            }

            .icon-repeat,
            .icon-lyrics {
                font-size: 18px;
                font-weight: 700;
            }
        }

        // 声音
        .right-voice {
            width: 20%;

            .sound {
                padding-right: 8px;
            }

            .icon-loud,
            .icon-mute {
                font-size: 20px;
                font-weight: 700;
                padding-right: 10px;
            }

            .icon-musiclist {
                font-size: 18px;
                padding-left: 20px;
            }

            .v-progress {
                width: 60%;

                // 音量球大小
                :deep(.el-slider__button) {
                    width: 16px;
                    height: 16px;
                }
            }

            span {
                cursor: pointer;

                &:hover {
                    color: #409eff;
                }
            }
        }

        span {
            cursor: pointer;
        }

    }
}
</style>