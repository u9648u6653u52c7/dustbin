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
    if (!node
        || node.nodeType != node.ELEMENT_NODE
        || typeof node.getBoundingClientRect !== "function") {
        return {};
    } else {
        return node.getBoundingClientRect();
    }
}

export function inTheView(node, options) {
    var viewport = getVisualViewportInfo();
    var rect = getElemBoundingClientRect(node);

    if (isEmptyObject(rect)) {
        return true;
    }

    options = options || {};

    var offsetLeft = typeof options.offsetLeft === "number"
        ? options.offsetLeft : 0;
    var offsetTop = typeof options.offsetTop === "number"
        ? options.offsetTop : 0;
    var offsetRight = typeof options.offsetRight === "number"
        ? options.offsetRight : 0;
    var offsetBottom = typeof options.offsetBottom === "number"
        ? options.offsetBottom : 0;

    if (rect.top > viewport.height - offsetBottom
        || rect.bottom < 0 + offsetTop
        || rect.left > viewport.width - offsetRight
        || rect.right < 0 + offsetLeft) {
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
 *  placeholder={ReactNode}
 *  removeSentry={Boolean}
 *  options={Object}
 *  useCapture={boolean}
 *  window={DOM}
 * />
 */
export default class extends React.PureComponent {
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
                    const arr = ["scroll", "resize", "DOMNodeRemoved"];
                    for (let i = 0; i < arr.length; i++) {
                        win[obj[k]](arr[i], this.handler, useCapture);
                    }
                }
            };
        }
    }

    handler = () => {
        const node = this.$ref.current;
        const { options } = this.props;
        if (node && inTheView(node, options)) {
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
        const { inTheView } = this.state;
        const {
            children,
            placeholder,
            removeSentry = true
        } = this.props;

        if (!removeSentry) {
            return (
                <div {...this.props.attrs} ref={this.$ref}>
                    {inTheView
                        ? typeof children === "function"
                            ? children() : children
                        : placeholder || null}
                </div>
            );
        }

        return (
            inTheView
                ? typeof children === "function"
                    ? children() : children
                : <div {...this.props.attrs} ref={this.$ref}>
                    {placeholder}
                </div>
        ) || null;
    }
}