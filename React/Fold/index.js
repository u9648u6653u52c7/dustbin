import { isArray, isFunction } from "./type";
import React, { useState, useMemo } from "react";

export default function Fold(props) {
    const {
        triggerElem,
        rtriggerElem,
        initialNum = 3,
        wrapElem,
        children
    } = props;

    const arr = React.Children.toArray(children);
    const maxNum = arr.length;
    const [num, setNum] = useState(initialNum);
    // 点击事件
    const getNewElem = (el, n) => (React.isValidElement(el)
        ? React.cloneElement(el, {
            onClick: evt => {
                const { props: { onClick } } = el;
                isFunction(onClick) && onClick(evt);
                setNum(n);
            }
        }) : null);
    // 正向触发组件
    const tElem = useMemo(
        () => getNewElem(triggerElem, maxNum),
        [triggerElem]
    );
    // 反向触发组件
    const rtElem = useMemo(
        () => getNewElem(rtriggerElem, initialNum),
        [rtriggerElem]
    );

    const elems = (() => {
        if (maxNum > 0 && initialNum < maxNum) {
            let el = arr.slice(0, num);
            el = React.isValidElement(wrapElem)
                ? React.cloneElement(wrapElem, { children: el })
                : el;
            return <React.Fragment>
                {el} {maxNum > num ? tElem : rtElem}
            </React.Fragment>;
        } else {
            return React.isValidElement(wrapElem)
                ? React.cloneElement(wrapElem, { children })
                : children;
        }
    })();

    return elems;
}
