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
	};
	
	exports.createJitteredComparator = function( jitter ) {
		return function( a, b ) {
			if (a === b) {
				return 0;
			}
			
			var diff;
			if (a > b) {
				diff = a - b;
			} else {
				diff = b - a;
			}
			
			if ( diff < jitter ) {
				return 0;
			} else if (a > b) {
				return 1;
			} else {
				return -1;
			}	
		}
	};
	
	var stillComparator = exports.createJitteredComparator( 150 );
	exports.isStill = function( pointable ) {
		var speed = exports.absSum( pointable.tipVelocity );
		return stillComparator( speed, 0 ) === 0;
	}
	
	return exports;
})