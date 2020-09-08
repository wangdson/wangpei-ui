import React, { PropsWithChildren, ReactNode, useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { iconSpin } from "../shared/animation";
import { darken, rgba, opacify } from "polished";
import { easing } from "../shared/animation";
import ReactDom from 'react-dom';
import { messageBoxShadow, IconWrapper, MessageTextWrapper, MessageText } from './style';
import { color } from '../shared/style';
import { Icon } from '../Icon';

export type MessageType =
	| "info"
	| "success"
	| "error"
	| "warning"
	| "loading"
  | "default";
  
export interface MessageConfig {
  /** 挂载点 */
  mount: HTMLElement;
  /** 动画延迟时间 */
  delay: number;
  /** 结束后回调 */
  callback: any;
  /** 动画持续时间 */
  animationDuring: number;
  /** 底色 */
  background: string;
  /** 文本颜色 */
  color: string;
}

/** 默认配置 */
const defaultConfig: MessageConfig = {
  mount: document.body,
  delay: 2000,
  callback: null,
  animationDuring: 300,
  background: color.lightest,
  color: color.dark,
}  

let wrap: HTMLElement;
export const createMessage = (type: MessageType) => {
	return (content: ReactNode, config: Partial<MessageConfig> = {}) => {
    const fconfig = {...defaultConfig, ...config};
    if (!wrap) {
			//如果有的话，说明已经调用过这个函数了，这个空div就可以一直复用
			wrap = document.createElement("div");
			wrap.style.cssText = `line-height:
        1.5;text-align:
        center;color: #333;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        list-style: none;
        position: fixed;
        z-index: 100000;
        width: 100%;
        top: 16px;
        left: 0;
        pointer-events: none;`;
      if (wrap) {
        fconfig.mount.appendChild(wrap); //挂body上
      }
		}

		const divs = document.createElement("div");
		wrap.appendChild(divs);
		ReactDom.render(
			<Message rootDom={wrap} parentDom={divs} content={content} fconfig={fconfig} iconType={type}/>,
			divs
		);
	};
};

export interface MessageProps {
  rootDom: HTMLElement; //这个用来干掉parentDom 这个可以常驻
	parentDom: Element | DocumentFragment; //这个是挂载点 要unmount卸载 完毕后卸载挂载点 注意！一共2步卸载，别漏了
  content: ReactNode;
  fconfig: MessageConfig;
  iconType: MessageType;
}

export function Message(props: PropsWithChildren<MessageProps>){
  const { rootDom, parentDom, content, fconfig, iconType } = props;
  const [close, setClose] = useState(false);

  // icon的render
  const renderIcon = useMemo(()=>{
    switch(iconType) {
      case 'default':
        return null;
      case "info":
        return (
          <IconWrapper>
            <Icon icon="info" color={color.primary}></Icon>
          </IconWrapper>
        );
      case 'success':
        return (
          <IconWrapper>
            <Icon icon="check" color={color.positive}></Icon>
          </IconWrapper>
        ); 
      case 'warning':
        return (
          <IconWrapper>
            <Icon icon="info" color={color.warning}></Icon>
          </IconWrapper>
        ); 
      case 'error':
        return (
          <IconWrapper>
            <Icon icon="closeAlt" color={color.negative}></Icon>
          </IconWrapper>
        );   
      case 'loading':
        return (<IconWrapper spin={true}>
          <Icon icon="sync"></Icon>
        </IconWrapper>);
      default:
        return null;  
    }
  }, [ iconType ]);
  const unmount = useMemo(()=>{
    // 解绑函数
    return ()=>{
      if (parentDom && rootDom) {
        ReactDom.unmountComponentAtNode(parentDom);
        rootDom.removeChild(parentDom);
      }
    }
  },[parentDom, rootDom]);
  
  useEffect(()=>{
    // 结束操作
    // 计算延迟和动画延迟的时间差
    let closeStart = fconfig.delay - fconfig.animationDuring;
    // 先打开
    let timer1 = window.setTimeout(()=>{setClose(true)}, closeStart > 0? closeStart: 0);
    // 再关闭操作
    let timer2 = window.setTimeout(()=>{
      setClose(false);
      unmount();
      if(fconfig.callback) {
        fconfig.callback();
      }
    }, fconfig.delay);
    return ()=>{
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
    }
  }, [unmount,fconfig]);

  // 监测unmount的变化，变化则重新调用
  // useEffect(()=>{
  //   setTimeout(() => {
  //     unmount();
  //   }, 2000);
  // }, [unmount]);
  return (
    <MessageTextWrapper openState={true} closeState={close} ani={fconfig.animationDuring}>
      <MessageText bg={fconfig.background} fc={fconfig.color}>
        {renderIcon}
        {content}
      </MessageText>
    </MessageTextWrapper>
  )
}

export const message = {
	info: createMessage("info"),
	success: createMessage("success"),
	error: createMessage("error"),
	warning: createMessage("warning"),
	loading: createMessage("loading"),
	default: createMessage("default"),
};