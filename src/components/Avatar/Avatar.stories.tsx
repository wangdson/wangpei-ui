import React from 'react';
import { withKnobs, select, color, text, boolean } from '@storybook/addon-knobs';
import { Avatar, AvatarSize , AvatarProps } from './index';
import styled from 'styled-components';

export default{
  title: 'View/ Avatar',
  component: Avatar,
  decorators: [withKnobs]
}

const Sizes = {};
Object.keys(AvatarSize).reduce((prev: Record<string, string>, current: string) => {
  prev[current] = current;
  return prev;
} , Sizes);

export const knobsAvatar = () => (
  <Avatar 
    size={select('size', Sizes, 'medium')}
    username={text('username', 'wangpei')}
    src={text('src', 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png')}
    isLoading={boolean('isLoading', false)}
  />
);

export const allSize = () => (
  <>
    {Object.keys(AvatarSize).map(item => (<Avatar size={item as keyof typeof AvatarSize} username="wangpei" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />))}
  </>
)

export const large = () => (
	<div>
		<Avatar isLoading size="large" />
		<Avatar size="large" username="wangpei" />
		<Avatar
			size="large"
			username="wangpei"
			src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
		/>
	</div>
);

export const medium = () => (
	<div>
		<Avatar isLoading size="medium" />
		<Avatar size="medium" username="wangpei" />
		<Avatar
			size="medium"
			username="wangpei"
			src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
		/>
	</div>
);

export const small = () => (
	<div>
		<Avatar isLoading size="small" />
		<Avatar size="small" username="wangpei" />
		<Avatar
			size="small"
			username="wangpei"
			src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
		/>
	</div>
);
