<template>
    <div class="login-page">
        <el-header style="background-color: pink; color: white; height: 60px; line-height: 60px; text-align: center;">
            表白墙
        </el-header>
        <div class="login-card">
            <el-card  shadow="always">
                <el-alert title="密码错误或用户不存在 请检查" v-if="alert.is_alert.value ==true" type="error" center show-icon />
                <h2>用户登录</h2>
                <el-form>
                    <el-form-item label="用户名">
                    <el-input  placeholder="请输入用户名" v-model="temp_user_storage.username.value" ></el-input>
                    </el-form-item>
                    <el-form-item label="密 码 ">
                    <el-input type="password" placeholder="请输入密码" v-model="temp_user_storage.password.value" ></el-input>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" @click="button_package.handle_login">登录</el-button>
                    <el-button type="default"  style="margin-left: 120px;" @click="button_package.handle_to_register" >注册页面</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue';
    import { login_store,user_store } from '@/stores/store';
    import router from '@/router/index'
    import axios from 'axios';

    const store_login = login_store()
    const store_about_user = user_store()

    //用户信息临时储存

    const temp_user_storage_func = ()=> {
        const username = ref('');
        const password = ref('');

        return {
            username,
            password,
        }
    }

    const temp_user_storage = temp_user_storage_func() //临时库

    //控制弹出框
    const use_alert = ()=> {
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

    const alert = use_alert()


    //token存入
    const push_into_store = (token:string) => {
        store_about_user.token = token
    }

    //处理请求
    const axios_method_func = (username:string,password:string) => {
        const axios_promise = axios({
            method:'post',
            url:'/api/api/user/login',
            data:{
                'username':username,
                'password':password,
            },
        })

        axios_promise.then(
            response => {
                console.log(response.data.code)
                if(response.data.code===200){
                    // console.log(response.data.data.token)
                    push_into_store(response.data.data.token)
                    // console.log(store_about_user.token)
                    store_login.login_status = true
                    router.push('/main')
                }else if(response.data.code===200501){
                    alert.handle_alert()
                }
            }
        )

        axios_promise.catch(
            error => {
                console.log(error)
            }
        )
    }


    //按键 事件处理
    const button_package_func = ()=>{
        const handle_login = () => {
            axios_method_func(temp_user_storage.username.value,temp_user_storage.password.value)
        }

        const handle_to_register = ()=> {
            router.push('/register')
        }

        return {handle_login,handle_to_register}
    }

    const button_package = button_package_func()
</script>

<style scoped>
    .login-page {
        display: flex;
        justify-content: center;
        align-items: center; 
        height: 100vh; 
    }
    .login-card {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
        max-width: 400px; 
        width: 100%;
    }
</style>
