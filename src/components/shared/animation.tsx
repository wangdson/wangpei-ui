import {keyframes} from 'styled-components';

export const easing = {
  rubber: 'cubic-bezier(0.175, 0.885, 0.335, 1.05)',
}

export const glow = keyframes`
  0%, 100% {opacity: 1;}
  50% { opacity: .4;}
`;

export const modalOpenAnimate = keyframes`
  0% {opacity: 0;}
  50% { opacity: .4;}
  100% {opacity: 1;}
`; 

export const modalCloseAnimate = keyframes`
  0% {opacity: 1;}
  50% { opacity: .4;}
  100% {opacity: 0;}
`; 
