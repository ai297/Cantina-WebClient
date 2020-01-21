<template>
    <div id="mainPage">
        <header>
            <div id="header"><img src="../assets/chubb-chubbs.jpg" alt="Какая-то симпотичная картинка в тему"></div>
            <h1>Добро пожаловать в Катину.</h1>
            <p>Скройся от суеты на перекрётске миров.</p>
        </header>

        <main>
            <div id="profileSection">
                <h3>user@gmail.com</h3>
                <p>какие-нибудь настройки профиля</p>
            </div>
            <div id="donatSection">
                <p>Поддержи проект.</p>
            </div>
            <div id="enterSection">
                <div>
                    <p>Сейчас в чате <strong>0</strong> человек</p>
                    <a href="#" @click.prevent="false">Войти</a>
                </div>
            </div>
            <div class="module" id="newsSection">
                <p>Какие-нибудь свежие новости</p>
            </div>
            <div class="module" id="noticeSection">
                <p>Доска объявлений</p>
            </div>
            <div class="module">
                <p>Какой-то ещё модуль</p>
            </div>
        </main>
        <footer>
            <div>
                <p>Список контактов, разработчиков, всякая информация мелким шрифтом</p>
            </div>
        </footer>
    </div>
</template>

<script>
export default {
    name: "MainPage",
    data: function(){
        return {
        }
    }
}
</script>

<style lang="less">
    @import "../less/vars.less";
    div#mainPage {
        width: 100%;
        max-width: 1170px;
        min-height: 100vh;
        padding: 0 20px;
        background-color: @content-background-color;
        display: grid;
        grid-template-rows: auto 1fr auto;
        header {
            text-align: center;
            width: 100%;
            margin-bottom: @header1-size;
            display: block;
            p {
                font-style: italic;
                font-weight: bold;
                color: @red;
            }
        }
        main {
            width: 100%;
            height: auto;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-gap: 10px;
            div {
                text-align: center;
            }
            div#profileSection {
                align-self: start;
                grid-column: 1;
                grid-row: 1;
            }
            div#donatSection {
                align-self: start;
                grid-column: 3;
                grid-row: 1;
            }
            div#enterSection {
                width: 100%;
                height: 100%;
                color: @red;
                grid-column: 2;
                grid-row-start: 1;
                grid-row-end: 1;
                display: flex;
                align-items: center;
                align-content: center;
                justify-content: center;
                a {
                    color: @gold;
                    font-weight: bold;
                    text-decoration: none;
                    display: inline-block;
                    padding: 5px 15px;
                    margin: round(@base-fontsize * 0.4);
                    &:hover {
                        color:@blue;
                    }
                }
            }
            .module {
                padding: 15px;
                background-color: midnightblue;
            }
        }
        footer {
            display: block;
            text-align: center;
            width: 100%;
            padding: 25px 0;
            p {
                font-size: @label-fontsize;
            }
        }
        h1 {
            color: @gold;
            font-family: @headers-font;
            font-size: @header1-size;
            text-shadow: 2px 2px 3px #000;
        }
        h3 {
            font-size: @header3-size;
            color: @blue;
            margin-bottom: round(@header3-size * 0.6);
        }
    }
    div#header {
        width: 100%;
        height: 400px;
        overflow: hidden;
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        margin-bottom: round(@header1-size * 0.6);
        img {
            display: block;
            width: 100%;
            height: auto;
        }
    }
</style>