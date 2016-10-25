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

/**
 * @i18n {zh-CN} 用于tinymce的mention 
 * @i18n {en-US} Mention for Tinymce
 */
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
    // const offset = getScrollOffset();
    const position = {
      x: pos.left + editorOffset.left,
      y: pos.top + editorOffset.top,
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
TinymceMention.displayName = 'TinymceMention';
TinymceMention.propTypes = {
  /**
   * @i18n {zh-CN} class前缀
   * @i18n {en-US} class prefix
   */
  prefixCls: React.PropTypes.string,
  /**
   * @i18n {zh-CN} 定义数据源
   * @i18n {en-US} data source for mention content
   */
  source: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.func,
  ]),
  /**
   * @i18n {zh-CN} 数据源查询延时
   * @i18n {en-US} debounce of the request to data source
   */
  delay: React.PropTypes.number,
  /**
   * @i18n {zh-CN} 匹配字符区间
   * @i18n {en-US} only match the string after delimiter which the length in this range
   */
  matchRange: React.PropTypes.arrayOf(React.PropTypes.number),
  /**
   * @i18n {zh-CN} 数据源格式化匹配
   * @i18n {en-US} format the data form source
   */
  formatter: React.PropTypes.func,
  /**
   * @i18n {zh-CN} 自定义插入的mention内容
   * @i18n {en-US} customize the insert content with this function | function
   */
  mentionFormatter: React.PropTypes.func,
  /**
   * @i18n {zh-CN} 自定义选择列表
   * @i18n {en-US} customize the panel display
   */
  panelFormatter: React.PropTypes.func,
  /**
   * @i18n {zh-CN} 发生变化后的触发
   * @i18n {en-US} trigger when editor content change
   * @param {data} xxxxxx
   */
  onChange: React.PropTypes.func,
  /**
   * @i18n {zh-CN} 添加mention后触发
   * @i18n {en-US} Callback invoked when a mention has been added
   */
  onAdd: React.PropTypes.func,
  /**
   * @i18n {zh-CN} `ELEMENT_NODE` 插入button, `TEXT_NODE` 插入纯字符串
   * @i18n {en-US} `ELEMENT_NODE` will insert mention content with a button, `TEXT_NODE` will insert with a text node
   */
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
