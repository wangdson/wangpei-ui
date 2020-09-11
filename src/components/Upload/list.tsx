import React, { useMemo } from 'react';
import { updateFileList, getBase64 } from './action';
import { ProgressBar, UploadListProps, ImageListProps } from './types';
import { Progress } from '../Progress';
import { Icon } from '../Icon';
import { color } from "../shared/style";
import { ImgWrapper, ImgCloseBtn, ProgressLi, ProgressListItem, ProgressListItemName } from './style'
import Button from '../Button';

/**
 * 文件列表组件
 */
export function UploadList(props: UploadListProps){
  const { fileList, onRemove } = props;
  return (
    <ul style={{padding: '10px'}}>
      {fileList.map((item) => (
        <ProgressLi key={item.uid}>
          <ProgressListItem>
            <ProgressListItemName status={item.status}>
              {item.filename}
            </ProgressListItemName>
            <div>
              <Button style={{padding: 0, background: 'transparent'}}
                onClick={()=>onRemove(item)}
              >
                <Icon icon="close"></Icon>
              </Button>
            </div>
          </ProgressListItem>
          {
            (item.status === 'upload' || item.status === 'ready') && (
              <Progress count={item.precent} />
            )
          }
        </ProgressLi>
      ))}
    </ul>
  )
}

/**
 * 图片列表组件
 * @param props 
 */
export function ImageList(props: ImageListProps){
  const { fileList, onRemove, setFileList } = props;
  useMemo(()=>{
    fileList.forEach((item: ProgressBar)=>{
      if(item.raw && !item.img) {
        //如果有文件并且没有img地址，生成blob地址
        // const freader = new FileReader();
        // freader.addEventListener("load", ()=>{
        //   updateFileList(setFileList, item, {
        //     img: freader.result || 'error'
        //   });
        // });
        // freader.readAsDataURL(item.raw);
        getBase64(item.raw, (e:string) => {
          updateFileList(setFileList, item, {
            img: e||"error",
          })
        })
      }
    })
  }, [fileList, setFileList]);
  
  return (
    <>
      {fileList.map(item => {
        return (
          <span key={item.uid}>
            <ImgWrapper>
              {item.status === "success" && (
								<img
									src={item.img as string}
									alt="upload img"
								></img>
							)}
              {item.status === "error" && (
								<Icon
                  icon="photo"
                  color={color.negative}
                ></Icon>
							)}
              {item.status === "ready" || item.status === "upload" && (
								<Icon
                  icon="sync"
                  color={color.warning}
                ></Icon>
							)}
              <ImgCloseBtn
                  className="closebtn"
                  onClick={() => onRemove(item)}
                >
                  <Icon icon="trash" color={color.light}></Icon>
							</ImgCloseBtn>
            </ImgWrapper>
          </span>
        )
      })}
    </>
  )
}