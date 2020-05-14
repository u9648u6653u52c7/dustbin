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
            children
        } = this.props

        return (
            children
        );
    }
}