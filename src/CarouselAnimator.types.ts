export interface CarouselAnimatorValue {
    animatedX: number;
    leftMostSlide: number;
}
export interface CarouselAnimatorProps {
    children: (animationProps: CarouselAnimatorValue) => JSX.Element;
    slidesToShow: number;
    itemCount: number;
    targetX: number;
    tension?: number;
    friction?: number;
}
