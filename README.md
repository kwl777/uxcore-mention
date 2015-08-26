# mention

- tags: uxcore, component, mention, at, editor
- description: mention anything in editor
- maintainers: vincent.bian
- version: 0.1.0
- lastupadate: 2015/08/26
- screenshots:

---

## TL;DR

mention ui component for react

#### setup develop environment

```sh
$ git clone https://github.com/uxcore/mention
$ cd mention
$ npm install
$ npm run dev
```

nav http://localhost:9090/webpack-dev-server/example/ to see the demo

#### deploy to gh-pages
[refer to]( http://stackoverflow.com/questions/17643381/how-to-upload-my-angularjs-static-site-to-github-pages)
```sh
$ npm run build
$ git add build & git commit -m 'update deploy files'
$ npm run deploy
```

## Usage

### demo
http://uxcore.github.io/mention/

### API

### props

|参数|说明|类型|默认值|
|---|----|---|------|
| prefixCls | class prefix | string | kuma-mention |
| source | data source for mention content | array or function | [] |
| delay | debounce of the request to data source | number | 100 |
| matchRange | only match the string after delimiter which the length in this range | array | [2, 8] |
| formatter | format the data form source | function | |
| panelFormatter | customize whats's in your select panel with this function | function | |
| mentionFormatter | customize what's in your mention node with this function | function | |
