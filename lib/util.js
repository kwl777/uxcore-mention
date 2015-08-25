/**
 * [parseStrByDelimiter description]
 * @method parseStrByDelimiter
 * @param  {[string]} str       = ''  [origin str]
 * @param  {[string]} delimiter = '@' [delimiter str]
 * @return {[string]}
 */
function parseStrByDelimiter(str = '', delimiter = '@') {
	let idx = str.lastIndexOf(delimiter);
	if (idx !== -1) {
		str = str.substring(idx + 1);
	} else {
		str = '';
	}
	return str;
}

function getCursorPosition(){

}

export {parseStrByDelimiter};
