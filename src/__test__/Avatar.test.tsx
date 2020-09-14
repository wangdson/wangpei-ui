import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Avatar, AvatarProps, AvatarSize } from '../components/Avatar';

describe('Avatar component test', ()=>{
  it('it should render default Avatar', ()=>{
    let wrapper = render(<Avatar />);
    expect(wrapper).toMatchSnapshot();
    let div = wrapper.getByTestId('avatar-div');
    expect(div).toBeInTheDocument();
    let username = wrapper.getByText('l');
    expect(username).toBeTruthy();
  })

  it('it should render corrent size', ()=>{
    let wrapper = render(<Avatar />);
    let div = wrapper.getByTestId('avatar-div');
    // expect(div).toHaveStyle(`height: ${AvatarSize.medium}px`);
    // expect(div).toHaveStyle(`width: ${AvatarSize.medium}px`);
    // expect(div).toHaveStyle(`line-height: ${AvatarSize.medium}px`);
    let username = wrapper.getByTestId('avatar-username');
    // expect(username).toHaveStyle(`line-height:${AvatarSize.medium}px`);
    cleanup();
    wrapper = render(<Avatar size="small"/>);
    div = wrapper.getByTestId('avatar-div');
    // expect(div).toHaveStyle(`height: ${AvatarSize.small}px`);
    // expect(div).toHaveStyle(`width: ${AvatarSize.small}px`);
    // expect(div).toHaveStyle(`line-height: ${AvatarSize.small}px`);
    username = wrapper.getByTestId('avatar-username');
    // expect(username).toHaveStyle(`line-height:${AvatarSize.small}px`);
    cleanup();
    wrapper = render(<Avatar size="large"/>);
    div = wrapper.getByTestId('avatar-div');
    // expect(div).toHaveStyle(`height: ${AvatarSize.large}px`);
    // expect(div).toHaveStyle(`width: ${AvatarSize.large}px`);
    // expect(div).toHaveStyle(`line-height: ${AvatarSize.large}px`);
    username = wrapper.getByTestId('avatar-username');
    // expect(username).toHaveStyle(`line-height:${AvatarSize.large}px`);
    cleanup();
    wrapper = render(<Avatar size="tiny"/>);
    div = wrapper.getByTestId('avatar-div');
    // expect(div).toHaveStyle(`height: ${AvatarSize.tiny}px`);
    // expect(div).toHaveStyle(`width: ${AvatarSize.tiny}px`);
    // expect(div).toHaveStyle(`line-height: ${AvatarSize.tiny}px`);
    username = wrapper.getByTestId('avatar-username');
    // expect(username).toHaveStyle(`line-height:${AvatarSize.tiny}px`);
  });
  it('should render corrent svg', ()=>{
    let wrapper = render(<Avatar isLoading />);
    expect(wrapper).toMatchSnapshot();
    let svg = wrapper.getByTestId('icon-svg');
    expect(svg).toBeVisible();
    cleanup();
    wrapper = render(<Avatar isLoading username="123" src='/' size='tiny'/>);
    svg = wrapper.getByTestId('icon-svg');
    expect(svg).toBeVisible();
  });
  it('should render corrent img', ()=>{
    let wrapper = render(<Avatar src="www.test.com" />);
    let img = wrapper.getByTestId('avatar-img');
    expect(img.tagName).toEqual('IMG');
    // expect(img).toHaveStyle('width: 100%');
    expect(img).toHaveAttribute('src', 'www.test.com');
    expect(img).toHaveAttribute('alt', 'loading');
    cleanup();
    wrapper = render(<Avatar src="www.wangdson.com" username="wangdson"/>);
    img = wrapper.getByTestId('avatar-img');
    expect(img).toHaveAttribute('src', 'www.wangdson.com');
    expect(img).toHaveAttribute('alt', 'wangdson');
  })
  it('should render corrent username', ()=>{
    let wrapper = render(<Avatar username="wangdson" />);
    expect(wrapper).toMatchSnapshot();
    let div = wrapper.getByTestId('avatar-div');
    // expect(div).toHaveStyle('text-transform:uppercase');
    let username = wrapper.getByText('w');
    expect(username).toBeVisible();
    cleanup();
    wrapper = render(<Avatar username="中文" />);
    username = wrapper.getByText('中');
    expect(username).toBeVisible();
  })
})