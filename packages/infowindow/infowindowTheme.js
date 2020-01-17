import Vue from 'vue' //组件渲染会报错，webpack这样引用不会报错
/*cue-cli 如此引用
也可以在 vue.config.js配置
configureWebpack: {
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    }
*/
// import Vue from 'vue/dist/vue.esm.js' 
export function vueFormatHtml(htmlTemplate) {
    let vm = Vue.extend({
        name:'asdas',
        template: htmlTemplate,
        data() {
            return {}
        },
        watch: {},
        beforeDestroy() {},
        mounted() {},
        methods: {}
    });
    let component = new vm().$mount();
    return component.$el;
}
export function getInfowindowThemeHtml(theme, data, textField, title, closeBtnId) {
    let themeData = {
        default: data[textField],
        simpleWhite: vueFormatHtml(getSimpleWhiteHtml(data, textField, closeBtnId)),
        simpleDark: vueFormatHtml(getSimpleDarkHtml(data, textField, closeBtnId)),
        largerWhite: vueFormatHtml(getLargerWhiteHtml(data, textField, title, closeBtnId)),
        largerDark: vueFormatHtml(getLargerDarkHtml(data, textField, title, closeBtnId)),
    }
    return themeData[theme]
}

function getSimpleWhiteHtml(data, textField, closeBtnId) {
    let text = data[textField];
    let html = `
        <div class="poi_tip">  
            <div class="poi_name" title="${text}">${text}</div>
            <div class="poi_tip_foot"></div>
            <div id="${closeBtnId}" class="_closeBtn">×</div>
        </div>
        `;
    return html;
}

function getSimpleDarkHtml(data, textField, closeBtnId) {
    let text = data[textField];
    let html = `
        <div class="poi_tip" style="background: rgba(0,0,0,0.8);color:#fff">  
            <div class="poi_name" style="color:#fff" title="${text}">${text}</div>
            <div class="poi_tip_foot" style="border-right: 8px solid rgba(0, 0, 0, 1) !important"></div>
            <div id="${closeBtnId}" class="_closeBtn" style="color:#fff">×</div>
        </div>
        `;
    return html;
}

function getLargerWhiteHtml() { 
    let html = `
        <div class="poi_large_theme">
        
        </div>
    `;
    return html
}
function getLargerDarkHtml() { }