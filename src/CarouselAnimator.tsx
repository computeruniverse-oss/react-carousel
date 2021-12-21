import React, { useEffect, useState } from 'react';
import useSpring from 'react-use/lib/useSpring';

import { CarouselAnimatorProps, CarouselAnimatorValue } from './CarouselAnimator.types';

const CarouselAnimator: React.FC<CarouselAnimatorProps> = ({
    slidesToShow,
    children,
    targetX,
    itemCount,
    friction,
    tension,
}) => {
    const [animationValues, setAnimationValues] = useState<CarouselAnimatorValue>(() => {
        return {
            animatedX: targetX,
            leftMostSlide: 0,
        };
    });

    const animatedValue = useSpring(targetX, tension || 50, friction || 20);

    useEffect(() => {
        const ani = animatedValue;
        const delta = Math.abs(targetX - ani);
        const animatedX = delta > 0.02 ? ani : targetX;
        const normX = Math.round((animatedX % (itemCount * 100)) * 100) / 100;
        const itemWidth = 100 / slidesToShow;
        const s = Math.floor(-normX / itemWidth);
        const leftMostSlide = Math.abs(s) === 0 ? 0 : s;

        if (normX !== animationValues.animatedX || leftMostSlide !== animationValues.leftMostSlide) {
            setAnimationValues({
                animatedX: normX,
                leftMostSlide,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [animatedValue]);

    return children(animationValues);
};

export default CarouselAnimator;
