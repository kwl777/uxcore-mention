import React from 'react';
import classNames from 'classnames';

export default class Panel extends React.Component {
  render() {
    const props = this.props;
    const { onSelect, list, style, visible, idx, formatter, prefixCls } = props;
    const clsObj = {};
    clsObj[`${prefixCls}-panel`] = true;
    clsObj[`${prefixCls}-panel-visible`] = visible;
    let cls = classNames(clsObj);
    return (
      <ul className={cls} style={style}>
        {list.map((item, index) => {
          const itemClsObj = {};
          itemClsObj[`${prefixCls}-panel-item`] = true;
          itemClsObj[`${prefixCls}-panel-item-current`] = idx === index;
          let itemCls = classNames(itemClsObj);
          return <li className={itemCls} key={index} onClick={onSelect.bind(this, item)}><div dangerouslySetInnerHTML={{ __html: formatter(item) }} /></li>;
        })}
      </ul>
    );
  }
}
Panel.displayName = 'uxcore-mention-panel';
Panel.propType = {
  prefixCls: React.PropTypes.string,
  list: React.PropTypes.array,
  style: React.PropTypes.object,
  idx: React.PropTypes.number,
  onSelect: React.PropTypes.func,
  formatter: React.PropTypes.func,
};
Panel.defaultProps = {
  prefixCls: '',
  list: [],
  style: {},
  idx: 0,
  onSelect: null,
  formatter: '',
};
