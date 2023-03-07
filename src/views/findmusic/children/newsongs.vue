<template>
    <div v-infinite-scroll="scollNewAlbums" infinite-scroll-delay="500" infinite-scroll-immediate="false"
        :infinite-scroll-disabled="noMore">
        <nav class="middle">
            <div class="navlist middle">
                <div class="navitem" v-for="(item, index) in navlist" :key="index" :class="{ active1: index == currentNav }"
                    @click="changeNavItem(item)">
                    {{ item.name }}</div>
            </div>
        </nav>
        <div class="tagline">
            <div v-if="isAlive">
                <tagbar :tagItems="taglist" @handleTagItem="changetag"></tagbar>
            </div>
            <div class="play-container" v-if="currentNav == 0">
                <div class="collplay middle" style="background-color: #fd544e;color: #fff;border: none;"
                    @click="playAllsongs">
                    <el-icon>
                        <VideoPlay />
                    </el-icon>
                    <span>播放全部</span>
                </div>
                <div class="collplay middle">
                    <el-icon>
                        <Star />
                    </el-icon>
                    <p>收藏全部</p>
                </div>
            </div>
        </div>
        <!-- 新歌速递 -->
        <div v-if="currentNav === 0" v-loading="loading">
            <topsong :songlist="songlist"></topsong>
        </div>
        <!-- 新碟上架 -->
        <div class="container" v-else>
            <div>
                <div class="sticky">本周新碟</div>
            </div>
            <div class="newdisks" v-loading="loading">
                <topalbumList :albumlist="albumlist"></topalbumList>
                <p v-if="noMore" style="font-size: 30px;text-align: center;">没有数据了</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import tagbar from '@/components/tagbar.vue';
import topsong from '@/components/topsong.vue'
import topalbumList from '../../../components/topalbumList.vue';
import { ref, watch, nextTick, computed } from 'vue';
import { getNewSongs, getNewAlbums, getAllSongdetail } from '../../../api/index'
import { usePlayerStore } from '../../../stores/index'

const tagType = ref(0);   // 对应的tag
const tagAear = ref('All');
const currentNav = ref(0) // 控制导航样式
const songlist = ref([]); // 新歌速递
const songs = ref([]) // 新歌速递所有歌的详情
const albumlist = ref([]); // 新碟上架
const isAlive = ref(true); // 刷新左侧tagbar
const currentPage = ref(1);
const offset = computed(() => (currentPage.value - 1) * 50) // 分页用
const noMore = computed(() => offset.value >= 500)
const playerStore = usePlayerStore()
const loading = ref(false)

// 导航列表
const navlist = [
    {
        type: 0,
        name: '新歌速递'
    },
    {
        type: 1,
        name: '新碟上架'
    }
];
// tag列表
const taglist = [
    {
        type: 0,
        area: 'ALL',
        name: '全部'
    },
    {
        type: 7,
        area: 'ZH',
        name: '华语'
    },
    {
        type: 96,
        area: 'EA',
        name: '欧美'
    },
    {
        type: 16,
        area: 'KR',
        name: '韩国'
    },
    {
        type: 8,
        area: 'JP',
        name: '日本'
    }
];
// 新碟相关
const xindieTag = [
    {
        type: 'hot',
        name: '推荐'
    },
    {
        type: 'new',
        name: '全部'
    }
]

// 播放全部
const playAllsongs = () => {
    playerStore.playingList.push(...songs.value);
    playerStore.saveNowSong(playerStore.playingList[0].id);
    playerStore.saveSongUrl(playerStore.playingList[0].id);
    playerStore.isPlay = true;
}

const changeNavItem = (navitem) => {
    currentNav.value = navitem.type
};

const changetag = (item) => {
    if (currentNav.value === 0) {
        tagType.value = item.type;
        getsonglist()
    } else {
        tagAear.value = item.area;
        GetNewAlbums()
    }
};



// 滚动获取数据
const scollNewAlbums = async () => {
    if (offset.value < 500) {
        currentPage.value++;
        let res = await getNewAlbums(tagAear.value, offset.value)
        res.forEach((i) => {
            albumlist.value.push(i)
        })
    }
}
// 初始化
const GetNewAlbums = async () => {
    loading.value = true;
    currentPage.value = 1;
    albumlist.value = await getNewAlbums(tagAear.value, offset.value);
    loading.value = false;
}
GetNewAlbums();

// 初始化
const getsonglist = async () => {
    loading.value = true;
    let songids = '';
    songlist.value = await getNewSongs(tagType.value)
    songlist.value.forEach(item => {
        songids += item.id + ',';
    })
    let queryids = songids.slice(0, songids.length - 1)
    songs.value = await getAllSongdetail(queryids);
    loading.value = false;
}
getsonglist();


watch(currentNav, () => {
    isAlive.value = false;
    nextTick(() => {
        isAlive.value = true;
    })
})

</script>
    
<style lang="less" scoped>
.navlist {
    border: 1.5px solid #ccc;
    border-radius: 25px;

    .navitem {
        width: 100px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        border-radius: 25px;
        cursor: default;

        &:hover {
            background-color: #f3f3f3;
        }
    }
}

.tagline {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .play-container {
        display: flex;


        .collplay {
            height: 20px;
            width: 80px;
            margin: 0 5px;
            border: 0.1px solid #ccc;
            border-radius: 20px;
            box-shadow: inset 0 0 red;
            cursor: pointer;

            &:hover {
                background-color: #f3f3f3;
            }
        }
    }
}

.container {

    display: flex;
    margin-top: 10px;

    .sticky {
        position: sticky;
        top: 0;
        font-size: 20px;
        width: 40px;
        padding: 0 10px;
        border: 1px soild #fd0808;
    }


}

.active1 {
    color: #fff;
    background-color: #bbb !important;
}
</style>