<template>
    <div>
        <el-table :data="songlist" style="width: 100%" @row-dblclick="playsong">
            <el-table-column width="55">
                <template #default="scope">
                    <span class="iconfont icon-loud" style="color: #fd544e;"
                        v-if="playerStore.nowSong.id == scope.row.id"></span>
                    <span v-else style="color: #acacac;">
                        {{ formatIndex(scope.$index) }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column width="80">
                <template v-slot="scope">
                    <div class="img-container" @click="playsong(scope.row)">
                        <el-image :src="scope.row.album.blurPicUrl" alt="" style="width: 60px; height: 60px" fit="cover"
                            lazy />
                        <div class="play-icon middle">
                            <el-icon size="35px" color="#fd544e">
                                <VideoPlay />
                            </el-icon>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="500">
                <template #default="scope">
                    <span>
                        {{ scope.row.name }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column width="250">
                <template #default="scope">
                    <span v-for="(item, index) in scope.row.artists" :key="index" style="color: #acacac;">
                        {{ index === scope.row.artists.length - 1 ? item.name : item.name + '/' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column width="230">
                <template #default="scope">
                    <span style="color: #acacac;">
                        {{ scope.row.album.name }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column width="80">
                <template #default="scope">
                    <span style="color: #acacac;">
                        {{ formatTime(scope.row.duration) }}
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
    
<script setup>
import { formatIndex, formatTime } from '../methods/utils'
import { usePlayerStore } from '../stores';

defineProps(['songlist'])
const playerStore = usePlayerStore()

// 双击切歌
const playsong = async (row) => {
    playerStore.saveNowSong(row.id);
    playerStore.saveSongUrl(row.id);
    playerStore.addPlayingList(row.id);
    playerStore.isPlay = true
}

</script>
    
<style lang="less" scoped>
.img-container {
    position: relative;
    width: 60px;
    height: 60px;
    cursor: pointer;

    .play-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        translate: -50% -50%;
        width: 50%;
        height: 50%;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.8);
    }
}

span {
    cursor: default;
}
</style>