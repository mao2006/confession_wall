<template>
    <div style="height: 100vh; display: flex; flex-direction: column;">
        <el-alert title="成功" v-if="commit_success_alert.is_alert.value===true" type="success" center show-icon />
        <!-- 发布帖子 -->
        <el-dialog
    v-model="control_post_dialog.dialog_visible_status.value"
    title="发布帖子"
    width="600"
>
    <el-alert :title="error_alert_message" v-if="commit_error_alert.is_alert.value===true" type="error" center show-icon />
    <div>
        <el-input 
            type="textarea" 
            placeholder="输入帖子内容" 
            maxlength="200"
            v-model="temp_post_post.post.value"
            rows="10"  
        ></el-input>

        <el-date-picker
            v-model="temp_post_post.post_unix.value"
            type="datetime"
            placeholder="选择时间"
            format="yyyy-MM-dd HH:mm:ss"
            @change="updatePostUnix"
        ></el-date-picker>

        <el-checkbox label="是否匿名" v-model="temp_post_post.unnamed.value">匿名</el-checkbox>
        <el-checkbox label="是否公开" v-model="temp_post_post.private.value">私密</el-checkbox>
    </div>
    <div style="margin-top: 20px; text-align: right;">
        <el-button @click="control_post_dialog.to_unvisible">取消</el-button>
        <el-button type="primary" @click="handle_commit_post">发布</el-button>
    </div>
</el-dialog>
        <!-- 修改帖子 -->
        <el-dialog
            v-model="control_revise_dialog.dialog_visible_status.value"
            title="修改帖子"
            width="600"
        >
            <el-alert :title="error_alert_message" v-if="revise_error_alert.is_alert.value===true" type="error" center show-icon />
            <div>
                <el-input 
                    type="textarea" 
                    placeholder="输入帖子内容" 
                    maxlength="200"
                    v-model="temp_post"
                    rows="10"  
                ></el-input>
            </div>
            <div style="margin-top: 20px; text-align: right;">
                <el-button @click="control_revise_dialog.to_unvisible">取消</el-button>
                <el-button type="primary" @click="handle_revise_post" >发布</el-button>
            </div>
        </el-dialog>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <el-button type="primary" plain style="margin-left: auto;" @click = "control_post_dialog.to_visible"> 新建帖子</el-button>
        </div>
        
        <el-dialog
            v-model="confirm_delete_status"
            title="确认删除"
            width="600"
        >
            <div style="text-align: center; margin-bottom: 20px;">
                <span>你确认要删除此表白吗</span>
            </div>
            <div style="text-align: right;">
                
                <el-button @click="handle_alert_confirm_delete.to_unvisible">取消</el-button>
                <el-button @click="handle_commit_delete" type="danger">确认</el-button>
            </div>
        </el-dialog>
        <el-scrollbar style="flex: 1; margin-top: 20px;">
            <div style="padding: 16px;">
                <div v-for="(item, index) in temp_post_package"  class="scrollbar-demo-item">
                    <div class="post-info">
                        <div class="post-id">帖子: {{ item.post_id }}</div>
                        <div class="content">{{ item.content }}</div>
                    </div>
                    <div class="button-container">
                        <el-button type="primary" @click = "revise_post_first_step(item.post_id,item.content)">修改</el-button>
                        <el-button type="danger" @click = "handle_delete_first_step(item.post_id)">删除</el-button>
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

interface Post {
    post_id: number; 
    content: string; 
}

const temp_user_store = user_store();
const token = temp_user_store.token;

const temp_post_package = ref<Post[]>([])
const error_alert_message = ref('')

const temp_post_undeleted = ref(0)

const refresh_post = () => {
    const get_my_comfession_promise = axios({
        method:'get',
        url:'/api/my_confession',
        headers: {
            Authorization: token,
        }
    });

    get_my_comfession_promise.then(response => {
        if (response.data.code === 200) {
            temp_post_package.value = response.data.data.my_confession_list;
        }
    });
}


onBeforeMount(() => {
    refresh_post()
});

const handle_delete_first_step = (post_id:number)=> {
    // console.log(post_id)
    temp_post_undeleted.value = post_id
    handle_alert_confirm_delete.to_visible()
}

//发表帖子 弹出框控制
const control_post_dialog_func = () => {
    const dialog_visible_status = ref(false)
    const to_visible = () => {
        dialog_visible_status.value = true
    }
    const to_unvisible = () => {
        dialog_visible_status.value = false
    }

    return {
        dialog_visible_status,
        to_visible,
        to_unvisible
    }
}

