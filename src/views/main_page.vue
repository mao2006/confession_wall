<template>
    <div class="common-layout">
        <el-container style="height: 100vh;">
            <el-header style="background-color: paleturquoise; color: white; height: 60px; line-height: 60px; text-align: center;">
                表白墙
            </el-header>
            
            <el-container style="height: calc(100vh - 60px);">
                <el-aside width="200px">
                    <el-menu @select="index_method.index_switch" default-active="1">
                        <el-menu-item index="1">表白社区</el-menu-item>
                        <el-menu-item index="2">我的表白</el-menu-item>
                        <el-menu-item index="3">个人主页</el-menu-item>
                    </el-menu>
                </el-aside>
        
                <el-main style="padding: 20px; overflow: auto;" class="content-container">
                    <router-view  />
                </el-main>
            </el-container>
        </el-container>
    </div>
  </template>

<script setup>
    import router from '@/router';
    import { login_store } from '@/stores/store';
    import { createPinia } from 'pinia';
    import {ref,watch} from 'vue'

    const use_store = login_store()

    function handle_sideborder_select(){
        const active_index = ref(0);
        const index_switch = (index) => {
            // console.log(index)
            active_index.value = index
        }

        return {
            active_index,
            index_switch
        }
    }

    const index_method = handle_sideborder_select()

    watch(
        index_method.active_index,
        (new_value,old_value) => {
            if(new_value!=old_value){
                if(new_value==1){
                    // console.log("12312321")
                    router.push('/main/community')
                }
                if(new_value==2){
                    // console.log("12312321")
                    router.push('/main/my_comfession')
                }
                if(new_value==3){
                    // console.log("12312321")
                    router.push('/main/homepage')
                }
            }
        }
    )


</script>


<style scoped>
    
    .el-container > .el-main {
        flex: 1; 
        display: flex; 
        flex-direction: column;
        min-width:100vh; 
    }

  
    
    .content {
    word-wrap: break-word; 
    word-break: break-all; 
    white-space: normal; 
    }

    /* 强制 router-view 内部的内容占满父容器宽度 */
    .content-container {
    width: 100%; /* 强制内容占满父容器 */
    height: 100%; /* 保证高度占满父容器 */
    box-sizing: border-box; /* 让 padding 不影响宽度计算 */
    }
</style>
