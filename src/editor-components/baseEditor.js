import { Component } from 'react';
import PropTypes from 'prop-types';
import { KEYCODE } from '../utils/keycode';
import '../utils/rangy-position';

export default class BaseEditor extends Component {
  static displayName = 'BaseEditor';
  static propTypes = {
    panelVisible: PropTypes.boolean,
    onFocus: PropTypes.func,
    mentionFormatter: PropTypes.func,
    onAdd: PropTypes.func,
  };
  static defaultProps = {
  };

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
        } else if (this.handleEnterPress) {
          this.handleEnterPress(e);
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
        if (this.handleDefaultKeyup) {
          this.handleDefaultKeyup();
        }
        break;
    }
  }
  insertMentionData(mentionData) {
    const { mentionFormatter, onAdd } = this.props;
    const insertContent = mentionFormatter(mentionData);
    this.insert(insertContent);
    onAdd(insertContent, mentionData);
  }
}
