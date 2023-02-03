<template>
    <topdesc :mainInfo="albumInfo" :submain="albumDynamic" :songs="songs" title="album"></topdesc>
    <div v-if="Object.keys(albumInfo).length !== 0">
        <el-tabs class="demo-tabs">
            <el-tab-pane label="歌曲列表">
                <songTable :songlist="songs"></songTable>
            </el-tab-pane>
            <el-tab-pane label="评论">
                <commtentsPage :mainId="albumId" fatherComponet="albumdetail"></commtentsPage>
            </el-tab-pane>
            <el-tab-pane label="专辑详情">
                <div v-if="albumInfo.description">
                    <h5>专辑介绍</h5>
                    <h4 class="description">
                        {{ albumInfo.description }}
                    </h4>
                </div>
                <div class="middle description" v-else>
                    暂无描述
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>

</template>
    
<script setup>
import topdesc from '@/components/topdesc.vue'
import songTable from '../../components/songTable.vue';
import commtentsPage from '@/components/commtentsPage.vue';

import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { getAlbumDetail, getAlbumDetaildynamic } from '../../api/index'

const route = useRoute()
const albumId = ref(route.params.albumId)
const songs = ref([]) // 所有歌曲
const albumInfo = ref([]) // 详情
const albumDynamic = ref({}) // 专辑动态信息

const getAlbumDetailF = async () => {
    let res = await getAlbumDetail(albumId.value);
    albumDynamic.value = await getAlbumDetaildynamic(albumId.value)
    songs.value = res.songs;
    albumInfo.value = res.album;
}
getAlbumDetailF()

</script>

<style lang="less" scoped>
h5 {
    color: #333;
    font-weight: 700;
}

.description {
    margin-top: 5px;
    color: #666;
    white-space: pre-wrap;
    text-indent: 2em;
}
</style>