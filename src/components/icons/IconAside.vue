<script>
export default {
    name: "IconAside",
    functional: true,
    render: function(createElement) {
        return createElement("g", [
            createElement("path", { attrs: {
                d: "m8.5 2c-3.6 0-6.5 2.9-6.5 6.5v31c0 3.6 2.9 6.5 6.5 6.5h31c3.6 0 6.5-2.9 6.5-6.5v-31c0-3.6-2.9-6.5-6.5-6.5zm0 3.1h31c1.9 0 3.5 1.5 3.5 3.5v31c0 1.9-1.5 3.5-3.5 3.5h-31c-1.9 0-3.5-1.5-3.5-3.5v-31c0-1.9 1.5-3.5 3.5-3.5z"
            }}),
            createElement("rect", { attrs: {
                x:"24",
                y:"8",
                width:"16",
                height:"32"
            }})
        ])
    }
}
</script>