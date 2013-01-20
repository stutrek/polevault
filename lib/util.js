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
	
	exports.getHandForPointable = function( pointable, hands ) {
		for( var i = 0; i < hands.length; i += 1 ) {
			if (hands[i].valid) {
				if( hands[i].pointables.indexOf(pointable) !== -1 ) {
					return hands[i]
				}
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