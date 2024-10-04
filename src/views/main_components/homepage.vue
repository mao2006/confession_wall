<template>
    <el-container>
        <el-alert 
        title="修改成功" 
        type="success" 
        v-if="nickname_success_alert.is_alert.value === true" 
        class="alert_container" 
        center 
        show-icon 
        style="position: fixed; top: 100px; left: 50%; transform: translateX(-50%); width: 300px; z-index: 1000;"
        />
        <el-alert 
        title="取消屏蔽成功" 
        type="success" 
        v-if="cancel_mute_success_alert.is_alert.value === true" 
        class="alert_container" 
        center 
        show-icon 
        style="position: fixed; top: 100px; left: 50%; transform: translateX(-50%); width: 300px; z-index: 1000;"
        />
        <el-dialog title="修改昵称" v-model="change_nickname_alert_visible" width="30%" 
        >
            <el-alert title="修改失败 昵称不能为空" style="border-bottom: 10px ;-bottom: 10px;" v-if="nickname_error_alert.is_alert.value" type="error" center show-icon />
            <div class="dialog-content">
                <el-input placeholder="请输入内容" v-model="nickname_temp"></el-input>
                <div class="button-group">
                <el-button type="primary" @click="handle_submit_change_nickname()" class="button">确定</el-button>
                <el-button @click="change_nickname_alert_visible = false" class="button">取消</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="上传头像" v-model="change_avater_alert_visible" width="30%">
            <el-alert :title="avatar_error_message" v-if="avatar_error_alert.is_alert.value" type="error" center show-icon />
            <el-upload
                class="upload-demo"
                drag
                :before-upload="before_avatar_upload"
                :on-change="handle_avatar_change"
                :show-file-list="true"
                :auto-upload="false"
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将头像文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip" type="warning">上传头像必须为 JPG、PNG 格式，且不超过 2MB</div>
            </el-upload>
            <div class="button-group">
                <el-button type="primary" @click="handle_upload_avator">确定</el-button>
                <el-button @click="change_avater_alert_visible = false">取消</el-button>
            </div>
        </el-dialog>
        <el-main>

            
            
            <el-card class="block" shadow="hover" style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h2>我的头像</h2>
                    <el-button type="primary" size="large" @click = "handle_alert_change_avatar()">修改</el-button>
                </div>
                <div class="mid">
                    <el-card class="block" shadow="hover" style="flex: 1; display: flex; justify-content: center; align-items: center;">
                        <img :src="temp_user_package.avatar_url.value" alt="图片" class="compressed-image"  />
                    </el-card>
                </div>
            </el-card>
            <el-card class="block" shadow="hover" style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    
                    
                    <h2>我的昵称</h2>
                    <el-button type="primary" size="large" @click = "handle_alert_change_nickname()">修改</el-button>
                </div>
                <p class="mid">{{temp_user_package.nickname}}</p>
            </el-card>

            <el-card class="block" shadow="hover" style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h2>已屏蔽的人</h2>
                </div>
                <el-row gutter={20}>
                    <el-col v-for="(user, index) in mute_list" :key="index" :span="8">
                        <div class="user-item">
                            <img :src="user.avatar" alt="头像" class="compressed-image" />
                            <span>{{ user.nickname }}</span>
                            <el-button type="danger" @click = "handle_remove_mute(user.target_id)">取消屏蔽</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
    import { user_store } from '@/stores/store';
    import { ref } from 'vue';
    import axios from 'axios';
    import { onBeforeMount } from 'vue';

    const store_usermessage = user_store()
    const token = store_usermessage.token


    const change_nickname_alert_visible = ref(false)
    const change_avater_alert_visible = ref(false)





    //用户信息临时存储
    const temp_package_func = () => {
        const nickname = ref('')
        const avatar_url = ref('')
        const change_user_message = (new_nickname:string,new_url:string) => {
            nickname.value = new_nickname;
            avatar_url.value = new_url;
        }

        return {
            nickname,
            avatar_url,
            change_user_message,
        }
    }

    const temp_user_package = temp_package_func()
    
    const nickname_temp = ref('')

    
    interface mute_list {
        nickname:string,
        avatar:string,
        target_id: number
    }

    //屏蔽列表
    const mute_list = ref<mute_list[]>([])

    //获取方法
    const get_mute_list = () => {
        //获取被我屏蔽的人
        const mute_promise = axios({
            method:'get',
            url:'/api/blacklist',
            headers:{
                Authorization:token
            }
        })

        mute_promise.then(
            response => {
                if(response.data.code===200){
                    // console.log(response.data.data.blacklist)
                    mute_list.value = response.data.data.blacklist
                }
                // console.log("111")
                // console.log(mute_list.value[0])
            }
        )
    }

    //取消屏蔽成功 alert


    const cancel_mute_success_alert_func = ()=> {
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

    const cancel_mute_success_alert = cancel_mute_success_alert_func()

    //取消屏蔽
    const handle_remove_mute = (target_id:number) => {
        const remove_mute_promise = axios({
            method:"delete",
            url:'/api/blacklist',
            headers:{
                Authorization:token,
            },
            data:{
                target_id:target_id
            }
        })

        remove_mute_promise.then(
            response => {
                if(response.data.code===200){
                    get_mute_list()
                    cancel_mute_success_alert.handle_alert()
                }
            }
        )
    }

    //生命周期钩子 获取个人信息
    onBeforeMount(
        //获取个人信息
        () => {
            // console.log(typeof(token))
            const user_message_promise = axios({
                method:'get',
                url:'/api/user',
                headers: {
                    Authorization: token
                }
            })

            user_message_promise.then(
                response => {
                    // console.log(response.data)
                    if(response.data.code===200){
                        // console.log(response.data.data)
                        console.log(response.data.data)
                        temp_user_package.change_user_message(response.data.data.nickname,response.data.data.avatar)
                        // console.log(temp_user_package.nickname.value)
                        // console.log(temp_user_package.avatar_url.value)
                    }
                }
            )

            user_message_promise.catch(
                error => {
                    console.log(error)
                }
            )

            get_mute_list()
        }
        
    )

    
    //修改昵称失败 alert

    const change_nickname_error_alert_func = ()=> {
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

    const nickname_error_alert = change_nickname_error_alert_func()

    //修改昵称成功 alert

    const change_nickname_success_alert_func = ()=> {
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

    const nickname_success_alert = change_nickname_error_alert_func()

    


    const handle_alert_change_avatar = () => {
        change_avater_alert_visible.value = true
        console.log(change_avater_alert_visible.value)
    }
    const handle_alert_change_nickname = () => {
        change_nickname_alert_visible.value = true
        console.log(change_nickname_alert_visible.value)
    }

    const handle_submit_change_nickname = () => {
        if(nickname_temp.value===''){
            nickname_error_alert.handle_alert()
        }else{
            const submit_promise = axios({
                method:'put',
                url:'/api/user',
                headers:{
                    Authorization:token,
                },
                data:{
                    nickname:nickname_temp.value
                }
            })

            submit_promise.then(
                response => {
                    if(response.data.code===200){
                        change_nickname_alert_visible.value = false
                        console.log(response.data)
                        nickname_success_alert.handle_alert()
                        location.reload()
                    }
                }
            )
        }

    }

    
    //头像处理弹出框
    const avatar_error_message = ref('') 

    const avatar_error_alert_func = ()=> {
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

    const avatar_error_alert = avatar_error_alert_func()

    //头像处理

    const avatar_file = ref(null); 

    const before_avatar_upload = (file:any) => {
        const is_image = file.type === 'image/jpeg' || file.type === 'image/png';
        const is_lessthan_2mb = (file.size / 1024 / 1024) < 2;

        if (is_image===false) {
            avatar_error_message.value = '上传头像图片只能是 JPG 或 PNG 格式!'
            avatar_error_alert.handle_alert()
        }
        if (is_lessthan_2mb===false) {
            avatar_error_message.value = '上传头像图片大小不能超过 2MB!'
            avatar_error_alert.handle_alert()
        }
        
        return (is_image && is_lessthan_2mb);
    };

    const handle_avatar_change = (file:any) => {
        console.log("111")
        console.log(typeof(file))
        avatar_file.value = file.raw;
    };

    const handle_upload_avator = () => {
    if (avatar_file.value === null) {
        avatar_error_message.value = '请先选择头像文件!';
        avatar_error_alert.handle_alert();
        return;
    }

    const formData = new FormData();
    formData.append('picture', avatar_file.value); 

    const updata_avator_promise = axios({
        method: 'post',
        url: '/api/upload',
        headers: {
            'Authorization': token,
        },
        data: formData 
    });

    updata_avator_promise.then(response => {
        if (response.data.code === 200) {
            const url:string = response.data.data.url

            // console.log(url)

            const submit_avator_promise = axios({
                method:'put',
                url:'/api/user',
                headers:{
                    Authorization:token,
                },
                data:{
                    avatar:url,
                }
            })

            submit_avator_promise.then(
                response => {
                    if(response.data.code===200){
                        console.log(response)
                        change_avater_alert_visible.value = false;
                        nickname_success_alert.handle_alert();
                        location.reload()
                    }
                }
            )

            submit_avator_promise.catch(
                error => {
                    console.log(error)
                }
            )
            // console.log(response.data.data.url)
            // change_avater_alert_visible.value = false;
            // nickname_success_alert.handle_alert();
        } else {
            console.log(response)
            avatar_error_message.value = '上传失败!';
            avatar_error_alert.handle_alert();
        }
    })
    .catch(error => {
        console.error(error);
        avatar_error_message.value = '上传失败!';
        avatar_error_alert.handle_alert();
    });
};



</script>

<style scoped>
    .block {
    margin-bottom: 20px;
  }
  
  .mid {
    display: flex;
    justify-content: center;
  }
  
  .compressed-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  .button-group el-button {
    width: 48%;
  }

  .button {
    width: 45%;
    margin: 0 2.5%;
  }

  
</style>