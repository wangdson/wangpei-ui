import styled from 'styled-components';
import { RequiredItemProps, InsertFlag } from './action'

const originPadding = 24;
export interface DragHighlight {
	drag: boolean;
	itemkey: string;
}

export interface TreeItemType {
	level: number;
	itemkey: string;
  highlight: DragHighlight;
  borderColor: string;
}

export const TreeItem = styled.div<TreeItemType>`
	padding-left: ${(props) => originPadding * props.level}px;
	padding-top: 2px;
	padding-bottom: 2px;
	display: flex;
	align-items: center;
	position: relative;
  overflow: hidden;
  ${(props) => {
		if (props.highlight.drag && props.highlight.itemkey === props.itemkey) {
			return `border: 1px dashed ${props.borderColor};`;
		} else {
			return "";
		}
	}}
`;

export const TreeIcon = styled.span<{ g: RequiredItemProps }>`
& > svg {
  transition: linear 0.2s;
  height: 10px;
  margin-bottom: 5px;
  ${(props) => {
    if (props.g.children && props.g.children.length !== 0) {
      if (props.g.children[0] && props.g.children[0]["visible"]) {
        return "display:inline-block;transform: rotate(-90deg);";
      } else {
        return "display:inline-block;";
      }
    } else {
      return "opacity:0";
    }
  }};
}
`;

export interface DragControlData {
	drag: boolean;
	x: number;
	itemkey: string;
};
export type TreeGragType = { gkey: string, backColor: string } & DragControlData;
const levelSpace = 20;

export const TreeGrag = styled.div<TreeGragType>`
	position: absolute;
	width: 100%;
	height: 90%;
	${(props) => {
		switch (props.x) {
			case InsertFlag.ParentInsert:
				return `margin-left:${-levelSpace}px;`;
			case InsertFlag.SameOriginInsert:
				return "";
			case InsertFlag.ChildrenInsert:
				return `margin-left:${levelSpace}px;`;
			default:
				return "";
		}
	}};
	${(props) => {
		if (props.itemkey === props.gkey) {
			return `background: ${props.backColor};`;
		}
	}}
`;
