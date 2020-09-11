import React from 'react';
import { withKnobs, select, number, boolean, text } from '@storybook/addon-knobs';
import { Carousel, CarouselProps } from './index';
import { color } from '../shared/style';

export default {
  title: '高级组件 / Carousel',
  component: Carousel,
  decorators: [withKnobs],
}

const DivExample = function(height: number, index: number) {
	return (
		<div
			style={{
				background: "#364d79",
			}}
    		key={index}
		>
			<span
				style={{
					lineHeight: `${height}px`,
					color: "white",
					fontSize: "20px",
					fontWeight: 800,
					width: "100%",
					textAlign: "center",
					display: "inline-block",
				}}
			>
				{index + 1}
			</span>
		</div>
	);
};

export const knobsCarousel = () => {
  const height = number("height", 300);
	const num = number("item number", 4);
  return <div>
		<Carousel
      delay={number("delay", 1000)}
      height={height}
      autoPlay={boolean("autoPlay", true)}
      autoPlayDelay={number('autoPlayDelay', 3000)}
      viewportBoxShadow={text('viewportBoxShadow', '2px 2px 4px #d9d9d9')}
      defaultIndex={number('defaultIndex', 0)}
      autoPlayReverse={boolean('autoPlayReverse', false)}
      radioAppear={select('radioAppear', Object.keys(color) as Array<keyof typeof color>, 'primary')}
    >
      {new Array(num).fill(height).map((v, i) => DivExample(v, i))}
		</Carousel>
	</div>
};

export const colorCarousel = () => (
  <div>
		<Carousel autoPlay delay={1000} height={300}>
			<div style={{ height: "100%", width: "100%", background: "red" }}>
				1
			</div>
			<div style={{ height: "100%", width: "100%", background: "blue" }}>
				2
			</div>
			<div
				style={{ height: "100%", width: "100%", background: "yellow" }}
			>
				3
			</div>
			<div style={{ height: "100%", width: "100%" }}>4</div>
		</Carousel>
	</div>
);


