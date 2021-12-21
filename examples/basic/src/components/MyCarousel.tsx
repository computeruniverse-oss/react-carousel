import React, { useState } from 'react';
import { ReactCarousel } from 'my-super-duper-rect-carousel';
import 'my-super-duper-rect-carousel/lib/index.css';

const MyCarousel: React.VFC = () => {
    const [itemCount, setItemCount] = useState(4);
    const [activeSlide, setActiveSlide] = useState(0);
    const items = [];
    for (let i = 0; i < 5; i++) {
        items.push(i);
    }

    return (
        <>
            <ReactCarousel
                isStatic={true}
                slidesToShow={itemCount}
                activeSlide={activeSlide}
                itemCount={items.length}
                autoplayInterval={5000}
                movementTension={50}
                movementFriction={20}
                onChange={(activeIndex) => {
                    console.log('activeIndex', activeIndex);
                    setActiveSlide(activeIndex);
                }}
                itemFactory={(index, preloading) => {
                    return (
                        <div
                            key={index}
                            style={{
                                height: '200px',
                                fontSize: '60px',
                                backgroundColor: (index + 1) % 2 === 0 ? 'green' : 'yellow',
                            }}
                        >
                            {index}
                        </div>
                    );
                }}
            />
            Slides to show:
            <button onClick={() => setItemCount(1)}>1</button>
            <button onClick={() => setItemCount(2)}>2</button>
            <button onClick={() => setItemCount(3)}>3</button>
            <button onClick={() => setItemCount(4)}>4</button>
            <button onClick={() => setActiveSlide(activeSlide - 1)}>Prev</button>
            <button onClick={() => setActiveSlide(activeSlide + 1)}>Next</button>
        </>
    );
};

export default MyCarousel;
