import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

function isNumber(v) {
    return !isNaN(v) && typeof v === "number";
}

function isFuntion(v) {
    return typeof v === "function";
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

export default function (props) {
    const {
        rClsName,
        rStyle,
        fClsName,
        fStyle,
        offset,
        func,
        rElem,
        fElem,
        children
    } = props;

    const $wrap = useRef(null);
    const [status, setStatus] = useState(false);

    useEffect(() => {
        const { current: node } = $wrap;
        const ceiling = offset && isNumber(+offset) ? +offset : 0;
        const handle = () => {
            const rect = getElemBoundingClientRect(node);
            const ret = rect.top < ceiling && rect.bottom < ceiling ? true : false;
            if (isFuntion(func)) { func(ret); }
            setStatus(ret);
        }

        handle();
        window.addEventListener("scroll", handle);
        window.addEventListener("resize", handle);
        return () => {
            window.removeEventListener("scroll", handle);
            window.removeEventListener("resize", handle);
        };
    }, [offset, func]);

    const stl = {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0
    };
    if (!status) { stl.display = "none"; }

    return (<>
        <div ref={$wrap}
            className={rClsName}
            style={{ ...rStyle }}>
            {rElem ? rElem : children}
        </div>
        {ReactDOM.createPortal(<div
            className={fClsName}
            style={{ ...stl, ...fStyle }}>
            {fElem ? fElem : children}
        </div>, document.body)}
    </>);
}
