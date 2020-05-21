import React from "react";

/**
 * @class TabPanel
 * @extends {React.Component}
 * @description
 * <TabPanel tab={String|ReactNode} key={String} forceRender={Boolean}>
 *    {any}
 * </TabPanel>
 */
export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            active,
            forceRender,
            children
        } = this.props;

        this.actived = this.actived || active;
        const shouldRender = this.actived || forceRender;

        return (
            shouldRender ? children : null
        );
    }
}