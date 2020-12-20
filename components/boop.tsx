import React from 'react';
import { animated, useSpring } from 'react-spring';

interface IOwnProps {
    x?: number,
    y?: number,
    rotation?: number,
    scale?: number,
    timing?: number,
    children: JSX.Element,
}

function Boop(props: IOwnProps) {
    const [isBooped, setIsBooped] = React.useState(false);

    let { x, y, rotation, scale, timing } = props;
    x = x ?? 0;
    y = y ?? 0;
    rotation = rotation ?? 0;
    scale = scale ?? 1;
    timing = timing ?? 150;

    const style = useSpring({
        display: 'inline-block',
        transform: isBooped
            ? `translate(${x}px, ${y}px)
                rotate(${rotation}deg)
                scale(${scale})`
            : `translate(0px, 0px)
                rotate(0deg)
                scale(1)`,
        config: {
            tension: 300,
            friction: 10,
        }
    });

    React.useEffect(() => {
        if (!isBooped) {
            return;
        }

        const timeoutId = window.setTimeout(() => setIsBooped(false), timing);
        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [isBooped, props.timing]);

    function trigger() {
        setIsBooped(true);
    }

    return (
        <animated.span onMouseEnter={() => trigger()} style={style}>
            {props.children}
        </animated.span>
    )

}

export default Boop;