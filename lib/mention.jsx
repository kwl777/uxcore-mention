/**
 * @author: vincent.bian
 */
import React from 'react';
import Panel from './panel.jsx';
import Editor from './editor.jsx';

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
            panelVisible: false
        };
    }
    componentDidUpdate(prevProps, prevState){
        if (prevState.mentionList.length !== this.state.mentionList.length) {
            this.setState({
                panelVisible: this.state.mentionList.length > 0
            });
        }
    }
    selectItem(data, e){
        this.setState({
            target: {
                data: data,
                t: new Date().getTime()
            },
            // panelVisible: false
        });
    }
    runMatcher(str){
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
                source(this._next);
            }
        }
    }
    setPanelPos(pos){
        this.setState({
            cursorPosition: pos
        });
    }
    _next(matchResult){
        this.setState({
            mentionList: matchResult
        });
    }
    render(){
        let props = this.props;
        let list = this.state.mentionList.map((item)=>{
            return {
                text: item
            };
        });
        let panelPosition = {
            left: this.state.cursorPosition.x,
            top: this.state.cursorPosition.y
        };
    	return (
            <div>
                <Editor
                    matcher={this.runMatcher.bind(this)}
                    mentionTarget={this.state.target}
                    setCursorPos={this.setPanelPos.bind(this)}>{props.children}</Editor>
                <Panel visible={this.state.panelVisible} list={list} onSelect={this.selectItem.bind(this)} style={panelPosition}></Panel>
            </div>
        );
    }
}
Mention.displayName = 'uxcore-mention';
Mention.propType = {
    source: React.PropTypes.oneOfType([
        React.PropTypes.array,
        React.PropTypes.func
    ]),
    matchRange: React.PropTypes.arrayOf(React.PropTypes.number)
};
Mention.defaultProps = {
    source: [],
    matchRange: [2, 8]
};
