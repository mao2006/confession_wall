<template>
    <div class="login-page">
        <el-header style="background-color: pink; color: white; height: 60px; line-height: 60px; text-align: center;">
            表白墙
        </el-header>
        <div class="login-card">
            <el-card  shadow="always">
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

    const store_login = login_store()
    const store_about_user = user_store()


    


    //用户信息临时储存

    const temp_user_storage_func = ()=> {
        const username = ref(void(0));
        const password = ref(void(0));

        return {
            username,
            password,
        }
    }

    const temp_user_storage = temp_user_storage_func()


    const push_into_store = (token:any) => {
        store_about_user.token = token
        
    }


    //按键 事件处理
    const button_package_func = ()=>{
        const handle_login = () => {
            store_login.login_status = true;
            router.push('/main')
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
