import React from "react";
import IScroll from "../IScroll/index";
import { _transform } from "./utils";

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.scroll = React.createRef();
    }

    moveScroller() {
        const obj = this.scroll.current;
        const iscroll = obj && obj.scroll;
        if (!iscroll) { return; }
        const { pageSize } = this.props;
        const min = 0;
        const max = iscroll.maxScrollX;
        let d = (iscroll.wrapperWidth * (this.i - 0.5 * pageSize + 0.5)) / pageSize * -1;
        if (d >= min) { d = min; }
        if (d <= max) { d = max; }
        iscroll.scrollTo(d, 0, 300);
    }

    componentDidMount() {
        this.moveScroller();
    }

    componentDidUpdate() {
        this.moveScroller();
    }

    componentWillUnmount() {
        this.scroll = null;
    }

    render() {
        const {
            pageSize,
            useIndicator,
            renderTabIndicator,
            panels,
            activeKey,
            onTabClick,
        } = this.props;

        const amountOfTab = panels.length;
        const hasScroll = pageSize && pageSize < amountOfTab ? true : false;

        let size, scrollSize;
        if (hasScroll) {
            size = 100 / amountOfTab + "%";
            scrollSize = (100 / pageSize) * amountOfTab + "%";
        } else {
            size = (pageSize > 0 ? 100 / pageSize : 100 / amountOfTab) + "%";
        }

        let i;
        const tab = panels.map((child, index) => {
            const { key, props } = child;
            if (key === activeKey) { i = this.i = index; }
            return (<div key={key}
                className={"tab" + (activeKey === key ? " active" : "")}
                style={{ width: size }}
                onClick={evt => onTabClick(key, evt)}>
                {typeof props.tab === "string"
                    ? <div className="tab__text">{props.tab}</div>
                    : props.tab}
            </div>);
        });

        if (useIndicator) {
            tab.push(<div key="tab-indicator"
                className="tab-indicator"
                style={{ width: size, [_transform]: `translate(${i * 100}%)` }}>
                {renderTabIndicator
                    ? typeof renderTabIndicator === "function"
                        ? renderTabIndicator(activeKey)
                        : renderTabIndicator
                    : <div className="tab-indicator-bar" />}
            </div>);
        }

        return (
            <div className="tabs-bar">
                <div className="tabs-bar-inner-wrap">
                    {hasScroll ? <IScroll ref={this.scroll}
                        outerAttrs={{ className: "tabs-bar-iscroll" }}
                        innerAttrs={{
                            className: "tabs-bar-iscroll-inner",
                            style: { width: scrollSize }
                        }}
                        options={{
                            scrollX: true,
                            scrollY: false,
                            click: true,
                            bindToWrapper: true,
                            eventPassthrough: true,
                        }}
                    >{tab}</IScroll> : tab}
                </div>
            </div>
        );
    }
}