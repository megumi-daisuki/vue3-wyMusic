<template>
    <div class="main-view">
        <!-- 轮播图 -->
        <el-carousel :interval="4000" type="card" height="200px">
            <el-carousel-item v-for="item in banner" :key="item" @click="clickBanner(item)">
                <div class="banneritem">
                    <el-image :src="item.imageUrl" alt="" />
                    <span>{{ item.typeTitle }}</span>
                </div>
            </el-carousel-item>
        </el-carousel>

        <h1>推荐歌单</h1>
        <songlistTable :songlist="songlist" width="250px"></songlistTable>

        <h1>独家放送</h1>
        <div class="personal-content">
            <el-card :body-style="{ padding: '0px' }" v-for="item in personalizedlist" :key="item.id"
                @click="tomvdetail(item.id)">
                <div class="img-container">
                    <el-image :src="item.sPicUrl" alt="" />
                </div>
                <h4 style="text-align: center;">{{ item.name }}</h4>
            </el-card>
        </div>

        <h1>最新歌曲</h1>
        <div class="newsong">
            <ul class="newsongs-container">
                <li class="item" v-for="item in newsongList" :key="item.id">
                    <div class="item-img" @click="playThis(item)">
                        <el-image :src="item.picUrl" alt="" />
                        <div class="icon-container">
                            <el-icon size="40px" color="#fff">
                                <VideoPlay />
                            </el-icon>
                        </div>
                    </div>
                    <div class="item-text">
                        <p style="color: #000;">{{ item.name }}</p>
                        <p style="color: #c0c0c0;">{{ item.song.artists[0].name }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
    
<script setup>
import songlistTable from '../../../components/songlistTable.vue'
import { getBanner, getPersonalized, getPrivatecontent, getNewSong, getPersonalizedDay } from '@/api/index.js';
import { ref, onMounted } from 'vue';
import { usePlayerStore } from '@/stores/index.js';
import { useRouter } from 'vue-router';
import { useLoginStore } from '../../../stores';
import { storeToRefs } from 'pinia';



let banner = ref([]);      // 轮播图
let songlist = ref([]);    // 推荐歌单
let personalizedlist = ref([]);   // 独家放送
let newsongList = ref([])   // 最新歌曲
// const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore();


// 将pinia的islogin解构出来,不然会出现初始化的时候获取不到最新值的问题
const loginStore = useLoginStore();
const { isLogin } = storeToRefs(loginStore)



// 点击轮播图
const clickBanner = async (item) => {
    switch (item.targetType) {
        case 1:
            // 单曲
            await playerStore.saveSongUrl(item.targetId);
            await playerStore.saveNowSong(item.targetId);
            await playerStore.addPlayingList(item.targetId);
            playerStore.isPlay = true;
            break;
        case 10:
            // 专辑
            router.push({
                name: 'albumdetail',
                params: {
                    albumId: item.targetId
                }
            })
            break;
        case 1000:
            // 歌单
            router.push({
                name: 'songlistdetail',
                params: {
                    songlistId: item.targetId
                }
            })
            break;
    }
}

// 获取轮播图
const getBanners = async () => {
    let res = await getBanner();
    banner.value = res.banners.slice(0, 7);
}

// 获取推荐歌单
const getPersonSong = async () => {

    if (isLogin.value) {

        let res = await getPersonalizedDay();

        songlist.value = res.recommend.slice(0, 4)

    } else {
        let res = await getPersonalized();
        songlist.value = res.result;

    }

}

// 获取独家放送
const getPrivatecontents = async () => {
    let res = await getPrivatecontent();
    personalizedlist.value = res.result;

}

// 获取最新歌曲
const getNewSongs = async () => {
    let res = await getNewSong();
    newsongList.value = res.result

}

// 获取歌曲url
const playThis = async (item) => {
    // 歌曲详情和链接  保存给pinia

    await playerStore.saveNowSong(item.id);
    await playerStore.saveSongUrl(item.id);
    await playerStore.addPlayingList(item.id);
    playerStore.isPlay = true;  //播放
}


// 跳转到mvdetail
const tomvdetail = (MVId) => {
    router.push({
        name: 'MVdetail',
        params: { MVId }
    })
}

// 初始化函数

getBanners();
getPersonSong();
getPrivatecontents();
getNewSongs()

</script>
    
<style lang="less" scoped>
.main-view {
    h1 {
        padding: 5px 0;
        font-size: 20px;
        font-weight: bold;
        color: #000;
    }

    .banneritem {
        position: relative;

        .el-carousel {

            img {
                width: 100%;
                height: 100%;
                margin: 0;
            }
        }

        span {
            position: absolute;
            right: 0;
            bottom: 11%;
            padding: 3px 5px;
            color: #fff;
            background-color: #666;
        }
    }


    .personal-content {
        display: flex;
        justify-content: space-between;
        padding-bottom: 15px;

        .el-card {
            width: 380px;
            cursor: pointer;

            .img-container {
                width: 100%;
                height: 80%;

                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }

    .newsong {
        .newsongs-container {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            height: 100%;

            .item {
                display: flex;
                align-items: center;
                width: 50%;
                margin-bottom: 15px;

                .item-img {
                    position: relative;
                    flex: 1;
                    cursor: pointer;

                    &:hover .el-icon {
                        color: red;
                    }

                    img {
                        width: 100%;

                    }

                    .icon-container {
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        translate: -50% -50%;


                    }
                }

                .item-text {
                    flex: 4;

                    p {
                        margin: 5px 0;
                        text-indent: 15px;
                    }
                }


            }
        }
    }
}
</style>