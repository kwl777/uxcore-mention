import React from 'react';
import { KEYCODE } from './keycode';
import { parseStrByDelimiter } from './util';
import './rangy-position';

export default class BaseEditor extends React.Component {
  constructor(props) {
    super(props);
  }
  onFocus() {
    this.props.onFocus(this);
  }
  onKeydown(e) {
    const { panelVisible } = this.props;
    switch (e.keyCode) {
      case KEYCODE.UP:
      case KEYCODE.DOWN:
        if (panelVisible) {
          e.preventDefault();
        }
        break;
      case KEYCODE.ENTER:
        if (panelVisible) {
          e.preventDefault();
        } else {
          this.handleEnterPress && this.handleEnterPress(e);
        }
        break;
      default:
        break;
    }
  }
  onKeyup(e) {
    const { panelVisible } = this.props;
    switch (e.keyCode) {
      case KEYCODE.UP:
      case KEYCODE.DOWN:
        if (panelVisible) {
          e.preventDefault();
        }
        break;
      case KEYCODE.ENTER:
        break;
      default:
        this.handleDefaultKeyup && this.handleDefaultKeyup();
        break;
    }
  }
  insertMentionData(mentionData) {
    const { formatter } = this.props;
    this.insert(formatter(mentionData));
  }
}
