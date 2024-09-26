<template>
  <div class="common-layout">
    <el-container style="height: 100vh;">
      <el-header style="background-color: pink; color: white; height: 60px; line-height: 60px; text-align: center;">
        表白墙
      </el-header>
      
      <el-container style="height: calc(100vh - 60px);">
        <!-- 侧边栏带圆角 -->
        <el-aside width="200px" class="aside-rounded">
          <el-menu @select="index_method.index_switch" default-active="1">
            <el-menu-item index="1">表白社区</el-menu-item>
            <el-menu-item index="2">我的表白</el-menu-item>
            <el-menu-item index="3">个人主页</el-menu-item>
          </el-menu>
        </el-aside>
  
        <el-main class="top">
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import router from '@/router';
import { login_store } from '@/stores/store';
import { ref, watch } from 'vue';

const use_store = login_store();

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
