import React, { useState } from 'react';
import { ImgCanvasTailorProps } from './types';
import Modal from '../Modal';
import Button from '../Button';
import { Icon } from '../Icon';
import { canvasDraw } from './action';
import { btnStyle } from './style';
import { color } from '../shared/style';

/**
 * 图片裁剪功能
 */
export const ImgCanvasTailor = (props: ImgCanvasTailorProps) => {
  const { imgCallback, modalOpen, modalContent, setModalOpen, setModalContent, imgContent, canvasRef } = props;
  const [mouseActive, setMouseActive] = useState(false);
  const [startXY, setStartXY] = useState({ X: 0, Y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMouseActive(true);
    setStartXY({
      X: e.clientX - modalContent.left,
      Y: e.clientY - modalContent.top,
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if(mouseActive) {
      let diffX = e.clientX - startXY.X;
      let diffY = e.clientY - startXY.Y;
      let newContent = {...modalContent, 
        left: diffX, 
        top: diffY,
      };
      setModalContent(newContent);
      canvasDraw(newContent, canvasRef.current!);
    }
  }

  const handleMouseUp = () => {
    setMouseActive(false);
  }

  const handleMouseLeave = () => {
    setMouseActive(false);
  }
  
  return (
    <Modal
      title="图片裁剪"
      callback={(v: boolean)=>{
        if(v) {
          canvasRef.current?.toBlob(function(blob){
            if(imgCallback.resFn) imgCallback.resFn(blob);
          })
        }
        // 消除旋转和放大
        setModalContent({...modalContent, 
          times: 1, 
          rotate: 0,
          left: 0,
				  top: 0,
        });
      }}
      maskClose={false}
      visible = {modalOpen}
      parentSetState = {setModalOpen}
      closeButton={true}
    >
      {/* <div>
        <img style={{ width: '100%', height: '100%'}} 
          src={imgContent}
          alt="modalpic"
        />
      </div> */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <canvas 
          width={300} 
          height={300}
          style={{ width: '100%', height: '100%', border: "1px dashed #ff4785", }}
          ref={ canvasRef }
        >您的浏览器不支持Canvas</canvas>
      </div>
      <div style={{ marginTop: '10px'}}>
        <Button appearance="primary" style={btnStyle} onClick={() => {
            let options = {...modalContent, times: modalContent.times + 0.1};
            setModalContent(options);
            canvasDraw(options, canvasRef.current!);
          }
        }><Icon icon="zoom" color={color.light}></Icon>放大</Button>
        <Button appearance="primary" style={btnStyle} onClick={()=>{
          let options = {...modalContent, times: modalContent.times - 0.1};
          setModalContent(options);
          canvasDraw(options, canvasRef.current!);
        }}><Icon icon="zoomout" color={color.light}></Icon>缩小</Button>
        <Button appearance="primary" style={btnStyle} onClick={()=>{
          let options = {...modalContent, rotate: modalContent.rotate + 0.1};
          setModalContent(options);
          canvasDraw(options, canvasRef.current!)
        }}><Icon icon="undo" color={color.light}></Icon>右旋</Button>
        <Button appearance="primary" style={btnStyle} onClick={()=>{
          let options = {...modalContent, rotate: modalContent.rotate - 0.1};
          setModalContent(options);
          canvasDraw(options, canvasRef.current!)
        }}><Icon icon="undo" color={color.light}></Icon>左旋</Button>
        <Button appearance="primary" style={btnStyle} onClick={()=>{
          let options = {...modalContent, 
            times: 1, 
            rotate: 0,
            left: 0,
				    top: 0,
          };
          setModalContent(options);
          canvasDraw(options, canvasRef.current!)
        }}><Icon icon="zoomreset" color={color.light}></Icon>重置</Button>
      </div>
    </Modal>
  )
};