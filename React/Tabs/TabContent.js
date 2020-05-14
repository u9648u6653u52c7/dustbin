import React from "react";
import { _transform } from "./utils";

export default function (props) {
    const {
        children,
        activeKey
    } = props;

    let i;
    const panel = children.map((child, index) => {
        const { props, key } = child;
        if (key === activeKey) { i = index; }
        return (<div key={key}
            className="panel">
            {props.children}
        </div>);
    });

    return (
        <div className="tabs-content">
            <div className="tabs-content-inner-wrap"
                style={{
                    [_transform]: `translate(${i * -100}%)`
                }}>{panel}</div>
        </div>
    );
}