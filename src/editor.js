import React from 'react';
// import rangy from 'rangy';
import './rangy-position';
import {parseStrByDelimiter} from './util';
import { KEYCODE } from './keycode';
import classNames from 'classnames';

const STORE = {};

// webkit browsers support 'plaintext-only'
const contentEditableValue = (function () {
  const div = document.createElement('div');
  div.setAttribute('contenteditable', 'PLAINTEXT-ONLY');
  return div.contentEditable === 'plaintext-only' ? 'plaintext-only' : true;
})();

export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      value: props.value,
    };
  }
  componentDidMount() {
    if (this.props.value) {
      this.refs.editor.innerHTML = this.props.value;
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.mentionTarget &&
      (!this.props.mentionTarget || (this.props.mentionTarget.t !== nextProps.mentionTarget.t))) {
      this.insertMentionTarget(nextProps.mentionTarget.data);
    }
  }
  onKeydown(e) {
    switch (e.keyCode) {
      case KEYCODE.UP:
      case KEYCODE.DOWN:
        if (this.props.panelVisible) {
          e.preventDefault();
        }
        break;
      case KEYCODE.ENTER:
        // insert br at the end of line
        e.preventDefault();
        if (!this.props.panelVisible) {
          const editor = this.refs.editor;
          const sel = rangy.getSelection();
          const range = sel.getRangeAt(0);

          // make sure the last element of the editor is br
          // refer to: http://stackoverflow.com/questions/6023307/dealing-with-line-breaks-on-contenteditable-div
          if (!editor.lastChild ||
          editor.lastChild.nodeName.toLowerCase() !== 'br') {
            editor.appendChild(document.createElement('br'));
          }
          const nodeBr = document.createElement('br');
          range.deleteContents();
          range.insertNode(nodeBr);
          range.setStartAfter(nodeBr);
          sel.setSingleRange(range);
        }
        break;
      default:
        // this.props.onChange('xxx');
        break;
    }
  }
  onKeyup(e) {
    // if (this.props.panelVisible) {return;}
    switch (e.keyCode) {
      case KEYCODE.UP:
      case KEYCODE.DOWN:
        if (this.props.panelVisible) {
          e.preventDefault();
        }
        break;
      case KEYCODE.ENTER:
        break;
      default:
        const sel = rangy.getSelection();
        const range = sel.getRangeAt(0);
        if (range.commonAncestorContainer.nodeType === 3) {
          range.setStart(range.commonAncestorContainer, 0);
          const originStr = range.toString();
          const str = parseStrByDelimiter(originStr, '@');
          // send str to matcher
          this.props.matcher(str);
          if (str) {
            this.props.setCursorPos(range.getEndClientPos());
            // set range's start position before delimiter
            range.setStart(range.commonAncestorContainer, originStr.length - str.length - 1);
            // save range position
            STORE.bookmark = range.getBookmark(range.commonAncestorContainer);
          }
        }
        break;
    }
  }
  onBlur() {
    this.emitChange();
    this.setState({
      focus: false,
    });
  }
  onFocus() {
    this.setState({
      focus: true,
    });
  }
  insertMentionTarget(mentionData) {
    // console.log(mentionData);
    const editor = this.refs.editor;
    const sel = rangy.getSelection();
    const formatter = this.props.formatter;
    if (STORE.bookmark) {
      const range = sel.getRangeAt(0);
      range.moveToBookmark(STORE.bookmark);
      const mentionNode = document.createElement('input');
      mentionNode.setAttribute('type', 'button');
      mentionNode.setAttribute('tabindex', '-1');
      mentionNode.className = `${this.props.prefixCls}-node`;
      mentionNode.value = formatter(mentionData);
      // delete origin content in range
      range.deleteContents();
      range.insertNode(mentionNode);
      range.collapseAfter(mentionNode);
      range.select();
      setTimeout(() => {
        editor.focus();
      }, 0);
    }
  }
  extractContent() {
    const editor = this.refs.editor;
    const nodes = editor.childNodes;
    let content = '';
    for (let i = 0, len = nodes.length; i < len; i += 1) {
      const node = nodes[i];
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        if (tagName === 'input') {
          content += ` ${node.value} `;
        } else if (tagName === 'br') {
          content += '\n';
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        content += node.textContent || node.nodeValue;
      }
    }
    return content;
  }
  emitChange(e) {
    const editor = this.refs.editor;

    const lastHtml = this.lastHtml;
    const currentHtml = editor.innerHTML;
    if (lastHtml === currentHtml) {
      // no change made
      return;
    }
    this.lastHtml = currentHtml;

    const content = this.extractContent();
    this.setState({
      value: content,
    });
    this.props.onChange(e, content);
  }
  render() {
    let style = {
      width: this.props.width,
      height: this.props.height,
    };
    return (
      <div className={this.props.prefixCls}>
        <div className={`${this.props.prefixCls}-editor`} ref="editor"
          onKeyUp={this.onKeyup.bind(this)}
          onKeyDown={this.onKeydown.bind(this)}
          contentEditable={contentEditableValue}
          onInput={this.emitChange.bind(this)}
          onBlur={this.onBlur.bind(this)}
          onFocus={this.onFocus.bind(this)}
          style={style}></div>
        {!this.state.focus && !this.state.value ? <div className={`${this.props.prefixCls}-placeholder`}>{this.props.placeholder}</div> : ''}
      </div>
    );
  }
}
Editor.displayName = 'uxcore-mention-editor';
Editor.propType = {
  prefixCls: React.PropTypes.string,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  placeholder: React.PropTypes.string,
  mentionTarget: React.PropTypes.object,
  matcher: React.PropTypes.func,
  setCursorPos: React.PropTypes.func,
  panelVisible: React.PropTypes.bool,
  formatter: React.PropTypes.func,
  onChange: React.PropTypes.func,
  value: React.PropTypes.string,
};
Editor.defaultProps = {
  prefixCls: '',
  width: 200,
  height: 100,
  placeholder: '',
  mentionTarget: null,
  matcher: function(){},
  setCursorPos: function(){},
  panelVisible: false,
  formatter: function(){},
  onChange: function(){},
  value: '',
};
