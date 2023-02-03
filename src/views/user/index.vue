<template>
    <div class="userinfo">
        <div class="avatar">
            <img :src="userinfo.profile?.avatarUrl" alt="">
        </div>
        <div class="info">
            <div class="top">
                <h5>{{ userinfo.profile?.nickname }}</h5>
                <div class="operate-container">
                    <span>Lv{{ userinfo.level }}</span>
                    <div class="operate clearfix">
                        <el-button round>发私信</el-button>
                        <el-button round>关注</el-button>
                        <el-button round>...</el-button>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="floow">
                    <div class="box">
                        <div class="count">
                            {{ userinfo.profile?.eventCount }}
                        </div>
                        <div>动态</div>
                    </div>
                    <div class="box">
                        <div class="count">
                            {{ userinfo.profile?.follows }}
                        </div>
                        <div>关注</div>
                    </div>
                    <div class="box">
                        <div class="count">
                            {{ userinfo.profile?.followeds }}
                        </div>
                        <div>粉丝</div>
                    </div>
                </div>
                <h5>社交网络：未绑定</h5>
                <h5>个人介绍：{{ userinfo.profile?.signature || '暂无介绍' }}</h5>
            </div>
        </div>
    </div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="创建的歌单" name="first">
            <div class="playlists">
                <div class="playlist" v-for="(item, index) in creatPlaylist" :key="index">
                    <songlistItem :item="item"></songlistItem>
                </div>
            </div>
        </el-tab-pane>
        <el-tab-pane label="收藏的歌单" name="second">
            <div class="playlists">
                <div class="playlist" v-for="(item, index) in subcPlaylist" :key="index">
                    <songlistItem :item="item"></songlistItem>
                </div>
            </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script setup>
import songlistItem from '../../components/songlistItem.vue'
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getuserDetail, getuserSonglist } from '../../api/index';
const route = useRoute()
const activeName = ref('first')
const userId = route.params.userId;
const userinfo = ref({})
const userPlaylist = ref([])
const creatPlaylist = computed(() => userPlaylist.value.filter((item) => item.creator.nickname === userinfo.value.profile.nickname))
const subcPlaylist = computed(() => userPlaylist.value.filter((item) => item.creator.nickname !== userinfo.value.profile.nickname))


const getuserDetailF = async () => {
    userinfo.value = await getuserDetail(userId);
    let res = await getuserSonglist(userId);
    userPlaylist.value = res.playlist
}
getuserDetailF()


</script>
    
<style lang="less" scoped>
.userinfo {
    display: flex;
    margin-bottom: 10px;

    .avatar {
        flex-shrink: 0;

        img {
            width: 200px;
            height: 200px;
            border-radius: 50%;
        }
    }

    .info {
        margin-left: 20px;
        width: 100%;

        .top {
            padding-bottom: 10px;
            border-bottom: 1px solid #ccc;

            h5 {
                font-weight: bolder;
                font-size: 20px;
            }

            .operate-container {
                line-height: 32px;
                overflow: hidden;

                span {
                    padding: 5px;
                    border-radius: 40%;
                    font-size: 10px;
                    background-color: #f0f0f0;
                    color: #333;
                }

                .operate {
                    float: right;
                }
            }
        }

        .bottom {
            .floow {
                display: flex;
                margin: 10px 0;

                .box {
                    padding: 0 20px;
                    overflow: hidden;

                    &:nth-of-type(1) {
                        padding-left: 0;
                    }

                    &:nth-of-type(2) {
                        border: 1px soild #ccc;
                    }



                    .count {
                        text-align: center;
                        font-size: larger;
                    }
                }
            }

            h5 {
                margin: 10px 0;
                color: #676767;
            }
        }
    }
}

.playlists {
    display: flex;
    flex-wrap: wrap;

    .playlist {
        margin: 0 15px 10px 0;
    }

}
</style>