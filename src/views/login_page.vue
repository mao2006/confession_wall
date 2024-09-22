<template>
    <div>
        <el-header>
            表白墙
        </el-header>
        <el-card  shadow="always">
            <h2>用户登录</h2>
            <el-form>
                <el-form-item label="用户名">
                <el-input  placeholder="请输入用户名" ></el-input>
                </el-form-item>
                <el-form-item label="密 码 ">
                <el-input type="password" placeholder="请输入密码" ></el-input>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" @click="handle_login">登录</el-button>
                <el-button type="default"  style="margin-left: 120px;" @click="handle_to_register" >注册页面</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue';
    import { login_store } from '@/stores/store';
    import router from '@/router/index'

    const store_loginpage = login_store()


    

    const handle_login = () => {
        // console.log(store_loginpage.login_status)
        store_loginpage.login_status = true;
        router.push('/main')
    }



    const handle_to_register = ()=> {
        router.push('/register')
    }
</script>

<style scoped>
    .el-alert {
        margin: 20px 0 0;
    }
    .el-alert:first-child {
        margin: 0;
    }
</style>