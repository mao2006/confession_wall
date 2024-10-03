<template>
  <div class="common-layout">
    <el-container style="height: 100vh;">
      <el-header style="background-color: pink; color: white; height: 60px; line-height: 60px; text-align: center;">
        表白墙
      </el-header>

      
      
      <el-container style="height: calc(100vh - 60px);">
        <el-dialog
            v-model="unlogin_dialog_control.unlogin_dialog_visible.value"
            title="退出登录"
            width="600"
        >
            <div style="text-align: center; margin-bottom: 20px;">你确定要退出登录吗</div>
            <div style="text-align: right;">
                <el-button @click = "unlogin_dialog_control.to_unvisible">取消</el-button>
                <el-button type="danger" @click = "handle_logout()">确认</el-button>
            </div>
        </el-dialog>
        <!-- 侧边栏带圆角 -->
        <el-aside width="200px" class="aside-rounded">
          <el-menu @select="index_method.index_switch" default-active="1">
            <el-menu-item index="1">表白社区</el-menu-item>
            <el-menu-item index="2">我的表白</el-menu-item>
            <el-menu-item index="3">个人主页</el-menu-item>
            
          </el-menu>
        </el-aside>
        <el-button 
          style="position: absolute; bottom: 10px; left: 10px; width: 150px; height: 40px; font-size: 16px;" 
          type="danger" @click = "unlogin_dialog_control.to_visible">
          退出登录
        </el-button>
  
        <el-main class="top">
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import router from '@/router';
import { login_store,user_store } from '@/stores/store';
import { ref, watch } from 'vue';

const use_store_login = login_store();
const use_store_user = user_store();

function handle_sideborder_select() {
  const active_index = ref(0);
  const index_switch = (index) => {
    active_index.value = index;
  };

  return {
    active_index,
    index_switch,
  };
}

const index_method = handle_sideborder_select();

watch(index_method.active_index, (new_value, old_value) => {
  if (new_value != old_value) {
    if (new_value == 1) {
      router.push('/main/community');
    }
    if (new_value == 2) {
      router.push('/main/my_comfession');
    }
    if (new_value == 3) {
      router.push('/main/homepage');
    }
  }
});


//退出登录 弹出框设置
const unlogin_dialog_func = () => {
  const unlogin_dialog_visible = ref(false)
  const  to_visible = () => {
    unlogin_dialog_visible.value = true
  }
  const to_unvisible = () => {
    unlogin_dialog_visible.value = false
  }

  return {
    unlogin_dialog_visible,
    to_visible,
    to_unvisible
  }
}

const unlogin_dialog_control = unlogin_dialog_func()

const handle_logout = () => {
    use_store_login.reset(),
    use_store_user.reset(),
    location.reload()
}

</script>

<style scoped>


.top {
  position: relative;
  z-index: 10;
}

.el-container > .el-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-y: auto;
}



.content {
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}

.content-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}


</style>
