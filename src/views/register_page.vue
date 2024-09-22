<template> 
    
    <div>
        <el-header>
            表白墙
        </el-header>
        <el-card  shadow="always">
            <el-alert title="Success alert" v-if="alert.is_alert.value ==true" type="success" center show-icon />
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
                <el-button type="default"  style="margin-left: 120px;" @click="handle_to_login" >登录页面</el-button>
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

    const handle_to_login = ()=> {
        router.push('/login')
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