<template>
    <div class="songlist-container" v-loading="loading">
        <el-table :data="musiclist" style="width: 100%" @row-click="toSonglistDetail">
            <el-table-column prop="id" width="60">
                <template v-slot="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="coverImgUrl" width="100">
                <template v-slot="scope">
                    <el-image :src="scope.row.coverImgUrl" alt="" style="width: 60px;height: 60px;" lazy />
                </template>
            </el-table-column>
            <el-table-column prop="name" width="750">
                <template v-slot="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="trackCount" width="120">
                <template v-slot="scope">
                    <span>{{ scope.row.trackCount }}首</span>
                </template>
            </el-table-column>
            <el-table-column prop="creator">
                <template v-slot="scope">
                    <span style="color: #ccc;padding-right: 5px;font-size: 10px;">by</span>
                    <span>{{ scope.row.creator.nickname }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="playCount">
                <template v-slot="scope">
                    <span>
                        {{ numberFormat(scope.row.playCount) }} 播放
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="pagination-container middle">
        <span>共找到{{ musiclistCount }}张歌单</span>
        <div class="pagination">
            <el-pagination layout="prev, pager, next" :total="musiclistCount" :page-size="30"
                @current-change="getMusicList" />
        </div>
    </div>
</template>
    
<script setup>
import { inject, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { numberFormat } from '../../../methods/utils'
import { getSearchSongList } from '../../../api/index'
const route = useRoute();
const router = useRouter()
const musiclist = ref([]);
const musiclistCount = ref(0);

const backtop = inject('backtop')

const loading = ref(false)

const getMusicList = async (page = 1) => {
    loading.value = true;
    let offset = (page - 1) * 30
    let res = await getSearchSongList(route.params.keywords, offset);
    musiclist.value = res.playlists;
    musiclistCount.value = res.playlistCount;
    loading.value = false;
    backtop()

};

const toSonglistDetail = (row) => {
    router.push({
        name: 'songlistdetail',
        params: {
            songlistId: row.id
        }
    })
}

onMounted(() => {
    getMusicList();
})
</script>
    
<style lang="less" scoped>
.el-table {
    :deep(.el-table__row) {
        &:nth-child(even) {
            background-color: #fafafa;
        }

        &:hover {
            cursor: pointer;
        }
    }
}
</style>