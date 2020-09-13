import "./style/index.scss";
import React, { useState } from "react";

export default function (props) {
    const {
        children,
        className,
        style,
        pageSize = 3,
        text = "查看更多"
    } = props;
    const [num, setNum] = useState(pageSize);
    const size = React.Children.count(children);
    const arr = React.Children.toArray(children);

    let clsName = "view-more";
    if (typeof className === "string") {
        clsName += " " + className;
    }

    const elem = <div className={clsName}
        style={{ ...style }}
        onClick={() => setNum(size)}>
        <span className="va-m">
            <em className="va-m">{text}</em>
        </span>
    </div>;

    return (size > 0 ? <>
        {arr.slice(0, num)}
        {size > num ? elem : null}
    </> : null);
}