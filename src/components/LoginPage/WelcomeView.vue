<template>
    <div id="loginPageWelcome">
        <animated-logo class="logo" />
        <br>
        <flat-button @click="enterPress">ВОЙТИ</flat-button>
    </div>
</template>

<script>
import {ROUTING} from '../../constants.js';
export default {
    name: "LoginWelcome",
    methods: {
        enterPress: function(){
            this.$router.push(ROUTING.IN_PAGE);
        },
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";
    
    #loginPageWelcome {
        display: block;
        width: 100%;
        max-width: 24rem;
        min-width: 15rem;
        text-align: center;
        .logo {
            display: block;
            transition: all .5s;
            #logoTopBorder {
                transform-origin: 300px 0px;
                transition: all 1s;
            }
            #logoBottomBorder {
                transform-origin: 0px 0px;
                transition: all 1s .3s;
            }
            #logoTopText {
                transition: all .7s .3s;
            }
            #logoBottomText {
                transition: all .7s .7s;
            }
        }
        button {
            transition: opacity 1.5s 1s;
        }
        &.enterForm-anim-enter-active {
            .logo {
                animation: fadeInWithScale 1.5s ease-out forwards;
            }
            button {
                opacity: 0;
            }
        }
        &.enterForm-anim-leave-to {
            opacity: 0;
        }
        &.enterForm-anim-leave-active {
            transition: opacity .8s;
        }
        &.enterForm-anim-enter, &.enterForm-anim-leave-to,
        &.enterForm-anim-enter-active, &.enterForm-anim-leave-to {
            #logo-borders {
                #logoTopBorder, #logoBottomBorder {
                    transform: scale(0, 1);
                }
                #logoTopText, #logoBottomText {
                    opacity: 0;
                }
            }
        }
    }

    @keyframes fadeInWithScale {
        0% {
            opacity: 0;
            transform: scale(5);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
</style>