import { ProgressBar, PostFileDataProps, ModalContentType, ProgressBarStatus } from './types';
import axios, {AxiosRequestConfig} from 'axios';
import { color } from '../shared/style';

/**
 * 获取文件的文件名
 * @param fileNames 
 * @param i 
 */
export function resolveFileName(fileNames: string[]|string, i: number): string {
  if(Array.isArray(fileNames)) {
    return fileNames[i];
  }
  return fileNames;
}

// 更新当前上传的文件列表信息
export function updateFileList(
  setFileList: React.Dispatch<React.SetStateAction<ProgressBar[]>>, // 修改文件列表
  _file: ProgressBar,
  extra: Partial<ProgressBar>
){
  setFileList((fileList) => {
    if(fileList) {
      return fileList.map((f) => {
        // uid一直则更新，否则不更新
        if(f.uid === _file.uid) {
          return { ...f, ...extra};
        }
        return f;
      })
    } else {
      return fileList;
    }
  })
}

// 图片文件转化成base64
export const getBase64 = (raw: File, callback: Function) => {
  const freader = new FileReader();
  freader.addEventListener('load', () => {
    callback(freader.result);
  });
  freader.readAsDataURL(raw);
}

// 调用getBase64，获取到图片base64数据
export const showModalToSliceImg = (file: File, setImgContent: React.Dispatch<any>):Promise<File> => {
  return new Promise<File>((res) => {
    getBase64(file, (s: string) => {
      setImgContent(s);
      res(file);
    })
  });
}
export const showModalToSlice = (file: File, canvasRef: React.RefObject<HTMLCanvasElement>, modalContent: ModalContentType) => {
  getBase64(file, (s: string) => {
    const canvas = canvasRef.current;
    if(canvas) {
      modalContent.img.src = s;
      modalContent.img && (modalContent.img.onload = ()=>{
        canvasDraw(modalContent, canvas);
      });
    }
  })
}

// 上传之前的校验，可以使用beforeUpdate的校验
export function checkFileData(props: PostFileDataProps, beforeUpdate: (file: File, i: number) => boolean | Promise<File>) {
  if(beforeUpdate) {
    const res = beforeUpdate(props.file, props.index);
    if(res instanceof Promise) {
      res.then((file: File) => {
        postFileData(props)
      })
    } else if(res) {
      // 判断执行结果是否是true,是false则不上传
      postFileData(props);
    }
  } else {
    postFileData(props);
  }
}

/**
 * 文件上传处理
 * @param props 
 */
function postFileData(props: PostFileDataProps){
  const { 
    file, 
    filename, 
    index, 
    successCallBack, 
    failCallback, 
    axiosConfig,
    onProgress,
    setFileList,
  } = props;
  const reqData = new FormData();
  reqData.append(filename, file);
  const cancelSource = axios.CancelToken.source();
  // 当前的文件数据
  const _file: ProgressBar = {
    filename: file.name,
    precent: 0,
    status: 'ready',
    raw: file,
    uid: Date.now()+'upload',
    cancel: cancelSource,
    size: file.size
  };
  // 添加到队里里面去
  setFileList((prev) => ([ _file, ...prev]))
  const defaultAxiosConfig: Partial<AxiosRequestConfig> = {
    method: 'post',
    url: 'http://127.0.0.1:20001/user/uploadAvatar',
    headers:{
      'Content-Type': 'multipart/form-data'
    },
    data: reqData,
    cancelToken: cancelSource.token,
    onUploadProgress:(e)=>{
      let precent = Math.round((e.loaded * 100) / e.total) || 0;
      // 更新当前的文件信息
      updateFileList(setFileList, _file, {
        status: 'upload',
        precent
      })
      // 判断当前回调函数是否存在，有的话就回调
      if(onProgress) {
        onProgress(precent, file, index);
      }
    }
  }
  const axiosConf: AxiosRequestConfig = {...defaultAxiosConfig, ...axiosConfig};
  return axios(axiosConf).then((res) => {
    // 更新当前的文件信息 成功的文件上传信息
    updateFileList(setFileList, _file, {
      status: 'success',
      precent: 100
    });
    if(successCallBack) {
      successCallBack(res, index);
    }
  }).catch((r)=>{
    // 更新当前的文件信息 失败的文件上传信息
    updateFileList(setFileList, _file, {
      status: 'error',
      precent: 0
    });
    if(failCallback) {
      failCallback(r, index);
    }
  })
}

/**
 * canvas画图
 */
export const canvasDraw = (
  modalContent: ModalContentType,
  canvas: HTMLCanvasElement
) => {
  const {
    img,
    rotate,
    times
  }  = modalContent;
  let ctx = canvas.getContext('2d');
  // 清屏
  canvas.height = canvas.height;
  let imgWidth = img.width;
  let imgHeight = img.height;
  // 图片的长大于宽
  if(imgWidth > imgHeight) {
    const rate = canvas.width / imgWidth;
    imgWidth = canvas.width * times;
    imgHeight = imgHeight * rate * times;
  } else {
    const rate = canvas.height / imgHeight;
    imgHeight = canvas.height * times;
    imgWidth= canvas.width * rate * times;
  }
  // 计算canvas布局的偏移量
  let startX = (canvas.width - imgWidth) / 2;
  let startY = (canvas.height - imgHeight) / 2;
  // 计算旋转中心点
  let midX = canvas.width / 2;
  let midY = canvas.height / 2;
  ctx?.translate(midX, midY);
  ctx?.rotate(rotate); // 发生旋转
  ctx?.drawImage(img, startX - midX + modalContent.left, startY - midY + modalContent.top, imgWidth,imgHeight);
  ctx?.translate(0, 0);
}

/** 显示不同进度条颜色 */
export function chooseProgressListColor(status: ProgressBarStatus) {
  switch (status) {
		case "error":
			return color.negative;
		case "ready":
			return color.warning;
		case "success":
			return color.positive;
		case "upload":
			return color.secondary;
	}
}