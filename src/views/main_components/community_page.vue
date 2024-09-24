<template>
    <el-scrollbar height="100%">
        <div class="scrollbar-demo-item">
            1
            <div style="margin-top: auto;">
                <el-button type="primary">Button 1</el-button>
                <el-button type="primary">Button 2</el-button>
                <el-button type="primary">Button 3</el-button>
            </div>
        </div>
        
    </el-scrollbar>
</template>

<script setup>
import { onMounted } from 'vue';
onMounted(
    () => {
        // console.log("挂载成功")
    }
)
</script>

<style scoped>
    .scrollbar-demo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
    }
    .fon-color {
        color: #FF4F5B;
    }


</style>