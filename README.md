# @computeruniverse/react-carousel
[![Last commit](https://img.shields.io/github/last-commit/computeruniverse-oss/react-carousel.svg)](https://github.com/computeruniverse-oss/react-carousel/commits/main)
[![license](https://img.shields.io/github/license/computeruniverse-oss/react-carousel)](https://github.com/computeruniverse-oss/react-carousel/blob/main/LICENSE.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)  
[![Downloads](https://img.shields.io/npm/dm/@computeruniverse/react-carousel?color=blue)](https://www.npmjs.com/package/@computeruniverse/react-carousel)
[![Activity](https://img.shields.io/github/commit-activity/m/computeruniverse-oss/react-carousel.svg)](https://github.com/computeruniverse-oss/react-carousel/commits/main)
[![Minified](https://img.shields.io/bundlephobia/min/@computeruniverse/react-carousel?label=minified)](https://www.npmjs.com/package/@computeruniverse/react-carousel)
[![npm](https://img.shields.io/npm/v/@computeruniverse/react-carousel.svg)](https://www.npmjs.com/package/@computeruniverse/react-carousel)


## Usage
```ts
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
```

## Props
| Name            | Type                                                                                | Default   | Description |
|-----------------|-------------------------------------------------------------------------------------|-----------|----|
| itemFactory     |`(index: number, preloading: boolean) => React.ReactElement`<br><sup>(required)</sup>|`undefined`| Is called at the creation of the carousel and basically returns an array of slides to show. **Important** the return value is cached |
| isStatic        |`boolean`<br><sup>(required)</sup>                                                   |`undefined`||
| itemCount       |`number`<br><sup>(required)</sup>                                                    |`undefined`| Count of how many Slides are in the carousel |
| activeSlide     |`number`<br><sup>(required)</sup>                                                    |`undefined | Index of the currently active slide, if the value is changed the carousel slides to this index |
| slidesToShow    |`number`                                                                             |`1`        | Value of how many slides the carousel shows at the same time |
| defaultSlide    |`number`                                                                             |`0`        | Position of the default slide, you're probably don't need this value |
| onChange        |`(activeIndex: number) => void`                                                      |`undefined`| Triggers every time the carousel moves |
| autoplayInterval|`number` (ms)                                                                        |`undefined`| Sets the interval time for the carousel in milliseconds |
| movementTension |`number`                                                                             |`50`       ||
| movementFriction|`number`                                                                             |`20`       ||