const control_post_dialog = control_post_dialog_func()


const temp_post_post = {
    post:ref(''),
    unnamed:ref(false),
    post_unix:ref(''),
    private:ref(false)
}

const updatePostUnix = (value:number) => {
    console.log("选择的时间值:", value);
    if (value) {
        temp_post_post.post_unix.value = String(Math.floor(new Date(value).getTime() / 1000));
        console.log("转换后的 Unix 时间戳:", temp_post_post.post_unix.value);
    } else {
        temp_post_post.post_unix.value = '';
    }
};

const commit_error_message = ref('')

const commit_error_alert_func = ()=> {
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

const commit_error_alert = commit_error_alert_func()

const commit_success_alert_func = ()=> {
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

const commit_success_alert = commit_success_alert_func()

const handle_commit_post = () => {
    console.log(temp_post_post.post.value)
    console.log(temp_post_post.unnamed.value)
    if(temp_post_post.post.value===''){
        error_alert_message.value = '帖子内容不能为空'
        commit_error_alert.handle_alert()
    }else{
        console.log("是否私密:")
        console.log(temp_post_post.private.value)
        const commit_promise = axios({
            method: 'post',
            url: '/api/confession',
            headers: {
                Authorization: token,
            },
            data: {
                content: temp_post_post.post.value,
                unnamed: temp_post_post.unnamed.value,
                ...(temp_post_post.post_unix.value ? { post_unix: temp_post_post.post_unix.value } : {}),
                private: temp_post_post.private.value
            }
        });

        commit_promise.then(
            response => {
                console.log(response)
                if(response.data.code===200502){
                    error_alert_message.value = '权限不足'
                    commit_error_alert.handle_alert()
                }else if(response.data.code===200){
                    control_post_dialog.to_unvisible()
                    refresh_post()
                    commit_success_alert.handle_alert()
                }
            }
        )
    }
}

const confirm_delete_status = ref(false)


const handle_alert_confirm_delete_func = () => {
    const to_visible = () => {
        confirm_delete_status.value = true
    }
    const to_unvisible = () => {
        confirm_delete_status.value = false
    }

    return {
        to_unvisible,
        to_visible
    }
}

const handle_alert_confirm_delete = handle_alert_confirm_delete_func()
const handle_commit_delete = () => {
    const delete_promise = axios({
        method:'delete',
        url:'/api/confession',
        headers:{
            Authorization:token
        },
        data:{
            post_id:temp_post_undeleted.value
        }
    })

    delete_promise.then(
        response => {
            if(response.data.code === 200){
                confirm_delete_status.value = false
                refresh_post()
                commit_success_alert.handle_alert()
                // console.log('123')
            }
        }
    )
}

//修改帖子

//弹出框
const revise_error_alert_func = ()=> {
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

const revise_error_alert = revise_error_alert_func()


//修改帖子 对话框方法
const control_revise_dialog_func = () => {
    const dialog_visible_status = ref(false)
    const to_visible = () => {
        dialog_visible_status.value = true
    }
    const to_unvisible = () => {
        dialog_visible_status.value = false
    }

    return {
        dialog_visible_status,
        to_visible,
        to_unvisible
    }
}

const control_revise_dialog = control_revise_dialog_func()
//第一步 弹出对话框 存储变量

const temp_post = ref('')
const post_id_revise = ref(0)

const revise_post_first_step = (post_id:number,post:string) => {
    temp_post.value = post
    post_id_revise.value = post_id
    control_revise_dialog.to_visible()
    // console.log(temp_post.value)
    // console.log(post_id_revise.value)
}

//第二步 提交请求

const handle_revise_post = () => {
    if(temp_post.value===''){
        error_alert_message.value = "帖子内容不能为空"
        revise_error_alert.handle_alert()
    }else{
        const revise_promise = axios({
            method:"put",
            url:'/api/confession',
            headers:{
                Authorization:token,
            },
            data:{
                post_id:post_id_revise.value,
                content:temp_post.value
            }
        })

        

        revise_promise.then(
            response => {
                console.log(response.data)
                if(response.data.code===200502){
                    error_alert_message.value = "权限不足"
                    revise_error_alert.handle_alert()
                }else if(response.data.code===200){
                    control_revise_dialog.to_unvisible()
                    refresh_post()
                    commit_success_alert.handle_alert()
                }
            }
        )
    }
}


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
    text-align: center;
    flex-grow: 1;
    margin: 5px 0;
    word-wrap: break-word; /* 或使用 overflow-wrap: break-word; */
    overflow-wrap: break-word; /* 这两者都可以 */
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
