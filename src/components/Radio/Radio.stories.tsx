import React,{ useState } from "react";
import { Radio } from "./index";
import {
	withKnobs,
	text,
	boolean,
	select,
} from "@storybook/addon-knobs";
import { color } from '../shared/style';
import { action } from "@storybook/addon-actions";
import { Icon } from "../Icon";

export default {
  title: 'Basic/ Radio',
  component: Radio,
  decorators: [withKnobs],
}

export const knobsRadio = () => (
	<Radio 
		hideLabel={boolean('hideLabel', false)}
		label={text('label', '标签')}
		appearance={select('appearance', Object.keys(color) , 'primary') as keyof typeof color}
		description={text('description', '')}
		wrapperClass={text('wrapperClass', 'test')}
		error={text('error', '')}
		disabled={boolean('disabled', false)}
	></Radio>
);

export const testColors = ()=>(
	<div>
		{
			Object.keys(color).map((c, index) => (
				<Radio key={index} name="group" label={c} appearance={c as keyof typeof color}/>
			))
		}
	</div>
)

const onChange = action('change');

export const testOnChange = () => (
	<form>
		<Radio name="group2" label='basketball' onChange={onChange} />
		<Radio name="group2" label='football' onChange={onChange} />
		<Radio name="group2" label='dancing' onChange={onChange} />
		<Radio name="group2" label='singing' onChange={onChange} />
		<Radio name="group2" label='walking' onChange={onChange} />
	</form>
)

export const testDisabled = () => <Radio label="disabled" disabled></Radio>

export const testExtraTest = () => (
	<Radio label="extra text" error="error text" description="description text"/>
)

export const testHideLabel = () => (
	<Radio label="hide label" hideLabel description="label will hidden"/>
)

export const withIcon = () => (
	<Radio label={
		<span><Icon icon="redux"></Icon>with icon</span>
	}></Radio>
)

function ParentControl() {
	const [state, setState] = useState(() => new Array(5).fill(false));
const onClick = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
		const target = e.target as HTMLInputElement;
		const index = (target.value as unknown) as number;
		let newArr = new Array(5).fill(false);
		newArr[index] = true;
		setState(newArr);
	};
	return (
		<div>
			<Radio
				label="apple"
				onClick={onClick}
				value={0}
				checked={state[0]}
				onChange={() => {}}
			/>
			<Radio
				label="banana"
				onClick={onClick}
				value={1}
				checked={state[1]}
				onChange={() => {}}
			/>
			<Radio
				label="pear"
				onClick={onClick}
				value={2}
				checked={state[2]}
				onChange={() => {}}
			/>
			<Radio
				label="mongo"
				onClick={onClick}
				value={3}
				checked={state[3]}
				onChange={() => {}}
			/>
			<Radio
				label="watermelon"
				onClick={onClick}
				value={4}
				checked={state[4]}
				onChange={() => {}}
			/>
		</div>
	);
}

export const testParentControl = () => <ParentControl></ParentControl>;