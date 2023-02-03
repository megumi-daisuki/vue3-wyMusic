<template>
    <div class="singer-container">
        <el-table :data="singerList" style="width: 100%" @row-click="tosingerdetail">
            <el-table-column prop="img1v1Url" width="80">
                <template v-slot="scope">
                    <el-image :src="scope.row.img1v1Url" alt="" style="width: 60px;height: 60px;" lazy />
                </template>
            </el-table-column>
            <el-table-column prop="name" width="1350">
                <template v-slot="scope">
                    <span style="padding-right:10px;">
                        {{ scope.row.name }}
                    </span>
                    <span style="color: #ccc;">
                        {{ scope.row.alias[0] ? `(${scope.row.alias[0]})` : '' }}
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <div class="pagination-container middle" style="margin-top:20px;">
        <span>共找到 {{ singerCount }} 位歌手</span>
        <div class="pagination">
            <el-pagination layout="prev, pager, next" :total="singerCount" :page-size="30" />
        </div>
    </div>
</template>
    
<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getSearchSinger } from '../../../api/index'

const route = useRoute();
const router = useRouter()
const singerList = ref([]);
const singerCount = ref(0);

const getSingerList = async () => {
    let res = await getSearchSinger(route.params.keywords);
    singerList.value = res.artists;
    singerCount.value = res.artistCount;
}
getSingerList();
// 
const tosingerdetail = (row) => {
    router.push({
        name: 'singerdetail',
        params: {
            singerId: row.id
        }
    })
}




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