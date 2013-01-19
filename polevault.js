/* 
Copyright 2013 Stu Kabakoff
https://github.com/sakabako/polevault
MIT Licensed
*/
(function(factory) {

	//AMD
	if(typeof define === 'function' && define.amd) {
		define('leap', [], function(){ return window.Leap });
		define(['leap', './paperboy'], factory);

	//NODE
	//} else if(typeof module === 'object' && module.exports) {
	//	module.exports = factory();

	//GLOBAL
	} else {
		window.polevault = factory( Leap, paperboy );
	}

})(function( Leap, paperboy ) {
	
	var exports = {};
	var trigger = paperboy.mixin(exports);
	var controller = new Leap.Controller();
	
	var PUNCH_DIVISOR = 400;
	
	function absSum( array ) {
		var val = 0;
		var i = array.length-1;
		while( i ) {
			val += Math.abs(array[i]);
			i -= 1;
		}
		return val;
	}
	
	var lastPunches = {};
	function checkForPunch( frame ) {
		var prevFrame = controller.frame(1);
		var tenFramesAgo = controller.frame(5);
		
		if (!prevFrame || !tenFramesAgo || !prevFrame.valid || !tenFramesAgo.valid ) { return }
				
		frame.hands.forEach(function( hand ) {
			
			// only punch once every 2.5/10 second
			if (lastPunches[hand.id] > frame.timestamp - 250000) { return }
			// punches are fists, there should be no fingers.
			if (hand.fingers.length) { return }
			
			var prevFrameHand = prevFrame.hand(hand.id);
			var tenFrameHand = tenFramesAgo.hand(hand.id);
			
			if (!prevFrameHand.valid || !tenFrameHand.valid) { return }
						
			var currentVelocity = Math.floor( absSum(hand.palmVelocity) / PUNCH_DIVISOR );
			var prevFrameVelocity = Math.floor( absSum(prevFrameHand.palmVelocity) / PUNCH_DIVISOR );
			var tenFrameVelocity = Math.floor( absSum(tenFrameHand.palmVelocity) / PUNCH_DIVISOR );
			
			if (currentVelocity === 0 && prevFrameVelocity !== 0) {
				lastPunches[hand.id] = frame.timestamp;
			} else {
				//console.log( currentVelocity, prevFrameVelocity, tenFrameVelocity)
			}
			
		});
	}
	
	controller.onFrame(function() {
		var frame = controller.lastFrame;
		if (frame.id % 10) {
			//return;
		}
		checkForPunch( frame );	
		
	})
		
	controller.connect()
	
	return exports;
});