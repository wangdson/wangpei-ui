import React, { PropsWithChildren, ReactNode, useMemo, useRef, useState, CSSProperties, useEffect } from 'react';
import { darken, rgba, opacify } from "polished";
import { CalendarWrapper, 
  CalendarHeadItem, 
  CalendarDate, 
  CalendarHeadWrapper,
  BtnDiv,
  IconWrapper,
  btnStyle,
  MonthWrapper,
  Bwrapper,
  MonthItem,
  DatePickerWrapper,
  CalendarIcon,
  CalendarDateRow } from './style';
import { useClickOutside, getDateData, changeCalData, generatorDate, validateDate, changeCalYear } from './action';
import { useStateAnimation } from '../Modal';
import Button from '../Button';
import { Icon } from '../Icon';

export interface DatePickerProps {
  /** 日期选择的回调 */
  callback?: (v: string) => void;
  /** ref通过回调函数返回 */
  refCallback?: (ref: React.RefObject<HTMLDivElement>) => void;
	/**  动画速度 */
	delay?: number;
	/** 初始值*/
	initDate?: string;
	/** 外层样式*/
	style?: CSSProperties;
	/** 外层类名 */
	classname?: string;
}

export interface DateItem {
	day: number; //天
	isonMonth: boolean; //当月
	isonDay: boolean; //是否是选中日
  origin: Date;
  isToday: boolean;// 是否是当日
}

export type CalDataType = [number, number, number];
export type ModeType = 'year'|'month'|'day';

// 月份信息
const MonthData = new Array(12).fill(1).map((_x, y) => y + 1);

