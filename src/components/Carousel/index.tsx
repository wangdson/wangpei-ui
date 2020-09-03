import React, { PropsWithChildren, ReactNode, useState, useMemo, useEffect, ReactElement, useRef, TouchEvent } from 'react';
import styled from 'styled-components';
import Radio from '../Radio';
import { computedPics, computedIndexMap, moveAction } from './action';
import { color } from '../shared/style';

interface AnimationType {
  animatein: boolean;
  direction: ''| 'left' |'right';
  delay?: number,
}

const Transition = styled.div<AnimationType>`
  ${props => props.animatein && `transform: translateX(0);transition: all ${props.delay! / 1000}s ease`}
`;

type WrapperProps = {
  viewportBoxShadow?: string
}
const Wrapper = styled.div<WrapperProps>`
  box-shandow: ${props => props.viewportBoxShadow};
  padding: 10px;
  border-radius: 5px;
`;

export interface CarouselProps {
  /** 默认索引 */
  defaultIndex?: number;
  /** 轮播图高度 */
  height?: number;
  /** 方案动画延迟 */
  delay?: number;
  /** 是否自动播放 */
  autoPlay?: boolean;
  /** 自动播放时间间隔 */
  autoPlayDelay?: number;
  /** 自动轮播方向 true: 从左往右 false: 从右往左 */
  autoPlayReverse?: boolean;
  /** radio 颜色 */
  radioAppear?: keyof typeof color;
  /** 外边框shadow样式 */
  viewportBoxShadow?: string;
}

// 设置组件默认值
Carousel.defaultProps = {
  defaultIndex: 0,
  delay: 1000,
  height: 200,
  autoPlay: true,
  autoPlayDelay: 3000,
  autoPlayReverse: false,
}

/**
 * 轮播图组件
 * @param props 
 */
