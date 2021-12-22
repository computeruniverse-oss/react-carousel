import React, { useEffect, useRef, useState } from 'react';
import { useInterval, useTimeoutFn, useUpdateEffect } from 'react-use';
import clsx from 'clsx';

import { CarouselAnimatorProps } from './CarouselAnimator.types';

import styles from './Carousel.module.css';

type SlideCssClasses = {
    active?: string;
    default?: string;
};

interface CarouselProps {
    slidesToShow?: number;
    itemFactory: (index: number, preloading: boolean) => React.ReactElement;
    isStatic: boolean;
    itemCount: number;
    defaultSlide?: number;
    activeSlide: number;
    onChange?: (activeIndex: number) => void;
    autoplayInterval?: number;
    movementTension?: number;
    movementFriction?: number;
    slideCssClasses?: SlideCssClasses;
}

export const CarouselSlides: React.FC<{
    slidesToShow: number;
    itemCount: number;
    leftMostSlide: number;
    children: Array<React.ReactElement>;
    slideCssClasses?: SlideCssClasses;
}> = React.memo(({ leftMostSlide, itemCount, slidesToShow, children, slideCssClasses }) => {
    const visibleSlides: Array<number> = [];
    for (let i = leftMostSlide; i < leftMostSlide + slidesToShow + 1; i++) {
        const rawIndex = i % itemCount;
        const virtualIndex = rawIndex < itemCount ? rawIndex : rawIndex - itemCount;
        visibleSlides.push(virtualIndex < 0 ? itemCount + virtualIndex : virtualIndex);
    }

    return (
        <>
            {children.map((item, index) => {
                const position = visibleSlides.indexOf(index);

                const MyDiv: React.ReactElement = {
                    ...item,
                    props: {
                        ...item.props,
                        style: {
                            ...item.props.style,
                            transform: `translateX(${(leftMostSlide + position) * 100}%)`,
                            gridColumn: `1/2`,
                        },
                        className: clsx(
                            item.props.className,
                            slideCssClasses?.default,
                            index === leftMostSlide && slideCssClasses?.active,
                        ),
                    },
                };
                return MyDiv;
            })}
        </>
    );
});
CarouselSlides.displayName = 'CarouselSlides';

const AnimatorMock: React.FC<CarouselAnimatorProps> = ({ targetX, children }) =>
    children({ animatedX: targetX, leftMostSlide: 0 });

type CarouselState = {
    isOver: boolean;
    isSliding: boolean;
    offsetX: number;
    round: number;
    slidingFromWheel?: boolean;
    startPosition: {
        mouseX: number;
        offsetX: number;
        ts: number;
    };
    slide: {
        virtualIndex: number;
        index: number;
    };
    movement?: {
        targetX: number;
        velocity: number;
    };
};

