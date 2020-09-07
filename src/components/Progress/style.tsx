import styled,{keyframes} from 'styled-components';
import {typography} from '../shared/style';

export const progressFlash = keyframes`
  0% {
    opacity: 0.1;
    width: 0;
  }
  20% {
    opacity: 0.5;
    width: 0;
  }
  100% {
    opacity: 0;
    width: 100%
  }
`;

export const BarWrapper = styled.div`
  display: flex;
  padding: 5px;
  align-items: center;
`; 

export interface BarMainProps {
	state: number;
	height?: number;
	flashColor: string;
	primary: string;
	secondary: string;
}

export const BarMain = styled.div<BarMainProps>`
  width: ${(props) => props.state}%;
  height: ${(props) => (props.height ? props.height : 8)}px;
  background-color: ${(props) => props.primary};
  background-image: linear-gradient(
    to right,
    ${(props) => props.primary},
    ${(props) => props.secondary}
  );
  transition: all 0.4s cubic-bezier(0.08, 0.82, 0.17, 1) 0s;
  border-radius: 5px;
  position: relative;
  &::before {
    animation: ${progressFlash} 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite;
    background: ${(props) => props.flashColor};
    border-radius: 10px;
    bottom: 0;
    content: "";
    left: 0;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
`;

export const BarMainWrapper = styled.div<{ bottomColor: string; height?: number }>`
	width: 100%;
	border-radius: 5px;
	position: relative;
	background: ${(props) => props.bottomColor};
	height: ${(props) => (props.height ? props.height : 8)}px;
`;
export const BarText = styled.div<{ height?: number }>`
	line-height: ${(props) => (props.height ? props.height : 8)}px;
	font-weight: ${typography.weight.bold};
	text-align: center;
	display: inline-block;
	margin-left: 10px;
	min-width: 55px;
`;
export const CircleWrapper = styled.div`
	position: relative;
	display: inline-block;
	border-radius: 50%;
`;

export const CircleText = styled.div<{ size: number }>`
	line-height: ${(props) => props.size * 0.62}px;
	width: ${(props) => props.size * 0.62}px;
	height: ${(props) => props.size * 0.62}px;
	border-radius: 50%;
	display: inline-block;
	font-weight: ${typography.weight.bold};
	left: 50%;
	position: absolute;
	text-align: center;
	top: 50%;
	transform: translateX(-50%) translateY(-50%);
`;


