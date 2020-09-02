import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Badge, BadgeProps, badgeColor, badgeBackground } from "../components/Badge";
import { color, background, typography } from "../components/shared/style";

const testonClick = jest.fn();
/**
 * 测试
 * @param status 
 */
const testThemeFunc = (status: BadgeProps['status']) => {
  cleanup();
  let wrapper = render(<Badge status={status}>111</Badge>);
  const text = wrapper.getByText('111');
  expect(text).toHaveStyle(`color: ${badgeColor[status!]}`);
  expect(text).toHaveStyle(`background: ${badgeBackground[status!]}`)
}

describe('test Badge component', ()=>{
  it('should render default style', ()=>{
    let wrapper = render(<Badge>111</Badge>);
    expect(wrapper).toMatchSnapshot();
    const text = wrapper.getByText('111');
    expect(text).toHaveStyle(`color: ${badgeColor['neutral']}`);
    expect(text).toHaveStyle(`background: ${badgeBackground['neutral']}`);
  });
  it('should render corrent attr', () => {
    let wrapper = render(<Badge className="testClass" onClick={testonClick}>
      111
    </Badge>);
    const text = wrapper.getByText("111");
    expect(text.className.includes('testClass')).toBeTruthy();
    fireEvent.click(text);
    expect(testonClick).toHaveBeenCalled();
  });
  it('should render corrent theme', () => {
    Object.keys(badgeColor).forEach(status => {
      testThemeFunc(status as BadgeProps['status']);
    })
  })
})