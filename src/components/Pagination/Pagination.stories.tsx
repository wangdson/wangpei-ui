import React from "react";
import { Pagination, Table, SourceDataType } from "./index";
import {
	withKnobs,
	text,
	boolean,
	color,
	select,
	number,
} from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";

export default {
  title: '基础组件/ Pagination分页组件',
  component: Pagination,
  decorators: [withKnobs],
}

const columns = [
	{
		title: "Name",
		dataIndex: "name",
	},
	{
		title: "Chinese Score",
		dataIndex: "chinese",
		sorter: {
			compare: (a: SourceDataType, b: SourceDataType) =>
				b.chinese - a.chinese,
		},
	},
	{
		title: "Math Score",
		dataIndex: "math",
		sorter: {
			compare: (a: SourceDataType, b: SourceDataType) => b.math - a.math,
		},
	},
	{
		title: "English Score",
		dataIndex: "english",
		sorter: {
			compare: (a: SourceDataType, b: SourceDataType) =>
				b.english - a.english,
		},
	},
];
const data = [
	{
		key: "1",
		name: "John Brown",
		chinese: 55,
		math: 60,
		english: 70,
	},
	{
		key: "2",
		name: "Jim Green",
		chinese: 98,
		math: 66,
		english: 89,
	},
	{
		key: "3",
		name: "Joe Black",
		chinese: 78,
		math: 90,
		english: 70,
	},
	{
		key: "4",
		name: "Jim Red",
		chinese: 88,
		math: 99,
		english: 89,
	},
];

export const knobsPagination = () => {
	return <Pagination 
		pageSize={number('pageSize', 10)}
		maxPage={number('maxPage', 5)}
		total={number("total", 1000)}
		defaultCurrent={number('defaultCurrent', 1)}
		callback={action('callback')}
	/>
};

export const TablePagination = () => {
	return <Table
		data={data}
		columns={columns}
		sorted={boolean('sorted', false)}
		pageSize={number('pageSize', 10)}
		pagination={boolean('pagination', true)}
	/>
};