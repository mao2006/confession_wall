<template>
    <el-scrollbar height="100%">
        <div style="margin-top: 40px;">
            <el-dialog v-model="comment_alert" title="评论列表" width="1500">
                <el-alert :title="comment_error_message" v-if="comment_error_alert.is_alert.value" 
                type="danger" center show-icon 
                :style="{ backgroundColor: '#f56c6c', borderColor: '#f56c6c', color: '#ffffff' }"  />
                <el-alert title="发布成功" v-if="comment_success_alert.is_alert.value" 
                type="success" center show-icon/>
                <el-scrollbar style="max-height: 400px; overflow-y: auto;">
                    <div v-if="temp_comment.length === 0" style="text-align: center; margin: 20px;">
                        <p>暂无评论</p>
                    </div>
                    <div v-for="(comment, index) in temp_comment" :key="comment.comment_id" class="comment-item">
                        <el-avatar :src="comment.avatar" size="32" class="comment-avatar" />
                        <div class="comment-content">
                            <div class="comment-nickname">{{ comment.nickname || '匿名用户' }}</div>
                            <div class="comment-text">{{ comment.content }}</div>
                        </div>
                    </div>
                </el-scrollbar>

                <!-- 输入框和提交按钮 -->
                <div class="comment-input">
                    <el-input v-model="new_comment_content" placeholder="写下你的评论..."></el-input>
                    <el-button type="primary" @click="handle_submit_comment(now_post_id, new_comment_content)">提交评论</el-button>
                </div>

                <template #footer>
                    <div class="dialog-footer">
                        <el-button type="primary" @click="handle_finish_comment()">完成</el-button>
                    </div>
                </template>
            </el-dialog>

            <el-alert title="成功" v-if="mute_success_alert.is_alert.value" type="success" center show-icon />
            <div v-for="(item, index) in all_post" :key="item.post_id">
                <div class="scrollbar-demo-item">
                    <div class="post-info">
                        <el-avatar :src="item.avatar" size="32" class="avatar" />
                        <div class="user-info">
                            <div class="nickname" v-if="item.nickname !== ''">{{ item.nickname }}</div>
                            <div class="nickname" v-if="item.nickname === ''">匿名用户</div>
                        </div>
                        <div class="post-id">{{ item.post_id }}</div>
                    </div>
                    <div class="content">{{ item.content }}</div>
                    <div class="button-container">
                        <div class="like-container">

                            <VueStarPlus @click="handle_like(item.post_id)"  :style="{ color: item.is_liked ? '#ff0000' : '#bfcbd9' }">
                                <template #icon>❤ {{ item.likes }}</template>
                            </VueStarPlus>
                        </div>

                        <el-button type="primary" @click="handle_comment_button(item.post_id)">查看评论</el-button>
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
    likes:number;//点赞数
    is_liked:boolean//是否已点赞
}

interface Comment {
    comment_id: number;
    nickname: string;
    content: string;
    avatar: string;
}

const temp_user_store = user_store();
const token = temp_user_store.token;
const all_post = ref<Post[]>([]);
const temp_comment = ref<Comment[]>([]);

const waited_mute_postid = ref(0);

const control_mute_func = () => {
    const mute_visible = ref(false);
    const to_visible = () => { mute_visible.value = true; };
    const to_unvisible = () => { mute_visible.value = false; };
    return { mute_visible, to_visible, to_unvisible };
};

const control_mute = control_mute_func();

const mute_success_alert_func = () => {
    const is_alert = ref(false);
    const handle_close = () => { is_alert.value = false; };
    const handle_alert = () => {
        is_alert.value = true;
        setTimeout(handle_close, 3000);
    };
    return { is_alert, handle_close, handle_alert };
};

const mute_success_alert = mute_success_alert_func();

const mute_error_alert_func = () => {
    const is_alert = ref(false);
    const handle_close = () => { is_alert.value = false; };
    const handle_alert = () => {
        is_alert.value = true;
        setTimeout(handle_close, 3000);
    };
    return { is_alert, handle_close, handle_alert };
};

const mute_error_alert = mute_error_alert_func();

const refresh_post = () => {
    axios.get('/api/confession', { headers: { Authorization: token } })
        .then(response => {
            if (response.data.code === 200) {
                all_post.value = response.data.data.confession_list;
                console.log(all_post.value)
            }
        })
        .catch(console.error);
};

onBeforeMount(refresh_post);

const handle_mute_firststep = (post_id: number) => {
    waited_mute_postid.value = post_id;
    control_mute.to_visible();
};

const alert_message_temp = ref('');

const handle_mute = () => {
    axios.post('/api/blacklist', { post_id: waited_mute_postid.value }, { headers: { Authorization: token } })
        .then(response => {
            if (response.data.code === 200510) {
                alert_message_temp.value = '不能屏蔽自己的帖子';
                mute_error_alert.handle_alert();
            } else if (response.data.code === 200503) {
                alert_message_temp.value = '屏蔽失败 屏蔽关系已存在';
                mute_error_alert.handle_alert();
            } else if (response.data.code === 200) {
                control_mute.to_unvisible();
                mute_success_alert.handle_alert();
                refresh_post();
            }
        })
        .catch(console.error);
};

