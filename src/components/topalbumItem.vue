<template>
    <div class="img-contain" @mouseenter="showM" @mouseleave="closeM" @click="playsong">
        <el-image :src="albumItem.albumItem.blurPicUrl" alt="" lazy style="width: 100%;" />
        <transition name="el-fade-in-linear">
            <div class="play-icon middle" v-show="isShowDetail">
                <el-icon size="35px" color="#fd544e">
                    <VideoPlay />
                </el-icon>
            </div>
        </transition>
    </div>
    <h4 class="songname" :title="albumItem.albumItem.name">{{ albumItem.albumItem.name }}</h4>
    <h4 class="singer" style="margin-top: 5px;">{{ albumItem.albumItem.artist.name }}</h4>
</template>

<script setup>
import { ref } from 'vue';
import { getAlbumDetail } from '../api/index'
import { usePlayerStore } from '../stores/index'

const albumItem = defineProps(['albumItem'])
const isShowDetail = ref(false)
const playerStore = usePlayerStore()
// 动画
const showM = () => { isShowDetail.value = true }
const closeM = () => { isShowDetail.value = false }


const playsong = async () => {
    // console.log(albumItem.albumItem.id);
    let res = await getAlbumDetail(albumItem.albumItem.id)
    let songid = res.songs[0].id;
    // console.log(songid);
    playerStore.saveNowSong(songid);
    playerStore.saveSongUrl(songid);
    playerStore.addPlayingList(songid)
    playerStore.isPlay = true;

}

</script>
    
<style lang="less" scoped>
.img-contain {
    position: relative;
    cursor: pointer;

    .el-image {
        border-radius: 5px;
    }

    .play-icon {
        position: absolute;
        top: 0%;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;

    }
}



h4 {
    // 多行溢出省略号
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
</style>