import React from "react";

export default function (props) {
    const {
        position,
        style,
        onClick,
        children
    } = props;

    const styleA = {
        position: "fixed",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        margin: "auto",
        textAlign: "center",
        ...style
    };

    const styleB = {
        display: "inline-block",
        width: 0,
        height: "100%",
        verticalAlign: "middle"
    };

    const styleC = {
        width: "100%",
        display: "inline-block",
        verticalAlign: "middle"
    };

    if (typeof position === "string" && position.length > 0) {
        const arr = position.split("-");
        styleA.textAlign = ({
            left: "left",
            right: "right",
            center: "center",
        })[arr[0]];
        styleC.verticalAlign = ({
            top: "top",
            bottom: "bottom",
            center: "middle"
        })[arr[1]];
    }

    return (<div style={styleA}
        onClick={() => typeof onClick === "function" && onClick()}>
        <div style={styleB} />
        <div style={styleC}>{children}</div>
    </div>);
}