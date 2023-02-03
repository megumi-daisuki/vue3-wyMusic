<template>
    <topdesc :main-info="singer" title="singer"></topdesc>
    <div class="bot-song-list" v-if="Object.keys(singer).length !== 0">
        <el-tabs class="demo-tabs">
            <el-tab-pane label="专辑">
                <albumTable :album-list="albumlist"></albumTable>
            </el-tab-pane>
            <el-tab-pane label="MV">
                <videoTable :video-list="MVs"></videoTable>
            </el-tab-pane>
            <el-tab-pane label="歌手详情">
                <div class="descript">
                    <div v-if="briefDesc">
                        <h3>歌手简介</h3>
                        <p>{{ briefDesc }}</p>
                    </div>
                    <div v-for="(item, index) in introduction" :key="index" v-if="introduction.length">
                        <h3>{{ item.ti }}</h3>
                        <p>{{ item.txt }}</p>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>

</template>
    
<script setup>
import topdesc from '../../components/topdesc.vue';
import albumTable from '../../components/albumTable.vue';
import videoTable from '../../components/videoTable.vue';
import { ref } from 'vue';
import { getSingerdetail, getSingerAlb, getSingerMv, getSingerDesc } from '../../api/index'
import { useRoute } from 'vue-router';

const route = useRoute()
const singerId = route.params.singerId
const singer = ref({});
const albumlist = ref([]);
const MVs = ref([]);
const briefDesc = ref(''); // 歌手简介
const introduction = ref([]); // 歌手经历



// 初始化
const getSingerdetailF = async () => {
    let singerRES = await getSingerdetail(singerId);
    singer.value = singerRES.artist;
    let albumRES = await getSingerAlb(singerId);
    albumlist.value = albumRES.hotAlbums;
    let mvRES = await getSingerMv(singerId);
    MVs.value = mvRES.mvs;
    let desc = await getSingerDesc(singerId);
    briefDesc.value = desc.briefDesc;
    introduction.value = desc.introduction;
}
getSingerdetailF()

</script>
    
<style lang="less" scoped>
.descript {
    h3 {
        font-size: 15px;
        font-weight: bold;
        margin: 10px 0;
    }

    p {
        line-height: 30px;
        color: #666;
        white-space: pre-wrap;
        padding-bottom: 20px;
    }
}
</style>