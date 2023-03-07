<template>
    <!-- 上边精品歌单 -->
    <div class="boutiqueSongList">
        <div class="img-div">
            <img :src="boutiqueSong.coverImgUrl" alt="" style="width: 100%;">
        </div>
        <div class="content">
            <span>精品歌单</span>
            <h2>{{ boutiqueSong.name }}</h2>
            <h5>{{ boutiqueSong.copywriter }}</h5>
        </div>
    </div>
    <!-- 中间tags -->
    <div class="tags">
        <!-- 左边按钮tag -->
        <div class="tag-button">
            <el-button @click="isShowList = !isShowList" id="button">
                {{ tagTitle }}
            </el-button>
            <div class="tag-list" id="taglist" v-show="isShowList">
                <nav>
                    <span @click="screeningList(quanbugedan)">{{ quanbugedan.name }}</span>
                </nav>
                <div v-for="(value, key) in categories" :key="key" class="tag-item">
                    <div class="tag-key">
                        <span>{{ value }}</span>
                    </div>
                    <div class="tag-value">
                        <span v-for="item in splitTags(key)" :key="item.id" @click="screeningList(item)">{{
                            item.name
                        }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 右边热门tag -->
        <div class="hot-tags">
            <span v-for="item in hotTags" :key="item.id" :class="{ active: item.name === tagTitle }"
                @click="screeningList(item)">{{
                    item.name
                }}</span>
        </div>
    </div>
    <!-- 下边歌单列表 -->
    <div class="tag-song-list" v-loading="loading">
        <div v-for="item in tagSonglist" :key="item.id" class="card">
            <songlistItem :item="item"></songlistItem>
        </div>
    </div>
    <!-- 分页 -->
    <div class="pagination-container middle">
        <span>共找到{{ tagSonglistCount }}张歌单</span>
        <div class="pagination">
            <el-pagination layout="prev, pager, next" :total="tagSonglistCount" :page-size="100"
                @current-change="getTagSonglist" />
        </div>
    </div>
</template>
<script  setup>
// 这个组件要做缓存
import songlistItem from '@/components/songlistItem.vue';
import {
    getTopHighqualityTag, getTopHighquality, getAllSonglistClassify,
    getHotSonglistClassify, getSonglistOneclassify
} from '@/api/index'
import { getRandom } from '@/methods/utils'
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const allTag = ref([]);  // 所有tag
const categories = ref({}); // tag种类
const boutiqueTags = ref([]); // 精品tag
const boutiqueSong = ref({}); // 顶部精品歌单
const hotTags = ref([]); // 热门tag
const tagSonglist = ref([]); // tag对应的歌单
const tagSonglistCount = ref(0); // tag对应歌单总数
const tagTitle = ref(route.query.tagname ?? '全部歌单');
const quanbugedan = ref({}) // 全部歌单tag
const isShowList = ref(false);
const loading = ref(false)

const backtop = inject('backtop')

// 随机获取一个精品歌单
const getHotTagsRandom = async () => {
    boutiqueTags.value = await getTopHighqualityTag();
    let random = getRandom(0, boutiqueTags.value.length);
    let res = await getTopHighquality((boutiqueTags.value)[random]?.name)
    boutiqueSong.value = res.playlists[0];
}
// tag分类
const splitTags = category => allTag.value.filter(i => category == i.category);

// 点击空白处关闭列表
const closeList = function (event) {
    var taglist = document.querySelector('#taglist');
    var button = document.querySelector('#button');
    if (taglist || button) {
        if (!taglist.contains(event.target) && !button.contains(event.target)) {
            isShowList.value = false;
        }
    }
};

// 点击tag切换歌单
const screeningList = (tag) => {
    tagTitle.value = tag.name;
    getTagSonglist();
    isShowList.value = false; // 选完一个tag就关闭列表
};


// 获取tag歌单
const getTagSonglist = async (page = 1) => {
    loading.value = true;
    let offset = (page - 1) * 100;
    let res = await getSonglistOneclassify(tagTitle.value, offset);
    tagSonglist.value = res.playlists;
    tagSonglistCount.value = res.total;
    backtop();
    loading.value = false;
}


const getTags = async () => {
    let res = await getAllSonglistClassify();
    allTag.value = res.sub;
    categories.value = res.categories;
    quanbugedan.value = res.all;
    hotTags.value = await getHotSonglistClassify();
};

getHotTagsRandom();
getTags();
getTagSonglist();


onMounted(() => {
    window.addEventListener('click', closeList)
})
onBeforeUnmount(() => {
    window.removeEventListener('click', closeList)
})
</script>
    
<style lang="less" scoped>
// 上边精品歌单
.boutiqueSongList {
    display: flex;
    height: 170px;
    width: 100%;
    border-radius: 10px;
    background-color: #999ba5;

    .img-div {
        width: 140px;
        height: 140px;
        border-radius: 10px;
        margin: auto 20px;
        overflow: hidden;
    }

    .content {
        margin-left: 5px;

        span {
            display: block;
            height: 30px;
            width: 100px;
            margin-top: 20px;
            line-height: 30px;
            text-align: center;
            color: #e7aa5a;
            border: 1px solid #e7aa5a;
            border-radius: 15px;
            cursor: default;

        }

        h2 {
            margin-top: 20px;
            color: #fff;
            padding-bottom: 5px;
            font-size: 16px;
        }

        h5 {
            color: #ccc;

        }
    }
}

// 中间tag
.tags {
    display: flex;
    justify-content: space-between;
    margin: 30px 0;

    .tag-button {
        position: relative;

        .tag-list {
            position: absolute;
            width: 800px;
            border-radius: 5px;
            box-shadow: -3px 3px 10px #ccc;
            background-color: #fff;
            z-index: 1;

            nav {
                display: flex;
                align-items: center;
                height: 50px;
                border-bottom: 1px solid #ccc;
                overflow: hidden;


                span {
                    display: block;
                    height: 40px;
                    line-height: 40px;
                    width: 110px;
                    text-align: center;
                    margin-left: 35px;
                    background-color: #fff6f6;
                    color: red;
                    border-radius: 15px;
                    cursor: pointer;
                }
            }

            .tag-item {
                display: flex;

                .tag-key {
                    width: 140px;
                    text-align: center;
                    cursor: default;

                    span {
                        display: block;
                        margin-top: 20px;
                        font-size: 16px;
                        color: #ccc;
                    }
                }

                .tag-value {

                    display: flex;
                    flex-wrap: wrap;
                    width: 660px;

                    span {
                        width: 110px;
                        padding: 20px 0;

                        &:hover {
                            color: #409eff;
                        }

                        cursor: pointer;
                    }
                }
            }
        }
    }

    // 右边热门tag

    .hot-tags {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 60%;
        height: 3rem;

        .active {
            color: #fe3730;
        }

        span {
            
            color: #666;
            margin-left: 10px;
            cursor: default;

            &:hover {
                color: #fe3730;
            }
        }
    }
}

// 下边歌单
.tag-song-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 10px;
}
</style>