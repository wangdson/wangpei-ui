import React, { PropsWithChildren, ReactNode, useState, useMemo, useEffect, CSSProperties } from 'react';
import { progressFlash, 
  BarWrapper, 
  BarMain,
  BarMainWrapper,
  BarText,
  CircleWrapper,
  CircleText
 } from './style';
 import { color } from '../shared/style';

export interface ProgressProps {
  /** 当前百分比 */
  count: number;
  /** 是否要末尾计数文本 */
  countNumber?: boolean;
  /** 长方形进度条使用 高度 */
  height?: number;
  /** 是否是环形 */
  circle?: boolean;
  /** 环形大小 */
  size?: number;
  /** 自定义环状进度条文本内容 */
  circleText?: ReactNode;
  /** 自定义长度进度条文本内容 */
  progressText?: ReactNode;
  /** 长条闪烁动画颜色 */
  flashColor?: string;
  /** 主色 */
	primary?: string;
	/** 副色 */
  secondary?: string;
  /** 底座色 */
	bottomColor?: string;
	/** 外层容器style*/
  style?: CSSProperties;
  /** 外层容器类名 */
	classname?: string;
}

export function Progress(props: PropsWithChildren<ProgressProps>){
  const {
		count,
		countNumber,
		height,
		circle,
		size,
		circleText,
    progressText,
    flashColor,
		primary,
		secondary,
		bottomColor,
		style,
		classname,
	} = props;
  const [state, setState] = useState(0);
  const [dasharray, setdashArray] = useState("");
  useMemo(()=>{
    if(count < 0){
      setState(0);
    } else if(count > 100) {
      setState(100)
    } else {
      setState(count);
    }
  }, [count]);
  useEffect(() => {
		if (circle) {
			let percent = state / 100;
			let perimeter = Math.PI * 2 * 170; //周长
			let dasharray =
        perimeter * percent + " " + perimeter * (1 - percent);
			setdashArray(dasharray);
		}
  }, [circle, state]);
  const render = useMemo(()=>{
    if(circle) {
      return (
        <CircleWrapper style={style} className={classname}>
          <svg width={size} height={size} viewBox="0 0 420 420" style={{ transform:'rotate(270deg)' }}>
            <defs>
              <radialGradient
                id="linear"
								r="100%"
								cx="100%"
								cy="100%"
								spreadMethod="pad"
              >
                <stop offset="0%" stopColor="#40a9ff" />
								<stop offset="100%" stopColor="#36cfc9" />
              </radialGradient>
            </defs>
            <circle
							cx="210"
							cy="210"
							r="170"
							strokeWidth="40"
							stroke="#f5f5f5"
							fill="none"
						></circle>
            <circle
							cx="210"
							cy="210"
							r="170"
							strokeWidth="40"
							stroke="url(#linear)"
							fill="none"
							opacity={state === 0 ? 0 : 1}
							strokeLinecap="round"
							strokeDasharray={dasharray}
							strokeDashoffset={"0px"}
							style={{
								transition:
									"stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s ease 0s, stroke-width 0.06s ease 0.3s",
							}}
						></circle>
          </svg>
          <CircleText size={size!}>
						{circleText ? circleText : `${state}%`}
					</CircleText>
        </CircleWrapper>
      )
    } else {
      return (
        <BarWrapper style={style} className={classname}>
          <BarMainWrapper bottomColor={bottomColor!} height={height}>
            <BarMain flashColor={flashColor!}
							primary={primary!}
							secondary={secondary!}
							state={state}
							height={height}>
            </BarMain>
          </BarMainWrapper>
          {countNumber && (
						<BarText height={height}>
							{progressText ? progressText : `${state}%`}
						</BarText>
					)}
        </BarWrapper>
      );
    }
  }, [circle,
		circleText,
		countNumber,
		dasharray,
		height,
		progressText,
		size,
    state,
    primary,
    secondary,
    bottomColor,
		style,
		classname,]);
  return <>{render}</>;
}

Progress.defaultProps = {
	countNumber: true,
	cicrle: false,
  size: 100,
  primary: color.primary,
	secondary: color.gold,
	flashColor: color.lightest,
	bottomColor: color.medium,
};

export default Progress;