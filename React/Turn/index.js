import "./style/index.scss";
import React, { useState, useEffect } from "react";

function varType(v, t) {
    const toString = ({}).toString;
    return toString.call(v)
        === toString.call(t);
}

function isArray(v) {
    return varType(v, []);
}

export default function (props) {
    const {
        className,
        style,
        data,
        loop = true,
        delay = 3e3,
        direction = "up",
        children
    } = props;

    let clsName = direction == "left" || direction == "right"
        ? "turn turn--hr" : "turn";
    if (typeof className === "string") {
        clsName += " " + className;
    }

    const child = React.Children.toArray(children);
    const arr = isArray(data) ? data : child.length ? child : [];
    const [currIndex, setCurrIndex] = useState(-1);
    const nextIndex = currIndex >= (arr.length - 1) && loop ? 0 : currIndex + 1;
    const currElem = arr[currIndex];
    const nextElem = arr[nextIndex];
    // 两个元素都存在时才做动画
    const hasBoth = currElem && nextElem;

    const elems = ({
        "up": [
            currElem ? <div key={currIndex} className={`turn-item ${hasBoth ? "h2zero" : ""}`}>{currElem}</div> : null,
            nextElem ? <div key={nextIndex} className="turn-item">{nextElem}</div> : null
        ],
        "down": [
            nextElem ? <div key={nextIndex} className={`turn-item ${hasBoth ? "h2hundred" : ""}`}>{nextElem}</div> : null,
            currElem ? <div key={currIndex} className="turn-item">{currElem}</div> : null
        ],
        "left": [
            currElem ? <div key={currIndex} className={`turn-item ${hasBoth ? "w2zero" : ""}`}>{currElem}</div> : null,
            nextElem ? <div key={nextIndex} className="turn-item">{nextElem}</div> : null
        ],
        "right": [
            nextElem ? <div key={nextIndex} className={`turn-item ${hasBoth ? "w2hundred" : ""}`}>{nextElem}</div> : null,
            currElem ? <div key={currIndex} className="turn-item">{currElem}</div> : null
        ]
    })[direction || "up"] || [];

    useEffect(() => {
        const len = arr.length;
        if (len <= 1) { return; }

        const timer = setTimeout(() => {
            if (currIndex == (len - 1)) {
                if (loop) { setCurrIndex(0); }
            } else {
                setCurrIndex((i) => i + 1);
            }
        }, delay);

        return () => clearTimeout(timer)
    }, [arr, currIndex]);

    return (<div
        className={clsName}
        style={{ ...style }}>
        {elems}
    </div>);
}
