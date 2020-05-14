export function is(type, val) {
    var toString = ({}).toString;
    return toString.call(type)
        === toString.call(val);
}

export function isArray(val) {
    return is([], val);
}

export function isObject(val) {
    return is({}, val);
}

export function isEmptyObject(obj) {
    var name;
    for (name in obj) { return false; }
    return true;
}

export function extend() {
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

const _vendor = (function () {
    const _elementStyle = document.createElement('div').style;
    var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
        transform,
        i = 0,
        l = vendors.length;

    for (; i < l; i++) {
        transform = vendors[i] + 'ransform';
        if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
    }

    return false;
})();

export function prefixStyle(style) {
    if (_vendor === false) return false;
    if (_vendor === "") return style;
    return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
}

export const _transform = prefixStyle("transform");

export function translate(elem, x, y, unit) {
    if (!(elem && elem.nodeType === 1)) { return; }
    let unitX, unitY;
    if (typeof unit === "string") {
        unitX = unitY = unit;
    } else if (isArray(unit)) {
        unitX = unit[0];
        unitY = unit[1];
    } else {
        unitX = unitY = "px";
    }
    x += unitX; y += unitY;
    elem.style[_transform] = "translate(" + x + "," + y + ")";
}
