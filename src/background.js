import React from 'react';
import ReactDOM from 'react-dom';
import Audio from './audio';

browser.contextMenus.create({
    id: 'speech',
    title: 'Selected text to speech',
    contexts: ['selection'],
    icons: {
        "48": 'images/icons.png',
    },
    onclick: (info) => {
        ReactDOM.unmountComponentAtNode(document.getElementById('audio'));
        ReactDOM.render(<Audio text={info.selectionText}/>, document.getElementById('audio'));
    }
});

