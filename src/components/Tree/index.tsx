import React, { PropsWithChildren, useState, useMemo, useRef, useEffect, CSSProperties } from 'react';
import { color, typography } from "../shared/style";
import { darken, rgba, opacify } from "polished";
import { easing } from "../shared/animation";
import {  changeVisible, 
  flatten, 
  ItemProps,
  RequiredItemProps,
  insertLower,
  insertTop,
  insertMiddle, 
  InsertFlag,
  throttle,
  switchInsert } from './action';
import { TreeItem, TreeIcon, DragControlData, TreeGrag } from './style';  
import { Icon } from '../Icon';

export interface TreeProps {
  /** 数据源*/
  source: ItemProps[];
  /** 是否可以拖拽 */
  drag?: boolean;
  /** 高亮边框颜色 */
  borderColor?: string;
  /** 拖拽提示色 */
  backColor?: string;
  /**外层样式*/
  style?: CSSProperties;
  /**外层类名*/
  classname?: string;
}

Tree.defaultProps = {
	source: [],
	drag: true,
	borderColor: "#53c94fa8",
	backColor: "#00000030",
};

/**
 * 树组件
 * @param props 
 */
export function Tree(props: PropsWithChildren<TreeProps>){
  const img = new Image();
  img.src = "https://www.easyicon.net/api/resizeApi.php?id=1200841&size=32";
  const { source, borderColor, backColor } = props;
  // const data = flatten({
  //   list: source,
  //   level: 0,
  //   parent: rootTree,
  // });
  // 起始地址
  const [start, setStart] = useState(0);
  const [dragUpdate, setDragUpdate] = useState(0);
  const [dragOver, setDragOver] = useState<DragControlData>({
    drag: false,
    x: 0,
    itemkey: '',
  });
  // 高亮显示原拖拽元素
  const [highlight, setHighlight] = useState({
		drag: true,
		itemkey: "",
	});
  // 默认根目录，根据source值变化而变化
  const root = useMemo(()=>{
    return {
      value: 'root',
      level: 0,
      children: source,
      visible: true,
      expand: true
    }
  }, [source]);
  // 当前的树结构值根据dragUpdate值和root值变化而变化
  const data = useMemo(()=>{
    return flatten({
      list: root.children,
      parent: root,
      level: 1,
    })
  }, [root, dragUpdate]);
  const [count, forceUpdate] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(ref.current) {
      // 设置起始位置
      setStart(ref.current.getBoundingClientRect().left);
    }
    const handle = () => {
      setDragOver((prev) => ({...prev, drag: true}));
      setHighlight({
        drag: true,
		    itemkey: "",
      });
    }
    window.addEventListener('dragend', handle);
    return () => {
      window.removeEventListener('dragend', handle);
    }
  }, []);

  // 回调函数
  const callback = ()=>{ forceUpdate((state)=>state+1) };
  const dragCallback = () => { setDragUpdate((dragUpdate) => dragUpdate+1) };

  const dragHandler = (clientX: number, itemkey: string, item: RequiredItemProps) => {
    const diff = clientX - start;
    const x = switchInsert(diff, item);
    setDragOver({
      drag: true,
      x,
      itemkey,
    })
  };

  return (
    <div ref={ref}>
      {
        data.filter((v: RequiredItemProps) => !!v.visible).map((item: RequiredItemProps) => {
          return (
            <TreeItem
              level = {item.level}
              itemkey = {item.key}
              highlight = {highlight}
              borderColor = {borderColor!}
              draggable 
              onClick={()=>{
                changeVisible(item, callback);
              }}
              key={item.key}
              style={{
                paddingLeft: `${10*item.level}px`,
                cursor: "pointer"
              }}
              onDragStart={(e)=>{
                e.dataTransfer.setData('treeKey', item.key);
                e.dataTransfer.setDragImage(img, 29, 29);
                setHighlight({
                  drag: true,
                  itemkey: item.key,
                });
              }}
              onDragOver={(e)=>{
                e.preventDefault();
                throttle(dragHandler)(e.clientX, item.key, item);
              }}
              onDrop={(e)=>{
                const key = e.dataTransfer.getData('treeKey');
                const left = e.clientX;
                const diff = left - start; // 距离顶部的位置
                const insertNum = switchInsert(diff, item);
                switch(insertNum) {
                  case InsertFlag.ParentInsert:
                    insertTop(key, item, data ,dragCallback);
                    break;
                  case InsertFlag.SameOriginInsert:
                    insertMiddle(key, item, data ,dragCallback);
                    break;
                  case InsertFlag.ChildrenInsert:
                    insertLower(key, item, data ,dragCallback);
                    break;
                  default:
                    break;   
                }
                console.log('onDrop', key, left, diff, insertNum, item);
              }}
            >
              <TreeIcon g={item}>
								<Icon icon="arrowdown"></Icon>
							</TreeIcon>
              {item.value}
              {dragOver.drag && (
								<TreeGrag
                  backColor={backColor!}
									gkey={item.key}
									drag={dragOver.drag}
									x={dragOver.x}
									itemkey={dragOver.itemkey}
								></TreeGrag>
							)}
            </TreeItem>
          )
        })
      }
    </div>
  );
}

export default Tree;