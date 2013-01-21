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
	
	exports.createIsZero = function( jitter ) {
		var stillComparator = exports.createJitteredComparator( jitter || 100 );
		return function ( number ) {
			return stillComparator( number, 0 ) === 0;
		}
	};
	
	var stillComparator = exports.createJitteredComparator( 150 );
	exports.isStill = function( pointable ) {
		var speed = exports.absSum( pointable.tipVelocity );
		return stillComparator( speed, 0 ) === 0;
	}
	
	exports.toMicroseconds = function( seconds ) {
		return seconds * 1000000;
	}
	
	return exports;
})