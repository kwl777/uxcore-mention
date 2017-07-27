import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import TestUtils, { Simulate } from 'react-addons-test-utils';
import Tinymce from 'uxcore-tinymce';
import Mention, { ContenteditableEditor, TextareaEditor, InputEditor, TinymceMention } from '../src';
import Panel from '../src/components/Panel';
import MentionDemo from '../demo/MentionDemo';
import assign from 'object-assign';
import { KEYCODE } from '../src/utils/keycode';
import { getCaretPosition } from '../src/utils/util';

// function appendScript(src) {
//   const script = document.createElement('script');
//   script.setAttribute('src', src);
//   document.body.appendChild(script);
// }

// appendScript('//alinw.alicdn.com/??uxcore/uxcore-lib/rangy/1.3.0/rangy-core.min.js,platform/c/tinymce/4.3.12/tinymce.min.js');

TinymceMention.prototype.runMatcher = function runMatcher(str) {
  this._matcher(str);
};

function setEndOfContenteditable(contentEditableElement) {
  let range;
  let selection;
  if (document.createRange) {
    range = document.createRange();
    range.selectNodeContents(contentEditableElement);
    range.collapse(false);
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  } else if (document.selection) { 
    range = document.body.createTextRange();
    range.moveToElementText(contentEditableElement);
    range.collapse(false);
    range.select();
  }
}

function renderIntoDoc(Target) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(Target, container);
  return container;
}

const event_a = {
  keyCode: 65,
};

