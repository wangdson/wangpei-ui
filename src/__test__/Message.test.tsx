import React from "react";
import { act, fireEvent, cleanup } from "@testing-library/react";
import { Message, MessageType, message, createMessage } from "../components/Message";
import { color, typography } from "../components/shared/style";
import { unmountComponentAtNode, render } from "react-dom";
import Button from '../components/Button';

let container: HTMLDivElement;
beforeEach(() => {
	// 创建一个 DOM 元素作为渲染目标
	container = document.createElement("div");
	document.body.appendChild(container);
});
const clean = () => {
	// 退出时进行清理
	unmountComponentAtNode(container);
};
afterEach(() => clean());
const sleep = (delay: number) => {
	return new Promise((res) => {
		setTimeout(() => {
			res();
		}, delay);
	});
};

async function changeIcon(type: MessageType) {
  clean();
  act(()=>{
    render(
			<Button
				id="btn"
				onClick={() => message[type](<span className="test3">test3</span>)}
			>
				but
			</Button>,
			container
		);
  })
  const btn = container.querySelector("#btn");
  await act(async () => {
		fireEvent.click(btn!);
		await sleep(500);
  });
  expect(document.querySelector('.test3')).toBeTruthy();
  expect(container).toMatchSnapshot();
}

const fn = jest.fn();

describe('test Message component', ()=>{
  it('render basic func', async ()=>{
    act(()=>{
      render(
        <Button
          id="btn"
          onClick={() => message.default(<span className="test">test</span>)}
        >
          but
        </Button>,
        container
      );
    })
    let btn = container.querySelector("#btn");
    await act(async ()=>{
      fireEvent.click(btn!);
      await sleep(500);
    })
    expect(document.querySelector('.test')).toBeTruthy();
    expect(container).toMatchSnapshot();
    await act(async ()=>{
      await sleep(1500);
    })
    expect(document.querySelector('.test')).toBeNull();
    expect(container).toMatchSnapshot();
  });
  it('change color', async ()=>{
    act(() => {
			render(
				<Button
					id="btn"
					onClick={() =>
						message.default(<span className="test2">test2</span>, {
							background: "blue",
							color: "red",
						})
					}
				>
					but2
				</Button>,
				container
			);
    });
    let btn = container.querySelector("#btn");
    await act(async ()=>{
      fireEvent.click(btn!);
      await sleep(500);
    })
    expect(document.querySelector(".test2")).toBeTruthy();
		expect(container).toMatchSnapshot();
  });
  it('callback test', async ()=>{
    act(() => {
			render(
				<Button
					id="btn"
					onClick={() =>
						message.default(<span className="callback">callback</span>, {
							callback: fn
						})
					}
				>
					callbackBtn
				</Button>,
				container
			);
    });
    const btn = container.querySelector("#btn");
    expect(fn).not.toHaveBeenCalled();
    await act(async()=>{
      fireEvent.click(btn!);
      await sleep(2100);
    })
    expect(fn).toHaveBeenCalled();
    expect(container).toMatchSnapshot();
  });
  it('change icon', async ()=>{
    await changeIcon('default');
    await changeIcon('error');
    await changeIcon('success');
    await changeIcon('warning');
    await changeIcon('success');
    await changeIcon('loading');
  });
  //prettier-ignore
	it("icon type default", async () => {
		act(() => {
			render(
				<div>
					{/* @ts-ignore */}
					<Button id="btn" onClick={() => createMessage("sdss")("fff")}
					>
						btn
					</Button>
				</div>,
				container
			);
		});
		const btn = container.querySelector("#btn");
		await act(async () => {
			fireEvent.click(btn!);
			await sleep(2100);
		});
		expect(container).toMatchSnapshot();
  });
  
  it("animate duration", async () => {
		act(() => {
			render(
				<Button
					id="btn"
					onClick={() =>
						message.default(<span className="callback">callback</span>, {
							animationDuring: 1000,
							delay: 3000,
						})
					}
				>
					btn
				</Button>,
				container
			);
		});
		let btn = container.querySelector("#btn");
		await act(async () => {
			fireEvent.click(btn!);
			await sleep(2100);
		});
		expect(container).toMatchSnapshot();
		await act(async () => {
			await sleep(1100);
		});
		expect(container).toMatchSnapshot();
  });
  it("animation lg delay", async () => {
		act(() => {
			render(
				<Button
					id="btn"
					onClick={() =>
						message.default(<span className="callback">callback</span>, {
							animationDuring: 2000,
							delay: 1000,
						})
					}
				>
					btn
				</Button>,
				container
			);
		});
		let btn = container.querySelector("#btn");
		await act(async () => {
			fireEvent.click(btn!);
			await sleep(1000);
		});
		expect(container).toMatchSnapshot();
	});
})