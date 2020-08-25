import React, { ButtonHTMLAttributes, PropsWithChildren, ReactNode, AnchorHTMLAttributes, useMemo } from "react";
import { Text, StyledButton, Loading } from './button';
import { SizeTypes, AppearancesTypes, APPEARANCES, SIZES } from "./types";
// @ts-ignore
export { SizeTypes, AppearancesTypes, APPEARANCES, SIZES };

export interface CustomButtonProps {
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否加载中 */
  isLoading?: boolean;
  /** 是否是a标签 */
  isLink?: boolean;
  /** 按钮文本  */
  loadingText?: ReactNode;
  /** 按钮大小 */
  size?: SizeTypes;
  /** 按钮类型 */
  appearance?: AppearancesTypes;
  /** 无效点击 */
  isUnclickable?: boolean;
  /** click事件 */
  onClick?: ()=>void;
  /** 包含的icon */
  containsIcon?: boolean;
}

export type ButtonProps = CustomButtonProps & AnchorHTMLAttributes<HTMLAnchorElement> & ButtonHTMLAttributes<HTMLButtonElement>;
const Button: React.FC<ButtonProps> = (props: PropsWithChildren<ButtonProps>) => {
  const { isLoading, loadingText, isLink, children } = props;
  const buttonInner = (
    <>
      <Text>{children}</Text>
      {isLoading && <Loading>{loadingText || 'loading'}</Loading>}
    </>
  );
  const btnType = useMemo(()=>{
    if(isLink){
      return 'a'
    }
  }, [isLink]);
  return (
    <StyledButton as={btnType} {...props} data-testid="button">
      {buttonInner}
    </StyledButton>
  )
}

Button.defaultProps = {
  isLoading: false,
  loadingText: null,
  isLink: false,
  appearance: APPEARANCES.tertiary,
  disabled: false,
  isUnclickable: false,
  containsIcon: false,
  size: SIZES.medium
}

export default Button;