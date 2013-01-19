/* 
Copyright 2013 Stu Kabakoff
https://github.com/sakabako/polevault
MIT Licensed
*/
define(function( require, exports, module ) {
	
	var paperboy = require('lib/paperboy');
	var Leap = window.Leap;

	var trigger = paperboy.mixin(exports);
	var controller = new Leap.Controller();
	
	var detectPunches = require('detectors/punch').create( trigger, controller );
			
	controller.onFrame(function() {
		var frame = controller.lastFrame;
		if (frame.id % 10) {
			//return;
		}
		detectPunches( frame );	
		
	})
		
	controller.connect()
	
});