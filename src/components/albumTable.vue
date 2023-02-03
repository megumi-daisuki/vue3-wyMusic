<template>
    <el-table :data="albumList" style="width: 100%" @row-click="toAlbumdetail">
        <el-table-column prop="id" width="60">
            <template v-slot="scope">
                {{ scope.$index + 1 }}
            </template>
        </el-table-column>
        <el-table-column prop="blurPicUrl" label="专辑封面" width="150">
            <template v-slot="scope">
                <el-image :src="scope.row.blurPicUrl" alt="" style="width: 60px;height: 60px;" lazy />
            </template>
        </el-table-column>
        <el-table-column prop="name" label="专辑名" width="500">
            <template v-slot="scope">
                <span style="padding-right: 5px;">{{ scope.row.name }}</span>
                <span style="color: #ccc;">
                    {{ scope.row.alias[0] ? `(${scope.row.alias[0]})` : '' }}
                </span>
            </template>
        </el-table-column>
        <el-table-column prop="size" label="专辑内容数">
            <template v-slot="scope">
                <span>{{ scope.row.size }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="publishTime" label="发布日期">
            <template v-slot="scope">
                <span>{{ timestampToTime(scope.row.publishTime) }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="artist" label="发布者">
            <template v-slot="scope">
                <span>{{ scope.row.artist.name }}</span>
                <span style="color: #ccc;">{{ scope.row.artist.alias[0] ? `(${scope.row.artist.alias[0]})` : ''
                }}</span>
            </template>
        </el-table-column>
    </el-table>
</template>
    
<script setup>
import { timestampToTime } from '@/methods/utils'
import { useRouter } from 'vue-router';

const props = defineProps({
    albumList: Array
})
const router = useRouter()


const toAlbumdetail = (row) => {
    router.push({
        name: 'albumdetail',
        params: {
            albumId: row.id
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