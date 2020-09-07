import React, {useState} from "react";
import { render as trender, fireEvent, cleanup, act } from "@testing-library/react";
import { Modal } from "../components/Modal";
import { render, unmountComponentAtNode } from 'react-dom';
import { color, typography } from "../components/shared/style";

/**
 * 睡眠
 * @param delay 延迟几秒 
 */
const sleep = (delay: number) => {
  return new Promise(res => {
    setTimeout(res, delay);
  })
}

let container: HTMLDivElement;
beforeEach(()=>{
  // 创建一个Dom元素作为渲染目标
  container = document.createElement('div');
  document.body.appendChild(container);
});
afterEach(()=>{
  unmountComponentAtNode(container);
})

describe('test Modal component', ()=>{
  it('should render corrent visible', ()=>{
    let visible = false;
    function setVisible(v: boolean){
      visible = v;
    }
    let wrapper = trender(<Modal title="标题" visible={visible} parentSetState={setVisible}>
      context test
    </Modal>);
    let title, context;
    title = wrapper.queryByText('标题');
    context = wrapper.queryByText('context test');
    expect(title).toBeNull();
    expect(context).toBeNull();
    cleanup();
    setVisible(!visible); // 设置modal开启
    wrapper = trender(<Modal title="标题" visible={visible} parentSetState={setVisible}>
      context test
    </Modal>);
    title = wrapper.findByText('标题');
    context = wrapper.findByText('context test');
    expect(title).toBeTruthy();
    expect(context).toBeTruthy();
    cleanup();
    setVisible(!visible); // 设置modal关闭
    wrapper = trender(<Modal title="标题" visible={visible} parentSetState={setVisible}>
      context test
    </Modal>);
    title = wrapper.queryByText('标题');
    context = wrapper.queryByText('context test');
    expect(title).toBeNull();
    expect(context).toBeNull();
  });
  it('should render correct render', async ()=>{
    let visible = false;
    function setVisible(v: boolean){
      visible = v;
    }
    act(()=>{
      render(<>
      <Modal title="标题" 
        visible={visible} 
        delay={3000}
        parentSetState={setVisible}>
        context test
      </Modal>
      <button id="modalBtn" onClick={()=>{
        setVisible(!visible);
      }}>ModalBtn</button>
    </>, container);
    })
    let modalBtn = container.querySelector('#modalBtn');
    // 开启modal框
    fireEvent.click(modalBtn!);
    expect(visible).toBe(true);
    fireEvent.click(modalBtn!);
    expect(visible).toBe(false);
  })
})