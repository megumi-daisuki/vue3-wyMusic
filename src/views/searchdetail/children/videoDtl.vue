<template>
    <div v-if="videoList">
        <section v-loading="loading">
            <videoTable :video-list="videoList"></videoTable>
        </section>
        <div class="pagination-container middle">
            <span>共找到{{ videoCount }}个视频</span>
            <div class="pagination">
                <el-pagination layout="prev, pager, next" :total="videoCount" :page-size="24"
                    @current-change="getViedoList" />
            </div>
        </div>
    </div>
    <div v-else style="width: 100%;height: 100%;">
        <el-empty description="暂无视频" />
    </div>
</template>


<script setup>
import videoTable from '../../../components/videoTable.vue';
import { useRoute } from 'vue-router';
import { getSearchVideo } from '../../../api/index'
import { ref, inject } from 'vue';
const route = useRoute();
const keywords = route.params.keywords
const videoList = ref([]);
const videoCount = ref(0);
const backtop = inject('backtop')
const loading = ref(false);


const getViedoList = async (page = 1) => {
    loading.value = true;
    let offset = (page - 1) * 24;
    let res = await getSearchVideo(keywords, offset);
    videoList.value = res.videos;
    videoCount.value = res.videoCount;
    loading.value = false;
    backtop()
}
getViedoList();

</script>
    
<style lang="less" scoped>

</style>