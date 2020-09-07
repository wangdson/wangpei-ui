import React from "react";
import { Progress } from "./index";
import { Icon } from '../Icon';
import {
	withKnobs,
	text,
	boolean,
	color,
	number,
} from "@storybook/addon-knobs";

export default {
  title: '基础组件/ Progress进度条',
  component: Progress,
  decorators: [withKnobs],
}

export const knobsProgress = () => (
	<Progress 
		count={number("count", 50, {range: true, min: 0, max: 100, step: 1})}
		countNumber={boolean("countNumber", true)}
		height={number("height", 8)}
		circle={boolean("circle", false)}
		size={number("size", 100)}
		primary={color("primary", "#FF4785")}
		secondary={color("secondary", "#FFAE00")}
		bottomColor={color("bottomColor", "#DDDDDD")}
		flashColor={color("flashColor", "#FFFFFF")}
		progressText={text("progressText", "")}
		circleText={text("circleText", "")}
	></Progress>
);

export const lineProgress = () => <Progress count={60} progressText={"test"}></Progress>;

export const circleProgress = () => <Progress count={80} circle={true}></Progress>;

export const changeColor = () => (
	<Progress
		count={20}
		primary="blue"
		secondary="yellow"
		bottomColor="brown"
		progressText={
			<span>
				<Icon icon="power"></Icon>
			</span>
		}
	></Progress>
);