export function DatePicker(props: PropsWithChildren<DatePickerProps>){
  const { initDate, delay, style, classname, refCallback } = props;
  // 选择的日期信息
  const [val, setVal] = useState(()=>{
    if(initDate && validateDate(initDate)) {
      return initDate;
    } else {
      return generatorDate(calData);
    }
  });
  // 是否显示
  const [show, setshow] = useState(false);
  const now = new Date();
  const [calData, setCalData] = useState<CalDataType>([now.getFullYear(), now.getMonth(), now.getDate()]);
  // modal动画
  const [st, setSt, unmount] = useStateAnimation(setshow, delay);
  // 切换日期选择器的类型 day, month, year切换
  const [mode, setMode] = useState('day');
  // 文本更新事件
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVal(event.target.value);
  }
  // 文本点击事件
  const handleClick = () =>{
    setshow(true);
  }

  // 日期列表
  const dayArr = useMemo(()=>{
    const arr = getDateData(calData[0], calData[1], calData[2]);
    return arr;
  }, [calData]);

  const ref = useRef<HTMLDivElement>(null);
  /**
   * 返回ref给使用组件的用户使用
   */
  useEffect(()=>{
    if(refCallback) {
      refCallback(ref);
    }
  }, [refCallback, ref]);
  // 域外点击事件
  useClickOutside(ref, ()=>setSt(false));

  // 处理输入框移开操作
  const hanleBlur = () => {
    // 判断当前输入框的值是否和弹出框的选择数据一致，不一致代表是有手动输入
    if(val !== generatorDate(calData)) {
      const valid = validateDate(val);
      // 输入不合法的，设置为上一次正确的数据
      if(!valid) {
        setVal(generatorDate(calData));
      } else {
        const arr = val.split('-');
        const newDate = new Date(Number(arr[0]), Number(arr[1])-1, Number(arr[2]));
        const nowCal:CalDataType = [newDate.getFullYear(), newDate.getMonth(), newDate.getDate()];
        setCalData(nowCal);
        setVal(generatorDate(nowCal));
        setSt(false);
      }
    }
  }

  // 选择月份选择器
  const renderMonthSwitch = useMemo(()=>{
    return (
      <MonthWrapper style={{display: mode==='month'? 'flex': 'none'}}>
        {MonthData.map((v,i) => {
          return (
            <MonthItem key={i}
              onClick={()=>{
                const sign = v - calData[1] -1;
                const newData = changeCalData(sign, calData);
                setCalData(newData);
                setMode('day');
              }}
            >
              {`${v}月`}
            </MonthItem>
          )
        })}
      </MonthWrapper>
    )
  }, [show, unmount, st, calData, dayArr, mode]);

  const startYear = useMemo(()=>{ return calData[0] - calData[0]%10;}, [calData]);

  // 选择年份选择器
  const renderYearSwitch = useMemo(()=>{
    const yearArr = Array.from({length:12}).fill(1).map((x,y) => startYear + y -1);
    return (
      <MonthWrapper style={{display: mode==='year'? 'flex': 'none'}}>
        {yearArr.map((v,i) => {
          return (
            <MonthItem key={i}
              toGrey={ i === 0 || i === 11 }
              onClick={()=>{
                const sign = v - calData[0] -1;
                const newData = changeCalYear(sign, calData);
                setCalData(newData);
                setMode('month');
              }}
            >
              {`${v}年`}
            </MonthItem>
          )
        })}
      </MonthWrapper>
    )
  }, [show, unmount, st, calData, dayArr, mode]);

  /**
   * 日期选择切换
   */
  const renderDaySwitch = useMemo(()=>{
    return <table style={{display: mode==='day'? 'block': 'none'}}>
    <thead>
      <tr>
        <CalendarHeadItem>日</CalendarHeadItem>
        <CalendarHeadItem>一</CalendarHeadItem>
        <CalendarHeadItem>二</CalendarHeadItem>
        <CalendarHeadItem>三</CalendarHeadItem>
        <CalendarHeadItem>四</CalendarHeadItem>
        <CalendarHeadItem>五</CalendarHeadItem>
        <CalendarHeadItem>六</CalendarHeadItem>
      </tr>
    </thead>
    <tbody>
      {dayArr.map((v,index)=>{
        return <CalendarDateRow key={index}>
          {
            v.map((k: DateItem,i) => {
              return <CalendarDate 
                key={i} 
                isonDay={k.isonDay} 
                isonMonth={k.isonMonth}
                isToday={k.isToday}
                onClick={()=>{
                  const origin = k.origin;
                  const cal:CalDataType = [
                    origin.getFullYear(),
                    origin.getMonth(),
                    origin.getDate()
                  ];
                  setCalData(cal);
                  setVal(generatorDate(cal));
                  setSt(false);
                }}
              >{k.day}</CalendarDate>
            })
          }
        </CalendarDateRow>
      })}
    </tbody>
  </table>;
  }, [show, unmount, st, calData, dayArr, mode])

  // 选择日期选择器
  const render = useMemo(()=>{
    if(!show) {
      unmount();
      return null;
    } else {
      return <CalendarWrapper delay={delay!} visible={st}>
        <CalendarHeadWrapper>
          <div style={{
            display: 'flex',
            justifyContent: "center",
            width: "240px",
          }}>
            <BtnDiv  style={{ marginLeft: "20px" }}>
              <Button size="small" style={btnStyle} onClick={()=>{
                let newData = calData;
                if(mode === 'year') {
                  newData = changeCalYear(-10, calData);
                } else if(mode === 'month') {
                  newData = changeCalYear(-1, calData);
                } else if(mode === 'day') {
                  newData = changeCalData(-1, calData);
                }
                setCalData(newData);
              }}>
                <IconWrapper>
                  <Icon icon="arrowleft"></Icon>
                </IconWrapper>
              </Button>
            </BtnDiv>
            <BtnDiv style={{ flex: 1, justifyContent: "center",display: mode === 'year'? 'inline-block': 'none' }}>
              <span>
                <Bwrapper>{`${startYear}-${startYear+9}`}</Bwrapper>
              </span>
            </BtnDiv>
            <BtnDiv style={{ flex: 1, justifyContent: "center",display: mode !== 'year'? 'inline-block': 'none' }}>
              {/* {`${calData[0]}年${calData[1]+1}月`} */}
              <span>
                <Bwrapper onClick={()=>{
                  setMode('year');
                }}>{`${calData[0]}年`}</Bwrapper>
                <Bwrapper onClick={()=>{
                  setMode('month');
                }}
                style={{ display: mode ==='day'? 'inline-block': 'none' }}
                >{`${calData[1]+1}月`}</Bwrapper>
              </span>
            </BtnDiv>
            <BtnDiv style={{ marginRight: "20px" }}>
              <Button size="small" style={btnStyle} onClick={()=>{
                let newData = calData;
                if(mode === 'year') {
                  newData = changeCalYear(10, calData);
                } else if(mode === 'month') {
                  newData = changeCalYear(1, calData);
                } else if(mode === 'day') {
                  newData = changeCalData(1, calData);
                }
                setCalData(newData);
              }}>
                <IconWrapper>
                  <Icon icon="arrowright"></Icon>
                </IconWrapper>
              </Button>
            </BtnDiv>
          </div>
        </CalendarHeadWrapper>
        <div
            style={{
              width: "240px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {renderYearSwitch}
            {renderMonthSwitch}
            {renderDaySwitch}
        </div>
      </CalendarWrapper>
    }
  },[show, unmount, st, calData, dayArr, mode])

  return <DatePickerWrapper ref={ref} onClick={handleClick} style={style} className={classname}>
    <input type="text"  style={{ border: "none", boxShadow: "none", outline: "none" }} value={val} aria-label="date picker" onBlur={hanleBlur} onChange={handleChange} onClick={handleClick}/>
    <CalendarIcon>
      <Icon icon='calendar'></Icon>
    </CalendarIcon>
    {render}
  </DatePickerWrapper>
}

DatePicker.defaultProps = {
  delay: 300
}

export default DatePicker;