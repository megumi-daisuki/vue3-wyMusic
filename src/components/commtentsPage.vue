<template>
    <div class="contents">
        <div class="textinput">
            <el-input v-model="textarea" :rows="2" :maxlength="140" show-word-limit type="textarea"
                placeholder="输入你的评论" />
            <div class="button-container">
                <el-button round>
                    评论
                </el-button>
            </div>
        </div>
        <div class="allcontents" v-loading="loading">
            <div class="hotcomment" v-if="hotComments.length">
                <h2>精彩评论</h2>
                <commtentsPageItem :comments="hotComments"></commtentsPageItem>
            </div>
            <div class="newcomment">
                <h2>最新评论({{ totalComments }})</h2>
                <commtentsPageItem :comments="comments"></commtentsPageItem>
            </div>
        </div>
        <div class="pagination middle">
            <el-pagination layout="prev, pager, next" :page-size="20" :total="totalComments"
                @current-change="getSonglistCommentsF" />
        </div>
    </div>
</template>

<script setup>
import commtentsPageItem from './commtentsPageItem.vue';
import { inject, ref } from 'vue';
import { getSonglistComments, getAlbumContents, getMVcommtents, getVideoComments, getSongComments } from '../api/index'

const props = defineProps(['fatherComponet', 'mainId']);
const textarea = ref('');
const hotComments = ref([]); // 热门评论
const comments = ref([]); // 所有评论
const totalComments = ref(0)
const loading = ref(false)
const backtop = inject('backtop')

const getSonglistCommentsF = async (page = 1) => {
    loading.value = true
    let offset = (page - 1) * 20;

    switch (props.fatherComponet) {
        case 'personalFM':
            var res = await getSongComments(props.mainId, offset);
            break;
        case 'songlistdetail':
            var res = await getSonglistComments(props.mainId, offset);
            break;
        case 'albumdetail':
            var res = await getAlbumContents(props.mainId, offset);
            break;
        case 'MVdetail':
            var res = await getMVcommtents(props.mainId, offset);
            break;
        case 'videodetail':
            var res = await getVideoComments(props.mainId, offset);
            break;
        default:
            return;
    }

    hotComments.value = res.hotComments ?? [];
    comments.value = res.comments.sort((a, b) => b.time - a.time); // 最新时间排序
    totalComments.value = res.total;
    loading.value = false;
    backtop()
}
getSonglistCommentsF()



</script>
    
<style lang="less" scoped>
.textinput {
    .button-container {
        display: flex;
        flex-direction: row-reverse;
        margin-top: 5px;
    }
}

.allcontents {
    width: 100%;

    h2 {
        font-size: 20px;
        font-weight: bold;
        padding: 10px 0;
    }
}
</style>