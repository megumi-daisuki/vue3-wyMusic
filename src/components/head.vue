<template>
    <div class="container">
        <el-col :span="4" class="logo">
            <img src="../assets/img/logo.png" alt="">
            网易云音乐
        </el-col>
        <el-col :span="3" class="arrow">
            <div @click="topre">
                <el-icon>
                    <ArrowLeftBold />
                </el-icon>
            </div>
            <div @click="tonext">
                <el-icon>
                    <ArrowRightBold />
                </el-icon>
            </div>
        </el-col>
        <el-col :span="4" class="search-container">
            <el-input id="input" type="search" ref="input" v-model="keywords" placeholder="请输入搜索内容" @focus="showHotSong"
                @keyup.enter.native="search">
            </el-input>
            <!-- 历史记录 -->
            <ul class="songList" id="songList" v-show="isShowHotSearchList">
                <div class="history" id="history" v-if="keywordsArr.length">
                    <div style="line-height:20px;height: 20px;padding: 10px 0;">
                        <span style="font-size: 15px;">历史记录</span>
                        <span class="deleteHistory" @click="deleteHistory">
                            <el-icon size="16px">
                                <Delete />
                            </el-icon>
                        </span>
                    </div>
                    <el-tag v-for="tag in keywordsArr" :key="tag" closable @close="deleteTag(tag)"
                        @click="searchHistory(tag)" style="cursor: pointer;margin: 0 5px 5px;">
                        {{ tag }}
                    </el-tag>
                </div>
                <h4>热门搜索</h4>
                <li class="middle" v-for="(item, index) in hotSongList" :key="index" @click="pushSearchRouter(item)">
                    <div class="index middle" :class="index < 3 || index === 0 ? 'hotindex' : ''">{{ index + 1 }}</div>
                    <div class="hotsongInfo">
                        <div>
                            <span :class="(index < 3 || index === 0 ? 'hotsearchword' : '')">{{
                                item.searchWord
                            }}</span>
                            <span style="color: #999;margin-left: 5px;font-size: 12px;">{{ item.score }}</span>

                        </div>
                        <h5 v-if="item.content">{{ item.content }}</h5>
                    </div>
                </li>
            </ul>
        </el-col>
        <el-col :span="12" class="login-container">
            <div class="login" @click="showLoginForm = true" v-if="!isLogin">
                <img src="../assets/img/logo.png" alt="">
                <span>未登录</span>
            </div>
            <el-dropdown trigger="click" v-else>
                <div class="user">
                    <img :src="loginStore.loginInfo.profile.avatarUrl" alt="">
                    <span>{{ loginStore.loginInfo.profile.nickname }}</span>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="loginoutF">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <loginpage :showLoginForm="showLoginForm" @closeForm="closeForm" v-if="showLoginForm"></loginpage>
        </el-col>
    </div>
</template>
    
<script setup>
import loginpage from './login.vue'
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { searchHot, loginout } from '../api/index'
import { useLoginStore } from '../stores';
import { storeToRefs } from 'pinia';

const router = useRouter()
const keywords = ref(''); // 搜索框关键字
const keywordsArr = localStorage.getItem('searchKeywords') ? ref(JSON.parse(localStorage.getItem('searchKeywords'))) : ref([]);// 历史记录
const isShowHotSearchList = ref(false);  // 显示搜索列表
const hotSongList = ref([]);

const input = ref();

const showLoginForm = ref(false)


const closeForm = () => {
    showLoginForm.value = false
}
// 获取登录状态
const loginStore = useLoginStore()
const { isLogin } = storeToRefs(loginStore)
loginStore.getLoginStatus()

// 监听搜索关键字
watch(keywords, () => {
    if (keywords.value) {
        // console.log('监听到了');
        isShowHotSearchList.value = false;
    }
});

// 前后页面路由跳转
const topre = () => {
    router.go(-1);
}
const tonext = () => {
    router.go(1);
}

