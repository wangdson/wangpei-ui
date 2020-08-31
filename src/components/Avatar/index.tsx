import React, { useMemo } from 'react';
import { glow } from '../shared/animation';
import {Icon} from '../Icon';
import { color, typography } from '../shared/style';
import styled, { css } from 'styled-components';

export const AvatarSize = {
  tiny: 16,
  small: 20,
  medium: 28,
  large: 40,
}

export interface AvatarProps {
  /** 是否加载中 */
  isLoading?: boolean,
  /** 用户名 */
  username?: string,
  /** button大小 */
  size?: keyof typeof AvatarSize,
  /** 图片地址 */
  src?: null|string,
}

const Image = styled.div<AvatarProps>`
  background: ${props => (!props.isLoading? 'transparent': color.lightest)};
  border-radius: 50%;
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
  text-transform: uppercase;
  height: ${props => AvatarSize[props.size as keyof typeof AvatarSize]}px;
  width: ${props => AvatarSize[props.size as keyof typeof AvatarSize]}px;
  line-height: ${props => AvatarSize[props.size as keyof typeof AvatarSize]}px;
  img {
    width: 100%;
    height: auto;
    display: block;
  }
  svg {
    position: relative;
    bottom: -2px;
    height: 100%;
    width: 100%;
    vertical-align: top;
  }
  path {
    fill: ${color.medium},
    animation: ${glow} 1.5s ease-in-out infinite;
  }
`;

const Initial = styled.div<AvatarProps>`
  background: ${color.darkest};
  color: ${color.lightest};
  text-align: center;
  font-size: ${typography.size.s2}px;
  line-height: ${AvatarSize.medium}px;
  ${props => props.size === 'tiny' && css`
    font-size: ${parseFloat(typography.size.s1) - 2}px;
    line-height: ${AvatarSize.tiny}px;
  `}
  ${props => props.size === 'small' && css`
    font-size: ${typography.size.s1}px;
    line-height: ${AvatarSize.small}px;
  `}
  ${props => props.size === 'large' && css`
    font-size: ${typography.size.s3}px;
    line-height: ${AvatarSize.large}px;
  `}
`;

interface AllyProps {
  [key : string]: boolean|string
}

/**
 * 头徽组件
 * @param props 
 */
export function Avatar(props: AvatarProps) {
  const { isLoading, username, src, size } = props;
  const avatarFigure = useMemo(()=>{
    let avatarDom = <Icon icon='useralt' />;
    const allyProps: AllyProps = {};
    if(isLoading) {
      allyProps['aria-busy'] = true;
      allyProps['aria-label'] = 'Loading avatar ...';
    } else if(src) {
      avatarDom = (<img src={src} alt={username} data-testid="avatar-img" />)
    } else {
      allyProps['aria-label'] = username!;
      avatarDom = (<Initial size={size} aira-hidden="true" data-testid="avatar-username">{username!.substring(0,1)}</Initial>);
    }
    return avatarDom;
  }, [isLoading, src, size, username]);

  return <Image size={size} isLoading={isLoading} src={src} data-testid="avatar-div" {...props}>{avatarFigure}</Image>
}

/**
 * 默认值数据
 */
Avatar.defaultProps = {
  size: 'medium',
  src: null,
  isLoading: false,
  username: 'loading'
};