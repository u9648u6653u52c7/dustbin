import React from "react";
import { _transform } from "./utils";

export default function (props) {
    const {
        children,
        activeKey
    } = props;

    let i;
    const panel = children.map((child, index) => {
        const { key } = child;
        const active = key === activeKey;
        const newChild = React.cloneElement(child, { active });
        if (active) { i = index; }
        return (<div key={key}
            className={"panel " + (active ? "active" : "inactive")}>
            {newChild}
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