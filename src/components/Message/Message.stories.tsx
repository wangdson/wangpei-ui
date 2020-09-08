import React from "react";
import { Message, createMessage, MessageType, message } from "./index";
import Button from "../Button";
import { Icon } from "../Icon";
import {
	withKnobs,
	text,
	boolean,
	color,
	select,
	number,
} from "@storybook/addon-knobs";

export default {
  title: '基础组件/ Message',
  component: Message,
  decorators: [withKnobs],
}

const Options: MessageType[] = [
	"info",
	"success",
	"error",
	"warning",
	"loading",
	"default",
];

export const knobsMessage = () => {
	const se = select<MessageType>("iconType", Options, "default");
	const op = {
		delay: number("delay", 2000),
		animationDuring: number("animationDuring", 300),
		background: color('background', '#fff'),
		color: color('color', '#333'),
	};
	const tx = text('content', 'hello u');
	const onMessage = ()=>createMessage(se)(tx, op);
	return (<div>
		<Button appearance="primary" onClick={onMessage}>Message</Button>
	</div>);
};

export const callbackTest = () => (
	<div>
		<Button
			onClick={() =>
				message.loading("加载中", {
					callback: () => message.success("加载完成"),
				})
			}
		>
			callback
		</Button>
	</div>
);

export const withIcon = () => (
	<div>
		<Button
			onClick={() =>
				message.default(
					<span>
						<Icon icon="admin"></Icon>admin
					</span>
				)
			}
		>
			admin icon
		</Button>
	</div>
);
