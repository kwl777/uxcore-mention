/**
 * @author: vincent.bian
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Panel from './panel';
import Editor from './editor/contentEditableEditor';
import { KEYCODE } from './keycode';
import { getScrollOffset } from './util';

let __matchTimer;

export default class Mention extends React.Component {
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
  componentDidUpdate(prevProps, prevState) {
    if (prevState.mentionList.length !== this.state.mentionList.length) {
      this.setState({
        panelVisible: this.state.mentionList.length > 0,
      });
    }
    if (!prevState.panelVisible && this.state.panelVisible) {
      this.setState({
        panelIdx: 0,
      });
    }
  }

  onFocus(editorInstance) {
    this.activeEditor = editorInstance;
  }

  onKeyup(e) {
    const { panelVisible, panelIdx, mentionList } = this.state;
    if (panelVisible) {
      const count = mentionList.length;
      switch (e.keyCode) {
        case KEYCODE.UP:
          this.setState({
            panelIdx: panelIdx === 0 ? count - 1 : panelIdx - 1,
          });
          break;
        case KEYCODE.DOWN:
          this.setState({
            panelIdx: panelIdx === count - 1 ? 0 : panelIdx + 1,
          });
          break;
        case KEYCODE.ENTER:
          this.selectItem(mentionList[panelIdx]);
          break;
        default:
          this.setState({
            mentionList: [],
          });
          break;
      }
    }
  }

  setPanelPos(pos) {
    const offset = getScrollOffset();
    const position = {
      x: pos.x + offset.x,
      y: pos.y + offset.y,
    };
    this.setState({
      cursorPosition: position,
    });
  }
  selectItem(data) {
    this.activeEditor.insertMentionData(data);
    this.setState({
      mentionList: [],
    });
  }

  runMatcher(str) {
    __matchTimer && clearTimeout(__matchTimer);
    __matchTimer = setTimeout((() => {
        this._matcher(str);
    }).bind(this), this.props.delay);
  }
  _matcher(str) {
    // console.log(`matcher run with: ${str}`);
    const { source, matchRange } = this.props;
    this.setState({
      panelVisible: false,
      mentionList: [],
    });
    if (str.length >= matchRange[0] && str.length <= matchRange[1]) {
      if (Array.isArray(source)) {
        this.next(source.filter((item) => item.indexOf(str) !== -1));
      } else {
        source(str, this.next.bind(this));
      }
    }
  }

  next(matchResult) {
    let result = matchResult;
    if (this.props.formatter) {
      result = this.props.formatter(result);
    }
    this.setState({
      mentionList: result,
    });
  }

  render() {
    let panelPosition = {
      left: this.state.cursorPosition.x,
      top: this.state.cursorPosition.y,
    };
    let { prefixCls, readOnly, onChange, children, panelFormatter } = this.props;
    return (
      <div onKeyUp={this.onKeyup.bind(this)}>
        {
          React.Children.map(children, (Comp) => {
            return React.cloneElement(Comp, {
              prefixCls,
              panelVisible: this.state.panelVisible,
              matcher: this.runMatcher.bind(this),
              setCursorPos: this.setPanelPos.bind(this),
              onChange,
              onFocus: this.onFocus.bind(this),
            });
          })
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
Mention.displayName = 'uxcore-mention';
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
