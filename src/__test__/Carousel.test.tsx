import React from "react";
import { render as trender, act, fireEvent, cleanup } from "@testing-library/react";
import { Carousel } from "../components/Carousel";
import { unmountComponentAtNode, render } from 'react-dom';
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
const children = (num: number, style?: any) => new Array(num).fill(1).map((v,k)=>(<span id={`test${k+1}`} key={`test${k+1}`} {...{style}}>{k+1}</span>))
/** 测试自动滚动 */
const testAutoPlay = () => (
  <Carousel autoPlayDelay={1000} autoPlay>
    {children(3)}
  </Carousel>
);
/** 反向滚动 */
const testAutoPlayReverse = () => (
  <Carousel autoPlay autoPlayDelay={1000} autoPlayReverse>
    {children(3)}
  </Carousel>
);

/** 测试高度 */
const testHeight = ()=>(
  <Carousel autoPlay autoPlayDelay={1000} height={300}>
    {children(3)}
  </Carousel>
);

const testDefaultIndex = () =>(
  <Carousel autoPlay autoPlayDelay={1000} height={300} defaultIndex={2}>
    {children(3)}
  </Carousel>
);

const testRadioColor = ()=>(
  <div>
		<Carousel height={100} autoPlay={false} radioAppear="positive">
      {children(3)}
    </Carousel>
    <Carousel height={100} autoPlay={false}>
      {children(3)}
    </Carousel>
    <Carousel height={100} autoPlay={false} radioAppear="purple">
      {children(3)}
    </Carousel>
  </div>    
);

const testOneItem = function() {
	return (
		<Carousel height={100} autoPlay={false}>
			<span id="test1" style={{ height: "100%", width: "100%" }}>
				1
			</span>
		</Carousel>
	);
};

const testTouch = ()=>(
  <Carousel height={100} autoPlay={false}>
    {children(3, {height: "100%", width: "100%" })}
  </Carousel>
);

const testResize = ()=>(
  <Carousel height={100} autoPlay={false}>
    {children(3, {height: "100%", width: "100%" })}
  </Carousel>
);

