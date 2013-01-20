define(['../lib/util'], function( util ) {
	exports = {};
	
	var TAP_DIVISOR = 100;
	var comparator = util.createJitteredComparator( TAP_DIVISOR );
	var handComparator = util.createJitteredComparator( 50 );
	var getHandForPointable = util.getHandForPointable;
	
	exports.create = function( controller ) {
		var lastTaps = {};
		var lastFastMotion = {};
		return function( frame ) {
			var prevFrame = controller.frame(1);
			var tappingPointables = [];
			
			if (!prevFrame || !prevFrame.valid) { return tappingPointables }	
			
			frame.pointables.forEach(function( pointable ) {
				
				// only tap once every 2.5/10 second
				if (lastTaps[pointable.id] > frame.timestamp - 250000) { return }
				// taps go down.
				
				var hand = getHandForPointable( pointable, frame.hands );
				if (hand === undefined) {
					return;
				}
				var prevFramePointable = prevFrame.pointable(pointable.id);
				
				if (!prevFramePointable.valid) { return }
				if (handComparator( pointable.tipVelocity[1], hand.palmVelocity[1]) === 0) {
					return;
				}
							
				if (pointable.tipVelocity[1] > 0 && (frame.timestamp-lastFastMotion[pointable.id]) < 100000 ) {
					lastTaps[pointable.id] = frame.timestamp;
					tappingPointables.push(pointable);
				} else if (pointable.tipVelocity[1] < -100) {
					lastFastMotion[pointable.id] = frame.timestamp;
				}
				
			});
			
			return tappingPointables;
		}
	}
	return exports;
});