<script>
// const ALL_SMILES = {
//     "classic_qip": async () => {
//         const {QIP_STYLE_SMILES} = await import('./qip_style.js');
//         return QIP_STYLE_SMILES;
//     }
// }

// function timeout(t) {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             console.log('timer ok')
//             resolve();
//         }, t);
//     });
// }

const smileImage = () => new Promise(resolve => {
    import('./SmileImage.vue').then(result => {
        console.log(result);
        resolve(result);
    });
});

export default {
    name: "Smile",
    functional: true,
    render: function(createElement, ctx) {
        let match = ctx.children[0].text.match(/^([-_\w\d]+)\/([-_\w\d-]+)$/i);
        if(match !== null) {
            // let category = match[1];
            //let name = match[2];
            return createElement(smileImage, ctx.data);
        } else return createElement('span', { style: { "display": "none" }}, "Wrong smile format");
    }
}
</script>