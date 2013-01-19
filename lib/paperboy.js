/* 
Copyright 2013 Stu Kabakoff
https://github.com/sakabako/paperboy
MIT Licensed
*/
(function(factory) {

	//AMD
	if(typeof define === 'function' && define.amd) {
		define(factory);

	//NODE
	} else if(typeof module === 'object' && module.exports) {
		module.exports = factory();

	//GLOBAL
	} else {
		window.paperboy = factory();
	}

})(function() {
	var exports = {};
	var aps = Array.prototype.slice;
	
	exports.mixin = function( target, eventTypes ){
		
		var events = {'*':[]};
		var enforceTypes = !!eventTypes;
		
		if (eventTypes) {
			for (var i = 0; i < eventTypes.length; i += 1) {
				events[eventTypes[i]] = [];
			}
		}
		
		function error( triedTo, eventName ) {
			throw new Error('tried to '+triedTo+' a non-existent event type: '+type+'. Options are: '+eventTypes.join(', '));
		}
		
		target.on = function (type, callback, isOne) {
			isOne = !!isOne;
			if (enforceTypes && !events[type]) {
				error( 'add', type );
			} else if (!events[type]) {
				events[type] = [];
			}
			events[type].push({callback: callback, isOne: isOne});
		};
		
		target.once = target.one = function (type, callback) {
			target.on(type, callback, true);
		};
		
		target.off = function (type, callback) {
			if (enforceTypes && !events[type]) {
				error( 'remove', type );
			} else if (!events[type]) {
				return;
			}
			for (var i = 0, callbackObj; callbackObj = events[type][i]; i += 1) {
				if (callbackObj.callback === callback) {
					events[type].splice(i, 1);
					return;
				}
			}
		};
		
		function trigger(type /* , args... */ ){
			if (enforceTypes && !events[type]) {
				error( 'trigger', type );
			} else if (!events[type] && events['*'].length === 0) {
				return;
			}
			// trigger all * events
			var callbacks = events['*'].slice();
			for (var i = 0; i < callbacks.length; i++){
				callbacks[i].callback.apply(target, aps.call(arguments));
				if (callbacks[i].isOne) {
					target.off(type, callbacks[i].callback);
				}
			}
			// trigger listeners for this type, if any
			if (events[type]) {
				var args = aps.call(arguments, 1);
				callbacks = events[type].slice();
				for (var i = 0; i < callbacks.length; i++){
					callbacks[i].callback.apply(target, args);
					if (callbacks[i].isOne) {
						target.off(type, callbacks[i].callback);
					}
				}
			}
		}
		
		target.on.accepts = function( eventName ) {
			if (enforceTypes) {
				return eventTypes.indexOf(eventName) !== -1;
			} else {
				return true;
			}
		};
		
		target.repeat = function( emitter, events ) {
			if (events) {
				for (var i = 0; i < events.length; i += 1 ) {
					if (target.on.accepts(events[i]) === false) {
						error( 'repeat', events[i] );
					}
				}
			}
			emitter.on('*', function(type) {
				if (!events || events.indexOf( type ) !== -1) {
					trigger.apply( target, arguments );
				}
			});
		};
		
		
		
		return trigger;
	};
	
	exports.emitter = function( eventTypes ) {
		var emitter = {};
		emitter.trigger = exports.mixin(emitter, eventTypes);
		return emitter;
	}
	
	return exports;
});
