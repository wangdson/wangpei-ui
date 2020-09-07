import React, { PropsWithChildren, ReactNode, useState, useMemo, CSSProperties, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ModalWrapper, CloseBtn, ModalMask, ModalViewPort, ConfirmWrapper, TitleWrapper, ChildrenWrapper } from './style';
import { Icon } from '../Icon';
import Button from '../Button';

export interface ModalProps {
  /** 父组件用来控制的变量 */
  visible: boolean;
  /** 容器位置 */
  container?: Element;
  /** 父组件的setState */
  parentSetState: (v:boolean)=>void;
  /** 弹出框标题 */
  title?: ReactNode;
  /** 是否有确认按钮 */
  confirm?: boolean;
  /** 确认按钮文案 */
  okText?: string;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 确认回调 */
  onOk?: (set:(v:boolean) => void) => void;
  /** 取消回调 */
  onCancel?: (set:(v:boolean) => void) => void;
  /** 确认和取消都走一样的回调 */
  callback?: (v:boolean) => void;
  /** 点击mask是否关闭模态框 */
  maskClose?:boolean;
  /** 是否需要mask遮罩层 */
  mask?: boolean; 
  /** 自定义模态框位置 */
  style?: CSSProperties;
  /** 是否有右上角关闭按钮 */
  closeButton?: boolean;
  /** 动画时间 */
  delay?: number;
  /** 是否停止滚动 */
  stopScroll?: boolean;
  /** portal层样式 */
  portralStyle?: CSSProperties;
  /** portral回调 */
  refCallback? :(ref:HTMLDivElement) => void;
  /** 点击关闭事件 */
  closeCallback?: ()=>void;
}

/**
 * animation事件
 */
export function useStateAnimation(
  parentSetState: (v:boolean) => void,
  delay: number = 100
):[boolean, (c:boolean) => void, () => void]{
  const [state, setState] = useState(true);
  const [innerClose, unmount] = useMemo(()=>{
    let timer: number;
    let innerClose = (v: boolean) => {
      setState(v);
      timer = setTimeout(()=>{
        parentSetState(v);
        setState(true);
      }, delay);
    };
    let unmount = ()=>{clearTimeout(timer);}
    return [innerClose, unmount];
  },[setState, parentSetState, delay]);
  return [state, innerClose, unmount];
}
/**
 * 在modal开启后，如果还能滚动就会显得很怪异，antd的modal打开后就不会滚动
 * @param props 
 */
export function useStopScroll(state: boolean, delay: number, open?: boolean){
  if(open) {
    let width = window.innerWidth - document.body.clientWidth;
    // 当前modal是否是打开状态，打开状态则让底层的body部分不让滑动
    if(state) {
      document.body.style.overflow = 'hidden';
      document.body.style.width = `clac(100%-${width}px)`;
    } else {
      setTimeout(()=>{
        document.body.style.overflow = 'auto';
        document.body.style.width = '100%';
      }, delay);
    }
  }
}

export function Modal(props: PropsWithChildren<ModalProps>){
  const {
    visible,
		maskClose,
		closeButton,
		delay,
		mask,
		container,
		confirm,
		okText,
		style,
		cancelText,
		onOk,
		onCancel,
		callback,
		title,
		parentSetState,
		stopScroll,
		portralStyle,
		refCallback,
		closeCallback,
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState, unmount] = useStateAnimation(parentSetState, delay);
  const render = useMemo(()=>{
    if(!visible) {
      unmount();
      return null;
    } else {
      return createPortal(<ModalWrapper ref={ref} style={portralStyle} id="modal">
        <ModalViewPort style={style} visible={visible} delay={delay!}>
          <div>
            {title && <TitleWrapper>{title}</TitleWrapper>}
            {closeButton && <CloseBtn
              id="closeBtn" 
              style={{
                background: "white",
                borderRadius: "5px",
                padding: "5px",
              }}
              onClick={()=>{
                setState(false);
                if(closeCallback) closeCallback();
            }}>
              <Icon icon="closeAlt"></Icon>
            </CloseBtn>}
          </div>
          <ChildrenWrapper>{props.children}</ChildrenWrapper>
          {confirm && (
            <ConfirmWrapper>
              <Button appearance="secondary" onClick={()=>{
                onOk? onOk(setState): setState(false);
                if(callback) callback(true);
              }}>
                {okText || '确认'}
              </Button>
              <Button appearance="secondary" 
                style={{ marginLeft: "10px" }}
                onClick={()=>{
                  onCancel? onCancel(setState): setState(false);
                  if(callback) callback(false);
              }}>
                {cancelText || '取消'}
              </Button>
            </ConfirmWrapper>
          )}
        </ModalViewPort>
        {mask && (
          <ModalMask onClick={()=>{
            if(!maskClose) return;
            setState(false);
            if(closeCallback) closeCallback();
          }} data-testid="modalMask"></ModalMask>
        )}
      </ModalWrapper> ,container!);
    }
  }, [
    callback,
		cancelText,
		closeButton,
		closeCallback,
		confirm,
		container,
		mask,
		maskClose,
		okText,
		onCancel,
		onOk,
		portralStyle,
		props.children,
		setState,
		style,
		title,
		state,
		visible,
		delay,
		unmount,
  ]);
  useStopScroll(visible, delay!, stopScroll);
  // refCallback变化则触发当前的ref回调
  useEffect(()=>{
    if(refCallback && ref.current) {
      refCallback(ref.current);
    } 
  }, [refCallback]);
  return (
    <div id="test">
     {render}
    </div>
  );
}

Modal.defaultProps = {
    visible: false,
		maskClose: true,
		closeButton: true,
		delay: 1000,
		mask: true,
		container: document.body,
		confirm: true,
		title:'',
		stopScroll: true,
}

export default Modal;