// 评论处理
const comment_alert = ref(false); // 评论对话框弹出状态

const get_post_comment = (comment_id: number) => {
    axios.get('/api/confession/comment', { headers: { Authorization: token }, params: { post: comment_id } })
        .then(response => {
            if (response.data.code === 200) {
                temp_comment.value = response.data.data.comment_list;
            }
        });
};

const now_post_id = ref(0);

// 查看评论按钮处理
const handle_comment_button = (comment_id: number) => {
    now_post_id.value = comment_id;
    get_post_comment(comment_id);
    comment_alert.value = true;
};

// 评论提交
const new_comment_content = ref('');

//错误弹出框
const comment_error_message = ref('')
// const comment_error_isalert = ref(false)

const comment_error_alert_func = () => {
    const is_alert = ref(false);
    const handle_close = () => { is_alert.value = false; };
    const handle_alert = () => {
        is_alert.value = true;
        setTimeout(handle_close, 3000);
    };
    return { is_alert, handle_close, handle_alert };
};
const comment_error_alert = comment_error_alert_func()

const comment_success_alert_func = () => {
    const is_alert = ref(false);
    const handle_close = () => { is_alert.value = false; };
    const handle_alert = () => {
        is_alert.value = true;
        setTimeout(handle_close, 3000);
    };
    return { is_alert, handle_close, handle_alert };
};
const comment_success_alert = comment_error_alert_func()


const handle_submit_comment = (post_id: number, content: string) => {
    console.log(content.length)
    if(content === ''){
        comment_error_message.value = '发送失败 内容不能为空'
        comment_error_alert.handle_alert()
    }else{
        axios.post('/api/confession/comment', { post_id, content }, { headers: { Authorization: token } })
        .then(response => {
            console.log(response.data)
            if(response.data.code===200512){
                comment_error_message.value = '发送失败 内容过长'
                comment_error_alert.handle_alert()
            }
            if (response.data.code === 200) {
                new_comment_content.value = '';
                get_post_comment(now_post_id.value);
                comment_success_alert.handle_alert()
            }
        });
    }
};

const handle_finish_comment = () => {
    temp_comment.value = []
    comment_alert.value = false
}


// //删除评论

// const delete_comment = (comment_id:number) => {
//     const delet_comment_axios = axios({
//         method:'delete',
//         url:'/api/confession/comment',
//         headers:{
//             Authorization:token,
//         },
//         data:{
//             comment_id:comment_id
//         }
//     })

//     delet_comment_axios.then(
//         response => {
//             console.log(response)
//             if(response.data.code===200){
//                 console.log("删除成功")
//             }else if(response.data.code===200502){
//                 //权限不足
//             }
//         }
//     )
// }

//点赞评论
const handle_like = (post_id:number) => {
    const like_promise = axios({
        method:"post",
        url:"/api/confession/like",
        headers:{
            Authorization:token,
        },
        data:{
            post_id:post_id
        }
    })

    like_promise.then(
        response => {
            if(response.data.code === 200){
                // mute_success_alert.handle_alert()
                refresh_post()
            }
        }
    )

    like_promise.catch(
        error => {
            console.log(error)
        }
    )
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

.post-info {
    display: flex;
    align-items: center;
}

.user-info {
    margin-left: 8px;
    font-weight: bold;
    font-size: 14px;
}

.post-id {
    margin-left: auto;
    font-weight: normal;
}

.content {
    text-align: center;
    flex-grow: 1;
    margin: 5px 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.button-container {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
}

.like-container {
    position: absolute; 
    left: calc((100vw - 200px) * 0.65 + 10vw);
    bottom: 68px;
    margin: 0 0;
}


.comment-item {
    display: flex;
    align-items: flex-start;
    margin: 10px 0;
    max-width: 100%; /* 确保评论项不会超出容器宽度 */
}


.comment-item {
    display: flex;
    align-items: flex-start;
    margin: 10px 0;
    max-width: 100%;
}

.comment-avatar {
    width: 32px; /* 固定宽度 */
    height: 32px; /* 固定高度 */
    border-radius: 50%; /* 保持为圆形 */
    flex-shrink: 0; /* 防止头像缩小 */
    margin-right: 10px;
}
.comment-content {
    flex-grow: 1;
    background: #f9f9f9;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    margin-left: 10px;
    min-width: 0; /* 确保评论内容可以适当缩小 */
}

.comment-nickname {
    font-weight: bold;
    margin-bottom: 4px;
}

.comment-text {
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: normal;
    word-break: break-all; /* 确保换行 */
}

.comment-input {
    display: flex;
    margin-top: 10px;
}

.comment-input .el-input {
    flex-grow: 1;
    margin-right: 10px;
}

.comment-text {
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: normal;
    word-break: break-all; /* 添加此行以确保换行 */
}

</style>
