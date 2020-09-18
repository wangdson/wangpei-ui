import styled from 'styled-components';

export const TableTable = styled.table`
width: 100%;
text-align: left;
border-radius: 2px 2px 0 0;
border-collapse: separate;
border-spacing: 0;
table-layout: auto;
box-sizing: border-box;
margin: 0;
padding: 0;
color: rgba(0, 0, 0, 0.65);
font-variant: tabular-nums;
line-height: 1.5715;
list-style: none;
font-feature-settings: "tnum";
position: relative;
z-index: 0;
clear: both;
font-size: 14px;
background: #fff;
border-radius: 2px;
& > thead > tr > th {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  text-align: left;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.3s ease;
  position: relative;
  padding: 16px;
  overflow-wrap: break-word;
}
& > tbody > tr {
  & > td {
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.3s;
    position: relative;
    padding: 16px;
    overflow-wrap: break-word;
  }
  &:hover {
    & > td {
      background: #fafafa;
    }
  }
}
`;

export const TableHeadSpan = styled.span`
  display: inline-block;
  position: absolute;
  right: 0;
  top: 0;
  padding: 4px 16px 16px;
  cursor: pointer;
  & svg {
    height: 10px;
    width: 10px;
  }
`;