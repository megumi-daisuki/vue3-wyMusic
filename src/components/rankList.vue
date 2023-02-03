<template>
    <div class="img-container">
        <el-image :src="item.coverImgUrl" alt="170*170" style="width: 100%;" lazy />
    </div>
    <el-table :data="songs" style="width: 1000px" @row-dblclick="playsong">
        <el-table-column prop="name" width="50">
            <template v-slot="scope">
                <span>
                    {{ scope.$index + 1 }}
                </span>
            </template>
        </el-table-column>
        <el-table-column prop="name" width="750">
            <template v-slot="scope">
                <span>{{ scope.row.name }}</span>
                <span style="color: #ccc;">{{ scope.row.alia[0] ? `(${scope.row.alia[0]})` : '' }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="name" width="200" align="right">
            <template v-slot="scope">
                <span v-for="(singer, index) in scope.row.ar" :key="singer.id">
                    {{ index == scope.row.ar.length - 1 ? singer.name : singer.name + '/' }}
                </span>
            </template>
        </el-table-column>
        <template #append>
            <span class="viewmore" @click="tosonglistdetail">查看更多</span>
        </template>
    </el-table>

</template>
    
<script setup >
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getSonglistDetail } from '../api/index'
import { usePlayerStore } from '../stores/index'

const router = useRouter()
const props = defineProps({
    item: {
        type: Object,
        default() {
            return {}
        }
    }
})


const playerStore = usePlayerStore();
const songs = ref([]);

const tosonglistdetail = () => {
    router.push({
        name: 'songlistdetail',
        params: {
            songlistId: props.item.id
        }
    })
}

// 双击播放
const playsong = (row) => {
    playerStore.saveNowSong(row.id);
    playerStore.saveSongUrl(row.id);
    playerStore.addPlayingList(row.id);
    playerStore.isPlay = true;

}

// 初始化
const getRankDetailList = async () => {
    let res = await getSonglistDetail(props.item.id);
    songs.value = res.playlist.tracks.slice(0, 5);
};
getRankDetailList(props.item.id);

</script>
    
<style lang="less" scoped>
.img-container {
    width: 170px;
    height: 170px;
    margin-right: 30px;
    margin-top: 20px;
}


.viewmore {
    display: block;
    margin: 10px 5px;
    cursor: pointer;

    &:hover {
        color: #409eff;
    }
}
</style>