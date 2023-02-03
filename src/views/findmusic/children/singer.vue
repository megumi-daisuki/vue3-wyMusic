<template >
    <div v-infinite-scroll="scollSingerList" infinite-scroll-delay="500" infinite-scroll-immediate="false">
        <div class="tags">
            <div class="tag-div" v-for="(item, index) in tagList" :key="index">
                <div style="cursor: default;">
                    {{ item.name }}
                </div>
                <tagbar :tagItems="list[index]" @handleTagItem="handleList[index]"></tagbar>
            </div>
        </div>
        <div v-loading="loading">
            <singerList :singerlist="singerlist"></singerList>
        </div>
        <p v-if="noMore">没有数据了</p>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { getSinger } from '../../../api/index'
import tagbar from '../../../components/tagbar.vue';
import singerList from '@/components/singerList.vue';
// 所有tag
const list = [
    [
        { area: -1, name: "全部" },
        { area: 7, name: "华语" },
        { area: 96, name: "欧美" },
        { area: 8, name: "日本" },
        { area: 16, name: "韩国" },
        { area: 0, name: "其它" },
    ],
    [

        { type: -1, name: "全部" },
        { type: 1, name: "男歌手" },
        { type: 2, name: "女歌手" },
        { type: 3, name: "乐队" }
    ],
    [

        { initial: -1, name: "热门" },
        { initial: "a", name: "A" },
        { initial: "b", name: "B" },
        { initial: "c", name: "C" },
        { initial: "d", name: "D" },
        { initial: "e", name: "E" },
        { initial: "f", name: "F" },
        { initial: "g", name: "G" },
        { initial: "h", name: "H" },
        { initial: "i", name: "I" },
        { initial: "j", name: "J" },
        { initial: "k", name: "K" },
        { initial: "l", name: "L" },
        { initial: "m", name: "M" },
        { initial: "n", name: "N" },
        { initial: "o", name: "O" },
        { initial: "p", name: "P" },
        { initial: "q", name: "Q" },
        { initial: "r", name: "R" },
        { initial: "s", name: "S" },
        { initial: "t", name: "T" },
        { initial: "u", name: "U" },
        { initial: "v", name: "V" },
        { initial: "w", name: "W" },
        { initial: "x", name: "X" },
        { initial: "y", name: "Y" },
        { initial: "z", name: "Z" },
        { initial: 0, name: "#" },
    ]
]
// tag分类
const tagList = [
    { name: "语种:" }, { name: "分类:" }, { name: "筛选:" },
]

const area = ref(-1);// 语种
const type = ref(-1); // 分类
const initial = ref(-1)// 首字母
const singerlist = ref([])

const currentPage = ref(1) // 分页用
const offset = computed(() => (currentPage.value - 1) * 30) // 分页用
const noMore = computed(() => offset.value >= 930)
const loading = ref(false)
// total=960
// 接收tagbar组件传回来的值
const handleArea = (item) => {
    area.value = item.area

};
const handleType = (item) => {
    type.value = item.type

};
const handleInitial = (item) => {
    initial.value = item.initial

};
const handleList = ref([handleArea, handleType, handleInitial])



// 初始化数据
const getSingerList = async () => {
    loading.value = true;
    currentPage.value = 1;
    singerlist.value = await getSinger(area.value, type.value, initial.value, offset.value);
    loading.value = false;
}
// 滚动加载数据
const scollSingerList = async () => {
    if (offset.value <= 930) {
        currentPage.value++;
        let res = await getSinger(area.value, type.value, initial.value, offset.value)
        res.forEach((i) => {
            singerlist.value.push(i)
        })
    }

}

// 监听数据变化,获取新的歌手列表
watch([area, type, initial], getSingerList)
getSingerList()

</script>
    
<style lang="less" scoped>
.tags {
    .tag-div {
        display: flex;
        align-items: center;
    }
}
</style>