import React, { useState, useEffect } from "react";
import Countdown from "./countdown";

export default function (props) {
    const {
        ms = 0,
        delay,
        offset,
        format = "还剩{d}天 {h}:{m}:{s}",
        children
    } = props;

    const [timeObj, setTimeObj] = useState(Countdown.format(ms));

    useEffect(() => {
        const countdown = new Countdown(
            ms,
            obj => setTimeObj(obj),
            delay,
            offset
        ).start();

        return () => countdown.stop();
    }, []);

    const elem = typeof children === "function"
        ? children(timeObj)
        : format.replace(/{(\w+)}/g, (m, g) => timeObj[g] || 0)

    return <>{elem}</>;
}
