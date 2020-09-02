import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Radio } from "../components/Radio";
import { color, typography } from "../components/shared/style";
import { disabled } from "../components/Button/Button.stories";

const testfn = jest.fn();
const disablefn = jest.fn();

describe('test Radio component', ()=>{
  it('should checked when clicked', ()=>{
    const wrapper = render(<Radio label="test" onChange={testfn} />);
    expect(wrapper).toMatchSnapshot();
    const input = wrapper.container.querySelector('input');
    expect(testfn).not.toHaveBeenCalled();
    fireEvent.click(input!);
    expect(testfn).toHaveBeenCalled();
  });
  it('should render extra text', () => {
    const wrapper = render(<Radio 
      label="test"
      error="error test"
      description="description test"
      onChange={testfn}
    />);
    expect(wrapper).toMatchSnapshot();
    const errorText = wrapper.getByText('error test');
    expect(errorText).toHaveStyle(`color:${color.negative}`);
    const descriptionText = wrapper.getByText('description test');
    expect(descriptionText).toHaveStyle(`color: ${color.mediumdark}`)
  });
  it('should hide label', ()=>{
    const wrapper = render(<Radio label="test" hideLabel></Radio>);
    expect(wrapper).toMatchSnapshot();
    const text = wrapper.getByText('test');
    expect(text).toHaveStyle("clip-path: inset(100%)");
  })
  it("should disabled", ()=>{
    const wrapper = render(<Radio label="test" disabled onChange={disablefn}></Radio>);
    expect(wrapper).toMatchSnapshot();
    const text = wrapper.getByText("test");
    fireEvent.click(text);
    expect(disablefn).not.toHaveBeenCalled();
  })
})