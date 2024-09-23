<template> 
    
    <div class="register-page">
        <el-header>
            表白墙
        </el-header>
        <el-card  shadow="always" class="register-card">
            <el-alert title="注册成功" v-if="alert.is_alert.value ==true" type="success" center show-icon />
            <h2>用户注册</h2>
            <el-form>
                <el-form-item label="用户名">
                <el-input  placeholder="请输入用户名" ></el-input>
                </el-form-item>
                <el-form-item label="*密码*">
                <el-input type="password" placeholder="请输入密码" ></el-input>
                </el-form-item>

                <el-form-item label="再次输入密码 ">
                <el-input type="password" placeholder="请输入密码" ></el-input>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" @click="alert.handle_alert()">注册</el-button>
                <el-button type="default"  style="margin-left: 120px;" @click="button_package.handle_to_login" >登录页面</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue';
    import router from '@/router/index'

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


    const button_package_func = ()=> {
        const handle_to_login = ()=> {
            router.push('/login')
        }
        return {
            handle_to_login,
        }
    }

    const button_package = button_package_func()
</script>

<style scoped>
    .register-page {
        display: flex;
        justify-content: center;
        align-items: center; 
        height: 100vh; 
    }
    .register-card {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
        max-width: 400px; 
        width: 100%;
    }
    .el-alert {
        margin: 20px 0 0;
    }
    .el-alert:first-child {
        margin: 0;
    }
</style>