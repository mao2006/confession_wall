<template>
    <el-container>
        <el-main>
            <el-card class="block" shadow="hover" style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h2>我的头像</h2>
                    <el-button type="primary" size="large">修改</el-button>
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
                    <el-button type="primary" size="large">修改</el-button>
                </div>
                <p class="mid">{{temp_user_package.nickname}}</p>
            </el-card>
        </el-main>
    </el-container>
</template>

<script setup>
    import { user_store } from '@/stores/store';
    import { ref } from 'vue';
    import axios from 'axios';
    import { onBeforeMount } from 'vue';

    const store_usermessage = user_store()
    const token = store_usermessage.token


    //用户信息临时存储
    const temp_package_func = () => {
        const nickname = ref('')
        const avatar_url = ref('')
        const change_user_message = (new_nickname,new_url) => {
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

    //生命周期钩子 获取个人信息
    onBeforeMount(
        () => {
            // console.log(typeof(token))
            const user_message_promise = axios({
                method:'get',
                url:'/api/api/user',
                headers: {
                    Authorization: token
                }
            })

            user_message_promise.then(
                response => {
                    // console.log(response.data)
                    if(response.data.code===200){
                        // console.log(response.data.data)
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
        }
    )
    
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
</style>