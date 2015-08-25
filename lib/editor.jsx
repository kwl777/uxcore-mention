import React from 'react';
import rangy from 'rangy';
import './rangy-position';
import {parseStrByDelimiter} from './util';
import {KEYCODE} from './keycode';

let __store = {};
//webkit browsers support 'plaintext-only'
const contentEditableValue = (function () {
    let div = document.createElement('div');
    div.setAttribute('contenteditable', 'PLAINTEXT-ONLY');
    return div.contentEditable === 'plaintext-only' ? 'plaintext-only' : true;
})();

export default class Editor extends React.Component {
	constructor(props){
		super(props);
	}
	componentDidMount(){
		let editor = React.findDOMNode(this.refs.editor);
		console.log(editor);
		rangy.init();
	}
	shouldComponentUpdate(nextProps, nextState){
		if (this.props.children !== nextProps.children) { return true;}
		if (nextProps.mentionTarget &&
			(!this.props.mentionTarget || (this.props.mentionTarget.t !== nextProps.mentionTarget.t))) {
			this.insertMentionTarget(nextProps.mentionTarget.data);
		}
		return false;
	}
	onKeydown(e){
		switch (e.keyCode) {
			case KEYCODE.ENTER:
				// insert br at the end of line
				e.preventDefault();

				let editor = React.findDOMNode(this.refs.editor);
				let sel = rangy.getSelection();
				let range = sel.getRangeAt(0);

				// make sure the last element of the editor is br
				// refer to: http://stackoverflow.com/questions/6023307/dealing-with-line-breaks-on-contenteditable-div
				if (!editor.lastChild ||
					editor.lastChild.nodeName.toLowerCase() !== 'br') {
					editor.appendChild(document.createElement('br'));
				}
				let nodeBr = document.createElement('br');
				range.deleteContents();
				range.insertNode(nodeBr);
				range.setStartAfter(nodeBr);
				sel.setSingleRange(range);
				break;
			default:
				break;
		}
	}
	onKeyup(e){
		let sel = rangy.getSelection();
		let range = sel.getRangeAt(0);
		switch (e.keyCode) {
			default:
				if (range.commonAncestorContainer.nodeType === 3) {
					range.setStart(range.commonAncestorContainer, 0);
					let originStr = range.toString();
					let str = parseStrByDelimiter(originStr, '@');
					// send str to matcher
					this.props.matcher(str, range.getEndClientPos());
					this.props.setCursorPos(range.getEndClientPos());
					// set range's start position before delimiter
					range.setStart(range.commonAncestorContainer, originStr.length - str.length - 1);
					// save range position
					__store.bookmark = range.getBookmark(range.commonAncestorContainer);
				}
				break;
		}
	}
	insertMentionTarget(mentionData){
		console.log(mentionData);
		let editor = React.findDOMNode(this.refs.editor);
		let sel = rangy.getSelection();
		if (__store.bookmark) {
			let range = sel.getRangeAt(0);
			range.moveToBookmark(__store.bookmark);
			let mentionNode = document.createElement('input');
			mentionNode.setAttribute('type', 'button');
			mentionNode.setAttribute('tabindex', '-1');
			mentionNode.value = mentionData.text;
			// delete origin content in range
			range.deleteContents();
			range.insertNode(mentionNode);
			range.collapseAfter(mentionNode);
			range.select();
			setTimeout(function(){
				editor.focus();
			}, 0);
		}
	}
	render(){
		let style = {
            width: '400px',
            height: '300px',
            border: '1px solid #000'
        };
		return (
			<div ref="editor"
				onKeyUp={this.onKeyup.bind(this)}
				onKeyDown={this.onKeydown.bind(this)}
				contentEditable={contentEditableValue}
				style={style}>
				{this.props.children}
			</div>
		);
	}
}
Editor.displayName = 'uxcore-mention-editor';
Editor.propType = {
	mentionTarget: React.PropTypes.object,
	matcher: React.PropTypes.func,
	setCursorPos: React.PropTypes.func
};
Editor.defaultProps = {
	mentionTarget: null,
	matcher: function(){},
	setCursorPos: function(){}
};
