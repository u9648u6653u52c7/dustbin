import React, {
    useState,
    useEffect,
    useRef
} from "react";

/**
 * @description
 * <TextFold 
 *     text={String} 
 *     textStyle={Object} 
 *     iconStyle={Object} 
 *     actionWrapStyle={Object}
 *     outerStyle={Object}
 *     innerStyle={Object}
 *     render={Function}
 * >
 *   {String}
 * </TextFold>
 */
export default function (props) {
    const { children } = props;
    const $outer = useRef(null);
    const $inner = useRef(null);
    const [flag, setFlag] = useState(true);
    const [shouldFold, setShouldFold] = useState(false);

    useEffect(() => {
        const outer = $outer.current;
        const inner = $inner.current;
        if (outer && inner
            && inner.scrollWidth > outer.offsetWidth) {
            setShouldFold(true);
        }
    });

    const actionWrapStyle = {
        float: "right",
        paddingLeft: 10,
        paddingRight: 10,
        ...props.actionWrapStyle
    };

    const iconStyle = {
        display: "inline-block",
        width: 0,
        height: 0,
        borderTop: "8px solid #111",
        borderLeft: "6px solid transparent",
        borderRight: "6px solid transparent",
        verticalAlign: "middle",
        marginLeft: 3,
        ...props.iconStyle
    };

    const textStyle = {
        ...props.textStyle
    };

    const elem = typeof props.render === "function"
        ? props.render()
        : <><span style={textStyle}>{props.text || "展开"}</span>
            <span style={iconStyle}></span></>;

    return (
        <div style={{
            overflow: "hidden",
            width: "100%",
            ...props.outerStyle
        }} ref={$outer}>
            {shouldFold
                ? <div style={actionWrapStyle}
                    onClick={() => {
                        setShouldFold(false);
                        setFlag(false);
                    }}>{elem}</div>
                : null}
            <div style={{
                overflow: "hidden",
                wordBreak: "break-all",
                textOverflow: "ellipsis",
                verticalAlign: "top",
                whiteSpace: flag ? "nowrap" : "initial",
                display: shouldFold ? "block" : "inline-block",
                ...props.innerStyle
            }} ref={$inner}>{children}</div>
        </div >
    );
}