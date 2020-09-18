import React, { PropsWithChildren, useEffect, useMemo, useState, CSSProperties } from 'react';
import { color, typography } from "../shared/style";
import { darken, rgba, opacify } from "polished";
import { easing } from "../shared/animation";
import Button from '../Button';
import { Icon } from '../Icon';
import { PageUl } from './style';
import { calculateMove } from './action';

export * from './Table';

export interface PaginationProps {
  /** 每页显示多少条数据 */
  pageSize?: number;
  /** 默认显示第几页 */
  defaultCurrent?: number;
  /** 总数据量 */
  total: number;
  /** 外层style*/
	style?:CSSProperties;
	/**外层类名 */
  classnames?:string;
  /** 分页最大显示长度 */
  maxPage?: number;
  /** 回调函数 */
  callback?: (v: number)=>void;
}


/**
 * 表格分页组件
 * @param props 
 */
export function Pagination(props: PropsWithChildren<PaginationProps>){
  const { pageSize, total, maxPage, callback, defaultCurrent, style, classnames } = props;
  const [current, setCurrent] = useState(defaultCurrent!);
  const [page, setPage] = useState<Array<number>>();
  const size = Math.ceil(total / pageSize!);
  const totalPage = useMemo(()=>{
    const size = Math.ceil(total / pageSize!);
    let tempPage;
    if(size > maxPage!) {
      tempPage = Array.from({length: maxPage!}).fill(1).map((x,y)=> y + 1);
    } else {
      tempPage = Array.from({length: size}).fill(1).map((x,y) => y + 1);
    }
    setPage(tempPage);
    // let arr = calculateMove(current, tempPage!, size);
    // if(arr) {
    //   setPage(arr);
    // }
    return size;
  },[total, pageSize, maxPage]);
  /** 当current有变化则返回回去 */
  useEffect(()=>{
    if(callback){
      callback(current);
    }
  }, [callback, current]);

  return (
    <PageUl style={style} className={classnames}>
      <li>
        <Button appearance="primaryOutline" disabled={current === 1 ? true: false} onClick={()=>{
          if(page && page.length) {
            if(page[0] > 1) {
              // 当前离第一页有偏移
              setCurrent((state)=>state-1);
              const mid = Math.floor(maxPage! / 2);
              if(current <= page[mid]) {
                let tempPage = page.map(x => x + current - page[mid] - 1)
                setPage(tempPage);
              }
            } else if(current !== page[0]) {
              // 当前位置不在第一位，但是当前页要往前进一位
              setCurrent((state)=>state-1);
            }
          }
        }}>
          <Icon icon="arrowleft"></Icon>
        </Button>
      </li>
      {page && page.map((item, i) => (
        <li key={i}>
          <Button appearance={item===current ? 'primary': 'primaryOutline'} onClick={()=>{
            setCurrent(item);
            let arr = calculateMove(item, page!, size);
            if(arr) {
              setPage(arr);
            }
          }}>
            {item}
          </Button>
        </li>
      ))}
      <li>
        <Button appearance="primaryOutline" disabled={current === totalPage ? true: false} onClick={()=>{
          if(page && page.length) {
            if(page[page.length-1] < totalPage){
              // 如果当前显示的数组最后一位不是最大页码
              setCurrent((state)=>state+1);
              const mid = Math.floor(maxPage! / 2);
              if(current >= page[mid]) {
                let tempPage = page.map(x=>x + current - page[mid] +  +1);
                setPage(tempPage);
              }
            } else if(current !== page[page.length-1]){
              // 判断当前页码是不是可显示页码列表的最后一页
              setCurrent((state)=>state+1);
            }
          }
        }}>
          <Icon icon="arrowright"></Icon>
        </Button>
      </li>
    </PageUl>
  );
}

Pagination.defaultProps = {
  total: 1000,
  pageSize: 10,
  maxPage: 5,
  defaultCurrent: 11
}

export default Pagination;