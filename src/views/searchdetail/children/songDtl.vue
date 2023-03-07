<template>
    <div class="song-detail-container">
        <!-- 列表 -->
        <div class="song-table">
            <div v-loading="loading" class="table-container">
                <songTable :songlist="songlist"></songTable>
            </div>

            <div class="pagination-container middle">
                <span>共找到{{ songCount }}首歌</span>
                <div class="pagination">
                    <el-pagination layout="prev, pager, next" :total="songCount" :page-size="50"
                        @current-change="getSongList" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import songTable from '../../../components/songTable.vue';
import { getSearchSong, } from '../../../api/index'
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const songlist = ref([]);
const songCount = ref(0);

const loading = ref(false)

// 初始化 获取歌单
const getSongList = async (page = 1) => {
    loading.value = true;
    let offset = (page - 1) * 50;
    let res = await getSearchSong(route.params.keywords, offset);
    songlist.value = res.songs;
    songCount.value = res.songCount;
    loading.value = false
};
getSongList();

</script>
    
<style lang="less" scoped>
.song-detail-container {
    width: 100%;


    .song-table {
        .table-container {
            width: 100%;
            height: 100%;
        }

        .pagination-container {

            margin-top: 20px;

            span {
                font-size: 16px;
            }

            .pagination {
                padding: 0 20px;
            }
        }
    }


}
</style>