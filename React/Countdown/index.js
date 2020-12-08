import React, { useState, useEffect } from "react";
import Countdown from "./countdown";

export default function (props) {
    const {
        ms = 0,
        delay,
        offset,
        onOver,
        onStop,
        format = "还剩{d}天 {hh}:{mm}:{ss}",
        children
    } = props;

    const [timeObj, setTimeObj] = useState(Countdown.format(ms));

    useEffect(() => {
        const countdown = new Countdown(
            ms,
            obj => setTimeObj(obj),
            onOver,
            onStop,
            delay,
            offset
        ).start();

        return () => countdown.stop();
    }, [ms, onOver, onStop, delay, offset]);

    const elem = typeof children === "function"
        ? children(timeObj)
        : format.replace(/{((\w)\2*)}/g, (m, g1, g2) => {
            const len = g1.length;
            const val = timeObj[g2] + "";
            return val.length >= len
                ? val
                : ((new Array(len + 1)).join("0") + val).substr(-len);
        });

    return <>{elem}</>;
}
