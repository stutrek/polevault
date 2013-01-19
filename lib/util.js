define([], function() {
	var exports = {};
	
	exports.absSum = function ( array ) {
		var val = 0;
		var i = array.length-1;
		while( i ) {
			val += Math.abs(array[i]);
			i -= 1;
		}
		return val;
	}
	
	return exports;
})