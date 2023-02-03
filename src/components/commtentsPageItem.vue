<template>
    <div class="comments" v-for="(item, index) in comments" :key="index">
        <div class="img">
            <img :src="item.user.avatarUrl" />
        </div>
        <div class="content">
            <h5>
                <span class="replay">{{ item.user.nickname || '' }}</span>：{{ item.content || '' }}
            </h5>
            <div class="rep" v-if="item.beReplied.length">
                <span class="replay">@{{ item.beReplied[0].user.nickname }}</span> ：{{ item.beReplied[0].content }}
            </div>
            <h5 style="color: #ccc;">{{ item.timeStr }}</h5>
        </div>

    </div>
</template> 

<script setup>
defineProps(['comments'])
</script>
    
<style lang="less" scoped>
img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    flex-shrink: 0;

}

.comments {
    display: flex;
    margin-bottom: 10px;
    border-bottom: solid #f2f2f2 1px;
    padding-bottom: 20px;

    .img {
        margin-right: 10px;
    }

    .content {
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: space-around;

        .replay {
            color: #409eff;
        }

        .rep {
            padding: 5px 0;
            background-color: #f5f5f5;
        }

        h5 {
            padding: 3px 0;
            font-size: 13px;
        }
    }

}
</style>