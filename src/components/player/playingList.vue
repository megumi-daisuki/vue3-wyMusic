<template>
    <div class="musiclist-container" :class="closeList">
        <!-- 播放列表/历史 -->
        <nav>
            <div class="tab middle">
                <div class="tab-item" :class="{ active: currentIndex == index }" v-for="(tab, index) in tablist"
                    :key="index" @click="changeTabIndex(index)">
                    {{ tab.label }}</div>
            </div>
        </nav>
        <div class="musiclist">
            <header>
                <h4>共{{ playerStore.playingList.length }}首</h4>
                <span style="cursor: pointer;" @click="clearMusicList">
                    <el-icon size="15px">
                        <DeleteFilled />
                    </el-icon>
                    清空
                </span>
            </header>
            <div class="list-container">
                <el-table empty-text="暂时没有歌曲" height="75vh" :data="playerStore.playingList" style="width: 100%" class="list"
                    @row-dblclick="dbclickPlay">
                    <el-table-column width="55">
                        <template v-slot="scope">
                            <span v-if="scope.row.id == playerStore.nowSong.id">
                                <el-icon size="16px" color="#409eff">
                                    <Headset />
                                </el-icon>
                            </span>
                            <span v-else>{{ formatIndex(scope.$index) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="歌名" width="180">
                        <template v-slot="scope">
                            <div class="song-name-container">
                                <span>{{ scope.row.name }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ar[0].name" label="歌手" width="180">
                        <template v-slot="scope">
                            <span>{{ scope.row.ar[0].name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dt" label="总时长" width="150">
                        <template v-slot="scope">
                            <span>{{ formatTime(scope.row.dt) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="删除" width="60">
                        <template v-slot="scope">
                            <span style="cursor: pointer;" class="middle" @click="deleteSong(scope.row)">
                                <el-icon class="delete" size="20px">
                                    <CloseBold />
                                </el-icon>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject, ref, watch } from 'vue';
import { usePlayerStore } from '../../stores/index';
import { formatIndex } from '../../methods/utils'
import { formatTime } from '../../methods/utils'


const closeList = inject('closeList');

const { resetDuration } = inject('resetDuration');
// const { resetCurrentTime, currentTime } = inject('resetCurrentTime');

const playerStore = usePlayerStore();
const currentIndex = ref(0);
const tablist = ref([
    { label: '播放列表' },
    { label: '历史记录' }
]);


// 切换 列表/历史
const changeTabIndex = (index) => {
    currentIndex.value = index;
};

// 清空歌单
const clearMusicList = () => {
    playerStore.playingList.splice(0, playerStore.playingList.length);
};


// 双击列表播放歌曲
const dbclickPlay = async (row) => {
    if (playerStore.nowSong.id == row.id) return;
    // 更换歌曲链接
    // let sUrl = await getSongUrl(row.id);
    playerStore.saveSongUrl(row.id);
    // 更换当前歌曲
    // let song = await getSongdetail(row.id)
    playerStore.saveNowSong(row.id);
}
// 删除选中的歌曲
const deleteSong = (row) => {
    // console.log(row);
    let index = playerStore.playingList.findIndex((i) => i.id == row.id);
    let nextSongID;

    // 如果删除的是正在播放的歌曲，则播放下一首或第一首
    if (row.id === playerStore.nowSong.id) {
        if (playerStore.playingList[playerStore.playingList.length - 1].id === row.id) {
            if (playerStore.playingList[playerStore.playingList.length - 1].id === playerStore.playingList[0].id) {
                clearMusicList();
            } else {
                nextSongID = playerStore.playingList[0].id;
                playerStore.saveNowSong(nextSongID);
                playerStore.saveSongUrl(nextSongID);
            }
        } else {
            nextSongID = playerStore.playingList[index + 1].id;
            playerStore.saveNowSong(nextSongID);
            playerStore.saveSongUrl(nextSongID);
        }
    };
    playerStore.playingList.splice(index, 1);
}



watch(() => playerStore.playingList.length, () => {
    if (playerStore.playingList.length === 0) {
        // 初始化
        // playerStore.nowSong = {};
        // playerStore.nowSongUrl = '';
        // playerStore.isPlay = false;
        // localStorage.removeItem('duration')
        // localStorage.removeItem('currentTime')
        playerStore.initPlayerStore()
        resetDuration(); // 初始化播放器总时长
    }
})

// console.log(currentTime, "currentTime");
</script>
    
<style lang="less" scoped>
.musiclist-container {
    position: absolute;
    bottom: 3rem;
    right: 0;

    width: 30rem;
    background-color: #fff;
    border-left: 1px solid #409eff;
    transition: right 0.3s;

    nav {
        width: 100%;
        height: 2rem;
        margin-top: 1rem;

        .tab {
            .active {
                color: #409eff;

            }

            .tab-item {
                padding: 0 5px;
                cursor: pointer;


            }
        }
    }

    .musiclist {

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 2rem;
            margin: 1rem 0;

            border-bottom: 1px solid #eee;

            h4 {
                color: #000;
                padding: 0 1rem;
            }

            span {
                margin-right: 1.5rem;

                &:hover {
                    color: #409eff;
                }
            }
        }
    }
}

.closelist {
    right: -100%;
}
</style>