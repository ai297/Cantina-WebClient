<script>
export default {
    name: "Smile",
    functional: true,
    render: function(createElement, ctx) {
        let filename = ctx.children[0].text;
        return createElement('img', 
        {
            attrs: { 
                src: '/smiles/' + filename + ".gif",
                class: 'smile',
                alt: 'smile: ' + filename
            },
            
            on: ctx.listeners,
        });
    }
}
</script>