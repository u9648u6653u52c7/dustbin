import React from "react";
import ReactDOM from "react-dom";
import Align from "./align";

class Dialog extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { options } = this.props;
        if (options && typeof options.duration === "number") {
            window.setTimeout(() => {
                this.close();
            }, options.duration);
        }
    }

    close() {
        const { options, destory } = this.props;
        if (options && typeof options.onClose === "function") {
            options.onClose();
        }
        destory();
    }

    render() {
        const {
            options,
            children,
        } = this.props;

        const opts = options || {};

        let style = {};

        if (opts.mask) {
            style.backgroundColor = "rgba(0,0,0,.6)";
        }

        if (opts.style) {
            style = { ...style, ...opts.style };
        }

        const elem = React.isValidElement(children)
            ? React.cloneElement(children, {
                closeDialog: () => {
                    this.close();
                }
            }) : children;

        return ReactDOM.createPortal(<Align style={style}
            position={opts.position}
            onClick={options && options.maskClosable
                ? () => this.close() : null}
        >{elem}</Align>, document.body);
    }
}

export default {
    popup(content, options) {
        const div = document.createElement("div");
        document.body.appendChild(div);

        function destory() {
            ReactDOM.unmountComponentAtNode(div);
            if (div.parentNode) {
                div.parentNode.removeChild(div);
            }
        }

        return ReactDOM.render(
            <Dialog options={{ ...options }} destory={destory}>
                {content}
            </Dialog>, div);
    }
};