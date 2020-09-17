import { RefObject, useEffect } from "react";
import { CalDataType } from './index';

/**
 * 点击外部操作不执行函数
 * @param ref 
 * @param handler 
 */
export function useClickOutside(
  ref: RefObject<HTMLElement>,
  handler: Function
){
  useEffect(()=>{
    const listener = (event: MouseEvent) => {
      // 如果当前监听的
      if(!ref.current || ref.current.contains(event.target as Node)){
        return;
      }
      handler();
    }
    window.addEventListener('click', listener);
    return () => window.removeEventListener('click', listener);
  }, [ref, handler]);
}

/**
 * 返回年月对应的日期数据列表
 */
export function getDateData(year: number, month: number, day: number){
  let today = new Date();
  let firstDate = new Date(year, month, 1);
  const weekDay = firstDate.getDay() === 0 ? 7 : firstDate.getDay();
  let startTime = firstDate.getTime() - weekDay * 24 * 60 * 60 * 1000;
  let arr: any[] = [];
  // 获取遍历后的日历数据
  for(let i=0; i<42; i++) {
    let current = new Date(startTime + i * 24 * 60 * 60 * 1000);
    arr.push({
      day: current.getDate(),
      isonMonth: isCurrentMonth(current, year, month),
      isonDay: isCurrentDay(current, year, month, day),
      isToday: isCurrentDay(current, today.getFullYear(), today.getMonth(), today.getDate()),
      origin: current,
    });
  }
  let count = -1;
  return Array.from({length: 6}, () => {
    count++;
    return arr.slice(count*7, (count+1)*7)
  });
}

/**
 * 根据当前时间获取年月信息
 * @param date 
 */
export function getYearMonthDay(date: number): CalDataType {
  let temp = new Date(date);
  return [temp.getFullYear(), temp.getMonth(), temp.getDate()];
}

/**
 * 修改信息月份
 * @param sign true: 减少 false: 新增
 * @param calData 
 */
export function changeCalData(
  sign: number,
  calData: CalDataType
): CalDataType {
  const oldDate = new Date(calData[0], calData[1]);
  let newDate = oldDate.setMonth(oldDate.getMonth() + sign);
  return getYearMonthDay(newDate);
}

/**
 * 切换年份
 * @param sign 
 * @param calData 
 */
export function changeCalYear(sign: number, calData: CalDataType) {
  const oldDate = new Date(calData[0], calData[1]);
  let newDate = oldDate.setFullYear(oldDate.getFullYear() + sign);
  return getYearMonthDay(newDate);
}

/**
 * 判断是否是当前月
 */
export function isCurrentMonth(currentDate: Date, year: number, month: number){
  if(currentDate && currentDate.getFullYear() === year && currentDate.getMonth() === month) {
    return true;
  }
  return false;
}

/**
 * 是否是当前日
 */
export function isCurrentDay(currentDate: Date, year: number, month: number, day: number){
  if(currentDate && currentDate.getFullYear() === year && currentDate.getDate() === day && currentDate.getMonth() === month) {
    return true;
  }
  return false;
}


/**
 * 生成字符串时间信息
 * @param calDate 
 */
export function generatorDate(calDate: CalDataType) {
  return `${calDate[0]}-${calDate[1]+1}-${calDate[2]}`;
}

/**
 * 判断是不是合格的日期
 */
export const validateDate = (value: string) => {
  let reg = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
  if(reg.exec(value)) {
    return true;
  }
  return false;
}
