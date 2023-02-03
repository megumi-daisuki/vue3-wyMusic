<template>
    <div class="video" v-infinite-scroll="loadscoll" infinite-scroll-immediate="false" infinite-scroll-delay="500"
        v-if="loginStore.isLogin">
        <div class="tag-button">
            <div>
                <el-button @click="isShowList = !isShowList" id="button">
                    {{ tagname }}
                </el-button>
                <div class="tag-list" id="taglist" v-show="isShowList">
                    <div class="allvideos" @click="clickAllVideos">
                        <span>全部视频</span>
                    </div>
                    <div class="tag-item">
                        <span v-for="item in grouplist" :key="item.name" :class="item.name === tagname ? 'active' : ''"
                            @click="tagclick(item)">{{ item.name }}</span>
                    </div>
                </div>
            </div>
            <div class="hot-tags">
                <span v-for="item in hotGrouplist" :key="item.id" :class="{ active: tagname === item.name }"
                    @click="tagclick(item)">{{
                        item.name
                    }}</span>
            </div>
        </div>
        <div class="video-table" v-loading="loading">
            <videotable :videoList="videoGroup"></videotable>
        </div>
    </div>
    <div v-else>
        <el-empty description="登录后才能查看" :image-size="200"></el-empty>
    </div>
</template>
    
<script setup>
import videotable from '@/components/videoTable.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getVideoGrouplist, getVideoGroup, getAllVideo, gethotVGlist } from '@/api/index'
import tagbar from '@/components/tagbar.vue'
import { useLoginStore } from '../../../stores';
const loginStore = useLoginStore()
const grouplist = ref([]);
const hotGrouplist = ref([])
const videoGroup = ref([])
const tagname = ref('全部视频')
const isShowList = ref(false)
let offset = 0;
const tagid = ref(0)

const loading = ref(false)

// 点击tag
const tagclick = (item) => {
    tagid.value = item.id
    offset = 0;
    tagname.value = item.name;
    videoGroup.value = [];
    getVideoGroupF();
    isShowList.value = false;
}

// 点击全部视频
const clickAllVideos = () => {
    tagname.value = '全部视频';
    offset = 0;
    tagid.value = 0;
    getAllVideoF()
}



// 某标签的全部视频
const getVideoGroupF = async () => {
    if (offset === 0) loading.value = true;
    let res = await getVideoGroup(tagid.value, offset);
    // console.log('type', res, offset);
    if (res.hasmore) {
        offset++;
        videoGroup.value.push(...res.datas)
        if (offset < 4) {
            getVideoGroupF()
        }
    }
    loading.value = false;
}

// 获取全部视频
const getAllVideoF = async () => {
    if (offset === 0) loading.value = true;
    let allvideos = await getAllVideo(offset)
    // console.log('all', allvideos, offset);
    if (allvideos.hasmore) {
        offset++;
        let filter = allvideos.datas.filter((i) => i.type === 1)
        // console.log(allvideos, filter);
        videoGroup.value.push(...filter)
        if (offset < 4) {
            getAllVideoF()
        }
    }
    loading.value = false;
}

// 滚动加载
const loadscoll = () => {
    if (tagname.value === '全部视频') {
        console.log('滚1');
        getAllVideoF()
    } else {
        console.log("滚2");
        getVideoGroupF(tagid.value)
    }
}

// 初始化
const initialization = async () => {
    let res = await getVideoGrouplist();
    grouplist.value = res.data;
    let result = await gethotVGlist();
    hotGrouplist.value = result.data;
    // console.log(result);
    getAllVideoF()
}
initialization()

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

onMounted(() => {
    window.addEventListener('click', closeList)
})
onBeforeUnmount(() => {
    window.removeEventListener('click', closeList)
})
</script>
    
<style lang="less" scoped>
.video {
    .tag-button {
        position: relative;
        padding: 20px 35px 20px 30px;
        display: flex;
        justify-content: space-between;

        .tag-list {
            position: absolute;
            width: 800px;
            border-radius: 5px;
            box-shadow: -1px 3px 5px #ccc;
            background-color: #fff;
            z-index: 1;

            .allvideos {
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
                flex-wrap: wrap;
                width: 604px;
                height: 500px;
                padding: 0 100px;
                overflow-y: scroll;
                overflow-x: hidden;

                // 滚动条样式
                &::-webkit-scrollbar {
                    width: 4px;
                    /*height: 4px;*/
                }

                &::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
                    background: #ccc;
                }

                &::-webkit-scrollbar-track {
                    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
                    border-radius: 0;
                    background: rgba(0, 0, 0, 0.1);

                }

                span {
                    display: block;
                    box-sizing: border-box;
                    width: 100px;
                    margin: 20px 0;
                    text-align: center;
                    font-size: 13px;
                    cursor: pointer;

                    &:hover {
                        color: #409eff;
                    }
                }

                .active {
                    color: red;
                }
            }
        }

        .hot-tags {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 40%;
            height: 30px;

            .active {
                color: #fe3730;
            }

            span {
                color: #666;
                padding: 0 4px;
                cursor: default;

                &:hover {
                    color: #fe3730;
                }
            }
        }
    }

    // 右边热门tag



}
</style>