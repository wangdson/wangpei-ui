/**
 * 单个树节点对象
 */
export interface ItemProps {
  value: string;
  visible?: boolean;
  expand?: boolean;
  level?: number;
  parent?: ItemProps;
  children?: Array<ItemProps>,
  key?: string;
}

/** 树节点信息 */
export interface RequiredItemProps extends Omit< Required<ItemProps>, 'children' | 'parent'> {
  children?: RequiredItemProps[];
  parent: RequiredItemProps;
}

// export const rootTree = {
//   value: 'root',
//   level: 0,
//   children: source,
//   visible: true,
//   expand: true
// }

export interface FlattenProps {
  list: any[],
  level: number,
  childrenKey?: string,
  parent: any,
  defaultExpand?: boolean
};

const initData = {
  level: 1,
  defaultExpand: true,
  parent: null,
  childrenKey: 'children'
};

/**
 * 控制树节点的显示隐藏
 * @param item 
 * @param callback 
 */
export const changeVisible = (item: RequiredItemProps, callback: Function) => {
  if(item.children) {
    let visible: boolean;
    const depth = (item: RequiredItemProps[]) => {
      item.forEach((v: RequiredItemProps) => {
        if(visible === undefined) {
          visible = !v.visible;
        }
        v.visible = visible;
        if(v.children) {
          depth(v.children);
        }
      })
    }
    depth(item.children);
    callback(); // 改变显示后刷新页面
  }
}

/**
 *  将树结构铺平
 */
export const flatten = function(treeObj: FlattenProps): any[]{
  let arr:any[] = [];
  if(!treeObj.level) {
    treeObj.level = initData.level;
  }
  if(!treeObj.parent) {
    treeObj.parent = initData.parent;
  }
  if(treeObj.defaultExpand === undefined) {
    treeObj.defaultExpand = initData.defaultExpand;
  }
  if(treeObj.childrenKey === undefined) {
    treeObj.childrenKey = initData.childrenKey;
  }
  const { list, level, childrenKey, parent, defaultExpand } = treeObj;
  list.forEach((item) => {
    item.level = level;
    if(item.expand === undefined) {
      item.expand = defaultExpand;
    }
    if(item.visible === undefined) {
      item.visible = true;
    }
    if(!parent.expand || !parent.visible) {
      item.visible = false;
    }
    if(item.key === undefined) {
      item.key = item.value + Math.random();
    }
    item.parent = parent;
    arr.push(item);
    if(item[childrenKey]) {
      arr.push(...flatten({
        ...treeObj,
        list: item[childrenKey],
        level: level+1,
        parent: item
      }))
    }
  })
  return arr;
}

/**
 * 判断是否是父级
 * @param item 
 */
export function checkParent(item: RequiredItemProps) {
  return item.level === 1;
}

// 插入类型常量类
export const InsertFlag = {
  ParentInsert: 1, // 插
  SameOriginInsert: 2, // 插同级
  ChildrenInsert: 3, // 插下级
  NotInsert: 0, // 不插入
}

/**
 * 选择录入位置
 * @param diff 
 * @param item 
 */
const levelSpace = 24; // 同级生效距离
export const switchInsert = (diff: number, item: RequiredItemProps) => {
  if(!isNaN(diff)){
    const origin =  item.level * 10;
    if(diff < origin) {
      if(checkParent(item)) {
        return InsertFlag.SameOriginInsert;
      } else {
        return InsertFlag.ParentInsert;
      }
    } else if(diff < origin + levelSpace) {
      return InsertFlag.SameOriginInsert;
    } else {
      return InsertFlag.ChildrenInsert;
    }
  } else {
    return InsertFlag.NotInsert;
  }
}

/** 找到对应的目标位置 */
export const findOrigin = (key: string, data: RequiredItemProps[]) => data.find((v: RequiredItemProps) => v.key === key);

/**
 * 获取父节点
 * @param item 
 */
export const getParent = (item: RequiredItemProps) => {
  if(item.parent && item.parent.parent) {
    return item.parent.parent;
  } else {
    return item.parent;
  }
}

/**
 * 判断target是否是origin的孩子
 * true 代表是无孩子， false 代表target是origin的孩子
 */
export function judgeChildren(origin: RequiredItemProps, target: RequiredItemProps) {
  let sign = true;
  const fn = (child: RequiredItemProps) => {
    if(child.children) {
      child.children.forEach((v: RequiredItemProps) => {
        if(v === target) {
          sign = false;
          return;
        }
        fn(v);
      })
    }
  }
  fn(origin);
  return sign;
}

/**
 * 更改源目标的parent
 * @param origin 
 */
export function changeOriginParent(origin: RequiredItemProps){
  const parent = origin.parent;
  if(parent.children) {
    const index = parent.children.indexOf(origin);
    if(index > -1) {
      parent.children.splice(index, 1)
    }
  }
}

/**
 * 修改目标源的parent
 * @param origin 
 * @param target 
 * @param item 
 */
export function changeTargetParent(parent: RequiredItemProps, origin: RequiredItemProps, item: RequiredItemProps) {
  origin.parent = parent;
  if(parent.children) {
    //判断应该插入父级节点哪里
    if(item.parent.children) {
      // todo: 问题点，这个应该有问题
      const index = item.parent.children.indexOf(item);
      if(index > -1) {
        parent.children.splice(index + 1, 0, origin);
      } else {
        parent.children.push(origin);
      }
    } else {
      parent.children.push(origin);
    }
  } else {
    parent.children = [origin];
  }
}

/**
 * 
 * @param item 
 * @param origin 
 */
export function checkTargetOrigin(item: RequiredItemProps, origin: RequiredItemProps) {
  return item !== origin;
}

/**
 * 插入到目标上级
 * @param key 
 */
export const insertTop = (key: string, 
  item: RequiredItemProps, 
  data: RequiredItemProps[],
  callback: Function ) => {
  const origin = findOrigin(key, data);
  const parent = getParent(item);
  if(item.level !== 1 && origin &&
  checkTargetOrigin(item, origin) && judgeChildren(origin, item)) {
    changeOriginParent(origin);
    changeTargetParent(parent, origin, item);
    callback();
  }
}

/**
 * 插入中间
 * @param key 
 * @param item 
 * @param data 
 * @param callback 
 */
export const insertMiddle = (key:string, 
  item: RequiredItemProps,
  data: RequiredItemProps[],
  callback: Function ) => {
  const origin = findOrigin(key, data);  
  const parent = item.parent;
  if(item.level !==0 && origin && checkTargetOrigin(item, origin) && judgeChildren(origin, item)) {
    changeOriginParent(origin);
    changeTargetParent(parent, origin, item);
    callback();
  }
} 

/**
 * 插入子节点
 * @param key 
 * @param item 
 * @param data 
 * @param callback 
 */
export const insertLower = (key:string, 
  item: RequiredItemProps,
  data: RequiredItemProps[],
  callback: Function ) => {
    const origin = findOrigin(key, data);  
    const parent = item;
    if(origin && checkTargetOrigin(item, origin) && judgeChildren(origin, item)) {
      changeOriginParent(origin);
      changeTargetParent(parent, origin, item);
      callback();
    }
}

/**
 * 节流操作
 * @param fn 
 * @param delay 
 */
export function throttle(fn: Function, delay: number = 300){
  let flag = true;
  return (...args: any) => {
    flag = false;
    fn(...args);
    setTimeout(() => {
      flag = true;
    }, delay);
  }
}