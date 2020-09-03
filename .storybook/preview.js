import React from 'react';
import { GlobalStyle } from '../src/components/shared/global';
import { addDecorator, addParameters, configure } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';

const loaderFn = () => {
  return [
    require('../src/stories/Introduction.stories.mdx'),
    require('../src/components/Avatar/Avatar.stories'),
    require('../src/components/Badge/Badge.stories'),
    require('../src/components/Button/Button.stories'),
    require('../src/components/Carousel/Carousel.stories'),
    require('../src/components/Color/color.stories.mdx'),
    require('../src/components/Highlight/Highlight.stories'),
    require('../src/components/Icon/Icon.stories'),
    require('../src/components/Radio/Radio.stories'),
    require('../src/components/Typography/Typography.stories.mdx'),
  ]
}


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

addParameters({
  options: {
    showRoots: true,
  },
  dependencies: {
    withStoriesOnly: true,
    hideEmpty: true,
  },
});
addDecorator(withA11y);
addDecorator((story) => (
  <>
    <GlobalStyle />
    {story()}
  </>
))

configure(loaderFn, module);
