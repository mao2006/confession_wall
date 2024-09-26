<template>
        <el-scrollbar height="100%">
            <div style="margin-top: 40px;">
                <el-alert title="屏蔽成功" 
                v-if="mute_success_alert.is_alert.value" type="success" center show-icon />
                <div v-for="(item, index) in all_post" :key="item.post_id">
                    <div class="scrollbar-demo-item">
                        <div class="post-info">
                            <div class="post-id">{{ item.post_id }}</div>
                            <div class="nickname">by:{{ item.nickname }}</div>
                        </div>
                        <div class="content">{{ item.content }}</div>
                        <div class="button-container">
                            <el-button type="primary">评论</el-button>
                            <el-button type="danger" @click="handle_mute_firststep(item.post_id)">屏蔽</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <el-dialog
                v-model="control_mute.mute_visible.value"
                title="警告"
                width="500"
            >
            <el-alert title="屏蔽失败 用户已被屏蔽" v-if="mute_error_alert.is_alert.value" type="error" center show-icon />
                <span>你确定要屏蔽此用户吗</span>
                <template #footer>
                <div class="dialog-footer">
                    <el-button @click="control_mute.to_unvisible">取消</el-button>
                    <el-button type="danger" @click="handle_mute()">
                    确认
                    </el-button>
                </div>
                </template>
            </el-dialog>
        </el-scrollbar>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import axios from 'axios';
import { user_store } from '@/stores/store';

const temp_user_store = user_store();
const token = temp_user_store.token;
const all_post = ref([]);

const waited_mute_postid = ref(0)



//屏蔽 弹出框
const control_mute_func = () => {
    const mute_visible = ref(false)
    const to_visible = () => {
        mute_visible.value = true
        console.log(mute_visible.value)
    }
    const to_unvisible = () => {
        mute_visible.value = false
        console.log(mute_visible.value)
    }
    return {
        mute_visible,
        to_visible,
        to_unvisible
    }
}



const control_mute = control_mute_func()

//屏蔽成功 alert

const mute_success_alert_func = () => {
    const is_alert = ref(false)

    const handle_close = ()=>{
        is_alert.value = false
    }

    const handle_alert = ()=>{
        is_alert.value = true;
        setTimeout(()=>{handle_close()},3000)
    }
    return {
        is_alert,
        handle_close,
        handle_alert
    }
}

const mute_success_alert = mute_success_alert_func()


//屏蔽失败 alert

const mute_error_alert_func = ()=> {
    const is_alert = ref(false)

    const handle_close = ()=>{
        is_alert.value = false
    }

    const handle_alert = ()=>{
        is_alert.value = true;
        setTimeout(()=>{handle_close()},3000)
    }
    return {
        is_alert,
        handle_close,
        handle_alert
    }
}

const mute_error_alert = mute_error_alert_func()


//生命周期钩子 挂载帖子

onBeforeMount(() => {
    axios({
        method: 'get',
        url: '/api/api/confession',
        headers: {
            Authorization: token
        }
    })
    .then(response => {
        console.log(response)
        if (response.data.code === 200) {
            all_post.value = response.data.data.confession_list;
        }
    })
    .catch(error => {
        console.log(error);
    });
});



//屏蔽 弹出框
const handle_mute_firststep = (post_id:number) => {
    waited_mute_postid.value = post_id
    control_mute.to_visible()
}

const handle_mute = () => {
    const post_promise = axios({
        method:'post',
        url:'/api/api/blacklist',
        headers:{
            Authorization:token,
        },
        data:{
            post_id:waited_mute_postid.value
        }
    })

    post_promise.then(
        response => {
            console.log(response.data)
            if(response.data.code===200503){
                mute_error_alert.handle_alert()
            }else if(response.data.code===200){
                control_mute.to_unvisible();
                mute_success_alert.handle_alert()
            }
        }
    )

    post_promise.catch(
        error => {
            console.log(error)
        }
    )
}

</script>

<style scoped>
.scrollbar-demo-item {
    background-color: #fff; /* 白色背景 */
    border: 1px solid #e0e0e0; /* 浅灰色边框 */
    border-radius: 8px; /* 圆角 */
    padding: 16px; /* 内边距 */
    margin-bottom: 20px; /* 底部外边距 */
    transition: box-shadow 0.3s; /* 过渡效果 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}

.post-info {
    display: flex;
    justify-content: space-between;
}

.post-id {
    font-weight: bold;
}

.nickname {
    margin-top: auto;
}

.content {
    text-align: center;
    flex-grow: 1;
    margin: 5px 0;
}

.button-container {
    display: flex;
    justify-content: flex-end; 
    margin: 0; 
}
.add-post-button {
    position: fixed;
    top: 80px; 
    right: 20px; 
    background-color: white; 
    color: var(--el-color-primary); 
    border: 1px solid var(--el-color-primary); 
}
</style>