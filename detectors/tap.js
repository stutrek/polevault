define(['../lib/util'], function( util ) {
	exports = {};
	
	var TAP_DIVISOR = 200;
	var comparator = util.createJitteredComparator( TAP_DIVISOR );
	var handComparator = util.createJitteredComparator( 100 );
	
	function getHandForPointable( pointable, hands ) {
		for( var i = 0; i < hands.length; i += 1 ) {
			if (hands[i].valid) {
				if( hands[i].pointables.indexOf(pointable) !== -1 ) {
					return hands[i]
				}
			}
		}
	}
	
	exports.create = function( trigger, controller ) {
		var lastTaps = {};
		return function( frame ) {
			var prevFrame = controller.frame(1);
			
			if (!prevFrame || !prevFrame.valid) { return }
			
			frame.pointables.forEach(function( pointable ) {
				
				// only tap once every 2.5/10 second
				if (lastTaps[pointable.id] > frame.timestamp - 250000) { return }
				
				var hand = getHandForPointable( pointable, frame.hands );
				if (hand === undefined) {
					console.log(frame);
					return;
				}
				var prevFramePointable = prevFrame.pointable(pointable.id);
				
				if (!prevFramePointable.valid) { return }
				if (handComparator( util.absSum(pointable.tipVelocity), util.absSum(hand.palmVelocity)) === 0) {
					return;
				}
							
				var currentVelocity = Math.floor( util.absSum(pointable.tipVelocity) / TAP_DIVISOR );
				var prevFrameVelocity = Math.floor( util.absSum(prevFramePointable.tipVelocity) / TAP_DIVISOR );
				
				if (currentVelocity === 0 && prevFrameVelocity !== 0 && comparator( pointable.tipVelocity, prevFramePointable.tipVelocity ) !== 0) {
					lastTaps[pointable.id] = frame.timestamp;
					trigger('tap', pointable);
				} else {
					//console.log( currentVelocity, prevFrameVelocity)
				}
				
			});
		}
	}
	return exports;
});