export function Carousel(props: PropsWithChildren<CarouselProps>){
  const { defaultIndex, height, delay, autoPlay, autoPlayDelay, children, autoPlayReverse, radioAppear, viewportBoxShadow } = props;
  // 设置轮播需要展示的元素
  const [pic, setPic] = useState<ReactNode[]>([]);
  // 设置显示索引,我们涉及到动画跳转，我们使用三个元素宽，确保中间的是显示，第一张和第三张是左右切换后显示
  const [indexMap, setIndexMap] = useState<[number, number, number]>([-1,-1,-1]);
  // 图片宽度展示
  const [bound, setBound] = useState<DOMRect>();
  // 根据索引判断动画方向
  const [animation, setAnimation] = useState<AnimationType>({
    animatein: true,
    direction: ''
  });
  // 滑动效果，计算滑动起点
  const [start, setStart] = useState(0);
  const touchStart = (e: TouchEvent<HTMLDivElement>) => {
    setStart(e.touches[0].clientX);
  }
  const touchEnd = (e: TouchEvent<HTMLDivElement>) => {
    let end = e.changedTouches[0].clientX;
    let val = end - start;
    let abs = Math.abs(val);
    let touchDiff = 50;
    if(abs > touchDiff!) {
      if(val > 0) {
        moveAction({right: false, totalLen, indexMap, setIndexMap});
      } else {
        moveAction({right: true, totalLen, indexMap, setIndexMap});
      }
    }
  }

  // 判断当前滚动的数量，根据children来算
  const totalLen = useMemo(()=>{
    let len: number = 1;
    if(children instanceof Array) {
      len = children.length;
    }
    return len;
  }, [children]);

  // defaultIndex children totalLen变化的时候去重新计算当前要展示的图片列表和显示索引
  useEffect(()=>{
    let keyMap: [number, number, number] = [-1, -1, -1];
    keyMap[1] = defaultIndex!;
    let picRes = computedPics({children, totalLen, indexMap: keyMap});
    setPic(picRes);
    setIndexMap(keyMap);
  }, [defaultIndex, children, totalLen]);

  // 监听 delay，indexMap, children 变化，设置当前动画方向并且按照delay时间去滚动变化
  useEffect(() => {
    let child = children as ReactElement[];
    let timer: number;
    // 判断当前是否有子节点
    if(child) {
      let temp = indexMap.map((v)=>{
        return v === -1 ? null: child[v];
      })
      // 获取当前的轮播图的数据源
      setPic(temp);
      let sign: boolean; // 判断当前的animation的方向， true: 右移动 indexMap.[0]===-1 false: 左移动 indexMap.[0]===1
      // 判断当前的轮播图的数据源是否只有1个
      if(indexMap[0] === -1 && indexMap[2]===-1) {
        return;
      } else if(indexMap[0] === -1) {
        sign = true;
        setAnimation({animatein: false, direction: 'right'}); 
      } else {
        sign = false;
        setAnimation({animatein: false, direction: 'left'});
      }
      timer = setTimeout(()=>{
        if(sign) {
          setAnimation({animatein: false, direction: 'right'}); 
        } else {
          setAnimation({animatein: false, direction: 'left'}); 
        }
      }, delay);
      // 返回取消定时任务函数
      return () => clearTimeout(timer);
    }
    
  }, [delay, indexMap, children]);

  // 根据autoPlay autoPlayDelay indexMap, totalLen的变化来控制滚动效果
  useEffect(()=>{
    let timer: number;
    if(autoPlay) {
      timer = setTimeout(()=>{
        moveAction({right: !autoPlayReverse, totalLen, indexMap, setIndexMap});
      }, autoPlayDelay);
    }
    return () => clearTimeout(timer);
  }, [autoPlay, autoPlayDelay, indexMap, totalLen, autoPlayReverse]);

  const ref = useRef<HTMLDivElement>(null);
  // 初始化操作，监听window.resize事件去控制bound模块的宽度 getBoundingClientRect
  useEffect(()=>{
    const setBoundFunc = () =>{
      // 根据ref拿到当前的标签设置bound
      if(ref.current) {
        let bounds = ref.current?.getBoundingClientRect();
        setBound(bounds);
      }
    }
    setBoundFunc();
    // 监听widnow.resize
    const resizeFunc = () => {
      setBoundFunc();
    }
    window.addEventListener('resize', resizeFunc);
    return () => window.removeEventListener('resize', resizeFunc);
  }, []);
  return <div ref={ref}>
    <Wrapper className="wrapper" viewportBoxShadow={viewportBoxShadow}>
      <div className="viewport" style={{width: '100%', 
          height:`${height}px`, 
          overflow: "hidden",
          borderRadius: "10px",
          boxShadow: viewportBoxShadow,
          position: "relative"}} 
          onTouchStart={touchStart}
          onTouchEnd={touchEnd} >
        <Transition animatein={animation.animatein} direction={animation.direction} delay={delay}>
          <div style={{
            display:'flex',
            width: `${bound?.width! * 3}px`,
            position: 'absolute',
            left: `-${bound?.width}px`
          }}>
            {pic.map((picItem,i) => (
              <div key={`key${i}`}
                style={{
                  height: `${height}px`,
                  width: `${bound?.width}px`
                }}
              >
                {picItem}
              </div>
            ))}
          </div>
        </Transition>
      </div>
      <ul style={{
        display: "flex",
        justifyContent:'center',
        alignItems:'center'
      }}>
        {
          new Array(totalLen).fill(1).map((x,y) => {
            return <Radio 
              label="" 
              key={`radio${y}`} 
              hideLabel
              value={0}
              appearance={radioAppear}
              checked={y === indexMap[x]}
              onChange={()=>{}}
              onClick={()=>{
                let newMap = computedIndexMap(y, indexMap);
                setIndexMap(newMap);
              }}
            />
          })
        }
      </ul>
    </Wrapper>
  </div>;
}

export default Carousel;