<template>
    <el-container style="height: 100vh;">
        <el-aside  class="sidebar">
            <el-menu @select = "index_method.index_switch" default-active="1">
                <el-menu-item index="1">表白社区</el-menu-item>
                <el-menu-item index="2">我的表白</el-menu-item>
                <el-menu-item index="3">个人主页</el-menu-item>
            </el-menu>
        </el-aside>

        <el-container>
            <RouterView />
        </el-container>
    </el-container>
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

