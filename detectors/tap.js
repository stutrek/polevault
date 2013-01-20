define(['../lib/util'], function( util ) {
	exports = {};
	
	var TAP_DIVISOR = 200;
	
	exports.create = function( trigger, controller ) {
		var lastTaps = {};
		return function( frame ) {
			var prevFrame = controller.frame(1);
			
			if (!prevFrame || !prevFrame.valid) { return }
			
			frame.pointables.forEach(function( pointable ) {

				// only tap once every 2.5/10 second
				if (lastTaps[pointable.id] > frame.timestamp - 250000) { return }
				
				var prevFramePointable = prevFrame.pointable(pointable.id);
				
				if (!prevFramePointable.valid) { return }
							
				var currentVelocity = Math.floor( util.absSum(pointable.tipVelocity) / TAP_DIVISOR );
				var prevFrameVelocity = Math.floor( util.absSum(prevFramePointable.tipVelocity) / TAP_DIVISOR );
				
				if (currentVelocity === 0 && prevFrameVelocity !== 0) {
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