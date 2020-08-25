import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import Button, {ButtonProps} from '../components/Button';
import { color, typography } from '../components/shared/style';
const defaultProps = {
  onClick: jest.fn(),
  className: 'testprops',
}

const testProps: ButtonProps = {
  appearance: 'primary',
  size: 'small',
  className: 'testprops'
}

const disabledProps: ButtonProps = {
  disabled: true,
  onClick: jest.fn()
}


// test('hello test', () => {
//   const wrapper = render(<Button>hello</Button>);
//   const element = wrapper.queryByText('hello');
//   expect(element).toBeTruthy();
// })
describe('test Button component', ()=>{
  it('should render the correct default button', ()=>{
    const wrapper = render(<Button {...defaultProps}>hello</Button>);
    const ele = wrapper.getByTestId('button');
    expect(ele).toBeInTheDocument();
    // 正确渲染文本
    const text = wrapper.getByText("hello");
    expect(text).toBeTruthy();
    // button标签
    expect(ele.tagName).toEqual('BUTTON');
    expect(ele).not.toHaveAttribute('isdisabled');
    expect(ele).not.toHaveAttribute('isLinked');
    expect(ele.getAttribute('class')?.split(' ').includes('testprops')).toEqual(true);
    // 正常click事件
    fireEvent.click(ele);
    expect(defaultProps.onClick).toHaveBeenCalled();
    // span正常显示
    expect(ele.getElementsByTagName('span')).toBeTruthy();
    expect(ele).toHaveStyle(`background:${color.tertiary}`);
    expect(ele).toHaveStyle(`color:${color.darkest}`);
    expect(ele).toHaveStyle(`font-size: ${typography.size.s2}px`);
  });

  it("should render correct appearance ", () => {
		let wrapper = render(<Button {...testProps}>hello</Button>);
		let ele = wrapper.getByTestId("button");
		expect(ele).toHaveStyle(`background:${color.primary}`);
		expect(ele).toHaveStyle(`color: ${color.lightest}`);
		cleanup();
		wrapper = render(<Button appearance="inverseOutline">hello</Button>);
		ele = wrapper.getByTestId("button");
		expect(ele).toHaveStyle(
			`box-shadow: ${color.lightest} 0 0 0 1px inset`
		);
		expect(ele).toHaveStyle(`color: ${color.lightest}`);
		cleanup();
		wrapper = render(<Button appearance="inversePrimary">hello</Button>);
		ele = wrapper.getByTestId("button");
		expect(ele).toHaveStyle(`background:${color.lightest}`);
		expect(ele).toHaveStyle(`color: ${color.primary}`);
		cleanup();
		wrapper = render(<Button appearance="inverseSecondary">hello</Button>);
		ele = wrapper.getByTestId("button");
		expect(ele).toHaveStyle(`background:${color.lightest}`);
		expect(ele).toHaveStyle(`color: ${color.secondary}`);
		cleanup();
		wrapper = render(<Button appearance="outline">hello</Button>);
		ele = wrapper.getByTestId("button");
		expect(ele).toHaveStyle(`background:transparent`);
		expect(ele).toHaveStyle(`color: ${color.dark}`);
		cleanup();
		wrapper = render(<Button appearance="primaryOutline">hello</Button>);
		ele = wrapper.getByTestId("button");
		expect(ele).toHaveStyle(`box-shadow: ${color.primary} 0 0 0 1px inset`);
		expect(ele).toHaveStyle(`color: ${color.primary}`);
		cleanup();
		wrapper = render(<Button appearance="secondary">hello</Button>);
		ele = wrapper.getByTestId("button");
		expect(ele).toHaveStyle(`background:${color.secondary}`);
		expect(ele).toHaveStyle(`color: ${color.lightest}`);
		cleanup();
		wrapper = render(<Button appearance="secondaryOutline">hello</Button>);
		ele = wrapper.getByTestId("button");
		expect(ele).toHaveStyle(
			`box-shadow: ${color.secondary} 0 0 0 1px inset`
		);
		expect(ele).toHaveStyle(`color: ${color.secondary}`);
  });
  it('should be render correct size', ()=>{
    const wrapper = render(<Button {...testProps}>hello</Button>);
    const ele = wrapper.getByTestId('button');
    expect(ele).toHaveStyle(`font-size:${typography.size.s1}px`)
  });
  it("should render a link", () => {
		const wrapper = render(
			<Button isLink href="/">
				linkbutton
			</Button>
		);
		const ele = wrapper.getByTestId("button");
		expect(ele).toBeInTheDocument();
		expect(ele.tagName).toEqual("A");
		expect(ele).toHaveAttribute("href", "/");
  });
  it("should render disabled ", () => {
		const wrapper = render(<Button {...disabledProps}>hello</Button>);
		const ele = wrapper.getByTestId("button");
		expect(ele).toBeInTheDocument();
		expect(ele).toHaveStyle("cursor: not-allowed");
    fireEvent.click(ele);
    expect(disabledProps.onClick).not.toHaveBeenCalled();
  });
  it("should render loading ", () => {
		const wrapper = render(<Button isLoading>hello</Button>);
		const ele = wrapper.getByTestId("button");
		expect(ele).toBeInTheDocument();
		expect(ele).toHaveStyle("cursor: progress");
		const text = wrapper.getByText("hello");
		expect(text).toHaveStyle("opacity: 0");
		const wrapper2 = render(
			<Button isLoading loadingText="yehuozhili">
				hello
			</Button>
		);
		const text2 = wrapper2.getByText("yehuozhili");
		expect(text2).toBeTruthy();
	});
	it("should isUnclickable ", () => {
		const wrapper = render(<Button isUnclickable>hello</Button>);
		const ele = wrapper.getByTestId("button");
		expect(ele).toBeInTheDocument();
		expect(ele).toHaveStyle("pointer-events: none");
		fireEvent.click(ele);
		expect(disabledProps.onClick).not.toHaveBeenCalled();
	});
})