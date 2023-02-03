<template>
    <div class="al-container">
        <div v-loading="loading">
            <albumTable :album-list="albumList"></albumTable>
        </div>
        <div class="pagination-container middle" style="margin-top:20px;">
            <span>共找到 {{ albumCount }} 首专辑</span>
            <div class="pagination">
                <el-pagination layout="prev, pager, next" :total="albumCount" :page-size="30"
                    @current-change="getAlbum" />
            </div>
        </div>
    </div>
</template>

<script setup >
import albumTable from '../../../components/albumTable.vue';
import { ref, inject } from 'vue';
import { useRoute } from 'vue-router';
import { getSearchAlbum } from '../../../api/index'
const route = useRoute();
const albumList = ref([]);
const albumCount = ref(0);
const keywords = ref(route.params.keywords)

const loading = ref(false);

const backtop = inject('backtop')

const getAlbum = async (page = 1) => {
    loading.value = true;
    let offset = (page - 1) * 30;
    let res = await getSearchAlbum(keywords.value, offset);
    albumList.value = res.albums;
    albumCount.value = res.albumCount;
    loading.value = false;
    backtop()
}
getAlbum();



</script>
    
<style lang="less" scoped>

</style>