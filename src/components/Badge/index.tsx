import React, { PropsWithChildren, HTMLAttributes } from 'react';
import styled from 'styled-components';
import { color, background, typography } from "../shared/style";

/**
 * 徽章颜色
 */
export const badgeColor = {
  positive: color.positive,
  negative: color.negative,
  neutral: color.dark,
  warning: color.warning,
  error: color.lightest
}

/**
 * 徽章背景色
 */
export const badgeBackground = {
  positive: background.positive,
  negative: background.negative,
  neutral: color.mediumlight,
  warning: background.warning,
  error: color.negative
}

const BadgeWrapper = styled.div<BadgeProps>`
  display: inline-block;
  vertical-align: top;
  font-size: 11px;
  line-height: 12px;
  padding: 4px 12px;
  border-radius: 3em;
  font-weight: ${typography.weight.bold};
  color: ${props => badgeColor[props.status!]};
  background: ${props => badgeBackground[props.status!]};

  svg {
    width: 12px;
    height: 12px;
    margin-top: -2px;
    margin-right: 4px;
  }
`;

type Status = 'positive'|'negative'|'neutral'|'warning'|'error'; 
type StatusObj = {
  [key in Status]: Status
}

export const statusList:StatusObj = {
	'positive': 'positive',
	'negative':'negative',
	'neutral': 'neutral',
	'warning': 'warning',
	'error':'error'
}

/**
 * 徽章组件类型描述
 */
export interface BadgeProps extends HTMLAttributes<HTMLDivElement>{
  status?: Status; 
  className?: string;
}

/**
 * 徽章组件
 * @param props 
 */
export function Badge(props: PropsWithChildren<BadgeProps>){
  return <BadgeWrapper {...props} status={props.status}>{props.children}</BadgeWrapper>
}

Badge.defaultProps = {
  status: 'neutral'
}

export default Badge;