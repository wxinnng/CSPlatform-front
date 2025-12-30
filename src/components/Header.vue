<template>
    <n-flex justify="end" class="icon">
        <n-avatar size="medium" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
        Sing
    </n-flex>
    <n-flex justify="end" align="center" :size="[60, 10]" class="choose" :wrap="false">

        <n-button quaternary type="default" focusable="false">Sing</n-button>
        <n-button quaternary type="info" focusable="false">Sing</n-button>
        <n-button quaternary type="primary" focusable="false">Sing</n-button>
        <n-button quaternary type="warning" focusable="false">Sing</n-button>
        <n-button quaternary type="error">切换主题</n-button>
        <n-button quaternary type="tertiary">GitHub</n-button>
    </n-flex>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.icon{
    margin-left: 20px;
    margin-right: 440px;
}

</style>
