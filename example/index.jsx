/**
 * example index
 */
import React from 'react';
import Mention from '../index';
import './style.less';

React.render((
    <Mention source={['aaaaa', 'aabbb', 'aaccc', 'bbbcc', 'dddee', 'fffqq', 'pppaa', 'ppccc']}>
        default content
    </Mention>
), document.getElementById('content'));
