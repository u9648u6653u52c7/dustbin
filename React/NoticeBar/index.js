import './index.less'
import React, { useState, useEffect, useRef } from 'react'

/**
 * getClsName 元素类名拼接
 * @returns {String}
 */
function getClsName() {
    const args = [].slice
        .apply(arguments)
        .filter(el => el && typeof el == 'string')
    return args.join(' ')
}

const hornIcon = <span className="iconfont yhicon-horn" />;
const closeIcon = <span className="iconfont yhicon-close" />;
const arrowRightIcon = <span className="iconfont yhicon-arrow-right" />;

export default function (props) {
    const {
        className,
        content,
        children,
        direction,
        fps,
        icon,
        mode,
        action,
        onClick,
    } = props;

    const text = content || children;
    if (!(text && typeof text === "string")) {
        return null;
    }

    const _fps = typeof fps === "number" ? fps : 1000 / 40;
    const position = direction == "vertical" ? direction : "horizontal";
    const [show, setShow] = useState(true);
    const [flag, setFlag] = useState(false);
    const [duration, setDuration] = useState("");
    const $text = useRef();
    const $inner = useRef();

    useEffect(() => {
        const textElem = $text.current;
        const innerElem = $inner.current;
        if (!(innerElem && textElem)) { return; }
        const textElemArea = textElem.offsetWidth * textElem.offsetHeight;
        const innerElemArea = innerElem.offsetWidth * innerElem.offsetHeight;
        const isOverflow = textElemArea > innerElemArea;
        if (!isOverflow) { return; }
        // 计算动画的animationDuration时间
        function calcDuration() {
            const duration = Math.ceil(position == "vertical"
                ? textElem.offsetHeight * _fps
                : (textElemArea / innerElem.offsetHeight) * _fps
            ) + "ms";
            setDuration(duration);
        }
        setFlag(true);
        calcDuration();
        window.addEventListener("resize", calcDuration);
        return () => window.removeEventListener("resize", calcDuration);
    }, []);

    const style = {};
    if (flag && duration) {
        style.animationDuration = duration;
    }

    const actionElem = (mode => {
        if (mode == "closable") {
            return <div className="notice-bar__right" onClick={() => {
                if (typeof onClick === "function") { onClick(); }
                setShow(false);
            }}>{action || closeIcon}</div>;
        }

        if (mode == "link") {
            return <div className="notice-bar__right" onClick={() => {
                if (typeof onClick === "function") { onClick(); }
            }}>{action || arrowRightIcon}</div>;
        }

        return null;
    })(mode);

    return show ? <div className={getClsName("notice-bar", className)}>
        <div className="notice-bar__left">{icon || hornIcon}</div>
        {actionElem}
        <div className="notice-bar__content">
            <div className="notice-bar__inner" ref={$inner}>
                <div className={getClsName("notice-bar__text", flag ? position : "")} style={style} ref={$text}>
                    {text}{flag && position == "vertical" ? <br /> : null}{flag ? text : null}
                </div>
            </div>
        </div>
    </div> : null;
}
