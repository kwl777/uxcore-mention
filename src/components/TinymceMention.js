import React from 'react';
import ReactDOM from 'react-dom';
import reactMixin from 'react-mixin';
import Panel from './Panel';
import BaseEditor from '../editor-components/baseEditor';
import { KEYCODE } from '../utils/keycode';
import { parseStrByDelimiter, getScrollOffset } from '../utils/util';
import mentionMixin from './mentionMixin';

function pluginInitialized() {
  const ed = window.tinymce.activeEditor;
  const plugins = ed && ed.plugins;
  const mention = plugins && plugins.mention;
  return !!mention;
}

class TinymceMention extends BaseEditor {
  constructor(props) {
    super(props);
    this.state = {
      mentionList: [],
      cursorPosition: {
        x: 0,
        y: 0,
      },
      panelVisible: false,
      panelIdx: 0,
    };
  }

  componentWillMount() {
    if (!pluginInitialized()) {
      tinymce.PluginManager.add('mention', (activeEditor) => {
        this.editor = activeEditor;
        activeEditor.on('keydown', (e) => {
          this.onKeydown(e);
        });
        activeEditor.on('keyup', (e) => {
          this.onKeyup(e);
          this.onPanelKeyup(e);
        });
      });
    }
  }

  componentDidMount() {
    this.STORE = {};
    const container = this.refs.target.parentNode;
    const mceNode = document.createElement('div');
    this.mceNode = mceNode;
    ReactDOM.render((
      <div>
        {
          React.Children.map(this.props.children, (Comp) => {
            let cp;
            if (Comp.type.name === 'Tinymce' || Comp.type.displayName === 'Tinymce') {
              cp = {
                config: {
                  plugins: ['mention'],
                },
              };
            }
            return React.cloneElement(Comp, cp);
          })
        }
      </div>
    ), mceNode);
    container.insertBefore(mceNode, this.refs.target);
  }

  componentWillUnmount() {
    const container = this.refs.target.parentNode;
    container.removeChild(this.mceNode);
  }

  onKeydown(e) {
    const { panelVisible } = this.state;
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
        }
        break;
      default:
        break;
    }
  }
  onKeyup(e) {
    const { panelVisible } = this.state;
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
        this.handleDefaultKeyup();
        break;
    }
  }

  handleDefaultKeyup() {
    const { delimiter } = this.props;
    const sel = this.editor.selection;
    const range = sel.getRng(true);
    if (range.commonAncestorContainer.nodeType === 3) {
      const cloneRange = range.cloneRange();
      cloneRange.setStart(range.commonAncestorContainer, 0);
      const originStr = cloneRange.toString();
      const str = parseStrByDelimiter(originStr, delimiter);
      this.runMatcher(str);
      if (str) {
        if ('createRange' in document) {
          range.setStart(range.commonAncestorContainer, originStr.length - str.length - 1);
          const rect = range.getBoundingClientRect();
          this.setPanelPos({
            left: rect.right,
            top: rect.bottom,
          });
          sel.setRng(range);
          // save range position
          this.STORE.bookmark = sel.getBookmark(3);
        } else {
          // IE8
          const internalRange = sel.getRng();
          this.setPanelPos({
            left: internalRange.boundingLeft,
            top: internalRange.boundingTop,
          });
          this.STORE.bookmark = str.length + 1;
        }
        sel.collapse();
      }
    }
    // debugger;
  }

  insert(mentionContent) {
    const { insertMode } = this.props;
    switch (insertMode) {
      case 'TEXT_NODE':
        this.insertWithTextNode(mentionContent);
        break;
      case 'ELEMENT_NODE':
      default:
        this.insertWithElementNode(mentionContent);
        break;
    }
  }

  insertWithElementNode(mentionContent) {
    const sel = this.editor.selection;
    if (this.STORE.bookmark) {
      sel.moveToBookmark(this.STORE.bookmark);
    }
    const range = sel.getRng(true);
    const mentionNode = document.createElement('input');
    mentionNode.setAttribute('type', 'button');
    mentionNode.setAttribute('tabindex', '-1');
    mentionNode.className = `${this.props.prefixCls}-node`;
    mentionNode.value = mentionContent;
    range.deleteContents();
    sel.setNode(mentionNode);
    range.collapse();
    this.editor.focus();
  }

  insertWithTextNode(mentionContent) {
    const sel = this.editor.selection;
    if (this.STORE.bookmark) {
      if ('createRange' in document) {
        sel.moveToBookmark(this.STORE.bookmark);
        const range = sel.getRng(true);
        range.deleteContents();
        sel.setContent(mentionContent);
        range.collapse();
        this.editor.focus();
      } else {
        const internalRange = sel.getRng();
        internalRange.moveStart('character', - this.STORE.bookmark);
        internalRange.pasteHTML(mentionContent);
      }
    }
  }

  setPanelPos(pos) {
    const editorOffset = this.editor.contentAreaContainer.getBoundingClientRect();
    const offset = getScrollOffset();
    const position = {
      x: pos.left + offset.x + editorOffset.left,
      y: pos.top + offset.y + editorOffset.top,
    };
    this.setState({
      cursorPosition: position,
    });
  }

  selectItem(data) {
    this.insertMentionData(data);
    this.setState({
      mentionList: [],
    });
  }

  render() {
    let panelPosition = {
      left: this.state.cursorPosition.x,
      top: this.state.cursorPosition.y,
    };
    const { prefixCls, panelFormatter } = this.props;
    return (
      <div ref="target">
        <Panel
          prefixCls={prefixCls}
          visible={this.state.panelVisible}
          idx={this.state.panelIdx}
          list={this.state.mentionList}
          onSelect={this.selectItem.bind(this)}
          formatter={panelFormatter}
          style={panelPosition}
        />
      </div>
    );
  }
}

reactMixin(TinymceMention.prototype, mentionMixin);

TinymceMention.propType = {
  prefixCls: React.PropTypes.string,
  source: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.func,
  ]),
  delay: React.PropTypes.number,
  matchRange: React.PropTypes.arrayOf(React.PropTypes.number),
  formatter: React.PropTypes.func,
  mentionFormatter: React.PropTypes.func,
  panelFormatter: React.PropTypes.func,
  onChange: React.PropTypes.func,
  onAdd: React.PropTypes.func,
  insertMode: React.PropTypes.oneOf(['ELEMENT_NODE', 'TEXT_NODE']),
};
TinymceMention.defaultProps = {
  prefixCls: 'kuma-mention',
  source: [],
  delay: 100,
  matchRange: [2, 8],
  formatter: (data) => data,
  mentionFormatter: (data) => `@${data.text}`,
  panelFormatter: (data) => `${data.text}`,
  onChange: (e, value) => {},
  onAdd: () => {},
  insertMode: 'ELEMENT_NODE',
};

export default TinymceMention;