let container: HTMLDivElement;
beforeEach(()=>{
  // 创建一个Dom元素作为渲染目标
  container = document.createElement('div');
  document.body.appendChild(container);
});
afterEach(()=>{
  unmountComponentAtNode(container);
})
describe('test Carousel component', ()=>{
  it('it should autoplay', async()=>{
    act(()=>{
      render(testAutoPlay(), container);
    })
    // 默认索引是0
    let text1 = container.querySelector('#test1');
    let text2 = container.querySelector('#test2');
    let text3 = container.querySelector('#test3');
    expect(text1?.textContent).toEqual('1');
    expect(text2).toBeNull();
    expect(text3).toBeNull();
    //自动播放速度为5000，jest超过5000的定时器直接报错,所以设置1000的定时器
    await act(async()=>{
      await sleep(1000);
    })
    text2 = container.querySelector('#test2');
    text3 = container.querySelector('#test3');
    expect(text2?.textContent).toEqual('2');
    expect(text3).toBeNull();
    await act(async()=>{
      await sleep(1000);
    })
    text3 = container.querySelector('#test3');
    text1 = container.querySelector('#test1');
    expect(text3?.textContent).toEqual('3');
    expect(text1).toBeNull();
    await act(async()=>{
      await sleep(1000);
    })
    text1 = container.querySelector('#test1');
    text2 = container.querySelector('#test2');
    expect(text1?.textContent).toEqual('1');
    expect(text2).toBeNull();
  });
  it('it should autoplay reverse', async()=>{
    act(()=>{
      render(testAutoPlayReverse(), container);
    })
    // 默认索引是0
    let text1 = container.querySelector('#test1');
    let text2 = container.querySelector('#test2');
    let text3 = container.querySelector('#test3');
    expect(text1?.textContent).toEqual('1');
    expect(text2).toBeNull();
    expect(text3).toBeNull();
    //自动播放速度为5000，jest超过5000的定时器直接报错,所以设置1000的定时器
    await act(async()=>{
      await sleep(1000);
    })
    text3 = container.querySelector('#test3');
    text2 = container.querySelector('#test2');
    expect(text3?.textContent).toEqual('3');
    expect(text2).toBeNull();
    await act(async()=>{
      await sleep(1000);
    })
    text2 = container.querySelector('#test2');
    text1 = container.querySelector('#test1');
    expect(text2?.textContent).toEqual('2');
    expect(text1).toBeNull();
    await act(async()=>{
      await sleep(1000);
    })
    text1 = container.querySelector('#test1');
    text3 = container.querySelector('#test3');
    expect(text1?.textContent).toEqual('1');
    expect(text3).toBeNull();
  });
  it('it should corrent height', ()=>{
    act(()=>{
      render(testHeight(), container);
    })
    let text1 = container.querySelector('#test1');
    expect(text1?.parentElement).toHaveStyle(`height: 300px`)
  });
  it("should render correct default index", () => {
		act(() => {
			render(testDefaultIndex(), container);
		});
		let text3 = container.querySelector("#test3");
		expect(text3).toBeTruthy();
		let text1 = container.querySelector("#test1");
		expect(text1).toBeNull();
  });
  it("should render correct when click radio", () => {
		act(() => {
			render(testDefaultIndex(), container);
		});
		const label = container.getElementsByTagName("label");
		fireEvent.click(label[0]);
		let text1 = container.querySelector("#test1");
		let text2 = container.querySelector("#test2");
		let text3 = container.querySelector("#test3");
		expect(text1).toBeTruthy(); //默认3，3到1
		expect(text2).toBeNull();
		expect(text3).toBeTruthy();
		fireEvent.click(label[1]); //跳2
		text1 = container.querySelector("#test1");
		text2 = container.querySelector("#test2");
		text3 = container.querySelector("#test3");
		expect(text1).toBeTruthy();
		expect(text2).toBeTruthy();
		expect(text3).toBeNull();
		//点击相同
		fireEvent.click(label[1]); //跳2
		text1 = container.querySelector("#test1");
		text2 = container.querySelector("#test2");
		text3 = container.querySelector("#test3");
		expect(text1).toBeTruthy();
		expect(text2).toBeTruthy();
		expect(text3).toBeNull();
  });
  it("should render correct radio style", () => {
		const wrapper = trender(testRadioColor());
		expect(wrapper).toMatchSnapshot();
  });
  it("should trun the page when touch", () => {
		act(() => {
			render(testTouch(), container);
		});
		let text1 = container.querySelector("#test1");
		let text2 = container.querySelector("#test2");
		fireEvent.touchStart(text1!, { touches: [{ clientX: 20 }] });
		fireEvent.touchEnd(text1!, { changedTouches: [{ clientX: 130 }] });
		//向前翻1-3
		let text3 = container.querySelector("#test3");
		text2 = container.querySelector("#test2");
		expect(text3).toBeTruthy();
		expect(text2).toBeNull();
		//3-》2
		fireEvent.touchStart(text3!, { touches: [{ clientX: 20 }] });
		fireEvent.touchEnd(text3!, { changedTouches: [{ clientX: 130 }] });
		text2 = container.querySelector("#test2");
		expect(text2).toBeTruthy();
		text1 = container.querySelector("#test1");
		expect(text1).toBeNull();
		//2-1
		fireEvent.touchStart(text2!, { touches: [{ clientX: 20 }] });
		fireEvent.touchEnd(text2!, { changedTouches: [{ clientX: 130 }] });
		text1 = container.querySelector("#test1");
		expect(text1).toBeTruthy();
		text3 = container.querySelector("#test3");
		expect(text3).toBeNull();
		//向后翻 1-》2
		fireEvent.touchStart(text1!, { touches: [{ clientX: 130 }] });
		fireEvent.touchEnd(text1!, { changedTouches: [{ clientX: 20 }] });
		text1 = container.querySelector("#test1");
		expect(text1).toBeTruthy();
		text2 = container.querySelector("#test2");
		expect(text2).toBeTruthy();
		text3 = container.querySelector("#test3");
		expect(text3).toBeNull();
		//2-3
		fireEvent.touchStart(text2!, { touches: [{ clientX: 130 }] });
		fireEvent.touchEnd(text2!, { changedTouches: [{ clientX: 20 }] });
		text1 = container.querySelector("#test1");
		expect(text1).toBeNull();
		text2 = container.querySelector("#test2");
		expect(text2).toBeTruthy();
		text3 = container.querySelector("#test3");
		expect(text3).toBeTruthy();
		//不变
		fireEvent.touchStart(text2!, { touches: [{ clientX: 130 }] });
		fireEvent.touchEnd(text2!, { changedTouches: [{ clientX: 120 }] });
		text1 = container.querySelector("#test1");
		expect(text1).toBeNull();
		text2 = container.querySelector("#test2");
		expect(text2).toBeTruthy();
		text3 = container.querySelector("#test3");
		expect(text3).toBeTruthy();
	});
	it("should render one item", () => {
		const wrapper = trender(testOneItem());
		expect(wrapper).toMatchSnapshot();
	});
	it("should test resize", async () => {
		act(() => {
			render(testResize(), container);
		});
		act(() => {
			window.dispatchEvent(new Event("resize"));
		});
		expect(container).toMatchSnapshot();
	});
})