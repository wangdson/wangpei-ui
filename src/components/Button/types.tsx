type btnType =
	| "primary"
	| "primaryOutline"
	| "secondary"
	| "secondaryOutline"
	| "tertiary"
	| "outline"
	| "inversePrimary"
	| "inverseSecondary"
  | "inverseOutline";

type AppearancesObj = {
  [key in btnType]: btnType
}
export const APPEARANCES: AppearancesObj = {
  primary: 'primary',
  primaryOutline: "primaryOutline",
	secondary: "secondary",
	secondaryOutline: "secondaryOutline",
	tertiary: "tertiary",
	outline: "outline",
	inversePrimary: "inversePrimary",
	inverseSecondary: "inverseSecondary",
	inverseOutline: "inverseOutline",
}  
export type AppearancesTypes = keyof typeof APPEARANCES;  

type sizeType = 'small' | 'medium' | 'large';
type sizeObj = {
  [key in sizeType]: sizeType
}
export const SIZES: sizeObj = {
  small: 'small',
  medium: 'medium',
  large: 'large'
}
export type SizeTypes = keyof typeof SIZES;