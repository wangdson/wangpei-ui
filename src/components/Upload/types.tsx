import { ReactNode } from 'react';
import {AxiosRequestConfig, CancelTokenSource} from 'axios';
export type UploadMode = 'default'|'img';

export type ProgressBarStatus = 'ready'|'success'|'error'|'upload';

/** 上传进度 */
export interface ProgressBar {
  filename: string; // 文件名
  status: ProgressBarStatus; // 上传状态
  uid: string; // 文件标识
  size: number; // 文件大小
  raw: File | null; // 文件源
  precent: number; // 进度信息 百分比数据
  cancel: CancelTokenSource; // 取消token axios配置
  img?: string| ArrayBuffer | null; // 文件信息
}

export type OnProgressType = (p: number, f: File, i: number) => void;


/**
 * 文件列表组件传参定义
 */
export interface UploadListProps {
  fileList: ProgressBar[]; // 文件列表，初始化
  onRemove: (item: ProgressBar) => void; // 移除某个文件的功能
}

/** ImageList组件入参类型 */
export interface ImageListProps extends UploadListProps {
  setFileList: React.Dispatch<React.SetStateAction<ProgressBar[]>>;
}

/**
 * 图片裁剪组件入参定义
 */
export interface ImgCanvasTailorProps {
  imgCallback: {
    resFn: Function
  };
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  imgContent: string;
  setModalContent: React.Dispatch<React.SetStateAction<ModalContentType>>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  modalContent: ModalContentType;
}

/** modal详情类型 */
export type ModalContentType = {
  rotate: number;
  times: number;
  img: HTMLImageElement;
  left: number; // 记录move操作的偏移量
  top: number; // 记录move操作的偏移量
}

// 请求文件上传入参
export interface PostFileDataProps {
  file: File; // 文件信息
  filename: string; // 文件名称
  index: number; // 标识文件下标
  successCallBack?: (res:any, i: number) => void; // 成功回调
  failCallback?: (res:any, i: number) => void;  // 失败回调
  axiosConfig?: Partial<AxiosRequestConfig>; // axios请求
  onProgress?: OnProgressType; // 请求进度回调
  setFileList: React.Dispatch<React.SetStateAction<ProgressBar[]>>, // 修改文件列表
}

/**
 * 上传组件传参定义
 */ 
export interface UploadProps {
  uploadFileNames?: string[] | string; // 上传的文件信息 多个上传或者单个
  successCallBack?: (res:any, i: number) => void; // 成功回调
  failCallback?: (res:any, i: number) => void;  // 失败回调
  axiosConfig?: Partial<AxiosRequestConfig>; // axios请求
  defaultProgressBar?: ProgressBar[]; // 默认的进度项
  onProgress?: OnProgressType; // 请求进度回调
  beforeUpdate?: (file: File, i: number) => boolean | Promise<File>; // 上传之前验证
  /** 上传模式 */
  uploadMode?: UploadMode;
  progress?: boolean; // 是否显示进度
  onRemoveCallback?: (f: ProgressBar) => void;
  /** 自定义删除行为，只有img与progress为true有效*/
  customRemove?: (file: ProgressBar, setFileList: React.Dispatch<React.SetStateAction<ProgressBar[]>>) => void;
  max?: number; // 上传文件的最大值
  accept?: string; // input输入框支持的后缀文件
  multiple?: boolean; // input输入框是否支持多文件上传
  /** 用户自定义按钮 */
	customBtn?:ReactNode;
}