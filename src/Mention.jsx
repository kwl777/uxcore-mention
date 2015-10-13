/**
 * @author: vincent.bian
 */
import React from 'react';
import Panel from './panel.jsx';
import Editor from './editor.jsx';
import {KEYCODE} from './keycode';
import {getScrollOffset} from './util';

let __matchTimer;

export default class Mention extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            target: null,
            mentionList: [],
            cursorPosition: {
                x: 0,
                y: 0
            },
            panelVisible: false,
            panelIdx: 0
        };
    }
    componentDidUpdate(prevProps, prevState){
        if (prevState.mentionList.length !== this.state.mentionList.length) {
            this.setState({
                panelVisible: this.state.mentionList.length > 0
            });
        }
        if (!prevState.panelVisible && this.state.panelVisible) {
            this.setState({
                panelIdx: 0
            });
        }
    }
    selectItem(data){
        this.setState({
            target: {
                data: data,
                t: new Date().getTime()
            },
            mentionList: []
        });
    }
    runMatcher(str){
        __matchTimer && clearTimeout(__matchTimer);
        __matchTimer = setTimeout(() => {
            this._matcher(str);
        }.bind(this), this.props.delay);
    }
    _matcher(str){
        console.log(`matcher run with: ${str}`);
        let {source, matchRange} = this.props;
        this.setState({
            panelVisible: false
        });
        if (str.length >= matchRange[0] && str.length <= matchRange[1]) {
            if (Array.isArray(source)) {
                this._next(source.filter((item)=> {
                    return item.indexOf(str) !== -1;
                }));
            } else {
                source(str, this._next.bind(this));
            }
        }
    }
    setPanelPos(pos){
        var offset = getScrollOffset();
        pos = {
            x: pos.x + offset.x,
            y: pos.y + offset.y
        };
        this.setState({
            cursorPosition: pos
        });
    }
    _next(matchResult){
        if (this.props.formatter) {
            matchResult = this.props.formatter(matchResult);
        }
        this.setState({
            mentionList: matchResult
        });
    }
    onKeyup(e){
        if (this.state.panelVisible) {
            let count = this.state.mentionList.length;
            switch(e.keyCode) {
                case KEYCODE.UP:
                    this.setState({
                        panelIdx: this.state.panelIdx === 0 ? count - 1: this.state.panelIdx - 1
                    });
                    break;
                case KEYCODE.DOWN:
                    this.setState({
                        panelIdx: this.state.panelIdx === count - 1 ? 0: this.state.panelIdx + 1
                    });
                    break;
                case KEYCODE.ENTER:
                    this.selectItem(this.state.mentionList[this.state.panelIdx]);
                    break;
                default:
                    this.setState({
                        mentionList: []
                    });
                    break;
            }
        }
    }
    render(){
        let props = this.props;
        let panelPosition = {
            left: this.state.cursorPosition.x,
            top: this.state.cursorPosition.y
        };
        let {width, height, prefixCls} = props;
    	return (
            <div onKeyUp={this.onKeyup.bind(this)}>
                <Editor
                    width={width}
                    height={height}
                    prefixCls={prefixCls}
                    panelVisible={this.state.panelVisible}
                    matcher={this.runMatcher.bind(this)}
                    mentionTarget={this.state.target}
                    setCursorPos={this.setPanelPos.bind(this)}
                    formatter={this.props.mentionFormatter}
                    >{props.children}</Editor>
                <Panel
                    prefixCls={prefixCls}
                    visible={this.state.panelVisible}
                    idx={this.state.panelIdx}
                    list={this.state.mentionList}
                    onSelect={this.selectItem.bind(this)}
                    formatter={this.props.panelFormatter}
                    style={panelPosition}></Panel>
            </div>
        );
    }
}
Mention.displayName = 'uxcore-mention';
Mention.propType = {
    prefixCls: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    source: React.PropTypes.oneOfType([
        React.PropTypes.array,
        React.PropTypes.func
    ]),
    delay: React.PropTypes.number,
    matchRange: React.PropTypes.arrayOf(React.PropTypes.number),
    formatter: React.PropTypes.func,
    panelFormatter: React.PropTypes.func,
    mentionFormatter: React.PropTypes.func
};
Mention.defaultProps = {
    prefixCls: 'kuma-mention',
    width: 200,
    height: 100,
    source: [],
    delay: 100,
    matchRange: [2, 8],
    formatter: function(data){
        return data;
    },
    panelFormatter: function(data){
        return `${data.text}`;
    },
    mentionFormatter: function(data){
        return `@${data.text}`;
    }
};
