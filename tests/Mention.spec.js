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

// function appendScript(src) {
//   const script = document.createElement('script');
//   script.setAttribute('src', src);
//   document.body.appendChild(script);
// }

// appendScript('//alinw.alicdn.com/??uxcore/uxcore-lib/rangy/1.3.0/rangy-core.min.js,platform/c/tinymce/4.3.12/tinymce.min.js');

TinymceMention.prototype.runMatcher = function (str){
  this._matcher(str);
};

function setEndOfContenteditable(contentEditableElement) {
  let range,selection;
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

describe('Mention', () => {

  const mentionProps = {
    matchRange: [1, 8],
    source: ['aaaaa', 'aabbb', 'aaccc', 'bbbcc', 'dddee', 'fffqq', 'pppaa', 'ppccc'],
    formatter: (data) => {
      return data.map((item) => {
          return {
              text: item
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
    const event_a = {
        keyCode: 65,
      };
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
      expect(inputNode.node.value).to.be(' @aaaaa ');
      inputNode.node.value = '@a';
      inputNode.simulate('change');
      inputNode.simulate('keydown', event_a);
      inputNode.simulate('keyup', event_a);
      const divNode = wrapper.find('div').at(0);
      setTimeout(() => {
        divNode.simulate('keyup', {
          keyCode: 40,
        });
        divNode.simulate('keyup', {
          keyCode: 40,
        });
        divNode.simulate('keyup', {
          keyCode: 38,
        });
        expect(wrapper.node.state.panelIdx).to.be(1);
        divNode.simulate('keyup', {
          keyCode: 13,
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
    const event_a = {
        keyCode: 65,
      };
    const wrapper = mount(
      <Mention {...mentionProps}>
        <TextareaEditor {...props} />
      </Mention>
    );
    const textareaNode = wrapper.find('textarea');
    it('should render correctly', (done) => {
      expect(textareaNode.length).to.be(1);
      done();
    });
    it('should change value correctly', (done) => {
      textareaNode.node.value = '@a';
      textareaNode.simulate('change');
      expect(wrapper.node.editor.state.value).to.be('@a');
      done();
    });
    // it('should show panel when typed: @a', (done) => {
      // textareaNode.simulate('keydown', event_a);
      // textareaNode.simulate('keyup', event_a);
      // setTimeout(() => {
      //   expect(wrapper.node.state.panelVisible).to.be(true);
      //   expect(wrapper.node.state.mentionList.length).to.be(4);
      //   done();
      // }, 100);
    // });
    it('should insert content correctly', (done) => {
      wrapper.node.editor.insert('@test');
      textareaNode.simulate('keydown', event_a);
      textareaNode.simulate('keyup', event_a);
      expect(wrapper.node.editor.state.value).to.contain('@test');
      done();
    });
  });

  describe('ContenteditableEditor', () => {
    const container = document.createElement('div');
    let editor;
    document.body.appendChild(container);
    Mention.prototype.runMatcher = function (str){
      this._matcher(str);
    };
    ReactDOM.render(
      <Mention ref={node => editor = node} {...mentionProps}>
        <ContenteditableEditor />
      </Mention>,
      container
    );

    it('should render correctly', (done) => {
      expect(editor.editor.refs.editor.tagName.toLowerCase()).to.be('div');
      done();
    });
    it('should hide the placeholder when clicked the editor', (done) => {
      let placeholders = TestUtils.scryRenderedDOMComponentsWithClass(editor, 'kuma-mention-placeholder');
      expect(placeholders.length).to.be(1);
      if (placeholders && placeholders.length > 0) {
        Simulate.click(placeholders[0])
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
      Simulate.keyUp(editor.editor.refs.editor, {
        keyCode: 40,
      });
      Simulate.keyDown(editor.editor.refs.editor, {
        keyCode: 13,
      });
      Simulate.keyUp(editor.editor.refs.editor, {
        keyCode: 13,
      });
      let children = editor.editor.refs.editor.children;
      expect(children[0].value).to.be('@aabbb');
      editor.editor.observer = null;
      editor.editor.emitChange();
      done();
    });
  });

  describe('TinymceMention', () => {
    const newProps = assign(mentionProps, {
      ref: (node) => editor = node,
    });
    const container = document.createElement('div');
    let editor, btn;
    document.body.appendChild(container);
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
    ReactDOM.render(
      <TinymceMentionTest />,
      container
    );

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
          keyCode: 40,
        });
        editor.editor.fire('keyup', {
          keyCode: 13,
        });
        expect(editor.editor.getContent()).to.be('<div>@aabbb</div>');
        btn.click();
        expect(editor.props.insertMode).to.be('ELEMENT_NODE');
        editor.editor.insertContent('@a');
        editor.onKeyup({
          keyCode: 65,
        });
        editor.editor.fire('keyup', {
          keyCode: 13,
        });
        expect(editor.editor.getContent()).to.be('<div>@aabbb<input class="kuma-mention-node" tabindex="-1" type="button" value="@aaaaa" /></div>');
        done();
      });
    });
  });
  
});
