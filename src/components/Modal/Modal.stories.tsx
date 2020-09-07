import React, { useState } from "react";
import { Modal } from "./index";
import {
	withKnobs,
	text,
	boolean,
	number,
} from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import Button from "../Button";

export default {
  title: '基础组件/ Modal模块框',
  component: Modal,
  decorators: [withKnobs],
}

export const knobsModal = () => {
	const [state, setState] = useState(false);
	const title = text("title", "标题");
	const child = text("children", "context text");
	const confirm = boolean("confirm", true);
	const okText = text("okText", "");
	const cancelText = text("cancelText", "");
	return (
		<div>
			<Modal
				refCallback={action('refCallback')}
				stopScroll={boolean("stopScroll", true)}
				delay={number("delay", 200)}
				mask={boolean('mask', true)}
				maskClose={boolean('maskClose', true)}
				callback={action("callback")}
				cancelText={cancelText}
				okText={okText}
				confirm={confirm}
				title={title}
				parentSetState={setState}
				visible={state}
				closeButton={boolean('closeButton', true)}
				closeCallback={action("closeCallback")}
				container={document.body}
			>
				{child}
			</Modal>
			<Button onClick={()=>{setState(!state)}}>打开/关闭modal</Button>
		</div>
	)
}