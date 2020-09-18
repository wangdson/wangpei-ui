import React, { PropsWithChildren, useEffect, useMemo, useState, useCallback, ReactNode } from 'react';
import { darken, rgba, opacify } from "polished";
import { TableTable, TableHeadSpan } from './style';
import Pagination from '..';
import { Icon } from '../../Icon';
import { color } from '../../shared/style';

export interface SourceDataType {
	key: string;
	[key: string]: any;
}

export interface CloumnType {
  title: ReactNode,
  /** 排序等操作用来代替这列的 */
  dataIndex: string;
  sorter?: {
    compare: (a: SourceDataType, b: SourceDataType) => number;
  }
  render?: (v: any, value: SourceDataType, rowData: CloumnType) => ReactNode;
}

export interface TableProps {
  /** 数据表内数据内容 */
  data: SourceDataType[];
  /** 是否需要分页 */
  pagination?: boolean;
  /** 表头渲染 */
  columns: CloumnType[];
  pageSize?: number;
  /** 是否排序 */
  sorted?: boolean;
}

type ActionType = {
  setSortedData: React.Dispatch<React.SetStateAction<SourceDataType[]>>,
  setFilterColumn: React.Dispatch<React.SetStateAction<number[]>>,
  pagination?: boolean,
  sorted?: boolean,
  initPagination: Function,
  sourceData: SourceDataType[],
}

/**
 * 表格数据渲染表头和表数据
 * @param columnData 
 * @param tableData 
 */
const TableMap = (columnData: CloumnType[], tableData: SourceDataType[],  filterColumn: number[], action: ActionType) => {
  const { setSortedData, setFilterColumn, pagination, sorted, initPagination, sourceData } = action;
  return <>
    <thead>
      <tr key='head'>
        {
          columnData && columnData.map((thd:CloumnType, i: number) => {
            return <td key={i} style={{position: 'relative'}}>
              <span>{thd.title}</span>
              {thd.sorter && sorted && thd.sorter.compare && <TableHeadSpan
                onClick={()=>{
                  if(filterColumn[i]) {
                    if(filterColumn[i] === 1) {
                      // 倒序显示
                      let resData = sourceData.slice().sort(
                        (a,b) => -thd.sorter!.compare(a,b)
                      );
                      setSortedData(resData);
                      filterColumn[i] = 2;
                      setFilterColumn([...filterColumn]);
                    } else {
                      // 清除排序数据
                      initPagination();
                      setSortedData([]);
                      filterColumn[i] = 0;
                      setFilterColumn(filterColumn);
                    }
                  } else {
                    // 没有则开启排序
                    let resData = sourceData.slice().sort(
                      (a,b) => thd.sorter!.compare(a,b)
                    );
                    setSortedData(resData);
                    filterColumn[i] = 1;
                    setFilterColumn([...filterColumn]);
                  }
                }}
              >
                <Icon icon="arrowup" block color={filterColumn[i]===1 ? color.primary : color.dark }/>  
                <Icon icon="arrowdown" block color={filterColumn[i]===2 ? color.primary : color.dark }/> 
              </TableHeadSpan>}
            </td>
          })
        }
      </tr>
    </thead>
    <tbody>
      {
        tableData && tableData.map((tbr:SourceDataType, i: number) => {
          return <tr key={i}>
            {
              columnData.map((tbd:CloumnType, tdi: number) => {
                return <td key={tdi}>
                  {tbd.render ? tbd.render(tbr[tbd['dataIndex']], tbr, tbd) : tbr[tbd['dataIndex']]}
                </td>
              })
            }
          </tr>
        })
      }
    </tbody>
  </>
}


/**
 * 表格分页组件
 * @param props 
 */
export function Table(props: PropsWithChildren<TableProps>){
  const { data, columns, pageSize, pagination, sorted } = props;
  // 从第一页开始
  const [current, setCurrent] = useState(1);
  // 排序后的数据
  const [sortedData, setSortedData] = useState<SourceDataType[]>([]);
  // 过滤条件
  const [filterColumn, setFilterColumn] = useState<number[]>([]);
  // 表头数据
  const [columnData, setColumnData] = useState<CloumnType[]>([]);
  // 源数据
  const [source, setSource] = useState<SourceDataType[]>([]);
  // 分页列表数据
  const [paginationData, setPaginationData] = useState<SourceDataType[][]>([]);

  // 获取分页数据
  const originPagination = useMemo(()=>{
    return (data: SourceDataType[]) =>{
      let temp:SourceDataType[][] = [];
      let size = Math.ceil(data.length / pageSize!);
      for(let i = 0; i < size; i++) {
        temp[i] = data.slice(
          i * pageSize!,
          (i+1) * pageSize!,
        );
      }
      setPaginationData(temp);
    }
  }, [pageSize]);

  const initPagination = () => {
    if(pagination) {
      originPagination(data);
    }
  }

  // 获取表头长度
  const totalColumn = useMemo(()=>{
    setColumnData(columns);
    if(columns && columns.length){
      setFilterColumn(new Array(columns.length).fill(0));
    }
    return columns.length;
  }, [columns]);

  // 获取列表数据
  const totalData = useMemo(()=>{
    if(pagination) {
      originPagination(data);
    }
    setSource(data);
    return data.length;
  },[data, originPagination, pagination]);

  // 表格列表数据渲染， 判断是分页渲染还是普通渲染
  const renderTable = useMemo(()=>{
    if(pagination) {
      return TableMap(columnData, paginationData[current-1], filterColumn, {
        setSortedData,
        setFilterColumn,
        sorted,
        pagination,
        initPagination,
        sourceData: source,
      });
    } else {
      // 判断是否需要渲染排序列表, 传入对应的过滤列表
      if(sortedData && sortedData.length) {
        return TableMap(columnData, sortedData, filterColumn, {
          setSortedData,
          setFilterColumn,
          sorted,
          pagination,
          initPagination,
          sourceData: source,
        });
      }
      return TableMap(columnData, source, filterColumn, {
        setSortedData,
        setFilterColumn,
        sorted,
        pagination,
        initPagination,
        sourceData: source,
      });
    }
  }, [pagination, columnData, source, current, sortedData, filterColumn, sorted]);

  return (
    <div>
      <TableTable>
        {renderTable}
      </TableTable>
      {pagination && (
        <Pagination 
          total={totalData}
          pageSize={pageSize}
          style={{ justifyContent: "flex-end" }}
          maxPage={5}
          defaultCurrent={current}
          callback={(cur)=>{setCurrent(cur)}}
        />
      )}
    </div>
  )
}

Table.defaultProps = {
	sorted: false,
	pagination: false,
  pageSize: 10,
};

export default Table;