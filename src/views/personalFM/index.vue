<template>
    <div class="personalFM w">
        <div class="left-bg ">
            <div class="al-bg">
                <img :src="nowFM?.album?.blurPicUrl" alt="">
            </div>
            <div class="operation">
                <div class="star operate">
                    <el-icon>
                        <Star />
                    </el-icon>
                    <span>收藏</span>
                </div>
                <div class="playbox ">
                    <div class="operate" @click="playSong(false)" v-if="!isPlay">
                        <el-icon>
                            <VideoPlay />
                        </el-icon>
                        <span>播放</span>
                    </div>
                    <div class="operate" @click="playSong(true)" v-else>
                        <el-icon>
                            <VideoPause />
                        </el-icon>
                        <span>暂停</span>
                    </div>
                </div>
                <div class="next operate" @click="nextSong">
                    <el-icon>
                        <DArrowRight />
                    </el-icon>
                    <span>下一首</span>
                </div>
            </div>
        </div>
        <div class="right-lyric">
            <div class="top-info">
                <h2 class="songname">
                    <span>{{ nowFM?.name }}</span>
                </h2>
                <div>
                    <h2>
                        专辑: <span class='light' @click="toAlbum">{{ nowFM?.album?.name }}</span>
                    </h2>
                    <h2>
                        歌手: <span class="light" @click="toSinger">{{ nowFM?.artists[0]?.name }}</span>
                    </h2>
                </div>
            </div>
            <el-scrollbar class="lyric" ref="scrollbox">
                <ul v-if="lyricArr.length">
                    <li v-for="(item, index) in lyricArr" :key="index" :class="{ active: index == nowLyricIndex }"
                        @mouseenter="showLT(index)" @mouseleave="isActive = false" @dblclick="dblclickPlay(item)">
                        <span class="lytime" v-show="isActive & currentIndex == index">{{
                            timeToMinute(item.time)
                        }}</span>
                        <div class="lyricbox ">
                            <p class="lyc">{{ item.lyric }}</p>
                            <p v-if="item.tlyric">{{ item.tlyric }}</p>
                        </div>

                    </li>
                </ul>
                <div v-else class="nolyric">
                    <h2>暂无歌词,请欣赏</h2>
                </div>
            </el-scrollbar>
        </div>
    </div>
    <div class="w" v-if="nowFM">
        <commtentsPage fatherComponet="personalFM" :mainId="nowFMid" :key="timestampKey"></commtentsPage>
    </div>

</template>
    
<script setup>
import commtentsPage from '@/components/commtentsPage.vue';
import { personalFm } from '@/api/index';
import { storeToRefs } from 'pinia';
import { ref, watch, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router'
import { usePlayerStore, useFMstore } from '@/stores';
import { timeToMinute } from '@/methods/utils'

const router = useRouter();

// fm仓库
const FMstore = useFMstore()
const { FMArr, lyricArr, nowFM, nowLyricIndex, timestampKey } = storeToRefs(FMstore)
const { nextSong, updatePlayer, getNowSongLyric } = FMstore

// player仓库
const playerStore = usePlayerStore()
const { currentTime, isPlay, playmodel, } = storeToRefs(playerStore)
const { initPlayerStore } = playerStore


const nowFMid = computed(() => nowFM.value.id)

// 歌词滚动区
const scrollbox = ref()
// 鼠标进入滚动区标识符
let isActive = ref(false)


// 鼠标经过歌词的索引
const currentIndex = ref(null)

// 监听当前播放时间
watch(() => currentTime.value, (newVal, oldVal) => {
    if (newVal == 0) return;
    lyricArr.value.forEach((item, index) => {
        if (Math.ceil(newVal) == item.time) {
            nowLyricIndex.value = index;
            // 鼠标进入不滚动
            if (isActive.value) return;
            scrollbox.value.scrollTo({
                top: 50 * index,
                behavior: 'smooth'
            })
        }
    })

})

// 监听所有歌曲数,若只剩一个歌曲，则获取新歌曲
watch(() => FMArr.value.length, async () => {
    if (FMArr.value.length !== 1) return;
    let timestamp = Date.now();
    let res = await personalFm(timestamp);
    res.data.forEach((i) => {
        FMArr.value.push(i)
    })
})

// 鼠标经过显示歌词的时间
const showLT = (index) => {
    isActive.value = true
    currentIndex.value = index
}

// 播放和暂停
const playSong = (statu) => {
    if (statu) {
        isPlay.value = false
    } else {
        isPlay.value = true
    }
}

// 双击播放指定歌词处
const dblclickPlay = (lyric) => {
    let audio = document.querySelector('#audio');
    audio.currentTime = lyric.time;
    isActive.value = false;
}

// 跳转到歌手页面
const toSinger = () => {
    router.push({
        name: 'singerdetail',
        params: {
            singerId: nowFM.value.artists[0].id
        }
    })
}

// 跳转到专辑页面
const toAlbum = () => {
    router.push({
        name: 'albumdetail',
        params: {
            albumId: nowFM.value.album.id
        }
    })
}


// 初始化
const init = async () => {
    playmodel.value = 1;

    let timestamp = Date.now();
    let res = await personalFm(timestamp)
    FMArr.value = res.data;

    await getNowSongLyric()
    updatePlayer()

}
init()

onBeforeUnmount(() => {
    initPlayerStore()
})


</script>
    
<style lang="less" scoped>
.w {
    width: 1000px;
    margin: 0 auto;
}

.personalFM {
    display: flex;
    justify-content: space-around;
    margin-bottom: 30px;

    .left-bg {
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .al-bg {
            width: 300px;
            height: 300px;

            img {
                border-radius: 5px;
            }
        }

        .operation {
            display: flex;
            justify-content: space-between;
            font-size: 20px;
            font-weight: bold;


            .operate {
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
            }

            .playbox:hover,
            .star:hover,
            .next:hover {
                color: #409eff;
            }

        }


    }

    .right-lyric {
        text-align: center;
        width: 600px;

        .top-info {
            h2 {
                padding: 10px 0;
            }

            .songname {
                font-size: 20px;
                font-weight: bolder;
            }

            .light {
                cursor: pointer;

                &:hover {
                    color: #409eff;
                }
            }
        }


        .lyric {


            height: 300px;
            overflow-y: auto;

            // 隐藏滚动条
            &::-webkit-scrollbar {
                display: none;
            }

            ul {
                margin-top: 100px;
                color: rgb(60, 60, 60);

                li {
                    position: relative;
                    height: 40px;

                    padding: 5px 0;
                    cursor: pointer;
                    // 字体无法选中

                    user-select: none;

                    .lytime {
                        line-height: 40px;
                        position: absolute;
                        left: 10px;
                        font-size: 13px;

                    }

                    .lyricbox {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100%;

                    }
                }

                .active {
                    font-size: larger;
                    font-weight: 20px;
                    color: orange;
                }
            }

            .nolyric {
                margin-top: 100px;
                font-size: 20px;
                font-weight: bolder;
            }
        }
    }
}
</style>