export const ReactCarousel: React.FC<CarouselProps> = ({
    slidesToShow,
    itemFactory,
    itemCount,
    activeSlide,
    onChange,
    movementFriction,
    movementTension,
    autoplayInterval,
    defaultSlide,
}) => {
    const itemWidth = 100.0 / (slidesToShow || 1);

    const [preloading, setPreloading] = useState(true);

    const scrollRef = useRef<HTMLDivElement>(null);

    const [scrollWidth, setScrollWidth] = useState(0);

    const [state, setState] = useState<CarouselState>({
        slide: {
            index: defaultSlide || 0,
            virtualIndex: defaultSlide || 0,
        },
        isOver: false,
        isSliding: false,
        startPosition: {
            mouseX: 0,
            ts: 0,
            offsetX: 0,
        },
        movement: undefined,
        offsetX: 0,
        round: 0,
    });

    const [DynamicAnimator, setDynamicAnimator] = useState<React.FC<CarouselAnimatorProps>>(() => {
        import('./CarouselAnimator').then((it) => setDynamicAnimator(() => it.default));
        return AnimatorMock;
    });

    const preRenderedItems = React.useMemo(() => {
        const items: Array<React.ReactElement> = [];

        for (let i = 0; i < itemCount; i++) {
            items.push(itemFactory(i, i >= (slidesToShow || 1)));
        }

        return items;
    }, [itemCount, slidesToShow, itemFactory]);

    const [slides, setSlides] = useState(preRenderedItems);

    useEffect(() => {
        if (preloading) {
            const items: React.ReactElement[] = [];

            for (let i = 0; i < itemCount; i++) {
                if (i < (slidesToShow || 1)) {
                    items.push(preRenderedItems[i]);
                } else {
                    items.push(itemFactory(i, false));
                }
            }
            setPreloading(false);

            setSlides(items);
        }
    }, [preRenderedItems, preloading, itemFactory, itemCount, slidesToShow]);

    const updateState = (newState: Partial<CarouselState>) => {
        setState({
            ...state,
            ...newState,
        });
    };

    useUpdateEffect(() => {
        updateState({
            offsetX: -state.slide.virtualIndex * itemWidth,
        });
    }, [itemWidth, state.slide]);

    useUpdateEffect(() => {
        const currentIndex = state.slide.index;

        if (currentIndex !== activeSlide % itemCount) {
            let diff = (activeSlide % itemCount) - currentIndex;
            const round = diff % (itemCount - 1) === 0 ? state.round - diff / (itemCount - 1) : state.round;

            updateState({
                slide: {
                    virtualIndex: round * itemCount + state.slide.index + diff,
                    index: state.slide.index + diff,
                },
                round,
            });
        }
    }, [itemCount, activeSlide]);

    useUpdateEffect(() => {
        if (onChange) {
            onChange(state.slide.index);
        }
    }, [state.slide]);

    useInterval(
        () => {
            const nextIndex = state.slide.virtualIndex + 1;
            updateState({
                slide: {
                    virtualIndex: nextIndex,
                    index: nextIndex % itemCount,
                },
            });
        },
        state.isOver || !autoplayInterval ? null : autoplayInterval,
    );

    const handleDragStart = (x: number, y: number) => {
        document.body.setAttribute('data-overscroll', document.body.style.overscrollBehaviorX);

        document.body.style.overscrollBehaviorX = 'none';

        if (scrollRef.current) {
            setScrollWidth(Math.round(scrollRef.current.clientWidth));
        }

        updateState({
            startPosition: {
                ts: Date.now(),
                offsetX: state.offsetX,
                mouseX: x,
            },
            isSliding: true,
        });
    };

    const handleDragEnd = (x: number, y: number, isOver?: boolean) => {
        if (!state.isSliding && isOver !== undefined) {
            updateState({
                isOver,
            });
        }
        let targetX = state.offsetX;

        const diff = targetX % itemWidth;

        let normalizedDiff = -(Math.abs(diff) > itemWidth / 2
            ? diff > 0
                ? -(itemWidth - diff)
                : itemWidth + diff
            : diff);

        targetX = targetX + normalizedDiff;

        const roundedVirtual = Math.floor(-targetX / itemWidth);
        const rounded = roundedVirtual % itemCount;
        const currentIndex = Math.abs(rounded >= 0 ? rounded : itemCount - rounded);
        const round = Math.floor(roundedVirtual / itemCount);

        updateState({
            slide: {
                virtualIndex: roundedVirtual,
                index: currentIndex % itemCount,
            },
            movement: undefined,
            isSliding: false,
            slidingFromWheel: false,
            offsetX: targetX,
            round,
            isOver: isOver !== undefined ? isOver : state.isOver,
        });
    };

    useTimeoutFn(
        () => {
            handleDragEnd(0, 0);
        },
        state.slidingFromWheel ? 500 : undefined,
    );

    const updateMovement = (velocity: number) => {
        if (state.isSliding) {
            updateState({
                offsetX: state.startPosition.offsetX + Math.round((velocity / scrollWidth) * 100),
            });
        }
    };

    const buildCols = (colCount: number, itemCount: number) => {
        return Array.from(Array(itemCount).keys())
            .map((val) => (val < colCount ? '1fr ' : '0px '))
            .join(' ');
    };

    return (
        <div
            style={{ maxWidth: '100%', overflow: 'hidden' }}
            onMouseDown={(e) => {
                handleDragStart(e.clientX, e.clientY);
            }}
            onMouseUp={(e) => {
                handleDragEnd(e.clientX, e.clientY);
            }}
            onMouseOver={() =>
                updateState({
                    isOver: true,
                })
            }
            onMouseLeave={(e) => {
                handleDragEnd(e.clientX, e.clientY, false);
            }}
            onClick={(e) => {
                e.preventDefault();
            }}
            onMouseMove={(e) => {
                if (e.buttons === 1 && state.isSliding) {
                    updateMovement(e.clientX - state.startPosition.mouseX);
                }
            }}
            onTouchMove={(e) => {
                if (state.isSliding && e.changedTouches?.length) {
                    const movementX = e.changedTouches[0].clientX - state.startPosition.mouseX;
                    updateMovement(movementX);
                }
            }}
            onTouchStart={(e) => {
                if (e.touches?.length) handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchEnd={(e) => {
                if (e.changedTouches?.length) {
                    handleDragEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                }
            }}
        >
            <DynamicAnimator
                targetX={state.offsetX}
                slidesToShow={slidesToShow || 1}
                itemCount={itemCount}
                tension={movementTension}
                friction={movementFriction}
            >
                {({ animatedX, leftMostSlide }: { animatedX: number; leftMostSlide: number }) => {
                    return (
                        <>
                            <div
                                style={{
                                    gridTemplateColumns: buildCols(slidesToShow || 1, itemCount),
                                    transform: `translateX(${animatedX}%)`,
                                }}
                                ref={scrollRef}
                                className={styles.content}
                            >
                                <CarouselSlides
                                    slidesToShow={slidesToShow || 1}
                                    itemCount={itemCount}
                                    leftMostSlide={leftMostSlide}
                                >
                                    {slides}
                                </CarouselSlides>
                            </div>
                        </>
                    );
                }}
            </DynamicAnimator>
        </div>
    );
};
