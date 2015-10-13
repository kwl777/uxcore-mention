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

/**
 * [get window scroll offset]
 * @method getScrollOffset
 */
function getScrollOffset(){
	var offset = {};
	if (window.pageXOffset) {
		offset.x = window.pageXOffset;
	} else {
		offset.x = document.documentElement.scrollLeft;
	}
	if (window.pageYOffset) {
		offset.y = window.pageYOffset;
	} else {
		offset.y = document.documentElement.scrollTop;
	}
	return offset;
}

export {parseStrByDelimiter, getScrollOffset};
