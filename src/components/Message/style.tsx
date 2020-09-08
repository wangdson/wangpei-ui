import styled, {css} from 'styled-components';
import { typography } from "../shared/style";
import { iconSpin, messageOpenAnimate, messageCloseAnimate } from '../shared/animation';

export const messageBoxShadow = css`
	box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
		0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
`;

export const MessageText = styled.span<{ bg: string; fc: string }>`
	display: inline-block;
	padding: 10px 16px;
	background: ${(props) => props.bg};
	color: ${(props) => props.fc};
	font-size: ${typography.size.s2}px;
	font-weight: ${typography.weight.bold};
	margin: 10px;
	${messageBoxShadow};
	border-radius: 2px;
`;

export const IconWrapper = styled.span<{ spin?: boolean }>`
	margin-right: 10px;
	& > svg {
		font-size: ${typography.size.s2}px;
		${(props) =>
			props.spin &&
			css`
				animation: ${iconSpin} 2s linear infinite;
			`}
	}
`;

export const MessageTextWrapper = styled.div<{
	openState: boolean;
	closeState: boolean;
	ani: number;
}>`
	${(props) =>
		props.openState &&
		css`
			animation: ${messageOpenAnimate} ${props.ani / 1000}s ease-in;
		`}
	${(props) =>
		props.closeState &&
		css`
			animation: ${messageCloseAnimate} ${props.ani / 1000}s ease-in;
		`}
`;