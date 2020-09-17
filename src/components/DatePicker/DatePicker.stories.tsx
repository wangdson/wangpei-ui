import React, { useEffect } from "react";
import { DatePicker } from "./index";
import {
	withKnobs,
	text,
	boolean,
	color,
	select,
	number
} from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";

export default {
  title: '基础组件/ DatePicker',
  component: DatePicker,
  decorators: [withKnobs],
}

export const knobsDatePicker = () => {
	return <DatePicker 
	    initDate={text('initDate', '2020-09-17')}
			delay={number('delay', 300)}
			callback={action("callback")}
			refCallback={action('refCallback')}
	/>
};

/**
 * ref控制测试
 */
export const InputRefTest = ()=>{
	let divRef:React.RefObject<HTMLDivElement>;
	useEffect(()=>{
		console.log(divRef);
		divRef.current && divRef.current.querySelector('input')?.click();
	}, []);
	return <DatePicker 
	    initDate={'2020-09-17'}
			delay={300}
			refCallback={(ref: React.RefObject<HTMLDivElement>) => {divRef = ref;}}
	/>
}