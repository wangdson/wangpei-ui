import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { DatePicker } from "../components/DatePicker";
import { color, typography } from "../components/shared/style";

describe('test DatePicker component', ()=>{
  it('test corrent DatePicker', ()=>{
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${date.getMonth()-1}-${date.getDate()}`;
    const wrapper = render(<DatePicker  initDate={dateStr}/>);
    expect(wrapper).toMatchSnapshot();
  });
})