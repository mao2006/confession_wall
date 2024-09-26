<template>
    <div style="height: 100vh; display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <el-button type="primary" plain style="margin-left: auto;">新建帖子</el-button>
        </div>
        <!-- 滚动区域 -->
        <el-scrollbar style="flex: 1; margin-top: 20px;">
            <div style="padding: 16px;">
                <div v-for="(item, index) in temp_post_package" :key="item.post_id" class="scrollbar-demo-item">
                    <div class="post-info">
                        <div class="post-id">帖子: {{ item.post_id }}</div>
                        <div class="content">{{ item.content }}</div>
                    </div>
                    <div class="button-container">
                        <el-button type="primary">修改</el-button>
                        <el-button type="danger">删除</el-button>
                    </div>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onBeforeMount } from 'vue';
import { user_store } from '@/stores/store';

const temp_user_store = user_store();
const token = temp_user_store.token;

const temp_post_package = ref([])

onBeforeMount(() => {
    const get_my_comfession_promise = axios({
        method:'get',
        url:'/api/api/my_confession',
        headers: {
            Authorization: token,
        }
    });

    get_my_comfession_promise.then(response => {
        if (response.data.code === 200) {
            temp_post_package.value = response.data.data.my_confession_list;
        }
    });
});
</script>

<style scoped>
.scrollbar-demo-item {
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
    transition: box-shadow 0.3s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.scrollbar-demo-item:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.post-info {
    margin-bottom: 12px;
}

.post-id {
    font-size: 14px;
    font-weight: bold;
    color: #333;
}

.content {
    font-size: 16px;
    color: #666;
    margin-bottom: 12px;
}

.button-container {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.el-button {
    border-radius: 4px;
}

.el-button.primary {
    background-color: #409EFF;
}

.el-button.danger {
    background-color: #F56C6C;
}
</style>
