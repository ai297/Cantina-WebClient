<template>
    <div class="cmd-console" ref="adminConsole">
        <div class="cmd-console__wrapper">
            <div class="output" >
                <pre v-for="(line, index) in output" :key="index" :class="line.style">{{line.data}}</pre>
            </div>
            <div class="input"><input type="text" ref="consoleInput" v-model.trim="input" @keypress.enter.prevent="send" @keydown.up="getLast" /></div>
        </div>
    </div>
</template>

<script>
function ConsoleLine(data, style = 'response') {
    this.data = data;
    this.style = style;
}

export default {
    name: "AdminConsole",
    data: function() {
        return {
            output: [],
            input: '',
            history: [],
        }
    },
    methods: {
        focus: function() {
            this.$refs['consoleInput'].focus();
        },
        getLast: function() {
            this.input = this.history.pop();
        },
        send: function() {
            if(!this.input.length) return;

            switch(this.input.trim().toLowerCase()) {
                case "clear":
                    this.output.splice(0,this.output.length);
                    this.input='';
                    return;
            }

            this.output.push(new ConsoleLine(this.input, 'request'));
            let words = this.input.match(/^(\w+)\s+([^{\s]+)\s?({.+})?$/i);
            this.history.push(this.input);
            this.input='';
            if(!words) return;
            
            let methods = ["get", "post", "patch", "delete"];
            
            if(words[1] === undefined || methods.indexOf(words[1].toLowerCase()) < 0) {
                this.output.push(new ConsoleLine("Неизвестный запрос", "error"));
                return;
            }
            
            if(words[2] === undefined || words[2].length < 3) {
                this.output.push(new ConsoleLine("Не указан путь запроса", "error"));
                return;
            }
            
            let dt = {};
            if(words[3] !== undefined) try {
                dt = JSON.parse(words[3]);
            } catch {
               this.output.push(new ConsoleLine("Не удалось распознать JSON", "error"));
                return; 
            }

            this.input = '...';
            this.$http({
                method: words[1],
                url: words[2],
                data: dt,
            }).then(response => {
                this.output.push(new ConsoleLine('> ' + JSON.stringify(response.data, null, 4), "response"));
            })
            .catch(error => {
                if(error.response !== undefined) {
                    this.output.push(new ConsoleLine(error.response.status + ": " + JSON.stringify(error.response.data, null, 4), "error"));
                } else this.output.push(new ConsoleLine(error, "error"));
            })
            .finally(() => {
                this.input = '';
                this.focus();
            });
        },
    },
    mounted: function() {
        this.focus();
    },
    updated: function() {
        this.$refs['adminConsole'].scrollTop = this.$refs['adminConsole'].scrollHeight - this.$refs['adminConsole'].clientHeight;
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";
    div.cmd-console {
        justify-content: center;
        align-items: center;
        overflow-y: scroll !important;
        overflow-x: hidden;
        .cmd-console__wrapper {
            width: 100%;
            max-width: 60rem;
            & > .output {
                color: @blue;
                & > pre {
                    margin-bottom: @base-padding;
                    word-break: break-all;
                    &.request {
                        color: @green;
                    }
                    &.response {
                        color: @blue;
                    }
                    &.error {
                        color: @red;
                    }
                    &::before {
                        content: '>';
                        display: inline-block;
                        color: inherit;
                        padding-right: @base-padding;
                    }
                }
            }
            & > .input {
                color: @green;
                display: flex;
                font-size: 1rem;
                & > input {
                    border: none;
                    background: none;
                    display: block;
                    font-size: 1rem;
                    padding-left: @base-padding;
                    width: 100%;
                    color: inherit;
                }
                &::before {
                    content: '>';
                    display: inline-block;
                }
            }
        }
    }
</style>