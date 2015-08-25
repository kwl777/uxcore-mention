import React from 'react';

export default class Panel extends React.Component {
	constructor(props){
		super(props);
	}
	render(){
		let props = this.props;
		let {onSelect, list, style, visible} = props;
		let cls = 'kuma-mention-panel';
		if (visible) {
			cls += ' kuma-mention-panel-visible';
		}
		return (
			<ul className={cls} style={style}>
				{list.map((item, index)=> {
					return <li key={index} onClick={onSelect.bind(this, item)}>{item.text}</li>;
				})}
			</ul>
		);
	}
}
Panel.displayName = 'uxcore-mention-panel';
Panel.propType = {
	list: React.PropTypes.array,
	style: React.PropTypes.object,
	onSelect: React.PropTypes.func
};
Panel.defaultProps = {
	list: [],
	style: {},
	onSelect: null
};
