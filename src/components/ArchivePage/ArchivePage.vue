<template>
    <div class="archive-page">
        <h3>Архив сообщений за {{date}}</h3>
    </div>
</template>

<script>
export default {
    name: "ArchivePage",
    props: {
        date: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";
    .archive-page {
        width: 100%;
        max-width: 40rem;
        background-color: @body-background-color;
        overflow-y: scroll;
        overflow-x: hidden;
    }
</style>