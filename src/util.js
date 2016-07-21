/**
 * [parseStrByDelimiter description]
 * @method parseStrByDelimiter
 * @param  {[string]} str       = ''  [origin str]
 * @param  {[string]} delimiter = '@' [delimiter str]
 * @return {[string]}
 */
function parseStrByDelimiter(str = '', delimiter = '@') {
  const idx = str.lastIndexOf(delimiter);
  let ret;
  if (idx !== -1) {
    ret = str.substring(idx + 1);
  } else {
    ret = '';
  }
  return ret;
}

/**
 * [get window scroll offset]
 * @method getScrollOffset
 */
function getScrollOffset() {
  const offset = {};
  if (window.pageXOffset) {
    offset.x = window.pageXOffset;
  } else {
    offset.x = document.documentElement.scrollLeft;
  }
  if (window.pageYOffset) {
    offset.y = window.pageYOffset;
  } else {
    offset.y = document.documentElement.scrollTop;
  }
  return offset;
}

function getCaretOffset(element) {
  let start;
  let end;
  if (element.setSelectionRange) {
    start = element.selectionStart;
    end = element.selectionEnd;
  } else {
    element.focus();
    const range = document.selection.createRange();
    if (element.tagName.toUpperCase() === 'TEXTAREA') {
      // textarea
      const duplicate = range.duplicate();
      duplicate.moveToElementText(element);
      start = -1;
      while (duplicate.inRange(range)) {
        duplicate.moveStart('character');
        start += 1;
      }
    } else if (element.tagName.toUpperCase() === 'INPUT') {
      // input
      range.moveStart('character', -element.value.length);
      start = range.text.length;
    }
    end = start + range.text.length;
  }
  return {
    start,
    end,
  };
}

function getElementOffset(element) {
  const box = element.getBoundingClientRect();
  const doc = element.ownerDocument;
  const body = doc.body;
  const clientTop = doc.documentElement.clientTop || body.clientTop || 0;
  const clientLeft = doc.documentElement.clientLeft || body.clientLeft || 0;
  const top = box.top + (window.pageYOffset || doc.documentElement.scrollTop) - clientTop;
  const left = box.left + (window.pageXOffset || doc.documentElement.scrollLeft) - clientLeft;

  return {
    left,
    top,
  };
}

function getStyle(element, name) {
  if (window.getComputedStyle) {
    return window.getComputedStyle(element, null)[name];
  }
  return element.currentStyle[name];
}

function cloneStyle(element) {
  const rstyle = /^(number|string)$/;
  const rname = /^(content|outline|outlineWidth)$/;
  // Opera: content; IE8:outline && outlineWidth
  let cssText = [];
  const sStyle = element.style;
  for (let propName in sStyle) {
    if (!rname.test(propName)) {
      const propValue = getStyle(element, propName);
      if (propValue !== '' && rstyle.test(typeof propValue)) {
        // camelcase to hyphen
        propName = propName.replace(/([A-Z])/g, '-$1').toLowerCase();
        cssText.push(`${propName}:${propValue};`);
      }
    }
  }
  cssText = cssText.join('');
  return cssText;
}

function getCaretPosition(element) {
  let left;
  let top;
  if (document.selection) {
    element.focus();
    const range = document.selection.createRange();
    left = range.boundingLeft + element.scrollLeft;
    top = range.boundingTop + element.scrollTop;
  } else {
    const SHADOWEDITOR = '__shadow_editor__';
    const SHADOWEDITORTEXT = '__shadow_editor_text__';
    const SHADOWEDITORCARET = '__shadow_editor_caret__';
    const WHITESPACE = '<span style="white-space:pre-wrap;"> </span>';
    const shadowEditor = element[SHADOWEDITOR] || document.createElement('div');
    const shadowEditorCaret = element[SHADOWEDITORCARET] || document.createElement('span');
    const shadowEditorText = element[SHADOWEDITORTEXT] || document.createElement('span');
    let focusOffset = { left: 0, top: 0 };
    if (!element[SHADOWEDITOR]) {
      // add shadpw element to element's cache
      element[SHADOWEDITOR] = shadowEditor;
      element[SHADOWEDITORCARET] = shadowEditorCaret;
      element[SHADOWEDITORTEXT] = shadowEditorText;
      // append shadow to document body
      shadowEditor.appendChild(shadowEditorText);
      shadowEditor.appendChild(shadowEditorCaret);
      document.body.appendChild(shadowEditor);
      // set shadow element's style
      shadowEditorCaret.innerHTML = '|';
      const SHADOWELEMENTSTYLE = 'display:inline-block;overflow:hidden;z-index:-999;word-wrap:break-word;word-break:break-all;';
      shadowEditorCaret.style.cssText = `width:0;${SHADOWELEMENTSTYLE}`;
      shadowEditor.style.cssText = `${cloneStyle(element)};visibility:hidden;position:absolute;${SHADOWELEMENTSTYLE}`;
    }
    const offset = getElementOffset(element);
    shadowEditor.style.top = `${offset.top}px`;
    shadowEditor.style.left = `${offset.left}px`;
    const index = element.selectionEnd;
    const SHADOWEDITORCONTENT = element.value.substring(0, index)
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/\n/g, '<br/>')
      .replace(/\s/g, WHITESPACE);
    shadowEditorText.innerHTML = SHADOWEDITORCONTENT;

    shadowEditorCaret.style.display = 'inline-block';
    try { focusOffset = getElementOffset(shadowEditorCaret); } catch (e) { }
    shadowEditorCaret.style.display = 'none';
    left = focusOffset.left - element.scrollLeft;
    top = focusOffset.top - element.scrollTop;
  }
  return {
    left,
    top,
  };
}

export { parseStrByDelimiter, getScrollOffset, getCaretOffset, getCaretPosition };
