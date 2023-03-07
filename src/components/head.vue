<template>
    <div class="container">
        <el-col :span="4" class="logo">
            <img src="../assets/img/logo.png" alt="">
            <span>音乐logo</span>
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
                    <div style="line-height:1rem;height: 1rem;padding: 0.5rem 0;">
                        <span style="font-size: 15px;">历史记录</span>
                        <span class="deleteHistory" @click="deleteHistory">
                            <el-icon size="16px">
                                <Delete />
                            </el-icon>
                        </span>
                    </div>
                    <el-tag v-for="tag in keywordsArr" :key="tag" closable @close="deleteTag(tag)"
                        @click="searchHistory(tag)" style="cursor: pointer;margin: 0 0.5rem 0.5rem;">
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

                        </div>
                        <h5 v-if="item.content">{{ item.content }}</h5>
                    </div>
                </li>
            </ul>
        </el-col>
        <el-col :span="11" class="login-container">
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
        text-indent: 0.5rem;
        color: #ccc;

        img {
            height: 40px;
            width: 40px;
            border-radius: 50%;
        }

        span {
            font-size: 0.8rem;
        }
    }

    .arrow {
        margin: 0 2rem;
        font-size: 1rem;

        div {
            margin: auto 1.2rem;
            cursor: pointer;

            &:hover {
                color: #fff;
            }
        }
    }

    .search-container {
        position: relative;

        .el-input {
            font-size: 0.8rem;
        }

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
                    padding: 0 1rem;
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
                font-size: 1rem;
                color: black;
                text-indent: 20px;
                margin: 0.5rem 0;
            }

            li {
                display: flex;
                height: 2.5rem;
                padding: 0.5rem 0;

                font-size: 0.5rem;
                text-indent: 6px;

                cursor: pointer;

                .index {
                    width: 20%;
                    font-size: 0.5rem;

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


                    .hotsearchword {
                        font-weight: bold;
                        font-size: 0.2rem;
                    }

                    h5 {
                        font-size: 0.1rem;
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
                margin-left: 2rem;


            }




        }
    }



}
</style>