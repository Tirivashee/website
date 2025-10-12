/**
 * Quantity dropdown.
 */
(function ($) {
	'use strict';

	$.fn.quantityDropdown = function( options ) {
		var defaults = {
			maxItems: 5,
			onChange: null,
			onInit: null
		};

		options = $.extend( defaults, options );

		return this.each( function() {
			var $input = $( this ),
				$quantity = $input.closest( '.quantity' ),
				$dropdown = $( '<ul/>' ),
				current = parseFloat($input.val()),
				min = parseFloat($input.attr('min')),
				max = parseFloat($input.attr('max')),
				step = parseFloat($input.attr('step')),
				maxItems = options.maxItems,
				infinite = false,
				values = [],
				visible = [];

			// Stop if already initialized.
			if ( $quantity.data( 'quantityDropdown' ) ) {
				return this;
			}

			step = step ? step : 1;
			min = min ? min : step;

			if (!max) {
				max = Math.max(maxItems, current);
				infinite = true;
			} else if ( max < maxItems ) {
				maxItems = max;
			}

			// Add all options.
			for (var i = min; i <= max; i += step) {
				if (current == i) {
					$('<li class="active">' + i + '</li>').appendTo($dropdown);
				} else {
					$('<li>' + i + '</li>').appendTo($dropdown);
				}

				values.push( i );
			}

			var $dropDownIcon = '<svg width="14px" height="14px" viewBox="0 0 14 14"><g><polygon points="7,10.773 1.531,6.398 2.469,5.227 7,8.851 11.531,5.227 12.469,6.398"/></g><rect fill="none" width="14" height="14"/></svg>';

			$('<div class="qty-dropdown"/>')
				.append('<span class="current"><span class="value">' + current + '</span><span class="svg-icon icon-arrow-dropdown icon-smaller">' + $dropDownIcon + '</span></span>')
				.append($dropdown)
				.appendTo($quantity);

			$dropdown.wrap( '<div class="qty-options"/>' );
			$quantity.addClass('quantity-dropdown');
			$quantity.data( 'quantityDropdown', options );

			// Open and select event.
			$quantity
				.on('click', '.qty-dropdown .current', function () {
					var $el = $(this),
						$dropdown = $el.next('.qty-options'),
						height = $el.outerHeight();

					current = parseFloat( $el.find( '.value' ).text() );

					scroll( current );

					$dropdown.css( 'height', maxItems * height );
					$dropdown.fadeToggle();
				})
				.on('click', '.qty-dropdown li', function () {
					var $el = $(this);

					current = parseFloat( $el.text() );

					$el.addClass('active').siblings('.active').removeClass('active');
					$el.closest( '.qty-options' ).fadeOut();
					$el.closest('.qty-dropdown').find('.current .value').text(current);
					$el.closest('.quantity').find('.qty').val(current).trigger( 'change' );

					if ( typeof options.onChange === 'function' ) {
						options.onChange( current, $quantity );
					}
				});

			// Scroll & swipe event.
			$quantity.find( '.qty-dropdown .qty-options' )
				.on('wheel', function(event) {
					if ( event.originalEvent.deltaY < 0 ) {
						scroll( 'up' ); // Up
					} else {
						increase(); // Down
					}
					return false;
				}).on('swipeup', function() {
					increase();
				}).on('swipedown', function() {
					scroll('up');
				});

			// Close dropdown when click outsite.
			$(document.body).on('click', function (event) {
				if (!$quantity.is(event.target) && $quantity.has(event.target).length === 0) {
					$quantity.find( '.qty-options' ).fadeOut();
				}
			});

			/**
			 * Append or scroll to next option.
			 */
			function increase() {
				var maxVisible = Math.max(...visible);

				// Append.
				if ( maxVisible >= max && infinite ) {
					max += step;
					values.push( max );

					$dropdown.append( '<li>' + max + '</li>' );
				}

				scroll( 'down' );
			}

			/**
			 * Scroll the options.
			 */
			function scroll( value ) {
				var height = $quantity.find( '.current' ).outerHeight(),
					minVisible = Math.min(...visible),
					maxVisible = Math.max(...visible),
					distance = 0;

				if ( 'up' === value ) {
					if ( minVisible <= min ) {
						return;
					}

					distance = -values.indexOf( minVisible - step ) * height;
					visible.pop();
					visible.unshift( minVisible - step );
				} else if ( 'down' === value ) {
					if ( maxVisible >= max ) {
						return;
					}

					distance = -values.indexOf( minVisible + step ) * height;
					visible.shift();
					visible.push( maxVisible + 1 );
				} else {
					var index = values.indexOf( value ),
						middle = Math.floor( maxItems/2 );

					if ( index > middle ) {
						index = index - middle;
					} else {
						index = 0;
					}

					// Reset visible.
					visible = [];

					for ( var i = index; i < index + maxItems; i++ ) {
						if ( i in values ) {
							visible.push(values[i]);
						} else if ( infinite ) {
							max = max + step;
							values.push( max );
							visible.push( max );
							$dropdown.append( '<li>' + max + '</li>' );
						}
					}

					distance = -index * height;
				}

				$dropdown.css( 'transform', 'translate3d(0, ' + distance + 'px, 0)' );
			}
		} );
	};
} )(jQuery);

/**
 * Support swipe event.
 */
(function ($) {
	function is_touch_device() {
		var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
		var mq = function (query) {
			return window.matchMedia(query).matches;
		}

		if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
			return true;
		}

		// include the 'heartz' as a way to have a non matching MQ to help terminate the join
		// https://git.io/vznFH
		var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
		return mq(query);
	}

	// initializes touch and scroll events
	var supportTouch = is_touch_device(),
		touchStartEvent = supportTouch ? "touchstart" : "mousedown",
		touchStopEvent = supportTouch ? "touchend" : "mouseup",
		touchMoveEvent = supportTouch ? "touchmove" : "mousemove";

	// handles swipeup and swipedown
	$.event.special.swipeupdown = {
		setup: function () {
			var thisObject = this;
			var $this = $(thisObject);

			$this.bind(touchStartEvent, function (event) {
				var data = event.originalEvent.touches ?
					event.originalEvent.touches[0] :
					event,
					start = {
						time: (new Date).getTime(),
						coords: [data.pageX, data.pageY],
						origin: $(event.target)
					},
					stop;

				function moveHandler(event) {
					if (!start) {
						return;
					}

					var data = event.originalEvent.touches ?
						event.originalEvent.touches[0] :
						event;
					stop = {
						time: (new Date).getTime(),
						coords: [data.pageX, data.pageY]
					};

					// prevent scrolling
					if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
						event.preventDefault();
					}
				}

				$this
					.bind(touchMoveEvent, moveHandler)
					.one(touchStopEvent, function (event) {
						$this.unbind(touchMoveEvent, moveHandler);
						if (start && stop) {
							if (stop.time - start.time < 1000 &&
								Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
								Math.abs(start.coords[0] - stop.coords[0]) < 75) {
								start.origin
									.trigger("swipeupdown")
									.trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
							}
						}
						start = stop = undefined;
					});
			});
		}
	};

	//Adds the events to the jQuery events special collection
	$.each({
		swipedown: "swipeupdown",
		swipeup: "swipeupdown"
	}, function (event, sourceEvent) {
		$.event.special[event] = {
			setup: function () {
				$(this).bind(sourceEvent, $.noop);
			}
		};
		//Adds new events shortcuts
		$.fn[event] = function (fn) {
			return fn ? this.bind(event, fn) : this.trigger(event);
		};
	});
})(jQuery);
