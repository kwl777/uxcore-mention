import React from 'react';
import BaseEditor from '../baseEditor';
import { parseStrByDelimiter } from '../util';

const MutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;

// webkit browsers support 'plaintext-only'
const contentEditableValue = (() => {
  const div = document.createElement('div');
  div.setAttribute('contenteditable', 'PLAINTEXT-ONLY');
  return div.contentEditable === 'plaintext-only' ? 'plaintext-only' : true;
})();

export default class ContentEditableEditor extends BaseEditor {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      value: props.defaultValue,
    };
  }
  componentDidMount() {
    this.STORE = {};
    if (this.props.defaultValue) {
      this.refs.editor.innerHTML = this.props.defaultValue;
    }
    if (MutationObserver) {
      this.observer = new MutationObserver(this.onMutation.bind(this));
      this.observer.observe(this.refs.editor, {
        characterData: true,
        childList: true,
        subtree: true,
      });
    }
  }
  componentWillUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
  handleEnterPress(e) {
    e.preventDefault();
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

  handleDefaultKeyup(e) {
    const { delimiter } = this.props;
    const sel = rangy.getSelection();
    const range = sel.getRangeAt(0);
    if (range.commonAncestorContainer.nodeType === 3) {
      range.setStart(range.commonAncestorContainer, 0);
      const originStr = range.toString();
      const str = parseStrByDelimiter(originStr, delimiter);
      // send str to matcher
      this.props.matcher(str);
      if (str) {
        this.props.setCursorPos(range.getEndClientPos());
        // set range's start position before delimiter
        range.setStart(range.commonAncestorContainer, originStr.length - str.length - 1);
        // save range position
        this.STORE.bookmark = range.getBookmark(range.commonAncestorContainer);
      }
    }
  }
  
  onInput() {
    if (!this.observer) {
      this.emitChange();
    }
  }
  onMutation(mutations) {
    this.emitChange(mutations);
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
    this.props.onFocus(this);
  }
  insert(mentionContent) {
    const { editor } = this.refs;
    const sel = rangy.getSelection();
    if (this.STORE.bookmark) {
      const range = sel.getRangeAt(0);
      range.moveToBookmark(this.STORE.bookmark);
      const mentionNode = document.createElement('input');
      mentionNode.setAttribute('type', 'button');
      mentionNode.setAttribute('tabindex', '-1');
      mentionNode.className = `${this.props.prefixCls}-node`;
      mentionNode.value = mentionContent;
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
    // console.time('extractContent');
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
    // console.timeEnd('extractContent');
    return content;
  }
  emitChange(e) {
    if (!this.observer) {
      const editor = this.refs.editor;

      const lastHtml = this.lastHtml;
      const currentHtml = editor.innerHTML;
      if (lastHtml === currentHtml) {
        // no change made
        return;
      }
      this.lastHtml = currentHtml;
    }
    const content = this.extractContent();
    this.setState({
      value: content,
    });
    this.props.onChange(e, content);
  }
  render() {
    const { readOnly } = this.props;
    let style = {
      width: this.props.width,
      height: this.props.height,
    };
    return (
      <div className={this.props.prefixCls}>
        <div className={`${this.props.prefixCls}-editor`} ref="editor"
          onKeyUp={this.onKeyup.bind(this)}
          onKeyDown={this.onKeydown.bind(this)}
          contentEditable={readOnly ? false: contentEditableValue}
          onInput={this.onInput.bind(this)}
          onBlur={this.onBlur.bind(this)}
          onFocus={this.onFocus.bind(this)}
          style={style}></div>
        {!this.state.focus && !this.state.value ? <div className={`${this.props.prefixCls}-placeholder`}>{this.props.placeholder}</div> : ''}
      </div>
    );
  }
}
ContentEditableEditor.propType = {
  prefixCls: React.PropTypes.string,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  placeholder: React.PropTypes.string,
  formatter: React.PropTypes.func,
  onChange: React.PropTypes.func,
  onAdd: React.PropTypes.func,
  defaultValue: React.PropTypes.string,
  readOnly: React.PropTypes.bool,
  delimiter: React.PropTypes.string,
};
ContentEditableEditor.defaultProps = {
  prefixCls: '',
  width: 200,
  height: 100,
  placeholder: '',
  formatter: (data) => `@${data.text}`,
  onChange: () => {},
  onAdd: () => {},
  defaultValue: '',
  readOnly: false,
  delimiter: '@',
};
