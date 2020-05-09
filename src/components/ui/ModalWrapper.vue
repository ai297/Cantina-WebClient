<template functional>
    <div class="modal-wrapper">
        <component :is="props.component" />
    </div>
</template>

<script>
export default {
    name: "ModalWrapper",
    props: {
        component: {
            default: "div"
        }
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";
    
    div.modal-wrapper {
        display: flex;
        position: fixed;
        top: 0; left: 0;
        z-index: 1000;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: rgba(0,0,0,.5);
    }
</style>