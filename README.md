# uxcore-mention

React mention.
Mention anywhere.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Dependency Status][dep-image]][dep-url]
[![devDependency Status][devdep-image]][devdep-url] 
[![NPM downloads][downloads-image]][npm-url]

[![Sauce Test Status][sauce-image]][sauce-url]

[npm-image]: http://img.shields.io/npm/v/uxcore-mention.svg?style=flat-square
[npm-url]: http://npmjs.org/package/uxcore-mention
[travis-image]: https://img.shields.io/travis/uxcore/uxcore-mention.svg?style=flat-square
[travis-url]: https://travis-ci.org/uxcore/uxcore-mention
[coveralls-image]: https://img.shields.io/coveralls/uxcore/uxcore-mention.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/uxcore/uxcore-mention?branch=master
[dep-image]: http://img.shields.io/david/uxcore/uxcore-mention.svg?style=flat-square
[dep-url]: https://david-dm.org/uxcore/uxcore-mention
[devdep-image]: http://img.shields.io/david/dev/uxcore/uxcore-mention.svg?style=flat-square
[devdep-url]: https://david-dm.org/uxcore/uxcore-mention#info=devDependencies
[downloads-image]: https://img.shields.io/npm/dm/uxcore-mention.svg
[sauce-image]: https://saucelabs.com/browser-matrix/uxcore-mention.svg
[sauce-url]: https://saucelabs.com/u/uxcore-mention


### Development

```sh
git clone https://github.com/uxcore/uxcore-mention
cd uxcore-mention
npm install
npm run server
```

if you'd like to save your install time，you can use uxcore-tools globally.

```sh
npm install uxcore-tools -g
git clone https://github.com/uxcore/uxcore-mention
cd uxcore-mention
npm install
npm run dep
npm run start
```

### Test Case

```sh
npm run test
```

### Coverage

```sh
npm run coverage
```

## Demo

http://uxcore.github.io/components/mention

## Contribute

Yes please! See the [CONTRIBUTING](https://github.com/uxcore/uxcore/blob/master/CONTRIBUTING.md) for details.

### API

#### Mention

* formatter(arr): 对从数据源取到的数据进行处理，返回处理后的结果数组。
* panelFormatter(obj): 自定义选择菜单的结构，返回html。
* onChange(e, value): onChange事件。

#### ContentEditableEditor

* formatter(obj): 自定义插入编辑器中的文本，返回字符串。
* onChange(e, value): onChange事件, 可覆盖 Mention 中的 onChange 。

#### TextareaEditor

* formatter(obj): 自定义插入编辑器中的文本，返回字符串。
* onChange(e, value): onChange事件, 可覆盖 Mention 中的 onChange 。

#### InputEditor

* formatter(obj): 自定义插入编辑器中的文本，返回字符串。
* onChange(e, value): onChange事件, 可覆盖 Mention 中的 onChange 。


### props

#### Mention

|name|Description|Type|Default|
|---|----|---|------|
| prefixCls | class prefix | string | kuma-mention |
| source | data source for mention content | array or function | [] |
| delay | debounce of the request to data source | number | 100 |
| matchRange | only match the string after delimiter which the length in this range | array | [2, 8] |
| formatter | format the data form source | function | |
| panelFormatter | customize the panel display | function | |
| onChange | trigger when editor content change | function | |

#### ContentEditableEditor

|name|Description|Type|Default|
|---|----|---|------|
| prefixCls | class prefix | string | kuma-mention |
| width | editor's width | number | 200 |
| height | editor's height | number | 100 |
| placeholder | placeholder | string | '' |
| formatter | customize whats's in your select panel with this function | function | |
| onChange | Callback invoked when the editor's content has been changed | function | |
| onAdd | Callback invoked when a mention has been added | function(display, originData) | |
| defaultValue | default values | string | |
| readOnly | can not edit | boolean | |
| delimiter | Defines the char sequence upon which to trigger querying the data source | string | '@' |


#### TextareaEditor

|name|Description|Type|Default|
|---|----|---|------|
| prefixCls | class prefix | string | kuma-mention |
| width | editor's width | number | 200 |
| height | editor's height | number | 100 |
| placeholder | placeholder | string | '' |
| formatter | customize whats's in your select panel with this function | function | |
| onChange | Callback invoked when the editor's content has been changed | function | |
| onAdd | Callback invoked when a mention has been added | function(display, originData) | |
| defaultValue | default values | string | |
| readOnly | can not edit | boolean | |
| delimiter | Defines the char sequence upon which to trigger querying the data source | string | '@' |

#### InputEditor

|name|Description|Type|Default|
|---|----|---|------|
| prefixCls | class prefix | string | kuma-mention |
| width | editor's width | number | 200 |
| height | editor's height | number | 30 |
| placeholder | placeholder | string | '' |
| formatter | customize whats's in your select panel with this function | function | |
| onChange | Callback invoked when the editor's content has been changed | function | |
| onAdd | Callback invoked when a mention has been added | function(display, originData) | |
| defaultValue | default values | string | |
| readOnly | can not edit | boolean | |
| delimiter | Defines the char sequence upon which to trigger querying the data source | string | '@' |
