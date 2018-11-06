import { addDecorator, configure } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';

addDecorator(
    withOptions({
        addonPanelInRight: true,
        goFullScreen: false,
        name: 'react-form-core',
        showAddonPanel: true,
        showSearchBox: false,
        showStoriesPanel: true,
        url: '',
    })
);

// Load all the stories
const stories = require.context('../src', true, /\.story\.tsx$/);

function loadStories() {
    stories.keys().forEach(filename => stories(filename));
}

configure(loadStories, module);
