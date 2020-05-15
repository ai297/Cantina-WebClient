<script>
export default {
    name: 'SmileImage',
    functional: true,
    props: {
        data: {
            type: String,
            default: 'R0lGODlhDwAPALMKAP+SVdvb///bqv9tVduSqv////+SqtsAALYAAP8AAP///wAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAKACwAAAAADwAPAAAEQFDJSatMZqRpkp+YEACbIRDeFgadd7QekgBjah+xB9spgvPAxAGhCPKIRWPsADL6KsGnRZYaWiYyH/Iq0XK/lAgAIfkEBQoACgAsAAAAAA8ADwAABDdQyUmrvbOkkdI0nSclRgB6QACEUrqGZHJ049nNMDLCfKfvvRslGPpNiMYhL1nJYY4HJkb6vEQAACH5BAkeAAoALAAAAQAPAA0AAAQ3UKlkRpLKpI2pCMBlCIR0edh0aBhypV3qwhN9vHR6IHVu8j2f4hDzEVM4XQ4o2Ql5CKdQEWViIgAh+QQFFAAKACwAAAAADwAPAAAENVDJSau9NI2UpuGdlBjB1wEBAEqoCo7JwYkmJ7+I+O5crvO2DLBXGfqKu6MFh5nElE1oExMBADs='
        },
    },
    render: function(createElement, ctx) {
        return createElement('img', { 
            attrs: {
                ...ctx.data.attrs,
                src: 'data:image/gif;base64,' + ctx.props.data
            },
            staticClass: ctx.data.staticClass !== undefined ? 'smile ' + ctx.data.staticClass : 'smile',
            on: { ...ctx.listeners }
        });
    }
}
</script>