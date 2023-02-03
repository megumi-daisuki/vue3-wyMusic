<template>
    <div class="subcribers" v-loading="loading">
        <div class="subscriber" v-for="(item, index) in subscribers" :key="index">
            <el-avatar :src="item.avatarUrl" :size="80" @click="toUser(item.userId)" />
            <div class="username">
                <h5 @click="toUser(item.userId)">{{ item.nickname }}</h5>
                <p style="font-size: 12px;">{{ item.signature }}</p>
            </div>
        </div>
    </div>
    <div class="pagination middle">
        <el-pagination layout="prev, pager, next" :page-size="60" :total="totalSubscribers"
            @current-change="getSonglistSubscribersF" />
    </div>
</template>
    
<script setup>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getSonglistSubscribers } from '../api/index'
const props = defineProps(['songlistId'])
const subscribers = ref([])
const totalSubscribers = ref(0)
const loading = ref(false)
const backtop = inject('backtop')
const router = useRouter()
const getSonglistSubscribersF = async (page = 1) => {
    loading.value = true;
    let offset = (page - 1) * 60;
    let res = await getSonglistSubscribers(props.songlistId, offset);
    subscribers.value = res.subscribers;
    totalSubscribers.value = res.total;
    loading.value = false;
    backtop()

}
getSonglistSubscribersF()

const toUser = (userId) => {
    router.push({
        name: 'user',
        params: {
            userId
        }
    })
}
</script>
    
<style lang="less" scoped>
.subcribers {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;


    .subscriber {
        display: flex;
        margin: 15px 0;
        width: 30%;
        cursor: pointer;
        overflow: hidden;

        .el-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .username {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            margin-left: 10px;
            width: calc(100% - 90px);

            h5 {
                cursor: pointer;

                &:hover {
                    color: rgb(45, 45, 45);
                }
            }

            p {

                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }


    }
}

.pagination {
    margin-top: 20px;
}
</style>