<script>
import {STATUS} from '../../../constants.js';
export default {
    name: "UserStatus",
    functional: true,
    props: {
        status: {
            type: Number,
            default: 1,
        }
    },
    render: function(createElement, ctx) {
        let marker = [];
        if(ctx.props.status >= STATUS.ONLINE && ctx.props.status <= STATUS.NOT_AVAILABLE) {
            marker.push(createElement("circle", { attrs: {
                cx: 10,
                cy: 10,
                r: 5,
                "stroke-width": 2,
            }}));
        }
        let statusClass = "status-" + ctx.props.status;
        return createElement("svg", { 
            class: {
                "user-status": true,
                [statusClass]: true
            }, 
            attrs: {
                version: "1.1",
                viewBox: "0 0 20 20",
                xmlns: "http://www.w3.org/2000/svg",
            }
        }, marker)
    }
}
</script>
<style lang="less">
    @import "../../../less/vars.less";

    svg.user-status {
        &.status-1 {
            stroke: @green;
            fill: @dark-green;
        }
        &.status-2 {
            stroke: @grey;
            fill: mix(@grey, @dark-grey);
        }
        &.status-3 {
            stroke: @red;
            fill: @dark-red;
        }
    }
</style>