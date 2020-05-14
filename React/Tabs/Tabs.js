import React from "react";
import TabPanel from "./TabPanel";
import TabBar from "./TabBar";
import TabContent from "./TabContent";

function filterChildren(props) {
    const arr = [];
    React.Children.forEach(props.children, child => {
        if (child && child.type === TabPanel) {
            arr.push(child);
        }
    });
    return arr;
}

function getDefaultActiveKey(props) {
    let activeKey;
    React.Children.forEach(props.children, child => {
        if (child && !activeKey && !child.props.disabled) {
            activeKey = child.key;
        }
    });
    return activeKey;
}

function activeKeyIsValid(props, key) {
    const keys = React.Children.map(props.children, child => child && child.key);
    return keys.indexOf(key) >= 0;
}

/**
 * @class Tabs
 * @extends {React.Component}
 * @description
 * <Tabs
 *    defaultActiveKey={String}
 *    activeKey={String}
 *    pageSize={Number}
 *    useIndicator={Boolean}
 *    renderTabIndicator={ReactNode|Function(activeKey) {}}
 *    onChange={Function(activeKey) {}} >
 *    <TabPanel tab={String|ReactNode} key={String} forceRender={Boolean}>
 *        {any}
 *    </TabPanel>
 * </Tabs>
 */
export default class extends React.Component {
    constructor(props) {
        super(props);

        let activeKey;
        if ("activeKey" in props) {
            activeKey = props.activeKey;
        } else if ("defaultActiveKey" in props) {
            activeKey = props.defaultActiveKey;
        } else {
            activeKey = getDefaultActiveKey(props);
        }

        this.state = {
            activeKey
        }
    }

    static getDerivedStateFromProps(props, state) {
        const newState = {};
        if ("activeKey" in props) {
            newState.activeKey = props.activeKey;
        } else if (!activeKeyIsValid(props, state.activeKey)) {
            newState.activeKey = getDefaultActiveKey(props);
        }
        if (Object.keys(newState).length > 0) {
            return newState;
        }
        return null;
    }

    setActiveKey = activeKey => {
        if (this.state.activeKey !== activeKey) {
            if (!("activeKey" in this.props)) {
                this.setState({
                    activeKey,
                });
            }
            typeof this.props.onChange === "function"
                && this.props.onChange(activeKey);
        }
    };

    onTabClick = (activeKey, e) => {
        if (this.tabBar.props.onTabClick) {
            this.tabBar.props.onTabClick(activeKey, e);
        }
        this.setActiveKey(activeKey);
    };

    render() {
        const children = filterChildren(this.props);

        if (children.length === 0) {
            return null;
        }

        const {
            pageSize,
            useIndicator,
            renderTabIndicator
        } = this.props;

        const {
            activeKey
        } = this.state;

        this.tabBar = <TabBar />

        const tabBar = React.cloneElement(this.tabBar, {
            panels: children,
            pageSize,
            useIndicator,
            renderTabIndicator,
            activeKey,
            onTabClick: this.onTabClick,
        });

        const tabContent = React.cloneElement(<TabContent />, {
            children: children,
            activeKey,
        });

        return (
            <div className="tabs">
                {tabBar}{tabContent}
            </div>
        );
    }
}