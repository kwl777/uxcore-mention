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

// setTimeout does not woke in phantom.
Mention.prototype.runMatcher = function (str){
  this._matcher(str);
};

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
      expect(wrapper.node.state.panelVisible).to.be(true);
      expect(wrapper.node.state.mentionList.length).to.be(4);
      done();
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
    });
  });

  describe('TextareaEditor', () => {
    const props = {
      defaultValue: 'defaultContent',
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
    it('should show panel when typed: @a', (done) => {
      const event_a = {
        keyCode: 65,
      };
      textareaNode.simulate('keydown', event_a);
      textareaNode.simulate('keyup', event_a);
      expect(wrapper.node.state.panelVisible).to.be(true);
      expect(wrapper.node.state.mentionList.length).to.be(4);
      done();
    });
    it('should insert content correctly', (done) => {
      wrapper.node.editor.insert('@test');
      expect(wrapper.node.editor.state.value).to.be('@test');
      done();
    });
  });

  describe('ContenteditableEditor', () => {
    const wrapper = mount(
      <Mention {...mentionProps}>
        <ContenteditableEditor />
      </Mention>
    );
    const editorNode = wrapper.find('.kuma-mention-editor');
    it('should render correctly', (done) => {
      expect(editorNode.length).to.be(1);
      done();
    });
    it('should hide the placeholder when clicked the editor', (done) => {
      expect(wrapper.find('.kuma-mention-placeholder').length).to.be(1);
      wrapper.find('.kuma-mention-placeholder').simulate('click');
      expect(wrapper.find('.kuma-mention-placeholder').length).to.be(0);
      done();
    });
    it('should change value correctly', (done) => {
      editorNode.node.innerHTML = '@a';
      wrapper.node.editor.emitChange();
      expect(wrapper.node.editor.state.value).to.be('@a');
      editorNode.simulate('keyup', {
        keyCode: 65,
      });
      wrapper.node.editor.insertMentionData({
        text: '@target'
      });
      // expect(wrapper.node.editor.state.value).to.be('@target');
      done();
    });
  });

  describe('TinymceMention', () => {
    const newProps = assign(mentionProps, {
      insertMode: 'TEXT_NODE',
    });
    const wrapper = mount(
      <TinymceMention {...newProps}>
        <Tinymce placeholder={'tinymce placeholder'} />
      </TinymceMention>
    );
    it('should render correctly', (done) => {
      expect(wrapper.node.refs.target.tagName.toLowerCase()).to.be('div');
      done();
    });
    // it('should show panel when input @a',  (done) => {
    //   wrapper.node.onKeyup({
    //     keyCode: 65,
    //   });
    //   done();
    // });
  });
  
});
