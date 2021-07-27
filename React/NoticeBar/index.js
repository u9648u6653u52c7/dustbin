import './index.less'
import throttle from './throttle'
import React, { useState, useEffect, useRef } from 'react'

/**
 * getClsName 元素类名拼接
 * @returns {String}
 */
function getClsName() {
    const args = [].slice
        .apply(arguments)
        .filter(el => el && typeof el == 'string')
    return args.join(' ')
}

const hornIcon = <span className="iconfont yhicon-horn" />
const closeIcon = <span className="iconfont yhicon-close" />
const arrowRightIcon = <span className="iconfont yhicon-arrow-right" />

export default function (props) {
    const {
        className,
        content,
        children,
        direction,
        delay,
        fps,
        icon,
        mode,
        action,
        onClick,
        listenResizeEvt = false
    } = props

    const text = content || children
    if (!text) { return null }

    const _fps = typeof fps === 'number' ? fps : 1000 / 40
    const animationDdelay = typeof delay === 'string' ? delay : '2s'
    const position = direction == 'vertical' ? direction : 'horizontal'
    const [show, setShow] = useState(true)
    const [flag, setFlag] = useState(false)
    const [duration, setDuration] = useState('')
    const flagMark = useRef(false)
    const $text = useRef()
    const $inner = useRef()

    useEffect(() => {
        const textElem = $text.current
        const innerElem = $inner.current
        if (!(innerElem && textElem)) { return }

        function getTextElemArea() {
            return textElem.offsetWidth * textElem.offsetHeight
        }

        function getInnerElemArea() {
            return innerElem.offsetWidth * innerElem.offsetHeight
        }

        function hasOverflow() {
            if (flagMark.current) {
                return (getTextElemArea() / 2) > getInnerElemArea()
            } else {
                return getTextElemArea() > getInnerElemArea()
            }
        }

        function getDuration() {
            return Math.ceil(position == 'vertical'
                ? textElem.offsetHeight * _fps
                : (getTextElemArea() / innerElem.offsetHeight) * _fps
            ) + 'ms'
        }

        const setState = throttle(() => {
            if (hasOverflow()) {
                setFlag(true)
                setDuration(getDuration())
                flagMark.current = true
            } else {
                setFlag(false)
                setDuration('')
                flagMark.current = false
            }
        }, 1e3, { leading: true })

        setState()

        if (listenResizeEvt) {
            window.addEventListener('resize', setState)
            return () => window.removeEventListener('resize', setState)
        }
    }, [])

    const style = {}
    if (flag && duration) {
        style.WebkitAnimationDuration = duration
        style.WebkitAnimationDelay = animationDdelay
        style.animationDuration = duration
        style.animationDelay = animationDdelay
    }

    const actionElem = (mode => {
        if (mode == 'closable') {
            return <div className="notice-bar__right" onClick={() => {
                if (typeof onClick === 'function') { onClick() }
                setShow(false)
            }}>{action || closeIcon}</div>
        }

        if (mode == 'link') {
            return <div className="notice-bar__right" onClick={() => {
                if (typeof onClick === 'function') { onClick() }
            }}>{action || arrowRightIcon}</div>
        }

        return null
    })(mode)

    return show ? <div className={getClsName('notice-bar', className)}>
        <div className="notice-bar__left">{icon || hornIcon}</div>
        {actionElem}
        <div className="notice-bar__content">
            <div className="notice-bar__inner" ref={$inner}>
                <div className={getClsName('notice-bar__text', flag ? position : '')} style={style} ref={$text}>
                    {text}{flag && position == 'vertical' ? <br /> : null}{flag ? text : null}
                </div>
            </div>
        </div>
    </div> : null
}
