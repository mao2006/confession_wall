<template> 
    
    <div class="register-page">
        <el-header style="background-color: pink; color: white; height: 60px; line-height: 60px; text-align: center;">
            表白墙
        </el-header>
        <el-card  shadow="always" class="register-card">
            <el-alert title="注册成功" v-if="alert_success.is_alert.value ==true" type="success" center show-icon />
            <el-alert title="两次输入的密码不一致" v-if="alert_error_inconsistent.is_alert.value ==true" type="error" center show-icon />
            <el-alert title="还有必填项未输入" v-if="alert_null_exist.is_alert.value ==true" type="error" center show-icon />
            <el-alert title="用户名已存在" v-if="alert_duplicate_username.is_alert.value ==true" type="error" center show-icon />
            <el-alert title="账号或密码不符合要求" v-if="alert_error_password.is_alert.value ==true" type="error" center show-icon />
            <h2>用户注册</h2><h4>账号规范</h4>
            <span>用户名:4-16位字母数字下划线</span><br><span>密码:8-32位字母数字下划线<br>至少一个小写字母和数字</span>
            <br><br>
            <el-form>
                <el-form-item label="用户名">
                <el-input  placeholder="请输入用户名" v-model="temp_user_package.temp_username.value" ></el-input>
                </el-form-item>
                <el-form-item label="*密码*">
                <el-input type="password" placeholder="请输入密码" v-model="temp_user_package.temp_password.value" ></el-input>
                </el-form-item>

                <el-form-item label="再次输入密码 ">
                <el-input type="password" placeholder="请输入密码" v-model="temp_user_package.temp_password_confirm.value" ></el-input>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" @click="button_package.handle_register">注册</el-button>
                <el-button type="default"  style="margin-left: 120px;" @click="button_package.handle_to_login" >登录页面</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue';
    import router from '@/router/index'
    import axios from 'axios';



    //alert控制
        //成功 alert
        const success_alert = ()=> {
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

        
        const alert_success = success_alert()

        //存在空元素 alert

        const error_null_exist = ()=> {
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

        
        const alert_null_exist = error_null_exist()

        //两次输入的密码不一致 alert

        const error_alert_inconsistent = ()=> {
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

        
        const alert_error_inconsistent = error_alert_inconsistent()

        //用户名已存在 alert

        const error_duplicate_username = ()=> {
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

        
        const alert_duplicate_username = error_duplicate_username()


        //密码不符合要求

        const error_alert_password = ()=> {
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

        
        const alert_error_password = error_alert_password()

    //临时用户信息存储
    const temp_package_func = () => {
        const temp_username = ref('')
        const temp_password = ref('')
        const temp_password_confirm = ref('')

        return {
            temp_username,
            temp_password,
            temp_password_confirm
        }
    }
    
    const temp_user_package = temp_package_func()


    //按钮包
    const button_package_func = ()=> {
        const handle_to_login = ()=> {
            router.push('/login')
        }

        const handle_register = () => {
            if(temp_user_package.temp_password.value===''||temp_user_package.temp_username.value===''||temp_user_package.temp_password_confirm.value===''){
                alert_null_exist.handle_alert()
            }else if(temp_user_package.temp_password.value !== temp_user_package.temp_password_confirm.value){
                alert_error_inconsistent.handle_alert()
            }else{
                const axios_promise = axios({
                    method:"post",
                    url:'/api/user/reg',
                    data:{
                        'username':temp_user_package.temp_username.value,
                        'password':temp_user_package.temp_password.value,
                    }
                })

                axios_promise.then(
                    response => {
                        console.log(response.data)
                        if(response.data.code===200){
                            alert_success.handle_alert()
                        }else if(response.data.code===200501){
                            alert_duplicate_username.handle_alert()
                        }else if(response.data.code===200505){
                            alert_error_password.handle_alert()
                        }
                    }
                )

                axios_promise.catch(
                    error => {
                        console.log(error)
                    }
                )
            }
        }


        return {
            handle_to_login,
            handle_register
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