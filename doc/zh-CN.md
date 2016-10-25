## Mention

Mention Component

### API

 - onFocus(editorInstance): 测试api文档
 - setPanelPos(pos): description of setPanelPos

### PROPS
Name | Type | Required | DefaultValue | Description
--- | --- | --- | --- | ---
prefixCls | string | false | 'kuma-mention' | class前缀
source | union (array, func) | false | [] | 定义数据源
delay | number | false | 100 | 数据源查询延时
matchRange | arrayOf number | false | [2, 8] | 匹配字符区间
formatter | func | false | (data) => data | 数据源格式化匹配
panelFormatter | func | false | (data) => `${data.text}` | 自定义选择列表
onChange | func | false | (e, value) => {} | 发生变化后的触发
## uxcore-mention-panel



### PROPS
Name | Type | Required | DefaultValue | Description
--- | --- | --- | --- | ---
prefixCls | string | false | '' | 
list | array | false | [] | 
style | object | false | {} | 
idx | number | false | 0 | 
onSelect | func | false | null | 
formatter | func | false | '' | 
## TinymceMention

用于tinymce的mention 

### PROPS
Name | Type | Required | DefaultValue | Description
--- | --- | --- | --- | ---
prefixCls | string | false | 'kuma-mention' | class前缀
source | union (array, func) | false | [] | 定义数据源
delay | number | false | 100 | 数据源查询延时
matchRange | arrayOf number | false | [2, 8] | 匹配字符区间
formatter | func | false | (data) => data | 数据源格式化匹配
mentionFormatter | func | false | (data) => `@${data.text}` | 自定义插入的mention内容
panelFormatter | func | false | (data) => `${data.text}` | 自定义选择列表
onChange | func | false | (e, value) => {} | 发生变化后的触发
onAdd | func | false | () => {} | 添加mention后触发
insertMode | enum ('ELEMENT_NODE', 'TEXT_NODE') | false | 'ELEMENT_NODE' | `ELEMENT_NODE` 插入button, `TEXT_NODE` 插入纯字符串
## ContentEditableEditor



### PROPS
Name | Type | Required | DefaultValue | Description
--- | --- | --- | --- | ---
prefixCls | string | false | '' | class前缀
width | number | false | 200 | 编辑区域宽度
height | number | false | 100 | 编辑区域高度
placeholder | string | false | '' | placeholder
mentionFormatter | func | false | (data) => `@${data.text}` | 自定义插入的mention内容
onChange | func | false | () => {} | 发生变化后的触发
onAdd | func | false | () => {} | 添加mention后触发
defaultValue | string | false | '' | 默认内容
readOnly | bool | false | false | 只读
delimiter | string | false | '@' | 触发字符
## InputEditor

input中使用mention

### PROPS
Name | Type | Required | DefaultValue | Description
--- | --- | --- | --- | ---
prefixCls | string | false | '' | class前缀
width | number | false | 200 | 编辑区域宽度
height | number | false | 30 | 编辑区域高度
placeholder | string | false | '' | placeholder
mentionFormatter | func | false | (data) => ` @${data.text} ` | 自定义插入的mention内容
onChange | func | false | () => {} | 发生变化后的触发
onAdd | func | false | () => {} | 添加mention后触发
defaultValue | string | false | '' | 默认内容
readOnly | bool | false | false | 只读
delimiter | string | false | '@' | 触发字符
## TextareaEditor

textarea中使用mention

### PROPS
Name | Type | Required | DefaultValue | Description
--- | --- | --- | --- | ---
prefixCls | string | false | '' | class前缀
width | number | false | 200 | 编辑区域宽度
height | number | false | 100 | 编辑区域高度
placeholder | string | false | '' | placeholder
mentionFormatter | func | false | (data) => ` @${data.text} ` | 自定义插入的mention内容
onChange | func | false | () => {} | 发生变化后的触发
onAdd | func | false | () => {} | 添加mention后触发
defaultValue | string | false | '' | 默认内容
readOnly | bool | false | false | 只读
delimiter | string | false | '@' | 触发字符