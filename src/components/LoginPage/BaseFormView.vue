<template functional>
    <div id="loginPageForm">
        <div class="k-border"><kotor-border turned /></div>
        <div id="formContentWrapper">
            <slot></slot>
        </div>
        <div class="k-border"><kotor-border /></div>
    </div>
</template>

<style lang="less">
    @import "../../less/vars.less";

    #loginPageForm {
        display: block;
        width: 100%;
        max-width: 24rem;
        min-width: 15rem;
        text-align: center;
        .k-border {
            color: mix(@blue, rgba(0,0,0,0), 70%);
            margin-top: .2em;
        }
        #formContentWrapper {
            overflow: hidden;
            form {
                display: block;
                margin: 0 .4rem;
                padding: .5rem;
                background-color: mix(@dark-grey, rgba(0,0,0,0), 50%);
                border-radius: .5rem;
                & > div {
                    display: inline-block;
                    width: 70%;
                }
                div > a {
                    font-family: @label-font;
                    font-size: @label-fontsize;
                    color: @blue;
                    &:hover {
                        color: @gold;
                    }
                }
                h3 {
                    margin-top: 0;
                }
                & > div:not(:first-child):before {
                    display: block;
                    height: @base-padding;
                    content: '';
                }
                p {
                    padding: @base-padding 0;
                }
                .errorMessage {
                    font-weight: bold;
                    color: @red;
                }
                .label {
                    font-size: @label-fontsize;
                    line-height: 1em;
                    color: @blue;
                }
            }
        }
        &.enterForm-anim-enter, &.enterForm-anim-leave-to {
            opacity: 0;
            #formContentWrapper form {
                margin-top: -100%;
            }
        }
        &.enterForm-anim-enter-active {
            transition: opacity 1.5s;
            #formContentWrapper form {
                transition: all 1.5s;
            }
        }
        &.enterForm-anim-leave-active {
            transition: opacity .8s;
            #formContentWrapper form {
                transition: all .6s;
            }
        }

        p {
            color: @gold;
        }
    }
</style>