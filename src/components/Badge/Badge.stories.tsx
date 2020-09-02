import React from "react";
import { Badge, statusList } from "./index";
import { Icon } from "../Icon";
import {
	withKnobs,
	text,
	boolean,
	color,
	select,
} from "@storybook/addon-knobs";

export default {
  title: 'view/ Badge徽章',
  component: Badge,
  decorators: [withKnobs],
}

export const knobsBadge = () => (
	<Badge 
		status={select('status', statusList, 'positive')}
	>
		{text('children', '123')}
	</Badge>
);

export const all = () => (
	<div>
		<Badge status="positive">positive</Badge>
		<Badge status="negative">negative</Badge>
		<Badge status="neutral">neutral</Badge>
		<Badge status="warning">warning</Badge>
		<Badge status="error">error</Badge>
	</div>
);

export const withIcon = () => (
	<Badge status="warning" className="testClass">
		<Icon icon="bookmark" color="#d8d80d"/>
		with icon
	</Badge>
);