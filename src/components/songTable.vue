<template>
    <el-table style="width: 100%" :data="songlist" empty-text="数据加载中~" @row-dblclick="playMusic">
        <!-- 播放图标 -->
        <el-table-column width="60">
            <template v-slot="scope">
                <span v-if="scope.row.id == playerStore.nowSong.id">
                    <el-icon size="16px" color="#409eff">
                        <Headset />
                    </el-icon>
                </span>
                <span v-else>{{ formatIndex(scope.$index) }}</span>
            </template>
        </el-table-column>
        <!-- 星星 -->
        <el-table-column width="40">
            <template v-slot="scope">
                <span id="star" title="收藏">
                    <el-icon size="16px">
                        <Star />
                    </el-icon>
                </span>
            </template>
        </el-table-column>
        <!-- 下载 -->
        <el-table-column width="40">
            <template v-slot="scope">
                <span id="download" title="下载">
                    <el-icon size="16px">
                        <Download />
                    </el-icon>
                </span>
            </template>
        </el-table-column>
        <!-- 添加到播放列表 -->
        <el-table-column width="50">
            <template v-slot="scope">
                <span id="add" title="添加到播放列表" @click="addPlayList(scope.row)">
                    <el-icon size="16px">
                        <Plus />
                    </el-icon>
                </span>
            </template>
        </el-table-column>
        <!-- 歌名 -->
        <el-table-column prop="name" label="歌名" width="350">
            <template v-slot="scope">
                <div class="song-name-container">
                    <span>{{ scope?.row?.name }}</span>
                </div>
            </template>
        </el-table-column>
        <!-- 歌手 -->
        <el-table-column prop="artists[0].name" label="歌手" width="250">
            <template v-slot="scope">
                <span v-for="(item, index) in scope.row.artists" :key="index" v-if="scope.row.artists" class="singer">{{
                    index === scope.row.artists?.length - 1 ? item.name : item.name + '/'
                }}</span>
                <span v-for="(item, index) in scope.row.ar" :key="index" v-if="scope.row.ar" class="singer">{{
                    index === scope.row.ar?.length - 1 ? item.name : item.name + '/'
                }}</span>
            </template>
        </el-table-column>
        <!-- 专辑 -->
        <el-table-column prop="album.name" label="专辑" width="400">
            <template v-slot="scope">
                <span v-if="scope.row.album">{{ scope.row.album?.name }}</span>
                <span v-if="scope.row.al">{{ scope.row.al?.name }}</span>
            </template>
        </el-table-column>
        <!-- 时长 -->
        <el-table-column prop="duration" label="时长" width="200">
            <template v-slot="scope">
                <span>{{ formatTime(scope.row.duration || scope.row.dt) }}</span>
            </template>
        </el-table-column>
    </el-table>
</template>
    
<script setup>
import { formatTime, formatIndex } from '@/methods/utils'
import { usePlayerStore } from '../stores/index'
defineProps(['songlist'])

const playerStore = usePlayerStore()


// 双击播放
const playMusic = async (row, column) => {
    // 获取url
    playerStore.saveSongUrl(row.id);
    playerStore.saveNowSong(row.id);
    playerStore.addPlayingList(row.id);
    playerStore.isPlay = true;
    // console.log('row', row);
};

// 添加到播放列表
const addPlayList = (song) => {
    playerStore.addPlayingList(song.id, 1);
}
</script>
    
<style lang="less" scoped>
.singer {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

#star,
#download,
#add {
    cursor: pointer;

    &:hover .el-icon {
        color: #409eff;
    }
}
</style>