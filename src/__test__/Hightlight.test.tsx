import React from 'react';
import { render } from '@testing-library/react';
import { Highlight, HighlightProps } from '../components/Highlight';

const javascriptCode = `import React from 'react'

const MyComponent = () => (
  <div>My component renders all the things</div>
)

export default MyComponent
`;

const testProps: HighlightProps = {
  language: 'javascript',
}

describe('test Highlight component', ()=>{
  it('Highlight component', ()=>{
    const wrapper = render(<Highlight {...testProps}>{javascriptCode}</Highlight>);
    const ele = wrapper.getByTestId('highlight');
    expect(ele).toBeInTheDocument();
  });
})