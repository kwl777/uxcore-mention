/**
 * example index
 */
import React from 'react';
import Mention from '../index';
import './style.less';

function formatter(data){
    return data.map((item)=> {
        return {
            text: item
        };
    });
}

let source = ['aaaaa', 'aabbb', 'aaccc', 'bbbcc', 'dddee', 'fffqq', 'pppaa', 'ppccc'];

React.render((
    <Mention
        matchRange={[1, 6]}
        source={source}
        formatter={formatter}
        selectTpl={'${text}'}>
        default content
    </Mention>
), document.getElementById('content'));
