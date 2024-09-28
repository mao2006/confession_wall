<template>
    <el-scrollbar height="100%">
        <div style="margin-top: 40px;">
            <el-dialog v-model="comment_alert" title="提示" width="500">
                <span>评论功能开发中 敬请期待</span>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button type="primary" @click="comment_alert = false">确认</el-button>
                    </div>
                </template>
            </el-dialog>
            <el-alert title="屏蔽成功" v-if="mute_success_alert.is_alert.value" type="success" center show-icon />
            <div v-for="(item, index) in all_post" >
                <div class="scrollbar-demo-item">
                    <div class="post-info">
                        <el-avatar :src="item.avatar" size="32" class="avatar" />
                        <div class="user-info">
                            <div class="nickname" v-if="item.nickname !== ''">
                                {{ item.nickname }}
                            </div>
                            <div class="nickname" v-if="item.nickname === ''">
                                匿名用户
                            </div>
                        </div>
                        <div class="post-id">{{ item.post_id }}</div>
                    </div>
                    <div class="content">{{ item.content }}</div>
                    <div class="button-container">
                        <el-button type="primary" @click = "comment_alert = true">评论</el-button>
                        <el-button type="danger" @click="handle_mute_firststep(item.post_id)">屏蔽</el-button>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog v-model="control_mute.mute_visible.value" title="警告" width="500">
            <el-alert :title="alert_message_temp" v-if="mute_error_alert.is_alert.value" type="error" center show-icon />
            <span>你确定要屏蔽此用户吗</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="control_mute.to_unvisible">取消</el-button>
                    <el-button type="danger" @click="handle_mute()">确认</el-button>
                </div>
            </template>
        </el-dialog>
    </el-scrollbar>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import axios from 'axios';
import { user_store } from '@/stores/store';

interface Post {
    post_id: number; // 帖子ID
    avatar: string; // 头像URL
    nickname: string; // 用户昵称
    content: string; // 帖子内容
}

const comment_alert = ref(false)

const temp_user_store = user_store();
const token = temp_user_store.token;
const all_post = ref<Post[]>([]);

const waited_mute_postid = ref(0);

const control_mute_func = () => {
    const mute_visible = ref(false);
    const to_visible = () => {
        mute_visible.value = true;
    };
    const to_unvisible = () => {
        mute_visible.value = false;
    };
    return {
        mute_visible,
        to_visible,
        to_unvisible
    };
};

const control_mute = control_mute_func();

const mute_success_alert_func = () => {
    const is_alert = ref(false);
    const handle_close = () => {
        is_alert.value = false;
    };
    const handle_alert = () => {
        is_alert.value = true;
        setTimeout(() => { handle_close(); }, 3000);
    };
    return {
        is_alert,
        handle_close,
        handle_alert
    };
};

const mute_success_alert = mute_success_alert_func();

const mute_error_alert_func = () => {
    const is_alert = ref(false);
    const handle_close = () => {
        is_alert.value = false;
    };
    const handle_alert = () => {
        is_alert.value = true;
        setTimeout(() => { handle_close(); }, 3000);
    };
    return {
        is_alert,
        handle_close,
        handle_alert
    };
};

const mute_error_alert = mute_error_alert_func();

onBeforeMount(() => {
    axios({
        method: 'get',
        url: '/api/confession',
        headers: {
            Authorization: token
        }
    })
    .then(response => {
        if (response.data.code === 200) {
            all_post.value = response.data.data.confession_list;
        }
    })
    .catch(error => {
        console.log(error);
    });
});

const handle_mute_firststep = (post_id:number) => {
    waited_mute_postid.value = post_id;
    control_mute.to_visible();
};

const alert_message_temp = ref('');

const handle_mute = () => {
    const post_promise = axios({
        method: 'post',
        url: '/api/blacklist',
        headers: {
            Authorization: token,
        },
        data: {
            post_id: waited_mute_postid.value
        }
    });

    post_promise.then(response => {
        if (response.data.code === 200510) {
            alert_message_temp.value = '不能屏蔽自己的帖子';
            mute_error_alert.handle_alert();
        } else if (response.data.code === 200503) {
            alert_message_temp.value = '屏蔽失败 屏蔽关系已存在';
            mute_error_alert.handle_alert();
        } else if (response.data.code === 200) {
            control_mute.to_unvisible();
            mute_success_alert.handle_alert();
            location.reload()
        }
    });

    post_promise.catch(error => {
        console.log(error);
    });
};

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

.post-info {
    display: flex;
    align-items: center; /* 垂直居中对齐 */
}

.user-info {
    margin-left: 8px; /* 头像和昵称之间的间距 */
    font-weight: bold; /* 加粗用户名 */
    font-size: 14px; /* 确保大小合适 */
}

.post-id {
    margin-left: auto; /* 将帖子ID推到右边 */
    font-weight: normal; /* 可调整为正常粗细 */
}

.content {
    text-align: center;
    flex-grow: 1;
    margin: 5px 0;
    word-wrap: break-word; /* 或使用 overflow-wrap: break-word; */
    overflow-wrap: break-word; /* 这两者都可以 */
}

.button-container {
    display: flex;
    justify-content: flex-end; 
    margin: 0; 
}
</style>