// 退出登录
const loginoutF = async () => {
    localStorage.removeItem('vdCookie');
    await loginout();
    // 获取登录状态
    loginStore.getLoginStatus();
}


const showHotSong = async () => {
    // 显示热搜
    if (!keywords.value) {
        isShowHotSearchList.value = true;
    }
};

// 点击空白处关闭热搜列表
const closeSearchList = function (event) {
    var text = document.querySelector('#songList');
    var input = document.querySelector('#input');
    if (text || input) {
        if (!text.contains(event.target) && !input.contains(event.target)) {
            isShowHotSearchList.value = false;
        }
    }
};


// 热搜搜索
const pushSearchRouter = (item) => {
    keywords.value = item.searchWord;
    isShowHotSearchList.value = false;
    search();
}

// 关键词搜索
const search = () => {
    // 清除搜索页面的tab缓存
    sessionStorage.removeItem('searchTab')
    router.push({
        name: 'searchdetail',
        params: {
            keywords: keywords.value
        }
    })
    if (!keywordsArr.value.includes(keywords.value)) {
        keywordsArr.value.push(keywords.value);
    }
    localStorage.setItem('searchKeywords', JSON.stringify(keywordsArr.value));
}

// 删除所有历史记录
const deleteHistory = () => {
    localStorage.clear();
    keywordsArr.value = [];
}

// 删除单个历史记录
const deleteTag = (tag) => {
    let index = keywordsArr.value.findIndex(i => i === tag);
    keywordsArr.value.splice(index, 1);
    localStorage.setItem('searchKeywords', keywordsArr.value)
}

// 搜索历史记录
const searchHistory = (tag) => {
    keywords.value = tag;
    search();
}

const getHotsong = async () => {
    let res = await searchHot();
    hotSongList.value = res.slice(0, 10);
}
getHotsong()

onMounted(() => {
    window.addEventListener('click', closeSearchList)
})

</script>
    
<style lang="less" scoped>
.container {
    display: flex;
    width: 100%;
    height: 100%;


    .el-col {
        display: flex;
        align-items: center;
    }


    .logo {

        height: 100%;
        text-indent: 5px;
        font-size: 18px;
        color: #ccc;

        img {

            width: 40px;
            height: 40px;
            border-radius: 15px;
        }
    }

    .arrow {
        font-size: 20px;

        div {
            margin: auto 20px;
            cursor: pointer;

            &:hover {
                color: #fff;
            }
        }
    }

    .search-container {
        position: relative;

        .songList {
            position: absolute;
            width: 100%;
            top: 48px;
            left: 0;
            border: 1px solid #ccc;
            background-color: #fff;
            z-index: 10;


            .history {
                span {
                    padding: 0 10px;
                }

                .deleteHistory {
                    padding: 0;
                    cursor: pointer;

                    &:hover {
                        color: #409eff;
                    }
                }
            }

            h4 {
                font-size: 18px;
                color: black;
                text-indent: 20px;
                margin: 5px 0;
            }

            li {
                display: flex;
                height: 45px;
                padding: 5px 0;

                font-size: 16px;
                text-indent: 6px;
                margin-top: 10px;
                cursor: pointer;

                .index {
                    width: 20%;
                    font-size: 20px;

                }

                .hotindex {
                    color: #ff3a3a;
                }

                .hotsongInfo {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    height: 100%;
                    width: 100%;
                    font-size: 13px;

                    .hotsearchword {
                        font-weight: bold;
                    }

                    h5 {
                        font-size: 12px;
                        color: #999;
                    }
                }


                &:hover {
                    background-color: #ccc;
                }
            }
        }
    }

    .login-container {
        display: flex;
        flex-direction: row-reverse;
        position: relative;

        .login,
        .user {
            display: flex;
            height: 100%;
            align-items: center;
            color: #ccc;
            cursor: pointer;

            &:hover {
                color: #fff;
            }

            .userImg {
                display: inline-block;
            }

            img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }

            span {
                margin-left: 20px;


            }




        }
    }



}
</style>