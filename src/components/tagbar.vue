<template>
    <div class="tagbar-container">
        <div class="tagbar">
            <div class="tag middle" v-for="(item, index) in props.tagItems" :key="index"
                :class="{ active: currentIndex == index }" :style="{ width: width }" @click="tabItemClick(item, index)">
                {{ item.name }}
            </div>
        </div>
    </div>
</template>
    
<script setup>
import { ref } from 'vue';

const props = defineProps({
    tagItems: {
        type: Array,
        default() {
            return []
        }
    },
    width: {
        type: String,
        default() {
            return ''
        }
    }
})
const emit = defineEmits(['handleTagItem'])
const currentIndex = ref(0)

const tabItemClick = (item, index) => {
    currentIndex.value = index;
    // console.log(item, index);
    emit('handleTagItem', item)
}

</script>
    
<style lang="less" scoped>
.tagbar-container {
    .tagbar {
        display: flex;

        cursor: pointer;

        .tag {
            box-sizing: border-box;

            // padding: 5px 5px;
            margin: 7px 5px;
            border-radius: 20%;

            &:hover {
                color: #fd544e;
            }
        }

    }
}

.active {
    color: #fd544e;
    background-color: #fff6ff;
}
</style>