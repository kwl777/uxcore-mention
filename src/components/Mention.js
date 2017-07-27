/**
 * @author: vincent.bian
 */
import React from 'react';
import Panel from './Panel';
import reactMixin from 'react-mixin';
import { KEYCODE } from '../utils/keycode';
import mentionMixin from './mentionMixin';

/**
 * Mention Component
 */
class Mention extends React.Component {
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
  componentDidMount() {
    this.activeEditor = null;
  }
  /**
   * description of onfocus
   * @i18n {zh-CN} 测试api文档
   * @i18n {en-US} test api doc
   */
  onFocus(editorInstance) {
    this.activeEditor = editorInstance;
  }
  /**
   * description of setPanelPos
   */
  setPanelPos(pos) {
    const position = {
      x: pos.x,
      y: pos.y,
    };
    this.setState({
      cursorPosition: position,
    });
  }
  selectItem(data) {
    this.setState({
      mentionList: [],
    });
    this.activeEditor.insertMentionData(data);
  }

  render() {
    let panelPosition = {
      left: this.state.cursorPosition.x,
      top: this.state.cursorPosition.y,
    };
    let { prefixCls, readOnly, onChange, children, panelFormatter, matchRange } = this.props;
    return (
      <div onKeyUp={this.onPanelKeyup.bind(this)}>
        {
          React.Children.map(children, (Comp) =>
            React.cloneElement(Comp, {
              prefixCls,
              panelVisible: this.state.panelVisible,
              matcher: this.runMatcher.bind(this),
              setCursorPos: this.setPanelPos.bind(this),
              onChange,
              onFocus: this.onFocus.bind(this),
              matchRange: matchRange,
            })
          )
        }
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

reactMixin(Mention.prototype, mentionMixin);
Mention.displayName = 'Mention';
Mention.propTypes = {
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
   * @i18n {zh-CN} 自定义选择列表
   * @i18n {en-US} customize the panel display
   */
  panelFormatter: React.PropTypes.func,
  /**
   * @i18n {zh-CN} 发生变化后的触发
   * @i18n {en-US} trigger when editor content change
   */
  onChange: React.PropTypes.func,
};
Mention.defaultProps = {
  prefixCls: 'kuma-mention',
  source: [],
  delay: 100,
  matchRange: [2, 8],
  formatter: (data) => data,
  panelFormatter: (data) => `${data.text}`,
  onChange: (e, value) => {},
};

export default Mention;
