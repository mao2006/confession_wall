<template>
    <div>
        <el-card class="login-card" shadow="always">
            <h2 class="login-title">用户登录</h2>
            <el-form ref="form" status-icon>
                <el-form-item label="用户名" prop="username" >
                <el-input  placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" >
                <el-input type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" @click="handle_login">登录</el-button>
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
</script>

<style scoped>

    .login-card {
        width: 400px;
        padding: 20px;
    }

    .login-title {
        text-align: center;
        margin-bottom: 20px;
    }
</style>