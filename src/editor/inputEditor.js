import React from 'react';
import BaseEditor from '../baseEditor';
import { parseStrByDelimiter, getCaretOffset, getCaretPosition } from '../util';

export default class InputEditor extends BaseEditor {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.selectionPosition = {
      start: 0,
      end: 0,
    };
  }
  handleDefaultKeyup() {
    const { editor } = this.refs;
    const { delimiter } = this.props;
    const offset = getCaretOffset(editor);
    let value = editor.value;
    value = value.replace(/(\r\n)|\n|\r/g, '\n');
    const originStr = value.slice(0, offset.end);
    const str = parseStrByDelimiter(originStr, delimiter);
    this.props.matcher(str);
    this.selectionPosition = {
      start: offset.start - str.length - 1,
      end: offset.end,
    };
    if (str) {
      const position = getCaretPosition(editor);
      this.props.setCursorPos({
        x: position.left,
        y: position.top,
      });
    }
  }
  insert(mentionContent) {
    this.insertContentAtCaret(mentionContent);
  }
  insertContentAtCaret(text) {
    const { editor } = this.refs;
    if (document.selection) {
      editor.focus();
      if (editor.createTextRange) {
        const range = editor.createTextRange();
        range.collapse(true);
        range.moveStart('character', this.selectionPosition.start);
        range.moveEnd('character', this.selectionPosition.end - this.selectionPosition.start);
        range.text = text;
      } else if (editor.setSelectionRange) {
        editor.setSelectionRange(this.selectionPosition.start, this.selectionPosition.end);
      }
    } else {
      const scrollTop = editor.scrollTop;
      editor.value = editor.value.substring(0, this.selectionPosition.start) +
        text +
        editor.value.substring(this.selectionPosition.end, editor.value.length);
      editor.focus();
      editor.scrollTop = scrollTop;
    }
  }
  render() {
    const { readOnly, placeholder } = this.props;
    let style = {
      width: this.props.width,
      height: this.props.height,
    };
    return (
      <div className={this.props.prefixCls}>
        <input
          className={`${this.props.prefixCls}-editor kuma-input`}
          ref="editor"
          style={style}
          readOnly={readOnly}
          placeholder={placeholder}
          onKeyDown={this.onKeydown.bind(this)}
          onKeyUp={this.onKeyup.bind(this)}
          onFocus={this.onFocus.bind(this)}
          defaultValue={this.props.defaultValue}
        />
      </div>
    );
  }
}
InputEditor.propType = {
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
InputEditor.defaultProps = {
  prefixCls: '',
  width: 200,
  height: 30,
  placeholder: '',
  formatter: (data) => ` @${data.text} `,
  onChange: () => {},
  onAdd: () => {},
  defaultValue: '',
  readOnly: false,
  delimiter: '@',
};
