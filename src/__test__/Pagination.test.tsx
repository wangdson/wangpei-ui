import React from "react";
import { render } from "@testing-library/react";
import { Pagination, SourceDataType, Table } from "../components/Pagination";

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

describe('test Pagination component', ()=>{
  it('it render corrent Pagination', ()=>{
    const wrapper = render(<Pagination 
      pageSize={10}
      maxPage={5}
      total={1000}
      defaultCurrent={1}
    />);
    expect(wrapper).toMatchSnapshot();
  });

  it('it render corrent Table', ()=>{
    const wrapper = render(<Table
      data={data}
      columns={columns}
      sorted={true}
      pageSize={10}
      pagination={false}
    />);
    expect(wrapper).toMatchSnapshot();
  });
})