import { KEYCODE } from '../utils/keycode';
let __matchTimer;

export default {
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
  },

  onPanelKeyup(e) {
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
  },
  runMatcher(str) {
    __matchTimer && clearTimeout(__matchTimer);
    __matchTimer = setTimeout(() => {
        this._matcher(str);
    }, this.props.delay);
  },
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
  },

  next(matchResult) {
    let result = matchResult;
    if (this.props.formatter) {
      result = this.props.formatter(result);
    }
    this.setState({
      mentionList: result,
    });
  },
};
