import "./style/index.scss";
import React from "react";
import IScroll from "./iscroll-lite";

/**
 * is
 * @param {any} type 期望的数据类型的值
 * @param {any} val  需要校验的值
 * @returns {Boolean}
 */
function is(type, val) {
    var toString = ({}).toString;
    return toString.call(type) === toString.call(val);
}

// This code copy from jQuery, I did a little modification.
function extend() {
    var options;
    var name;
    var src;
    var copy;
    var copyIsArray;
    var clone;
    var target = arguments[0] || {};
    var i = 1;
    var length = arguments.length;
    var deep = false;

    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;
        // Skip the boolean and the target
        target = arguments[i] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && typeof target !== 'function') {
        target = {};
    }

    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (deep && copy && (is({}, copy) || (copyIsArray = is([], copy)))) {

                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && is([], src) ? src : [];

                    } else {
                        clone = src && is({}, src) ? src : {};
                    }
                    // Never move original objects, clone them
                    target[name] = extend(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    // Return the modified object
    return target;
}

/**
 * @class Scroll
 * @extends {React.Component}
 * @description 
 * <Scroll
 *  outerAttrs={{[key: string]: any}}
 *  innerAttrs={{[key: string]: any}}
 *  options={{[key: string]: any}}
 *  enhance={Function}
 * />
 */
export default class Scroll extends React.Component {
    constructor(props) {
        super(props);
        this.$ref = React.createRef();
    }

    componentDidMount() {
        let {
            options = {},
            enhance = function () { }
        } = this.props;

        const scroll = this.scroll = new IScroll(
            this.$ref.current,
            extend({ click: true }, options)
        );

        if (typeof enhance === "function") {
            enhance(scroll, IScroll);
        }
    }

    componentDidUpdate() {
        if (this.scroll) {
            this.scroll.refresh();
        }
    }

    componentWillUnmount() {
        if (this.scroll) {
            this.scroll.destroy();
            this.scroll = null;
        }
    }

    render() {
        const {
            outerAttrs = {},
            innerAttrs = {}
        } = this.props;

        return (
            <div {...outerAttrs} ref={this.$ref}>
                <div {...innerAttrs}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

/**
 * HorScrollNavTo
 * @extends {React.Component}
 * @description 
 * <HorScrollNavTo
 *  outerAttrs={{[key: string]: any}}
 *  innerAttrs={{[key: string]: any}}
 *  options={{[key: string]: any}}
 *  offset={Number}
 *  func={Function}
 * />
 */
export function HorScrollNavTo(props) {
    const outerAttrs = extend({
        className: "iscroll"
    }, props.outerAttrs);

    const innerAttrs = extend({
        className: "iscroll-inner"
    }, props.innerAttrs);

    const options = extend({
        scrollX: true,
        scrollY: false,
        click: true,
        bindToWrapper: true,
        eventPassthrough: true,
        useTransition: false,
    }, props.options);

    const $ref = React.createRef(),
        offset = props.offset || 30,
        func = props.func;

    function enhance(scroll, IScroll) {
        const $more = $ref.current || {};

        scroll._move = function (e) {
            IScroll.prototype._move.call(this, e);
            const { startX, maxScrollX } = this;
            if ((maxScrollX - startX) > offset) {
                IScroll.utils.addClass($more, "reverse");
            } else {
                IScroll.utils.removeClass($more, "reverse");
            }
        };

        const ease = scroll.options.bounceEasing;
        scroll._end = function (e) {
            const { startX, maxScrollX } = this;
            if ((maxScrollX - startX) > offset) {
                this.options.bounceEasing = IScroll.utils.ease.elastic
            } else {
                this.options.bounceEasing = ease;
            }
            IScroll.prototype._end.call(this, e);
        };

        scroll.on("scrollEnd", function () {
            const { startX, maxScrollX } = this;
            if ((maxScrollX - startX) > offset) {
                IScroll.utils.removeClass($more, "reverse");
                typeof func === "function" && func();
            }
        });
    }

    return (
        <Scroll
            outerAttrs={outerAttrs}
            innerAttrs={innerAttrs}
            options={options}
            enhance={enhance}>
            {props.children}
            <div className="view-more" ref={$ref}></div>
        </Scroll>
    );
}
