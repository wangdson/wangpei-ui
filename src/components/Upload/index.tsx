import React, { PropsWithChildren, ReactNode, useMemo, useRef, useState, useCallback } from 'react';
import Button from '../Button';
import { message } from '../Message';
import { UploadList, ImageList } from './list';
import { ImgUpload } from './style';
import { Icon } from '../Icon';
import { ProgressBar, UploadProps, ModalContentType } from './types';
import { resolveFileName, checkFileData, showModalToSlice } from './action';
import { ImgCanvasTailor } from './extra';

// 组件传参默认值
Upload.defaultProps = {
  axiosConfig: {},
  uploadFileNames: 'avatar',
  successCallBack:()=>message.success('上传成功'),
  failCallback: ()=>message.error('上传失败'),
  uploadMode: 'default',
}

/**
 * upload组件
 * @param props 
 */
export function Upload(props: PropsWithChildren<UploadProps>){
  const {
    uploadFileNames,
    successCallBack,
    failCallback,
    axiosConfig,
    defaultProgressBar,
    onProgress,
    beforeUpdate,
    uploadMode,
    progress,
    onRemoveCallback,
    customRemove,
    max, // 文件上传上限值
    accept, // input的accept属性
    multiple, // input框的multiple属性
    customBtn
  } = props;
  const [flist, setFlist] = useState<ProgressBar[]>(defaultProgressBar || []);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** 裁剪模块modal信息 */
  // modal模块是否打开
  const [modalOpen, setModalOpen] = useState(false);
  const [imgContent, setImgContent] = useState<string>('');
  const [imgCallback, setImgCallback] = useState<{ resFn: Function }>({
    resFn :()=>{}
  });
  const [modalContent, setModalContent] = useState<ModalContentType>({
		rotate: 0,
		times: 1,
    img: new Image(),
    left: 0,
    top: 0,
	});

  /** 计算当前是否是img单个上传，单个上传则支持裁剪功能 */
  const showSlice = useMemo(()=>{
    if(!multiple && uploadMode === 'img') {
      return true;
    }
    return false;
  }, [multiple, uploadMode]);
  
  const handleClick = () => {
    inputRef.current?.click();
  }
  /**
   * 选择文件变化的时候触发
   * @param e 
   */
  const changeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files || (e.target.files && e.target.files.length <= 0)) return;
    const uploadFiles = Array.from(e.target.files);
    console.log('uploadFiles', uploadFiles);
    // const formdata = new FormData();
    // formdata.append("avatar", uploadFiles![0])
    // axios.post("http://localhost:20001/user/uploadAvatar", formdata, {
    //   headers: {
    //     "Content-Type": 'multipart/form-data'
    //   }
    // });
    // 交给公共的模块去处理上传逻辑
    uploadFiles.forEach((f:File,index) => {
      // 判断当前是否是否是图片上传
      // 每个都请求接口去上传数据
      const restFn = (f:File) => checkFileData({
        file: f,
        filename: resolveFileName(uploadFileNames!, index),
        index,
        failCallback,
        successCallBack,
        onProgress: onProgress,
        axiosConfig,
        setFileList: setFlist,
      }, beforeUpdate!);
      setImgCallback({resFn: restFn });
      // 当前是图片单个上传
      if(showSlice) {
        // 打开裁剪功能
        setModalOpen(true);
        // showModalToSliceImg(f, setImgContent).then((r) => {f=r;})
        showModalToSlice(f, canvasRef, modalContent);
      } else {
        restFn(f);
      }
    })
  }

  const resolveLoading = (first: ProgressBar[]) => {
    return first.some((v) => v.status === 'upload');
  }

  /** 删除文件 */
  const removeFile = useCallback((file: ProgressBar)=>{
    // 判断是否客户端自己处理
    if(customRemove) {
      customRemove(file, setFlist);
    } else {
      setFlist((prevList) => {
        return prevList.filter((item) => {
          if(item.uid === file.uid && item.status === 'upload' && item.cancel) {
            item.cancel.cancel();
          }
          return item.uid !== file.uid;
        })
      })
    }
    // 触发回调函数
    if(onRemoveCallback) {
      onRemoveCallback(file);
    }
  }, [onRemoveCallback, customRemove]);

  /** 根据max值判断当前是否要做展示 */
  const shouldShow = useMemo(()=>{
    if(max) {
      return flist.length <= max;
    }
    return true;
  }, [max]);

  return (
    <div>
      <ImgCanvasTailor 
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        setModalContent={setModalContent}
        imgCallback={imgCallback}
        imgContent={imgContent}
        canvasRef={canvasRef}
        modalContent={modalContent}
      />
      <input 
        ref={inputRef} 
        onChange={changeFile}
        accept={accept}
        multiple={multiple}
        style={{ display: "none" }}
				value=""
        type="file">
      </input>
      {
        shouldShow && uploadMode === 'default' && (
          <span onClick={handleClick}>
            {customBtn ? (customBtn):(
              <Button 
                onClick={handleClick} 
                isLoading={resolveLoading(flist)} 
                loadingText="上传中...">upload</Button>
            )}
          </span>
        )
      }
      {
        shouldShow && uploadMode === 'img' && (
          <ImgUpload onClick={handleClick} >
            <Icon icon="plus"></Icon>
          </ImgUpload>
        )
      }
      {/* {flist.map((f,l) => (
        <div key={f.uid}>
          {f.filename}
          {f.precent}
          {f.status}
        </div>
      ))} */}
      {
        uploadMode === 'default' && progress && (
          <UploadList fileList={flist} onRemove={removeFile}></UploadList>
        )
      }
      {uploadMode === "img" && (
				<ImageList
          fileList={flist}
					setFileList={setFlist}
					onRemove={removeFile}
				></ImageList>
			)}
    </div>
  )
}

export default Upload;