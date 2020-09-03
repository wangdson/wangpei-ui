import React, { ReactNode, ReactElement } from 'react';
// 计算当前显示索引
export const computedIndexMap = (current: number, indexMap:[number, number, number]):[number, number, number] => {
  let mid = indexMap[1];
  if(mid === current) {
    return indexMap;
  } else if(mid < current) {
    return [mid, current, -1];
  } else {
    return [-1, current, mid];
  }
}

type MoveActionParam = {
  right: boolean;
  totalLen: number;
  indexMap: [number, number, number];
  setIndexMap: React.Dispatch<React.SetStateAction<[number, number, number]>>;
};
/**
 * 自动滚动事件
 * @param param0 
 */
export const moveAction = ({
  right,
  totalLen,
  indexMap,
  setIndexMap
}: MoveActionParam) => {
  let startIndex:number;
  // 是否是自动往右侧滚动
  if(right) {
    if(indexMap[1]< totalLen - 1) {
      startIndex = indexMap[1]+1;
    } else {
      startIndex = 0;
    }
  } else {
    if(indexMap[1] > 0) {
      startIndex = indexMap[1]-1;
    } else {
      startIndex = totalLen - 1;
    }
  }
  // 重新设置新值
  setIndexMap(computedIndexMap(startIndex, indexMap));
}

type PicArguments = {
  indexMap: [number, number, number],
  children: ReactNode,
  totalLen: number,
}
/**
 * 计算当前轮播图中轮播图中的元素列表
 * @param PicArguments 
 */
export const computedPics = ({
  indexMap,
  children,
  totalLen,
}: PicArguments) => {
  if(totalLen === 1) {
    return [null, children, null]
  } else {
    return indexMap.map((v,k)=>{
      if(v === -1) {
        return null;
      }
      let child = children as ReactElement[];
      return child[v];
    })
  }
};
