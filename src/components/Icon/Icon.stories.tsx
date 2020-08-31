import React from 'react';
import { withKnobs, select, color } from '@storybook/addon-knobs';
import { Icon, IconProps } from './index';
import {icons} from '../shared/icons';
import styled from 'styled-components';

export default {
  title: 'Icon / icon',
  component: Icon,
  decorators: [withKnobs],
}

export const knobsBtn = () => (
  <Icon 
    icon={select<IconProps['icon']>('icon', Object.keys(icons) as IconProps['icon'][], 'bookmark')}
    color={color('color', 'black')}
  ></Icon>
);

const Meta = styled.div`
  color: #666;
  font-size: 12px;
  margin-top: 4px;
`;

const List = styled.ul`
  display: flex;
  flex-flow: row wrap;
  list-style: none;
`;

const Item = styled.li`
  display: inline-flex;
  flex-direction: row;
  align-item: center;
  flex: 0 1 0%;
  min-width: 120px;
  padding: 0px 7.5px 20px;
  svg {
    margin-right: 10px;
    width: 24px;
    height: 24px;
  }
`;

export const labels = () => (
  <>
    There are {Object.keys(icons).length} icons
    <List>
      {Object.keys(icons).map(key => (
        <Item key={key}>
          <Icon icon={key as keyof typeof icons}></Icon>
          <Meta>{key}</Meta>
        </Item>
      ))}
    </List>
  </>
)