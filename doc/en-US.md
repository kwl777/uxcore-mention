## Mention

Mention Component

### API

 - onFocus(editorInstance): test api doc
 - setPanelPos(pos): description of setPanelPos

### PROPS
Name | Type | Required | DefaultValue | Description
--- | --- | --- | --- | ---
prefixCls | string | false | 'kuma-mention' | class prefix
source | union (array, func) | false | [] | data source for mention content
delay | number | false | 100 | debounce of the request to data source
matchRange | arrayOf number | false | [2, 8] | only match the string after delimiter which the length in this range
formatter | func | false | (data) => data | format the data form source
panelFormatter | func | false | (data) => `${data.text}` | customize the panel display
onChange | func | false | (e, value) => {} | trigger when editor content change
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

Mention for Tinymce

### PROPS
Name | Type | Required | DefaultValue | Description
--- | --- | --- | --- | ---
prefixCls | string | false | 'kuma-mention' | class prefix
source | union (array, func) | false | [] | data source for mention content
delay | number | false | 100 | debounce of the request to data source
matchRange | arrayOf number | false | [2, 8] | only match the string after delimiter which the length in this range
formatter | func | false | (data) => data | format the data form source
mentionFormatter | func | false | (data) => `@${data.text}` | customize the insert content with this function | function
panelFormatter | func | false | (data) => `${data.text}` | customize the panel display
onChange | func | false | (e, value) => {} | trigger when editor content change
onAdd | func | false | () => {} | Callback invoked when a mention has been added
insertMode | enum ('ELEMENT_NODE', 'TEXT_NODE') | false | 'ELEMENT_NODE' | `ELEMENT_NODE` will insert mention content with a button, `TEXT_NODE` will insert with a text node
## ContentEditableEditor



### PROPS
Name | Type | Required | DefaultValue | Description
--- | --- | --- | --- | ---
prefixCls | string | false | '' | class prefix
width | number | false | 200 | editor's width
height | number | false | 100 | editor's height
placeholder | string | false | '' | placeholder
mentionFormatter | func | false | (data) => `@${data.text}` | customize the insert content with this function | function
onChange | func | false | () => {} | trigger when editor content change
onAdd | func | false | () => {} | Callback invoked when a mention has been added
defaultValue | string | false | '' | default value
readOnly | bool | false | false | read only
delimiter | string | false | '@' | Defines the char sequence upon which to trigger querying the data source
## InputEditor

mention in input

### PROPS
Name | Type | Required | DefaultValue | Description
--- | --- | --- | --- | ---
prefixCls | string | false | '' | class prefix
width | number | false | 200 | editor's width
height | number | false | 30 | editor's height
placeholder | string | false | '' | placeholder
mentionFormatter | func | false | (data) => ` @${data.text} ` | customize the insert content with this function | function
onChange | func | false | () => {} | trigger when editor content change
onAdd | func | false | () => {} | Callback invoked when a mention has been added
defaultValue | string | false | '' | default value
readOnly | bool | false | false | read only
delimiter | string | false | '@' | Defines the char sequence upon which to trigger querying the data source
## TextareaEditor

mention in textarea

### PROPS
Name | Type | Required | DefaultValue | Description
--- | --- | --- | --- | ---
prefixCls | string | false | '' | class prefix
width | number | false | 200 | editor's width
height | number | false | 100 | editor's height
placeholder | string | false | '' | placeholder
mentionFormatter | func | false | (data) => ` @${data.text} ` | customize the insert content with this function | function
onChange | func | false | () => {} | trigger when editor content change
onAdd | func | false | () => {} | Callback invoked when a mention has been added
defaultValue | string | false | '' | default value
readOnly | bool | false | false | read only
delimiter | string | false | '@' | Defines the char sequence upon which to trigger querying the data source