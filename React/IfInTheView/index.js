import React from "react";

function isEmptyObject(obj) {
    var name;
    for (name in obj) { return false; }
    return true;
}

function getVisualViewportInfo() {
    if ("visualViewport" in window) {
        var vvp = window.visualViewport;
        return { width: vvp.width, height: vvp.height, scale: vvp.scale };
    }
    var root = document.documentElement;
    var hasTouchEvent = "ontouchstart" in root;
    var vw = hasTouchEvent ? window.screen.width : root.clientWidth;
    var width = hasTouchEvent ? window.innerWidth : root.clientWidth;
    var height = hasTouchEvent ? window.innerHeight : root.clientHeight;
    var scale = vw / width;
    return { width: width, height: height, scale: scale };
}

function getElemBoundingClientRect(node) {
    return "getBoundingClientRect" in node
        ? node.getBoundingClientRect() : {};
}

function inTheView(node) {
    var rect = getElemBoundingClientRect(node);
    var viewport = getVisualViewportInfo();

    if (isEmptyObject(rect)) {
        return true;
    }

    if (rect.top > viewport.height
        || rect.bottom < 0
        || rect.left > viewport.width
        || rect.right < 0) {
        return false;
    } else {
        return true;
    }
}

/**
 * @class IfInTheView
 * @extends {React.Component}
 * @description 
 * <IfInTheView
 *  attrs={{[key: string]: any}}
 *  useCapture={boolean}
 *  window={DOM}
 * />
 */
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = { inTheView: false };
        this.$ref = React.createRef();

        const win = this.props.window || window;
        const useCapture = this.props.useCapture || false;
        const obj = {
            bindEvent: "addEventListener",
            removeEvent: "removeEventListener"
        };

        for (const k in obj) {
            if (!obj.hasOwnProperty(k)) { continue; }
            this[k] = () => {
                if (obj[k] in win) {
                    const arr = ["scroll", "resize"];
                    for (let i = 0; i < arr.length; i++) {
                        win[obj[k]](arr[i], this.handler, useCapture);
                    }
                }
            };
        }
    }

    handler = () => {
        const node = this.$ref.current;
        if (node && inTheView(node)) {
            this.setState({ inTheView: true });
            this.removeEvent();
        }
    }

    componentDidMount() {
        this.handler();
        if (!this.state.inTheView) {
            this.bindEvent();
        }
    }

    componentWillUnmount() {
        this.removeEvent();
    }

    render() {
        const { children } = this.props;
        const { inTheView } = this.state;

        return (
            inTheView
                ? typeof children === "function"
                    ? children() : children
                : <div {...this.props.attrs} ref={this.$ref}></div>
        ) || null;
    }
}