describe('Mention', () => {
  const mentionProps = {
    matchRange: [1, 8],
    source: ['aaaaa', 'aabbb', 'aaccc', 'bbbcc', 'dddee', 'fffqq', 'pppaa', 'ppccc'],
    formatter: (data) => {
      return data.map((item) => {
        return {
          text: item,
        };
      });
    },
  };

  describe('InputEditor', () => {
    const props = {
      defaultValue: 'defaultContent',
    };
    const wrapper = mount(
      <Mention {...mentionProps}>
        <InputEditor {...props} />
      </Mention>
    );
    const inputNode = wrapper.find('input');
    it('should render correctly', (done) => {
      expect(inputNode.length).to.be(1);
      done();
    });
    it('should change value correctly', (done) => {
      inputNode.node.value = '@a';
      inputNode.simulate('change');
      expect(wrapper.node.editor.state.value).to.be('@a');
      done();
    });
    it('should show panel when typed: @a', (done) => {
      inputNode.simulate('keydown', event_a);
      inputNode.simulate('keyup', event_a);
      setTimeout(() => {
        expect(wrapper.node.state.panelVisible).to.be(true);
        expect(wrapper.node.state.mentionList.length).to.be(4);
        done();
      }, 100);
    });
    it('should insert mention target correctly', (done) => {
      inputNode.simulate('focus');
      wrapper.find('li').at(0).simulate('click');
      inputNode.simulate('keydown', {
        keyCode: KEYCODE.UP,
      });
      expect(inputNode.node.value).to.be(' @aaaaa ');
      inputNode.node.value = '@a';
      inputNode.simulate('change');
      inputNode.simulate('keydown', event_a);
      inputNode.simulate('keyup', event_a);
      const divNode = wrapper.find('div').at(0);
      setTimeout(() => {
        divNode.simulate('keyup', {
          keyCode: KEYCODE.DOWN,
        });
        divNode.simulate('keyup', {
          keyCode: KEYCODE.DOWN,
        });
        divNode.simulate('keyup', {
          keyCode: KEYCODE.UP,
        });
        expect(wrapper.node.state.panelIdx).to.be(1);
        divNode.simulate('keyup', {
          keyCode: KEYCODE.ENTER,
        });
        expect(inputNode.node.value).to.be(' @aabbb ');
        done();
      }, 100);
    });
  });

  describe('TextareaEditor', () => {
    const props = {
      defaultValue: 'defaultContent',
    };
    let editor;
    let target;
    class TextareaEditorDemo extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          show: true,
          value: 'default content',
        };
      }
      updateValue() {
        this.setState({
          value: 'new content',
        });
      }
      handleHide() {
        this.setState({
          show: false,
        });
      }
      render() {
        let c;
        if (this.state.show) {
          const p = assign({}, mentionProps, {
              ref: (node) => editor = node,
          });
          const tp = assign({}, props, {
            value: this.state.value,
          });
          c = (
            <Mention {...p}>
              <TextareaEditor {...props} />
            </Mention>
          );
        } else {
          c = null;
        }
        return (
          <div>{c}</div>
        );
      }
    }
    const wrapper = renderIntoDoc(
      <TextareaEditorDemo ref={node => target = node} />
    );
    const textarea = wrapper.getElementsByTagName('textarea')[0];
    it('should render correctly', (done) => {
      expect(textarea.tagName.toLowerCase()).to.be('textarea');
      done();
    });
    it('should change value correctly', (done) => {
      textarea.value = '@a';
      Simulate.change(textarea);
      expect(editor.editor.state.value).to.be('@a');
      done();
    });
    it('should show panel when typed: @a', (done) => {
      Simulate.keyDown(textarea, event_a);
      Simulate.keyUp(textarea, event_a);
      getCaretPosition(textarea);
      setTimeout(() => {
        // expect(editor.state.panelVisible).to.be(true);
        // expect(editor.state.mentionList.length).to.be(4);
        done();
      }, 100);
    });
    it('should insert content correctly', (done) => {
      editor.editor.insert('@test');
      Simulate.keyDown(textarea, event_a);
      Simulate.keyUp(textarea, event_a);
      expect(textarea.value).to.contain('@test');
      target.updateValue();
      target.handleHide();
      done();
    });
  });

  describe('ContenteditableEditor', () => {
    let editor;
    renderIntoDoc(
      <Mention ref={node => editor = node} {...mentionProps}>
        <ContenteditableEditor />
      </Mention>
    );
    Mention.prototype.runMatcher = function runMatcher(str) {
      this._matcher(str);
    };

    it('should render correctly', (done) => {
      expect(editor.editor.refs.editor.tagName.toLowerCase()).to.be('div');
      done();
    });
    it('should hide the placeholder when clicked the editor', (done) => {
      const placeholders = TestUtils.scryRenderedDOMComponentsWithClass(editor, 'kuma-mention-placeholder');
      expect(placeholders.length).to.be(1);
      if (placeholders && placeholders.length > 0) {
        Simulate.click(placeholders[0]);
        expect(TestUtils.scryRenderedDOMComponentsWithClass(editor, 'kuma-mention-placeholder').length).to.be(0);
      }
      done();
    });
    it('should blur & focus works correctly', (done) => {
      editor.editor.onInput();
      editor.editor.onBlur();
      expect(editor.editor.state.focus).to.be(false);
      editor.editor.onFocus();
      expect(editor.editor.state.focus).to.be(true);
      done();
    });
    it('should change value correctly', (done) => {
      editor.editor.refs.editor.innerHTML = '@a';
      editor.editor.emitChange();
      expect(editor.editor.state.value).to.be('@a');
      setEndOfContenteditable(editor.editor.refs.editor.childNodes[0]);
      Simulate.keyUp(editor.editor.refs.editor, {
        keyCode: 65,
      });
      setTimeout(() => {
        Simulate.keyUp(editor.editor.refs.editor, {
          keyCode: KEYCODE.DOWN,
        });
        Simulate.keyDown(editor.editor.refs.editor, {
          keyCode: KEYCODE.ENTER,
        });
        Simulate.keyUp(editor.editor.refs.editor, {
          keyCode: KEYCODE.ENTER,
        });
        const children = editor.editor.refs.editor.children;
        expect(children[0].value).to.be('@aabbb');
        editor.editor.observer = null;
        editor.editor.emitChange();
        Simulate.keyDown(editor.editor.refs.editor, {
          keyCode: KEYCODE.ENTER,
        });
        done();
      }, 100);
    });
  });

  describe('TinymceMention', () => {
    const newProps = assign(mentionProps, {
      ref: (node) => editor = node,
    });
    let editor;
    let btn;
    class TinymceMentionTest extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          insertMode: 'TEXT_NODE',
        };
        this.handleChangeMode = this.handleChangeMode.bind(this);
      }
      handleChangeMode() {
        const { insertMode } = this.state;
        this.setState({
          insertMode: insertMode === 'TEXT_NODE' ? 'ELEMENT_NODE' : 'TEXT_NODE',
        });
      }
      render() {
        assign(newProps, this.state);
        return (
          <TinymceMention {...newProps}>
            <button ref={node => btn = node} onClick={this.handleChangeMode}>change inser mode</button>
            <Tinymce placeholder={'tinymce placeholder'} />
          </TinymceMention>
        );
      }
    }
    renderIntoDoc(<TinymceMentionTest />);

    function testUntilReady(next) {
      if (editor.editor) {
        next();
      } else {
        setTimeout(() => {
          testUntilReady(next);
        }, 20);
      }
    }
    it('should render correctly', (done) => {
      expect(editor.mceNode.tagName.toLowerCase()).to.be('div');
      done();
    });

    it('should action correctly when input', (done) => {
      testUntilReady(() => {
        editor.editor.insertContent('@a');
        editor.onKeyup({
          keyCode: 65,
        });
        expect(editor.state.panelVisible).to.be(true);
        editor.editor.fire('keyup', {
          keyCode: KEYCODE.DOWN,
        });
        editor.editor.fire('keyup', {
          keyCode: KEYCODE.ENTER,
        });
        expect(editor.editor.getContent()).to.be('<div>@aabbb</div>');
        btn.click();
        expect(editor.props.insertMode).to.be('ELEMENT_NODE');
        editor.editor.insertContent('@a');
        editor.onKeyup({
          keyCode: 65,
        });
        editor.editor.fire('keyup', {
          keyCode: KEYCODE.ENTER,
        });
        expect(editor.editor.getContent()).to.be('<div>@aabbb<input class="kuma-mention-node" tabindex="-1" type="button" value="@aaaaa" /></div>');
        done();
      });
    });
  });
});
