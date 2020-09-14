import React from 'react';
import { Icon, IconProps } from '../components/Icon';
import { render, cleanup } from '@testing-library/react';
import { icons } from '../components/shared/icons';

function TestIcon(icon: IconProps['icon']) {
  const wrapper = render(<Icon icon={icon}/>);
  const pathEle = wrapper.getByTestId('icon-path');
  expect(pathEle).toHaveAttribute('d', icons[icon]);
  cleanup();
}

describe('test Icon component', ()=>{
  it('it should be render corrent icon', ()=>{
    Object.keys(icons).forEach(key => TestIcon(key as keyof typeof icons));
  });
  it('it should render block', ()=>{
    const wrapper = render(<Icon icon="mobile" block />);
    const svgEle = wrapper.getByTestId('icon-svg');
    // expect(svgEle).toHaveStyle('display:block');
    cleanup();
  })
  it('it should render right color', ()=>{
    const wrapper1 = render(<Icon icon='mobile' />);
    const pathEle1 = wrapper1.getByTestId('icon-path');
    expect(pathEle1).toHaveAttribute('color', 'black');
    cleanup();
    const wrapper2 = render(<Icon icon='mobile' color='red'/>);
    const pathEle2 = wrapper1.getByTestId('icon-path');
    expect(pathEle2).toHaveAttribute('color', 'red');
  })
})