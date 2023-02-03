<template>
    <div class="official">
        <h2>
            官方榜
        </h2>
        <div class="official_list" v-for="item  in officialList" :key="item.id">
            <rankListVue :item="item"></rankListVue>
        </div>
    </div>
    <div class="global">
        <h2>全球榜</h2>
        <div class="card-container">
            <div v-for="(item, index) in globalList" :key="index" class="card" @click="tosonglistdetail(item)">
                <div class="img-div" @mouseover="changeMaskclass">
                    <el-image :src="item.coverImgUrl" alt="" lazy />
                    <div class="playcount">
                        <span>
                            <el-icon color="#fff">
                                <Headset />
                            </el-icon>
                            {{ numberFormat(item.playCount) }}
                        </span>
                    </div>
                </div>
                <h4>{{ item.name }}</h4>
            </div>
        </div>
    </div>
</template>
    
<script setup>
import rankListVue from '../../../components/rankList.vue';
import { getAllRank, getAllRankDetail } from '../../../api/index'
import { onMounted, reactive, ref } from 'vue';
import { numberFormat } from '../../../methods/utils'
import { useRouter } from 'vue-router';
const router = useRouter()
const officialList = ref([]); // 官方榜
const globalList = ref([]); // 全球榜

const maskClass = reactive({
    hidden: true
})

const tosonglistdetail = (item) => {
    router.push({
        name: 'songlistdetail',
        params: {
            songlistId: item.id
        }
    })
}

const getAllList = async () => {
    let res = await getAllRank()
    officialList.value = res.list.slice(0, 4);
    globalList.value = res.list.slice(4, res.list.length);
    // console.log(globalList.value.length);
}

const changeMaskclass = () => {
    maskClass.hidden = !maskClass.hidden
}


onMounted(() => {
    getAllList();
})

</script>
    
<style lang="less" scoped>
h2 {
    color: #333;
    font-size: 20px;
    font-weight: bold;
}

.official {
    .official_list {
        display: flex;
        margin-bottom: 30px;
    }
}

.card-container {
    display: flex;
    flex-wrap: wrap;

    margin-top: 20px;

    .card {
        width: 220px;
        margin: 0 12.5px 20px;
        cursor: pointer;

        &:nth-of-type(5n) {
            margin-right: 0;
        }

        &:nth-of-type(5n+1) {
            margin-left: 0;
        }

        .img-div {
            position: relative;

            img {
                width: 100%;
            }

            .playcount {
                position: absolute;
                right: 5px;
                top: 5px;

                span {
                    color: #fff;
                }
            }
        }
    }

}
</style>