<script>
export default {
    name: "IconScroll",
    functional: true,
    render: function(createComponent) {
        return createComponent("g", [
            createComponent("path", { attrs: {
                d: "m24 2c-12 0-22 9.9-22 22s9.9 22 22 22 22-9.9 22-22-9.9-22-22-22zm0 3.1c10 0 19 8.5 19 19s-8.5 19-19 19c-11 0-19-8.5-19-19s8.5-19 19-19z"
            }}),
            createComponent("path", { attrs: {
                d: "m15 29 9 12 9-12z"
            }}),
            createComponent("path", { attrs: {
                d: "m15 19h18l-9-12z"
            }}),
            createComponent("circle", { attrs: {
                cx: "24",
                cy: "24",
                r: "3"
            }})
        ])
    }
}
</script>