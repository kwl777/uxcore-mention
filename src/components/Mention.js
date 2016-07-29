/**
 * @author: vincent.bian
 */
import React from 'react';
import Panel from './Panel';
import reactMixin from 'react-mixin';
import { KEYCODE } from '../utils/keycode';
import mentionMixin from './mentionMixin';

let __matchTimer;

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

  onFocus(editorInstance) {
    this.activeEditor = editorInstance;
  }

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
    let { prefixCls, readOnly, onChange, children, panelFormatter } = this.props;
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

Mention.propType = {
  prefixCls: React.PropTypes.string,
  source: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.func,
  ]),
  delay: React.PropTypes.number,
  matchRange: React.PropTypes.arrayOf(React.PropTypes.number),
  formatter: React.PropTypes.func,
  panelFormatter: React.PropTypes.func,
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
