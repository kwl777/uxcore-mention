import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, { Simulate } from 'react-addons-test-utils';
import Mention, { ContenteditableEditor, TextareaEditor, InputEditor } from '../src';
import Panel from '../src/panel';
import MentionDemo from '../demo/MentionDemo';

describe('Mention', () => {

  let instance = TestUtils.renderIntoDocument(<MentionDemo />);
  let ceditors = TestUtils.scryRenderedComponentsWithType(instance, ContenteditableEditor);
  let teditor = TestUtils.findRenderedComponentWithType(instance, TextareaEditor);
  let ieditor = TestUtils.findRenderedComponentWithType(instance, InputEditor);
  let panels = TestUtils.scryRenderedComponentsWithType(instance, Panel);

  it('the contenteditable editor should be a div', (done) => {
    expect(ceditors[0].refs.editor.tagName.toLowerCase()).to.be('div');
    done();
  });

  it('the textareaeditor should be a textarea', (done) => {
    expect(teditor.refs.editor.tagName.toLowerCase()).to.be('textarea');
    done();
  });

  it('the input editor should be a input', (done) => {
    expect(ieditor.refs.editor.tagName.toLowerCase()).to.be('input');
    done();
  });

  it('enter the string @a should show select panel', (done) => {
    // const charAt = {
    //   key: '@',
    //   keyCode: 64,
    // };
    // const charA = {
    //   key: 'a',
    //   keyCode: 97,
    // };
    // const editor = ceditors[0].refs.editor;
    // Simulate.click(ceditors[0]);
    // Simulate.keyDown(editor, charAt);
    // Simulate.keyUp(editor, charAt);
    // Simulate.keyDown(editor, charA);
    // Simulate.keyUp(editor, charA);
    // console.log(editor.textContent, panels[0].props.list);
  });

  it('the readOnly should work', (done) => {
    Simulate.change(instance.refs.readOnlyCheckbox);
    expect(ceditors[0].refs.editor.getAttribute('contentEditable')).to.be('false');
    expect(teditor.refs.editor.readOnly).to.be(true);
    expect(ieditor.refs.editor.readOnly).to.be(true);
    done();
  });
});
