import React, { useState } from 'react';
import { ReactCarousel } from '@computeruiverse/react-carousel';
import '@computeruiverse/react-carousel/lib/index.css';

const MyCarousel: React.VFC = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const items = [];
    for (let i = 0; i < 5; i++) {
        items.push(i);
    }

    return (
        <>
            <ReactCarousel
                isStatic={true}
                slidesToShow={4}
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

            <button onClick={() => setActiveSlide(activeSlide - 1)}>Prev</button>
            <button onClick={() => setActiveSlide(activeSlide + 1)}>Next</button>
        </>
    );
};

export default MyCarousel;
