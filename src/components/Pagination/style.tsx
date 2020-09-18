import styled from 'styled-components';

export const PageUl = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;

  & > li {
    list-style: none;
    margin: 4px;
  }
  & button {
    border-radius: 6px;
    padding: 10px 8px;
  }
  & span {
    line-height: 13.6px;
    height: 13.6px;
    min-width: 18px;
  }
  & svg {
    height: 13.6px;
    width: 13.6px;
    vertical-align: bottom;
  }
`;