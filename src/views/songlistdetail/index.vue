<template>
    <topdesc :mainInfo="playlistInfo" :songs="songs" title="songlist"></topdesc>
    <!-- 底部歌曲 -->
    <div class="bot-song-list" v-if="Object.keys(playlistInfo).length !== 0">
        <el-tabs class="demo-tabs">
            <el-tab-pane label="歌曲列表">
                <songTable :songlist="songs"></songTable>
            </el-tab-pane>
            <el-tab-pane label="评论">
                <commtentsPage :mainId="songlistId" fatherComponet="songlistdetail"></commtentsPage>
            </el-tab-pane>
            <el-tab-pane label="收藏者">
                <subscribers :songlistId="songlistId"></subscribers>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import topdesc from '@/components/topdesc.vue'
import songTable from '@/components/songTable.vue';
import commtentsPage from '@/components/commtentsPage.vue';
import subscribers from '@/components/subscribers.vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { getAllSongdetail, getSonglistDetail } from '../../api/index'

const route = useRoute()
const songlistId = ref(route.params.songlistId); // 歌单id
const playlistInfo = ref({}); // 歌单信息
const songids = ref(''); // 歌单里所有歌曲的id
const songs = ref([]) //歌单中所有歌曲详细信息





const getPlaylist = async () => {
    let res = await getSonglistDetail(songlistId.value);
    playlistInfo.value = res.playlist
    //存储歌单中的所歌曲id，为一个字符串            
    if (playlistInfo.value.trackIds.length > 1000) {
        playlistInfo.value.trackIds.slice(0, 500).forEach(item => {
            songids.value += item.id + ",";
        });
    } else {
        playlistInfo.value.trackIds.forEach(item => {
            songids.value += item.id + ",";
        });
    }
    let queryids = songids.value.slice(0, songids.value.length - 1);
    /* 根据歌曲id获取每首歌的信息*/
    songs.value = await getAllSongdetail(queryids)

};
getPlaylist()

</script>
    
<style lang="less" scoped>
.demo-tabs::after {
    content: '';
    display: block;
    height: 20px;
}
</style>