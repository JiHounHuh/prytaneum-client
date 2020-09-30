import React, { Component } from 'react';

import Bold from '.';

export default {
    title: 'Components/Bold',
    component: Component,
};

const toBoldString = 'test_asdASD_123_=-0"\'';
const toBoldJSX = <p>this should look bold</p>;
const toBoldJSXArr = (
    <div>
        <p>test_jsxArr</p>
        <p>testingJSX[]</p>
    </div>
);

export function BoldText() {
    return (
        <div>
            <Bold>{toBoldString}</Bold>
            <Bold>{toBoldJSX}</Bold>
            <Bold>{toBoldJSXArr}</Bold>
            <p>this is not bold for reference</p>
        </div>
    );
}