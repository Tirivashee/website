/*global BallylikeData*/
var Ballylike = Ballylike || {};

(function( $ ) {
	'use strict';
	/**
	 * The main function to init the theme
	 */
	Ballylike.init = function() {

		this.closeTopbar();

		this.focusSearchField();
		this.cartWidget();
		this.loginPanel();
		this.toggleVerticalMenu();
		this.toggleHamburgerScreen();
		this.toggleHamburgerMenu();
		this.toggleOffCanvas();
		this.mobileMenu();
		this.toggleModals();

		this.accordion();
		this.closeMessages();
		this.tabs();
		this.BallylikeCarousel();

		this.progeressBar();
		this.charts();

		this.productGalleryLightbox();
		this.singleProductV1();
		this.singleProductV2();
		this.singleProductV3();
		this.singleProductV4();
		this.singleProductV5();
		this.singleProductV7();
		this.productQuantityButtons();
		this.toggleProductTabs();
		this.singleProductAjaxAddToCart();

		this.productThumbnailsSlider();
		this.productThumbnailZoom();
		this.productCarousel2();
		this.productCarousel();
		this.productsCarousel();
		this.productsMasonry();
		this.reviewProduct();
		this.variationProduct();
		this.addWishlist();
		this.addToCart();
		this.resetSelect();
		this.variationsForm();

		this.postsSlider();
		this.countdown();

		this.popup();
		this.map();

		//Shop
		this.productsQuickSearch();
		this.select2Tool();
		this.stickySidebar();
		this.priceSlider();
		this.productsTool();
		this.loadMoreProducts();
		this.productQuickView();

		//Login
		this.loginTabs();

		this.portfolioMasonry();
		this.loadMorePosts();

		this.stickySocials();
		this.backToTop();
		this.stickyScrollDown();
		this.scrollDown();

		this.pageTemplateFlexPosts();
		this.sliders();
		this.formFieldFocus();
		this.pageTemplateSplit();
		this.BallylikeToggle();

		// Other
		this.getWsection_stretch_left();
		this.carouselTestimonial();

		this.openShippingAddress();
	};

	Ballylike.openShippingAddress = function() {
		$( document.body ).on( 'click', '#ship-to-different-address', function( e ) {
			e.preventDefault();
			var input = $( '#ship-to-different-address-checkbox' );
			input.prop( 'checked', !input.prop( 'checked' ));
			$( this ).siblings( '.shipping_address' ).slideToggle();
		} );
	}

	// Topbar
	Ballylike.closeTopbar = function() {
		$( document.body ).on( 'click', '.close-topbar', function( event ) {
			event.preventDefault();

			$( '#topbar' ).slideUp();
		} );
	};
	/**
	 * Open quick links when focus on search field
	 */
	Ballylike.focusSearchField = function() {
		$( '.header-search .search-field' ).on( 'focus', function() {
			var $quicklinks = $( this ).closest( '.header-search' ).find( '.quick-links' );

			if ( !$quicklinks.length ) {
				return;
			}

			$quicklinks.addClass( 'open' );
			$( this ).addClass( 'focused' );
		} );

		$( document.body ).on( 'click', 'div', function( event ) {
			var $target = $( event.target );

			if ( $target.is( '.header-search' ) || $target.closest( '.header-search' ).length ) {
				return;
			}

			$( '.quick-links', '.header-search' ).removeClass( 'open' );
			$( '.search-field', '.header-search' ).removeClass( 'focused' );
		} );
	};

	/**
	 * Add class to .form-row when inputs are focused.
	 */
	Ballylike.formFieldFocus = function() {
		$( document.body )
			.on( 'focus', '.form-row > input.input-text, .form-row > textarea, .wpcf7-form-control', function() {
				$( this ).parent().addClass( 'focused' );

				if ( $( this ).is( '.wpcf7-form-control' ) ) {
					$( this ).closest( 'label' ).addClass( 'focused' );
				} else {
					$( this ).parent().addClass( 'focused' );
				}
			} )
			.on( 'blur', '.form-row > input.input-text, .form-row > textarea, .wpcf7-form-control', function() {
				if ( $( this ).val() === '' ) {
					if ( $( this ).is( '.wpcf7-form-control' ) ) {
						$( this ).closest( 'label' ).removeClass( 'focused' );
					} else {
						$( this ).parent().removeClass( 'focused' );
					}
				}
			} )
			.find( '.form-row > input.input-text, .form-row > textarea, .wpcf7-form-control' ).each( function() {
			if ( $( this ).val() != '' ) {
				if ( $( this ).is( '.wpcf7-form-control' ) ) {
					$( this ).closest( 'label' ).addClass( 'focused' );
				} else {
					$( this ).parent().addClass( 'focused' );
				}
			}
		} );
	};

	/**
	 * Make the cart widget more flexible.
	 */
	Ballylike.cartWidget = function() {
		var options = {};

		if ( $.fn.quantityDropdown ) {
			$( '.mini-cart-item .quantity .qty' ).quantityDropdown( options );
		}
	};

	/**
	 * Toggle sub-menu inside hamburger screen
	 */
	Ballylike.toggleVerticalMenu = function() {
		var $menu = $( '.header-vertical .main-navigation' );

		if ( ! $menu.length ) {
			return;
		}

		var dropdown = $menu.children( '.menu' ).hasClass( 'nav-menu--submenu-slidedown' );

		// Open when click
		$menu.on( 'click', '.menu li.menu-item-has-children > a', function( event ) {
			event.preventDefault();

			var $item = $( this ).parent();

			$item.toggleClass( 'active' ).siblings().removeClass( 'active' ).children( 'ul' ).removeClass( 'open' );
			$item.children( 'ul' ).toggleClass( 'open' );

			// If this is sub-menu item
			if ( dropdown || $item.closest( 'ul' ).hasClass( 'sub-menu' ) ) {
				$item.children( 'ul' ).slideToggle();
				$item.siblings().find( 'ul' ).slideUp();
			}
		} );
	};

	/**
	 * Toggle hamburger full-screen
	 */
	Ballylike.toggleHamburgerScreen = function() {
		$( document.body ).on( 'click', '.header-hamburger', function( event ) {
			event.preventDefault();

			var $el = $( this ),
				$screen = $( '#' + $el.data( 'target' ) );

			if ( !$screen.length ) {
				return;
			}

			var $menu = $( '#fullscreen-menu', $screen ),
				$widgets = $( '.filter-widgets', $screen ),
				$socials = $( '.social-icons', $screen ),
				$currency = $( '.currency', $screen ),
				$language = $( '.language', $screen ),
				step = 100,
				count = 0;

			// Add animation if enabled.
			if ( !$screen.hasClass( 'content-animation-none' ) ) {
				if ( $screen.hasClass( 'content-animation-fade' ) ) {
					step = 160;
				}

				if ( $menu.length && !$menu.data( 'delay' ) ) {
					$( '.menu > li', $menu ).each( function() {
						$( this ).css( 'animation-delay', count * step + 'ms' );
						count++;
					} );

					$menu.data( 'delay', count );
				} else if ( $widgets.length && !$widgets.data( 'delay' ) ) {
					$( '.widget', $widgets ).each( function() {
						$( this ).css( 'animation-delay', count * step + 'ms' );
						count++;
					} );

					$widgets.data( 'delay', count );
				}

				count = 1;
				if ( $socials.length && !$socials.data( 'delay' ) ) {
					$( '.menu > li', $socials ).each( function() {
						$( this ).css( 'animation-delay', count * step + 'ms' );
						count++;
					} );

					$socials.data( 'delay', count );
				}

				if ( $currency.length && !$currency.data( 'delay' ) ) {
					$currency.css( 'animation-delay', count * step + 'ms' );
					$currency.data( 'delay', count );
					count++;
				}

				if ( $language.length && !$language.data( 'delay' ) ) {
					$language.css( 'animation-delay', count * step + 'ms' );
					$language.data( 'delay', count );
					count++;
				}
			}

			$screen.fadeToggle( function() {
				$( '.hamburger-menu', $screen ).addClass( 'active' );
			} );
			$screen.addClass( 'open' );
		} ).on( 'click', '#hamburger-fullscreen .button-close', function( event ) {
			event.stopPropagation();

			var $el = $( this ),
				$screen = $( '#hamburger-fullscreen' );

			$el.removeClass( 'active' );
			$screen.removeClass( 'open' );

			setTimeout( function() {
				$screen.fadeOut();
			}, 420 );
		} );

		// Init scrollbar for full screen menu.
		if ( typeof PerfectScrollbar !== 'undefined' ) {
			var $hamburgerScreen = $( '#hamburger-fullscreen' );

			if ( $hamburgerScreen.length ) {
				new PerfectScrollbar( $( '.hamburger-screen-content', $hamburgerScreen ).get( 0 ) );
			}
		}
	};

	/**
	 * Toggle sub-menu inside hamburger screen
	 */
	Ballylike.toggleHamburgerMenu = function() {
		var $menu = $( '#fullscreen-menu' );

		if ( !$menu.length ) {
			return;
		}

		// Open when click
		if ( $menu.hasClass( 'click-open' ) ) {
			$menu.on( 'click', '.menu li.menu-item-has-children > a', function( event ) {
				event.preventDefault();

				var $item = $( this ).parent();

				$item.toggleClass( 'active' ).siblings().removeClass( 'active' ).children( 'ul' ).removeClass( 'open' );
				$item.children( 'ul' ).toggleClass( 'open' );

				// If this is sub-menu item
				if ( $item.closest( 'ul' ).hasClass( 'sub-menu' ) ) {
					$item.children( 'ul' ).slideToggle();
					$item.siblings().find( 'ul' ).slideUp();
				}
			} );
		}
	};

	/**
	 * Toggle off-screen panels
	 */
	Ballylike.toggleOffCanvas = function() {
		$( document.body ).on( 'click', '[data-toggle="off-canvas"]', function( event ) {
			var target = '#' + $( this ).data( 'target' );

			if ( $( target ).hasClass( 'open' ) ) {
				Ballylike.closeOffCanvas( target );
			} else if ( Ballylike.openOffCanvas( target ) ) {
				event.preventDefault();
			}
		} ).on( 'click', '.offscreen-panel .button-close, .offscreen-panel .backdrop', function( event ) {
			event.preventDefault();

			Ballylike.closeOffCanvas( this );
		} ).on( 'keyup', function ( e ) {
			if ( e.keyCode === 27 ) {
				Ballylike.closeOffCanvas();
			}
		} );
	};

	Ballylike.openOffCanvas = function( target ) {
		var $target = $( target );

		if ( !$target.length ) {
			return false;
		}

		$target.fadeIn(200, function(){
			$target.addClass( 'open' );
		});

		$( document.body ).addClass( 'offcanvas-opened ' + $target.attr( 'id' ) + '-opened' ).trigger( 'Ballylike_off_canvas_opened', [$target] );

		return true;
	};

	/**
	 * Close off canvas panel.
	 * @param DOM target
	 */
	Ballylike.closeOffCanvas = function( target ) {
		if ( !target ) {
			$( '.offscreen-panel' ).each( function() {
				var $panel = $( this );

				if ( ! $panel.hasClass( 'open' ) ) {
					return;
				}

				$panel.removeClass( 'open' ).fadeOut();
				$( document.body ).removeClass( $panel.attr( 'id' ) + '-opened' );
			} );
		} else {
			target = $( target ).closest( '.offscreen-panel' );
			target.removeClass( 'open' ).fadeOut();

			$( document.body ).removeClass( target.attr( 'id' ) + '-opened' );
		}

		$( document.body ).removeClass( 'offcanvas-opened' ).trigger( 'Ballylike_off_canvas_closed', [target] );
	}

	/**
	 * Handle mobile menu toggle.
	 */
	Ballylike.mobileMenu = function() {
		var $mobileMenu = $( '#mobile-menu' );

		$mobileMenu.find( '' )

		// Add class 'open' to current menu item.
		$mobileMenu.find( '.menu > .menu-item-has-children, .menu > li > ul > .menu-item-has-children' ).filter( function() {
			return $( this ).hasClass( 'current-menu-item' ) || $( this ).hasClass( 'current-menu-ancestor' );
		} ).addClass( 'open' );

		// Toggle submenu.
		$mobileMenu.on( 'click', '.menu-item-has-children > a', function( event ) {
			var $li = $( this ).parent();

			if ( $li.hasClass( 'open' ) && $li.hasClass( 'clicked' ) && '#' !== $( this ).attr( 'href' ) ) {
				return true;
			}

			event.stopPropagation();
			event.preventDefault();

			$li.addClass( 'clicked' );

			$li.toggleClass( 'open' ).children( 'ul' ).slideToggle();
			$li.siblings( '.open' ).removeClass( 'open clicked' ).children( 'ul' ).slideUp();
		} ).on( 'click', '.menu-item-has-children > .toggle', function( event ) {
			event.stopPropagation();
			event.preventDefault();

			var $li = $( this ).parent();

			$li.toggleClass( 'open' ).children( 'ul' ).slideToggle();
			$li.siblings( '.open' ).removeClass( 'open' ).children( 'ul' ).slideUp();
		} );

		// Close other panels.
		$mobileMenu.on( 'click', '[data-toggle="off-canvas"], [data-toggle="modal"]', function() {
			if ( 'mobile-menu' !== $( this ).data( 'target' ) ) {
				Ballylike.closeModal();
				Ballylike.closeOffCanvas();
			}
		} );
	};

	/**
	 * Toggle modals.
	 */
	Ballylike.toggleModals = function() {
		$( document.body ).on( 'click', '[data-toggle="modal"]', function( event ) {
			var target = '#' + $( this ).data( 'target' );

			if ( $( target ).hasClass( 'open' ) ) {
				Ballylike.closeModal( target );
			} else if ( Ballylike.openModal( target ) ) {
				event.preventDefault();
			}
		} ).on( 'click', '.modal .button-close, .modal .backdrop', function( event ) {
			event.preventDefault();

			Ballylike.closeModal( this );
		} ).on( 'keyup', function ( e ) {
			if ( e.keyCode === 27 ) {
				Ballylike.closeModal();
			}
		} );
	};

	/**
	 * Open a modal.
	 *
	 * @param string target
	 */
	Ballylike.openModal = function( target ) {
		var $target = $( target );

		if ( !$target.length ) {
			return false;
		}

		$target.fadeIn();
		$target.addClass( 'open' );

		$( document.body ).addClass( 'modal-opened ' + $target.attr( 'id' ) + '-opened' ).trigger( 'Ballylike_modal_opened', [$target] );

		return true;
	};

	/**
	 * Close a modal.
	 *
	 * @param string target
	 */
	Ballylike.closeModal = function( target ) {
		if ( !target ) {
			$( '.modal' ).removeClass( 'open' ).fadeOut();

			$( '.modal' ).each( function() {
				var $modal = $( this );

				if ( ! $modal.hasClass( 'open' ) ) {
					return;
				}

				$modal.removeClass( 'open' ).fadeOut();
				$( document.body ).removeClass( $modal.attr( 'id' ) + '-opened' );
			} );
		} else {
			target = $( target ).closest( '.modal' );
			target.removeClass( 'open' ).fadeOut();

			$( document.body ).removeClass( target.attr( 'id' ) + '-opened' );
		}

		$( document.body ).removeClass( 'modal-opened' ).trigger( 'Ballylike_modal_closed', [target] );
	};

	/**
	 * Toggle register/login form in the login panel.
	 */
	Ballylike.loginPanel = function() {
		$( document.body )
			.on( 'click', '#login-panel .create-account', function( event ) {
				event.preventDefault();

				$( this ).closest( 'form.login' ).fadeOut( function() {
					$( this ).next( 'form.register' ).fadeIn();
				} );
			} ).on( 'click', '#login-panel a.login', function( event ) {
			event.preventDefault();

			$( this ).closest( 'form.register' ).fadeOut( function() {
				$( this ).prev( 'form.login' ).fadeIn();
			} );
		} ).on( 'click', '[data-toggle="off-canvas"][data-target="login-panel"]', function() {
			$( '#login-panel' ).find( 'form' ).hide().filter( '.login' ).show();
		} );
	};

	// Eles
	Ballylike.accordion = function() {
		$( document.body ).find( '.Ballylike-accordions' ).each( function () {
			var  els = $( this ).find( '.Ballylike-accordion' );

			els.not(':first-child').find('.Ballylike-accordions__desc').slideUp();
			els.first().addClass('active');

			els.click( function () {
				var item = $( this ),
					siblings =  item.siblings(item);

				if (els.hasClass('.active')) {
					return;
				}

				siblings.removeClass('active');
				item.addClass('active');
				siblings.find('.Ballylike-accordions__desc').slideUp(200);
				item.find('.Ballylike-accordions__desc').slideDown(150);

			} );

		} )
	};

	/**
	 * Close message box.
	 */
	 Ballylike.closeMessages = function() {
	 	$( document.body ).on( 'click', '.Ballylike-message-box .close', function ( e ) {
			e.preventDefault();

			$( this ).parent().fadeOut();
		} );

	 };

	/**
	 * tabs
	 */
	 Ballylike.tabs = function() {
		$( document.body ).find( '.Ballylike-tabs' ).each( function () {
			var   tabMnu = $( this ).find( '.Ballylike-tabs__nav li' ),
				  tabContent = $( this ).find( '.Ballylike-tabs__panel' );

			tabMnu.first().addClass( 'active' );
			tabContent.first().addClass( 'active' );

			tabMnu.click( function () {
				var item = $(this);

				if (tabMnu.hasClass('.active')) {
					return;
				}

				item.addClass('active').siblings().removeClass('active');
				tabContent.eq(item.index()).addClass('active').siblings().removeClass('active');
			} );
		} )
	};

	/**
	 * Initialize the featured content carousel
	 */
	Ballylike.BallylikeCarousel = function() {
		if ( ! $.fn.slick ) {
			return;
		}

		$( '.Ballylike-carousel' )
			.on( 'init', function( event, slick ) {
				if ( slick.$slider.hasClass( 'Ballylike-carousel--show-index' ) ) {
					slick.$slides.each( function( index, $slide ) {
						var number = ++index < 10 ? '0' + index.toString() : index.toString();
						$( '<span class="Ballylike-dash Ballylike-carousel__slide-index"><span class="Ballylike-dash__line text-default"></span><span class="Ballylike-carousel__slide-index-number">' + number + '</span></span>' ).appendTo( $slide );
					} );

					setTimeout( function() {
						slick.$slider.addClass( 'indexs-initialized' );
					}, 500 );
				}
			} )
			.slick( {
				prevArrow: '<button type="button" class="slick-prev Ballylike-carousel__arrow"><span class="svg-icon icon-left icon-small"><svg width="16px" height="16px" viewBox="0 0 16 16"><g><rect fill="none" width="16" height="16"/><g><polygon points="8.394,13.941 4.073,8 8.394,2.059 9.606,2.941 5.927,8 9.606,13.059"/></g></g></svg></span></button>',
				nextArrow: '<button type="button" class="slick-next Ballylike-carousel__arrow"><span class="svg-icon icon-right icon-small"><svg width="16px" height="16px" viewBox="0 0 16 16"><g><rect fill="none" width="16" height="16"/><g><polygon points="7.606,13.941 11.927,8 7.606,2.059 6.394,2.941 10.073,8 6.394,13.059"/></g></g></svg></span></button>',
				responsive: [
					{
						breakpoint: 1199,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 1
						}
					},
					{
						breakpoint: 767,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1
						}
					}
				],
		} );
	};

	Ballylike.progeressBar = function() {
		$( '.Ballylike-progress-bars' ).each( function () {
			var els 	= $(this).find('.Ballylike-progress-bars__bar'),
				value 	=  els.data('value');

			els.css({
				width: value + '%'
			});
		});

	};

	Ballylike.charts = function() {
		$( '.Ballylike-chart' ).each( function () {
			$( this ).circleProgress( {
				emptyFill : 'rgba(227,231,232,1)',
				startAngle: -Math.PI / 2
			} );
		});
	};

	/**
	 * Product thumbnails slider.
	 */
	Ballylike.productThumbnailsSlider = function() {
		if ( ! $.fn.slick ) {
			return;
		}

		var options = {
			slidesToShow  : 1,
			slidesToScroll: 1,
			infinite      : false,
			lazyLoad      : 'ondemand',
			dots          : false,
			swipe         : false,
			prevArrow     : '<span class="slick-prev slick-arrow svg-icon icon-left icon-small"><svg width="16px" height="16px" viewBox="0 0 16 16"><g><rect fill="none" width="16" height="16"/><g><polygon points="8.394,13.941 4.073,8 8.394,2.059 9.606,2.941 5.927,8 9.606,13.059"/></g></g></svg></span>',
			nextArrow     : '<span class="slick-next slick-arrow svg-icon icon-right icon-small"><svg width="16px" height="16px" viewBox="0 0 16 16"><g><rect fill="none" width="16" height="16"/><g><polygon points="7.606,13.941 11.927,8 7.606,2.059 6.394,2.941 10.073,8 6.394,13.059"/></g></g></svg></span>'
		}

		$( '.product-thumbnails--slider' ).slick( options );
	};

	/**
	 * Product thumbnail zoom.
	 */
	Ballylike.productThumbnailZoom = function() {
		$( '.product-thumbnail-zoom' ).each( function() {
			var $el = $( this );

			$el.zoom( {
				url: $el.attr( 'data-zoom_image' )
			} );
		} );
	};

	/**
	 * Open popup.
	 */
	Ballylike.popup = function() {
		var days = 1;

		$( window ).on( 'load', function() {
			setTimeout( function() {
				Ballylike.openModal( '#popup-modal' );
			}, 500 );
		} );

		$( document.body ).on( 'Ballylike_modal_closed', function( event, modal ) {
			if ( !$( modal ).closest( '.modal' ).hasClass( 'popup-modal' ) ) {
				return;
			}

			var date = new Date(),
				value = date.getTime();

			date.setTime( date.getTime() + (days * 24 * 60 * 60 * 1000) );

			document.cookie = 'Ballylike_popup=' + value + ';expires=' + date.toGMTString() + ';path=/';
		} );

		// Support close popup with a helper class.
		$( document.body ).on( 'click', '.popup-modal .close-popup-trigger', function() {
			Ballylike.closeModal( '.popup-modal' );
		} );
	};

	/**
	 * Product Carousel.
	 */
	Ballylike.productCarousel = function() {
		if ( ! $.fn.slick ) {
			return;
		}

		var $this= $( '.Ballylike-product-carousel' ),
			options = $this.data('slick'),
			navStyle = $this.data('nav_style'),
			navText = {};

		if ('angle' === navStyle) {
			navText.prev = '<button type="button" class="slick-prev product-carousel-arrow"><span class="svg-icon icon-left"><svg width="16px" height="16px" viewBox="0 0 16 16"><g><rect fill="none" width="16" height="16"/><g><polygon points="8.394,13.941 4.073,8 8.394,2.059 9.606,2.941 5.927,8 9.606,13.059"/></g></g></svg></span></button>';
			navText.next = '<button type="button" class="slick-next product-carousel-arrow"><span class="svg-icon icon-right"><svg width="16px" height="16px" viewBox="0 0 16 16"><g><rect fill="none" width="16" height="16"/><g><polygon points="7.606,13.941 11.927,8 7.606,2.059 6.394,2.941 10.073,8 6.394,13.059"/></g></g></svg></span></button>';
		} else {
			navText.prev = '<button type="button" class="slick-prev product-carousel-arrow"><span class="svg-icon icon-arrow-left"><svg viewBox="0 0 32 32"><g><rect y="0" style="fill:none;" width="32" height="32"/><path d="M14,17h14v-2H14V9L4,16l10,7V17z M7.488,15.96L12,12.841V19v0.079L7.488,15.96z"/></g></svg></span></button>';
			navText.next = '<button type="button" class="slick-next product-carousel-arrow"><span class="svg-icon icon-arrow-left"><svg viewBox="0 0 32 32"><g><rect y="0" style="fill:none;" width="32" height="32"/><path d="M14,17h14v-2H14V9L4,16l10,7V17z M7.488,15.96L12,12.841V19v0.079L7.488,15.96z"/></g></svg></span></button>';
		}

		options = $.extend(options, {
			speed: 400,
			prevArrow: navText.prev,
			nextArrow: navText.next,
			responsive: [
				{
					breakpoint: 1199,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3
					}
				},
				{
					breakpoint: 991,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2
					}
				},
				{
					breakpoint: 320,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
			]
		});

		$this.find( 'ul.products' ).slick( options );
	};



	/**
	 * Product carousel 2
	 */
	Ballylike.productCarousel2 = function() {
		if ( ! $.fn.slick ) {
			return;
		}

		$( '.Ballylike-product-carousel2' ).each( function() {
			var $carousel = $( this );

			var options = $carousel.data('slick'),
				navText = {};

			navText.prev = '<button type="button" class="slick-prev"><span class="svg-icon icon-left"><svg width="16px" height="16px" viewBox="0 0 16 16"><g><rect fill="none" width="16" height="16"/><g><polygon points="8.394,13.941 4.073,8 8.394,2.059 9.606,2.941 5.927,8 9.606,13.059"/></g></g></svg></span></button>';
			navText.next = '<button type="button" class="slick-next"><span class="svg-icon icon-right"><svg width="16px" height="16px" viewBox="0 0 16 16"><g><rect fill="none" width="16" height="16"/><g><polygon points="7.606,13.941 11.927,8 7.606,2.059 6.394,2.941 10.073,8 6.394,13.059"/></g></g></svg></span></button>';

			options = $.extend( options, {
				dots: false,
				arrows: true,
				speed: 400,
				slidesToShow: 1,
				slidesToScroll: 1,
				prevArrow: navText.prev,
				nextArrow: navText.next,
				variableWidth: true,
				touchThreshold: 10,
				responsive: [
					{
						breakpoint: 1279,
						settings: {
							slidesToShow: 1
						}
					}
				]
			});

			$carousel.find( 'ul.products' )
				.attr( 'dir', $(document.body).hasClass('rtl') ? 'rlt' : '' )
				.css( 'opacity', 0 )
				.on( 'init', function ( event ) {
					$( event.target ).css( 'opacity', 1 );
				} )
				.slick( options );
		} );
	};

	/**
	 * Initialize posts slider widget
	 */
	Ballylike.postsSlider = function() {

		$( '.posts-slider-widget .posts-slider' ).each( function() {
			var $carousel = $( this );

			Ballylike.sliderCarousel( $carousel );
		} );

		$( '#featured-content-carousel' ).each( function() {
			var $carousel = $( this );

			Ballylike.sliderCarousel( $carousel );
		} );
	};

	/**
	 *  Countdown
	 */
	Ballylike.countdown =function() {
		$( '.Ballylike-countdown' ).each( function () {
			var $el = $( this ),
				$timers = $el.find( '.timers' ),
				output = '';

			$timers.countdown( $timers.data( 'date' ), function ( event ) {
				output = '';
				var day = event.strftime( '%D' );
				for ( var i = 0; i < day.length; i++ ) {
					output += '<span>' + day[i] + '</span>';
				}
				$timers.find( '.day' ).html( output );

				output = '';
				var hour = event.strftime( '%H' );
				for ( i = 0; i < hour.length; i++ ) {
					output += '<span>' + hour[i] + '</span>';
				}
				$timers.find( '.hour' ).html( output );

				output = '';
				var minu = event.strftime( '%M' );
				for ( i = 0; i < minu.length; i++ ) {
					output += '<span>' + minu[i] + '</span>';
				}
				$timers.find( '.min' ).html( output );

				output = '';
				var secs = event.strftime( '%S' );
				for ( i = 0; i < secs.length; i++ ) {
					output += '<span>' + secs[i] + '</span>';
				}
				$timers.find( '.secs' ).html( output );
			} );
		} );
	};

	/**
	 * Toggle product tabs
	 */
	Ballylike.toggleProductTabs = function() {
		var $product = $( 'div.product' );

		if ( $product.hasClass( 'layout-v6' ) || $product.hasClass( 'layout-v7' ) ) {
			return;
		}

		$( document.body )
			.off( 'click', '.wc-tabs li a, ul.tabs li a' )
			.on( 'click', '.wc-tabs li a, ul.tabs li a', function( event ) {
				event.preventDefault();

				var $el = $( this ),
					$wrapper = $el.closest( '.wc-tabs-wrapper, .products-tabs' ),
					$tabs = $wrapper.find( '.wc-tabs, ul.tabs' ),
					$panels = $wrapper.find( '.panels' ),
					$target = $wrapper.find( $el.attr( 'href' ) );

				$tabs.find( 'li' ).removeClass( 'active' );
				$el.closest( 'li' ).addClass( 'active' );
				$panels.find( '.panel' ).show();
				$panels.fadeIn(200, function(){
					$target.addClass( 'open' );
				});


				$( document.body ).addClass( 'offcanvas-opened' );
			} )
			.on( 'click', '.products-tabs .backdrop, .products-tabs .button-close', function( event ) {
				event.preventDefault();

				var $wrapper = $( this ).closest( '.wc-tabs-wrapper, .products-tabs' ),
					$panels = $wrapper.find( '.panels' ),
					$opened = $panels.find( '.panel.open' );

				$opened.removeClass( 'open' );
				$wrapper.find( '.tabs' ).children( 'li' ).removeClass( 'active' );
				$panels.fadeOut();

				// Close the review form
				if ( $opened.is( '#tab-reviews' ) ) {
					$opened.find( '#review_form_wrapper' ).fadeOut();
					$opened.find( '#comments' ).fadeIn();
				}

				$( document.body ).removeClass( 'offcanvas-opened' );
			} )
			.on( 'keyup', function( e ) {
				if ( e.keyCode === 27 ) {
					var $wrapper = $( '.wc-tabs-wrapper, .products-tabs' ),
						$panels = $wrapper.find( '.panels' ),
						$opened = $panels.find( '.panel.open' );

					$opened.removeClass( 'open' );
					$wrapper.find( '.tabs' ).children( 'li' ).removeClass( 'active' );
					$panels.fadeOut();

					// Close the review form
					if ( $opened.is( '#tab-reviews' ) ) {
						$opened.find( '#review_form_wrapper' ).fadeOut();
						$opened.find( '#comments' ).fadeIn();
					}

					$( document.body ).removeClass( 'offcanvas-opened' );
				}
			} );

		// Remove active tab
		if ( ! window.location.hash ) {
			$product.find( '.wc-tabs, ul.tabs' ).first().find( 'li:first' ).removeClass( 'active' );
		} else {
			$product.find( '.wc-tabs, ul.tabs' ).first().find( 'li.active a' ).trigger( 'click' );
		}
	};

	Ballylike.singleProductV1 = function() {
		var $product = $( 'div.product.layout-v1' );

		// Prevent clicking on gallery image link.
		var $gallery = $product.find('.product-gallery');

		Ballylike.flexSlider($gallery);

		// Set top padding of product
		$product.css( {paddingTop: $( '#masthead' ).height()} );

		//Change background color
		if ( $product.hasClass( 'background-set' ) ) {
			Ballylike.productBackgroundFromGallery( $product );
		}
	} ;

	/**
	 * Set the product background similar to product gallery images
	 */
	Ballylike.productBackgroundFromGallery = function( $product ) {
		if ( typeof BackgroundColorTheif == 'undefined' ) {
			return;
		}

		var $gallery = $product.find( '.product-gallery' ),
			$image = $gallery.find( '.wp-post-image' ),
			imageColor = new BackgroundColorTheif();

		// Change background base on main image.
		$image.one( 'load', function() {
			setTimeout( function() {
				changeProductBackground( $image.get( 0 ) );
			}, 100 );
		} ).each( function() {
			if ( this.complete ) {
				$( this ).trigger( 'load' );
			}
		} );

		// Change background when slider change.
		setTimeout( function() {
			var slider = $gallery.data( 'flexslider' );

			if ( !slider ) {
				return;
			}

			slider.vars.before = function( slider ) {
				setTimeout( function() {
					changeProductBackground( slider.slides.filter( '.flex-active-slide' ).find( 'a img' ).get( 0 ) );
				}, 150 );
			};
		}, 150 );


		/**
		 * Change product backgound color
		 */
		function changeProductBackground( image ) {
			// Stop if this image is not loaded.
			if ( image.src === '' ) {
				return;
			}

			var rgb = imageColor.getBackGroundColor( image );
			$product.get( 0 ).style.backgroundColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
		}
	}

	/**
	 * Special functions for product layout v2.
	 * Enable zooming for gallery thumbnails.
	 * Make the summary sticky.
	 */
	Ballylike.singleProductV2 = function() {
		var $product = $( 'div.product.layout-v2' ),
			$gallery = $product.find('.product-gallery--mobile');

		if ( !$product.length ) {
			return;
		}

		var $window = $( window ),
			$summary = $product.find( '.summary' ),
			summarySticky = false;

		// Make product fullwidth
		Ballylike.productFullWidth( $product );

		//Slider Mobile
		Ballylike.flexSlider($gallery);

		// Sticky summary
		if ( $.fn.stick_in_parent ) {
			$summary.on( 'sticky_kit:bottom', function() {
				$( this ).parent().css( 'position', 'static' );
			} );

			stickySummary();

			$window.on( 'resize', stickySummary );
		}

		/**
		 * Sticky summary
		 */
		function stickySummary() {
			var  options = {};

			var offset = $('#masthead').height(),
				$topbar = $( '#topbar' );

			if ( $topbar.length ) {
				offset += $topbar.height();
			}

			options = {
				recalc_every: 1,
				offset_top: offset
			}

			if ( $window.width() > 991 ) {
				if ( ! summarySticky ) {
					$summary.stick_in_parent( options );
				}
				summarySticky = true;
			} else {
				$summary.trigger( 'sticky_kit:detach' );
				summarySticky = false;
			}
		}
	};

	/**
	 * Special functions for product layout v3.
	 * Change the height of product gallery.
	 */
	Ballylike.singleProductV3 = function() {
		var $product = $( 'div.product.layout-v3' ),
			$slider = $product.find('.product-gallery__wrapper');

		if ( !$product.length ) {
			return;
		}

		var $header = $( '#masthead' );

		Ballylike.sliderCarousel( $slider, true, false );

		// Set top padding of product
		$product.css( {paddingTop: $header.height()} );
		$( '.product-toolbar' ).css( {top: $header.height()} );

		// Set gallery height
		$( '.product-gallery__wrapper .product-gallery__image:eq(0) .wp-post-image' ).one( 'load', setGalleryHeight );

		setTimeout( function() {
			setGalleryHeight();
		}, 200 );

		$( window ).on( 'resize', setGalleryHeight );

		/**
		 * Set gallery height
		 */
		function setGalleryHeight() {
			var height = $( window ).height() - $header.outerHeight() - $( '#colophon' ).outerHeight() + 19,
				$topbar = $( '#topbar' ),
				$footer = $( '.footer-main' );

			if ( $topbar.length ) {
				height -= $topbar.outerHeight();
			}

			if ( $footer.length ) {
				height -= parseFloat( $footer.css( 'padding-top' ) );
			}

			$product.find( '.product-gallery' ).css( {
				maxHeight: height,
				height   : height
			} );
		}
	}

	Ballylike.sliderCarousel = function($carousel, $dots, $arrows) {
		if ( ! $.fn.slick ) {
			return;
		}

		var options = {
				adaptiveHeight: true,
				autoplay      : false,
				autoplaySpeed : 3000,
				dots: $dots,
				arrows: $arrows,
				prevArrow     : '<span class="slick-prev slick-arrow svg-icon icon-left icon-small"><svg width="16px" height="16px" viewBox="0 0 16 16"><g><rect fill="none" width="16" height="16"/><g><polygon points="8.394,13.941 4.073,8 8.394,2.059 9.606,2.941 5.927,8 9.606,13.059"/></g></g></svg></span>',
				nextArrow     : '<span class="slick-next slick-arrow svg-icon icon-right icon-small"><svg width="16px" height="16px" viewBox="0 0 16 16"><g><rect fill="none" width="16" height="16"/><g><polygon points="7.606,13.941 11.927,8 7.606,2.059 6.394,2.941 10.073,8 6.394,13.059"/></g></g></svg></span>'
			};

			if ( $carousel.hasClass( 'carousel' ) ) {
				options.infinite = false;
				options.slidesToShow = 3;
				options.slidesToScroll = 3;
				options.responsive = [
					{
						breakpoint: 991,
						settings  : {
							slidesToShow  : 2,
							slidesToScroll: 2
						}
					},
					{
						breakpoint: 767,
						settings  : {
							slidesToShow  : 1,
							slidesToScroll: 1
						}
					}
				];
			}else {
				if ( 'fade' === $carousel.data( 'effect' ) ) {
					options.fade = true;
				}
			};

			$carousel.slick(options);
	};

	Ballylike.singleProductV4 = function() {
		// Quantity dropdown

		if ( $.fn.quantityDropdown ) {
			$( 'div.product.layout-v4').find( '.quantity .qty' ).quantityDropdown();
		}

		if ( ! $.fn.slick ) {
			return;
		}

		var $product = $( 'div.product.layout-v4, div.product.layout-v6' ),
			$wrapper = $product.find('.product-gallery'),
			$silder = $wrapper.find('.product-gallery__wrapper'),
			$silderMobile = $product.find('.product-gallery__wrapper--mobile'),

			$nav = $wrapper.find('.flex-control-nav');

		$silder.slick({
		   autoplay: false,
		   pauseOnHover: true,
		   arrows: false,
		   dots: false,
		   infinite: false,
		   fade: false,
		   asNavFor: $nav
		});
		$nav.slick({
		   slidesToShow: 5,
		   vertical: true,
		   arrows: false,
		   dots: false,
		   infinite: false,
		   focusOnSelect: true,
		   asNavFor: $silder,
		});

		Ballylike.sliderCarousel($silderMobile, true, false);
	};

	/**
	 * Special functions for product layout v5.
	 */
	Ballylike.singleProductV5 = function() {
		var $product = $( 'div.product.layout-v5' ),
			$summary = $product.find( '.summary' ),
			$summaryInner = $summary.children( '.summary-inner' ),
			$gallery = $product.find('.product-gallery--mobile'),
			$window = $( window ),
			headerHeight = $( '#masthead' ).height(),
			summarySticky = false;

		if ( !$product.length ) {
			return;
		}

		// Make product fullwidth
		productWidth();

		$window.on( 'resize', function() {
			productWidth();
		} );

		// Set top padding of product
		$summary.css( {paddingTop: headerHeight} );
		$summaryInner.css( 'max-height', $window.height() - headerHeight );

		// Sticky summary
		if ( $.fn.stick_in_parent ) {
			$summaryInner
				.on( 'sticky_kit:bottom', function() {
					$( this ).closest( '.product-gallery-summary' ).addClass( 'summary-sticky-bottom' );
				} )
				.on( 'sticky_kit:unbottom', function() {
					$( this ).closest( '.product-gallery-summary' ).removeClass( 'summary-sticky-bottom' );
				} );

			setTimeout( function() {
				stickySummary();
			}, 100 );

			$window.on( 'resize', stickySummary );
		}

		Ballylike.flexSlider($gallery);

		/**
		 * Set product width
		 */
		function productWidth() {
			var width = $window.width(),
				bonus = width > 1440 ? 60 : 0;

			width -= Ballylike.getVerticalHeaderWidth();

			$product.width( width );

			$product.css( 'margin-left', -width / 2 );
			$summary.css( 'padding-right', width / 2 - $( '.Ballylike-container' ).width() / 2 + bonus );
		}

		/**
		 * Sticky summary
		 */
		function stickySummary() {
			var options = { parent: $product.get(0) };

			var offset = $('#masthead').height(),
				$topbar = $('#topbar');

			if ($topbar.length) {
				offset += $topbar.height();
			}

			options = {
				recalc_every: 1,
				offset_top: offset,
				parent: $product.get(0)
			}

			if ( $window.width() > 991 ) {
				if ( ! summarySticky ) {
					$summaryInner.stick_in_parent( options );
				}
				summarySticky = true;
			} else {
				$summaryInner.trigger( 'sticky_kit:detach' );
				summarySticky = false;
			}
		}
	};

	Ballylike.singleProductV7 = function() {
		if ( ! $.fn.slick ) {
			return;
		}

		var $product = $( 'div.product.layout-v7' ),
			$wrapper = $product.find('.product-gallery'),
			$silder = $wrapper.find('.product-gallery__wrapper'),
			$silderMobile = $product.find('.product-gallery__wrapper--mobile'),

			$nav = $wrapper.find('.flex-control-nav ');

		$silder.slick({
		   autoplay: false,
		   pauseOnHover: true,
		   arrows: false,
		   dots: false,
		   infinite: false,
		   fade: false,
		   asNavFor: $nav
		});
		$nav.slick({
		   slidesToShow: 5,
		   vertical: false,
		   arrows: false,
		   dots: false,
		   infinite: false,
		   focusOnSelect: true,
		   centerMode: false,
		   asNavFor: $silder,
		});

		Ballylike.sliderCarousel($silderMobile, true, false);
	};

	Ballylike.flexSlider = function($gallery) {
		$gallery.on( 'click', '.product-gallery__image a', function( event ) {
			event.preventDefault();
		} );

		// Init flex slider.
		if ( $gallery.find( '.product-gallery__image' ).length > 1 && $.fn.flexslider ) {
			$gallery.flexslider( {
				selector      : '.product-gallery__wrapper > .product-gallery__image',
				animation     : 'fade',
				animationLoop : false,
				animationSpeed: 500,
				controlNav    : true,
				directionNav  : false,
				prevText      : '<span class="svg-icon icon-left icon-small"><svg width="16" height="16"><svg width="16px" height="16px" viewBox="0 0 16 16"><g><rect fill="none" width="16" height="16"/><g><polygon points="8.394,13.941 4.073,8 8.394,2.059 9.606,2.941 5.927,8 9.606,13.059"/></g></g></svg></span>',
				nextText      : '<span class="svg-icon icon-right icon-small"><svg width="16px" height="16px" viewBox="0 0 16 16"><g><rect fill="none" width="16" height="16"/><g><polygon points="7.606,13.941 11.927,8 7.606,2.059 6.394,2.941 10.073,8 6.394,13.059"/></g></g></svg></span>',
				slideshow     : false,
				start         : function() {
					$gallery.css( 'opacity', 1 );
				},
			} );
		} else {
			$gallery.css( 'opacity', 1 );
		}
	};


	/**
	 * Make product full width
	 */
	Ballylike.productFullWidth = function( $product ) {
		var $window = $( window );

		// Set width of product
		changeProductWidth();

		$window.on( 'resize', function() {
			changeProductWidth();
		} );

		/**
		 * Change the product width
		 */
		function changeProductWidth() {
			var width = $window.width();

			width -= Ballylike.getVerticalHeaderWidth();

			$product.width( width );

			$product.css( 'marginLeft', -width/2 );
		}
	};

	/**
	 * Get the width of vertical header.
	 */
	Ballylike.getVerticalHeaderWidth = function() {
		var width = 0;

		if ( $( document.body ).hasClass( 'header-vertical' ) ) {
			var $header = $( '#masthead' );

			if ( $header.hasClass( 'header-v10' ) ) {
				$header = $header.find( '.header-main .header-left-items' );
			}

			if ( $header.is( ':visible' ) ) {
				width = $header.outerWidth();
			}

			return width;
		}

		return width;
	};

	/**
	 * Increase/decrease product quantity
	 */
	Ballylike.productQuantityButtons = function() {
		$( document.body ).on( 'click', '.quantity .increase, .quantity .decrease', function( event ) {
			event.preventDefault();

			var $this = $( this ),
				$qty = $this.siblings( '.qty' ),
				current = parseFloat( $qty.val() ),
				min = parseFloat( $qty.attr( 'min' ) ),
				max = parseFloat( $qty.attr( 'max' ) ),
				step = parseFloat( $qty.attr( 'step' ) );

			min = min ? min : 1;
			max = max ? max : current + 1;
			step = step ? step : 1;

			if ( $this.hasClass( 'decrease' ) && current > min ) {
				$qty.val( current - step );
				$qty.trigger( 'change' );
			}
			if ( $this.hasClass( 'increase' ) && current < max ) {
				$qty.val( current + step );
				$qty.trigger( 'change' );
			}
		} );
	};

	/**
	 * Show photoSwipe lightbox
	 */
	Ballylike.productGalleryLightbox = function () {
		var $images = $( '.product-gallery-summary .product-gallery' );

		if ( !$images.length ) {
			return;
		}

		$images.on( 'click', '.product-gallery__image', function ( e ) {
			e.preventDefault();
			imagesPhotoPopup( $( this ) );
		} );

		function imagesPhotoPopup( $this ) {
			var items = [],
				$links = $this.closest( '.product-gallery' ).find( '.product-gallery__image' );

			$links.each( function () {
				var $el = $( this );

				items.push( {
					src: $el.children( 'a' ).attr( 'href' ),
					w  : $el.find( 'img' ).attr( 'data-large_image_width' ),
					h  : $el.find( 'img' ).attr( 'data-large_image_height' )
				} );

			} );

			var index =  $links.index(),
				options = {
					index              : index,
					bgOpacity          : 0.85,
					showHideOpacity    : true,
					mainClass          : 'pswp--minimal-dark',
					barsSize           : { top: 0, bottom: 0 },
					captionEl          : false,
					fullscreenEl       : false,
					shareEl            : false,
					tapToClose         : true,
					tapToToggleControls: false
				};

			var lightBox = new PhotoSwipe( document.getElementById( 'pswp' ), window.PhotoSwipeUI_Default, items, options );
			lightBox.init();
		}
	};

	/**
	 * Handle product reviews
	 */
	Ballylike.reviewProduct = function() {
		$( document.body )
			.on( 'click', '.add-review', function( event ) {
					event.preventDefault();

					var $reviews = $( this ).closest( '#reviews' );

					$( '#review_form_wrapper', $reviews ).fadeIn();
					$( '#comments', $reviews ).fadeOut();
				} ).on( 'click', '.cancel-review a', function( event ) {
				event.preventDefault();

				var $reviews = $( this ).closest( '#reviews' );

				$( '#review_form_wrapper', $reviews ).fadeOut();
				$( '#comments', $reviews ).fadeIn();
			} )
			.on( 'click', '#respond p.stars a', function() {
				var $star   	= $( this ),
					$rating 	= $( this ).closest( '#respond' ).find( '#rating' ),
					$container 	= $( this ).closest( '.stars' );

				$rating.val( $star.text() );
				$star.siblings( 'a' ).removeClass( 'active' );
				$star.addClass( 'active' );
				$container.addClass( 'selected' );

				return false;
			} );

		$( '#review_form' )
			.on( 'focus', 'input, textarea', function() {
				$( this ).parent().addClass( 'focused' );
			} )
			.on( 'blur', 'input, textarea', function() {
				if ( $( this ).val() === '' ) {
					$( this ).parent().removeClass( 'focused' );
				}
			} )
			.find( 'input, textarea' ).each( function() {
			if ( $( this ).val() !== '' ) {
				$( this ).parent().addClass( 'focused' );
			}
		} );
	};

	Ballylike.variationProduct = function() {
		$( document.body )
			.on( 'click', '.tawcvs-swatches .swatch', function() {
				var $el  	= $( this ),
					$container 	= $( this ).closest( '.stars' );

				$el.siblings().removeClass( 'selected' );
				$el.addClass( 'selected' );

				return false;
			} );
	};

	Ballylike.map = function() {
		/**
		 * Google Maps.
		 */
		$( '.Ballylike-map' ).each( function() {
			var $map = $( this ),
				latitude = $map.data( 'lat' ),
				longitude = $map.data( 'lng' ),
				zoom = $map.data( 'zoom' ),
				marker_icon = $map.data( 'marker' ),
				info = $map.html();


			var mapOptions = {
				zoom             : zoom,
				disableDefaultUI : true,
				scrollwheel      : false,
				navigationControl: true,
				mapTypeControl   : false,
				scaleControl     : false,
				draggable        : true,
				center           : new google.maps.LatLng( latitude, longitude ),
				mapTypeId        : google.maps.MapTypeId.ROADMAP
			};

			switch ( $map.data( 'color' ) ) {
				case 'grey':
					mapOptions.styles = [{
						"featureType": "water",
						"elementType": "geometry",
						"stylers"    : [{"color": "#e9e9e9"}, {"lightness": 17}]
					}, {
						"featureType": "landscape",
						"elementType": "geometry",
						"stylers"    : [{"color": "#f5f5f5"}, {"lightness": 20}]
					}, {
						"featureType": "road.highway",
						"elementType": "geometry.fill",
						"stylers"    : [{"color": "#ffffff"}, {"lightness": 17}]
					}, {
						"featureType": "road.highway",
						"elementType": "geometry.stroke",
						"stylers"    : [{"color": "#ffffff"}, {"lightness": 29}, {"weight": 0.2}]
					}, {
						"featureType": "road.arterial",
						"elementType": "geometry",
						"stylers"    : [{"color": "#ffffff"}, {"lightness": 18}]
					}, {
						"featureType": "road.local",
						"elementType": "geometry",
						"stylers"    : [{"color": "#ffffff"}, {"lightness": 16}]
					}, {
						"featureType": "poi",
						"elementType": "geometry",
						"stylers"    : [{"color": "#f5f5f5"}, {"lightness": 21}]
					}, {
						"featureType": "poi.park",
						"elementType": "geometry",
						"stylers"    : [{"color": "#dedede"}, {"lightness": 21}]
					}, {
						"elementType": "labels.text.stroke",
						"stylers"    : [{"visibility": "on"}, {"color": "#ffffff"}, {"lightness": 16}]
					}, {
						"elementType": "labels.text.fill",
						"stylers"    : [{"saturation": 36}, {"color": "#333333"}, {"lightness": 40}]
					}, {"elementType": "labels.icon", "stylers": [{"visibility": "off"}]}, {
						"featureType": "transit",
						"elementType": "geometry",
						"stylers"    : [{"color": "#f2f2f2"}, {"lightness": 19}]
					}, {
						"featureType": "administrative",
						"elementType": "geometry.fill",
						"stylers"    : [{"color": "#fefefe"}, {"lightness": 20}]
					}, {
						"featureType": "administrative",
						"elementType": "geometry.stroke",
						"stylers"    : [{"color": "#fefefe"}, {"lightness": 17}, {"weight": 1.2}]
					}];
					break;

				case 'black':
					mapOptions.styles = [{
						"featureType": "all",
						"elementType": "labels.text.fill",
						"stylers"    : [{"saturation": 36}, {"color": "#000000"}, {"lightness": 40}]
					}, {
						"featureType": "all",
						"elementType": "labels.text.stroke",
						"stylers"    : [{"visibility": "on"}, {"color": "#000000"}, {"lightness": 16}]
					}, {
						"featureType": "all",
						"elementType": "labels.icon",
						"stylers"    : [{"visibility": "off"}]
					}, {
						"featureType": "administrative",
						"elementType": "geometry.fill",
						"stylers"    : [{"color": "#000000"}, {"lightness": 20}]
					}, {
						"featureType": "administrative",
						"elementType": "geometry.stroke",
						"stylers"    : [{"color": "#000000"}, {"lightness": 17}, {"weight": 1.2}]
					}, {
						"featureType": "landscape",
						"elementType": "geometry",
						"stylers"    : [{"color": "#000000"}, {"lightness": 20}]
					}, {
						"featureType": "poi",
						"elementType": "geometry",
						"stylers"    : [{"color": "#000000"}, {"lightness": 21}]
					}, {
						"featureType": "road.highway",
						"elementType": "geometry.fill",
						"stylers"    : [{"color": "#000000"}, {"lightness": 17}]
					}, {
						"featureType": "road.highway",
						"elementType": "geometry.stroke",
						"stylers"    : [{"color": "#000000"}, {"lightness": 29}, {"weight": 0.2}]
					}, {
						"featureType": "road.arterial",
						"elementType": "geometry",
						"stylers"    : [{"color": "#000000"}, {"lightness": 18}]
					}, {
						"featureType": "road.local",
						"elementType": "geometry",
						"stylers"    : [{"color": "#000000"}, {"lightness": 16}]
					}, {
						"featureType": "transit",
						"elementType": "geometry",
						"stylers"    : [{"color": "#000000"}, {"lightness": 19}]
					}, {
						"featureType": "water",
						"elementType": "geometry",
						"stylers"    : [{"color": "#000000"}, {"lightness": 17}]
					}];
					break;

				case 'vista-blue':
					mapOptions.styles = [{
						"featureType": "water",
						"elementType": "geometry",
						"stylers"    : [{"color": "#a0d6d1"}, {"lightness": 17}]
					}, {
						"featureType": "landscape",
						"elementType": "geometry",
						"stylers"    : [{"color": "#ffffff"}, {"lightness": 20}]
					}, {
						"featureType": "road.highway",
						"elementType": "geometry.fill",
						"stylers"    : [{"color": "#dedede"}, {"lightness": 17}]
					}, {
						"featureType": "road.highway",
						"elementType": "geometry.stroke",
						"stylers"    : [{"color": "#dedede"}, {"lightness": 29}, {"weight": 0.2}]
					}, {
						"featureType": "road.arterial",
						"elementType": "geometry",
						"stylers"    : [{"color": "#dedede"}, {"lightness": 18}]
					}, {
						"featureType": "road.local",
						"elementType": "geometry",
						"stylers"    : [{"color": "#ffffff"}, {"lightness": 16}]
					}, {
						"featureType": "poi",
						"elementType": "geometry",
						"stylers"    : [{"color": "#f1f1f1"}, {"lightness": 21}]
					}, {
						"elementType": "labels.text.stroke",
						"stylers"    : [{"visibility": "on"}, {"color": "#ffffff"}, {"lightness": 16}]
					}, {
						"elementType": "labels.text.fill",
						"stylers"    : [{"saturation": 36}, {"color": "#333333"}, {"lightness": 40}]
					}, {"elementType": "labels.icon", "stylers": [{"visibility": "off"}]}, {
						"featureType": "transit",
						"elementType": "geometry",
						"stylers"    : [{"color": "#f2f2f2"}, {"lightness": 19}]
					}, {
						"featureType": "administrative",
						"elementType": "geometry.fill",
						"stylers"    : [{"color": "#fefefe"}, {"lightness": 20}]
					}, {
						"featureType": "administrative",
						"elementType": "geometry.stroke",
						"stylers"    : [{"color": "#fefefe"}, {"lightness": 17}, {"weight": 1.2}]
					}];
					break;

				case 'blue':
					mapOptions.styles = [{
						"featureType": "administrative",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#444444"
							}
						]
					}, {
						"featureType": "landscape",
						"elementType": "all",
						"stylers": [
							{
								"color": "#f2f2f2"
							}
						]
					}, {
						"featureType": "poi",
						"elementType": "all",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					}, {
						"featureType": "road",
						"elementType": "all",
						"stylers": [
							{
								"saturation": -100
							},
							{
								"lightness": 45
							}
						]
					}, {
						"featureType": "road.highway",
						"elementType": "all",
						"stylers": [
							{
								"visibility": "simplified"
							}
						]
					},
					{
						"featureType": "road.arterial",
						"elementType": "labels.icon",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "transit",
						"elementType": "all",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					}, {
						"featureType": "water",
						"elementType": "all",
						"stylers": [
							{
								"color": "#b2d6eb"
							},
							{
								"visibility": "on"
							}
						]
					} ];
			}

			var map = new google.maps.Map( this, mapOptions );

			if ( marker_icon ) {
				var marker = new google.maps.Marker( {
					position : new google.maps.LatLng( latitude, longitude ),
					map      : map,
					icon     : marker_icon,
					animation: google.maps.Animation.DROP
				} );
			}

			if ( info ) {
				var infoWindow = new google.maps.InfoWindow( {
					content: '<div class="info_content">' + info + '</div>'
				} );

				if ( typeof marker === undefined ) {
					var marker = new google.maps.Marker( {
						position : new google.maps.LatLng( latitude, longitude ),
						map      : map,
						animation: google.maps.Animation.DROP
					} );
				}

				if ( typeof marker !== 'undefined' ) {
					marker.addListener( 'click', function () {
						infoWindow.open( map, marker );
					} );
				}
			}
		} );
	};

	Ballylike.select2Tool = function() {
		if ( ! $.fn.select2 ) {
			return;
		}
		$( '.Ballylike-select2' ).each( function() {
			$(this).select2({
				width  : $(this).hasClass('Ballylike-select2--full') ? '100%' : 'auto',
				minimumResultsForSearch: -1,
				dropdownCssClass       : 'products-quick-search-options',
			});
		});

		$( '.Ballylike-select2--small' ).each( function() {
			$(this).select2({
				width  : $(this).hasClass('Ballylike-select2--full') ? '100%' : 'auto',
				minimumResultsForSearch: -1,
				dropdownCssClass       : 'products-ordering',
				dropdownParent         : $(this).parent()
			});
		});
	};

	Ballylike.priceSlider = function() {
		$('.Ballylike-price-slider').each( function() {
			var $el 		= $(this),
				$valMin		= $el.data('min'),
				$valMax		= $el.data('max'),
				$currency	= $el.data('currency'),
				$content 	= $('#Ballylike-price-slider__inner'),
				$amount 	= $('#Ballylike-price-slider__amount');

			$content.slider({
				step: 10,
				range: true,
				min: $valMin,
				max: $valMax,
				values: [ $valMin, $valMax ],
				slide: function( event, ui ) {
					$amount.val( $currency + ui.values[ 0 ] + " - " + $currency + ui.values[ 1 ] );
				  }
			});

			$amount.val( $currency + $content.slider( "values", 0 ) + " - " + $currency + $content.slider( "values", 1 ) );
		});

	};

		/**
	 * Make the sidebar sticky
	 */
	Ballylike.stickySidebar = function() {
		if ( $.fn.stick_in_parent && $( window ).width() > 767 ) {
			$( '#secondary.sticky-sidebar' ).stick_in_parent();
		}

		// Recalculate after cart widget loaded via ajax.
		$( document.body ).on( 'wc_fragments_refreshed Ballylike_products_loaded', function() {
			$( document.body ).trigger( 'sticky_kit:recalc' );
		} );
	};

	Ballylike.productsTool = function() {
		// Proudcts filter.
		var $tools = $( '.products-tools' ),
		 	$filter = $tools.find( '#products-filter' );

		if ( $filter.length && $filter.hasClass( 'dropdown-panel' ) ) {
			setDropdownFilterPosition();

			$( window ).on( 'resize', setDropdownFilterPosition );
		}

		// Toggle products filter.
		$( document.body ).on( 'click', '.products-tools .toggle-filters[data-toggle="dropdown"]', function( event ) {
			event.preventDefault();

			$( $( this ).attr( 'href' ) ).fadeToggle( function() {
				$( this ).toggleClass( 'open' );
			} );
		} ).on( 'click', '.products-filter.dropdown-panel .button-close', function( event ) {
			event.preventDefault();

			$( this ).closest( '.products-filter' ).fadeOut( function() {
				$( this ).removeClass( 'open' );
			} );
		} );

		/**
		 * Set the correct position of dropdown filter.
		 */
		function setDropdownFilterPosition() {
			var $sidebar = $( '#secondary' ),
				windowWidth = $( window ).width();

			if ( windowWidth >= 992 ) {
				windowWidth -= Ballylike.getVerticalHeaderWidth();
			}

			$filter.width( windowWidth );

			// Check if there is a sidebar
			var prop = 'margin-left';

			if ( windowWidth >= 992 ) {
				if ( $sidebar.length ) {
					$filter.css(prop, -windowWidth / 2 - ($sidebar.outerWidth() / 2));
				} else {
					$filter.css(prop, -windowWidth / 2);
				}
			} else {
				$filter.css(prop, -windowWidth / 2);
			}
		};
	};

	/**
	 * Ajax load more products.
	 */
	Ballylike.loadMoreProducts = function() {
		// Handles click load more button.
		$( document.body ).on( 'click', '.products-navigation.ajax-navigation a', function( event ) {
			event.preventDefault();

			var $el = $( this );

			if ( $el.hasClass( 'loading' ) ) {
				return;
			}

			$el.addClass( 'loading' );
		} );

		// Infinite scroll.
		if ( $( document.body ).hasClass( 'products-nav-infinite' ) ) {
			var waiting = false,
				endScrollHandle;

			$( window ).on( 'scroll', function() {
				if ( waiting ) {
					return;
				}

				waiting = true;

				// clear previous scheduled endScrollHandle
				clearTimeout( endScrollHandle );

				infiniteScoll();

				setTimeout( function() {
					waiting = false;
				}, 100 );

				// schedule an extra execution of infiniteScoll() after 200ms
				// in case the scrolling stops in next 100ms.
				endScrollHandle = setTimeout( function() {
					waiting = false;
					infiniteScoll();
				}, 200 );
			} );
		}

		/**
		 * Infinite scroll handler.
		 */
		function infiniteScoll() {
			var $navigation = $( '.products-navigation.ajax-navigation' ),
				$button = $( 'a', $navigation );

			// When almost reach to the navigation.
			if ( Ballylike.isVisible( $navigation ) && $button.length && !$button.hasClass( 'loading' ) ) {
				$button.addClass( 'loading' );
			}
		}
	};

	/**
	 * Check if an element is in view-port or not
	 *
	 * @param jQuery el Targe element to check.
	 * @return boolean
	 */
	Ballylike.isVisible = function( el ) {
		if ( el instanceof jQuery ) {
			el = el[0];
		}

		if ( ! el ) {
			return false;
		}

		var rect = el.getBoundingClientRect();

		return rect.bottom > 0 &&
			rect.right > 0 &&
			rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
			rect.top < (window.innerHeight || document.documentElement.clientHeight);
	};

	/**
	 * Add wishlist counter
	 */
	Ballylike.addWishlist  = function() {
		$( '.add-to-wishlist-button' ).on( 'click', function( event ) {
			event.preventDefault();

			var $el = $( this );

			$el.addClass('loading');

			setTimeout(function(){
				$el.addClass('added').removeClass('loading');
			},1200);
		});

	};

	/**
	 * Add to cart
	 */
	Ballylike.addToCart  = function() {
		$( '.ajax_add_to_cart' ).on( 'click', function( event ) {
			event.preventDefault();

			var $el = $( this );

			if ($el.hasClass('added')) {
				$el.removeClass('added');
			}

			$el.addClass('loading');

			setTimeout(function(){
				$el.addClass('added').removeClass('loading');
			},1200);
		});
	};

	Ballylike.resetSelect = function() {
		var $el 		= $('.reset_variations'),
		 	$form 		= $el.closest('form'),
			$btn  		= $form.find('.single_add_to_cart_button'),
			$select  	= $form.find('select');

		 $el.click(function(event){
		 	event.preventDefault();

			$select.prop('selectedIndex',0);
			$el.addClass('hidden');

			setTimeout(function(){
				$btn.addClass('disabled');
			},500);

		})
	};

	/**
	 * Quick view modal.
	 */
	Ballylike.productQuickView = function() {
		var $productModal = $( '#quick-view-modal' ),
		 	$productPanel = $( '#quick-view-panel' ),
		 	$galleryM = $productModal.find('.product-gallery'),
		 	$galleryP = $productPanel.find('.product-gallery__wrapper');

		Ballylike.flexSlider($galleryM);
		Ballylike.sliderCarousel($galleryP);
	};

	/**
	 * Login & register tabs.
	 */
	Ballylike.loginTabs = function() {
		$( document.body ).on( 'click', '.login-tabs-nav .tab-nav', function( event ) {
			event.preventDefault();

			var $tab = $( this ),
				$panels = $tab.parent().siblings( '.u-columns' );

			if ( $tab.hasClass( 'active' ) ) {
				return;
			}

			$tab.addClass( 'active' ).siblings().removeClass( 'active' );
			$panels.children().eq( $tab.index() ).addClass( 'active' ).siblings().removeClass( 'active' );
		} );
	};

	/**
	 * Login & register tabs.
	 */
	Ballylike.variationsForm = function() {
		$( '.variations_form--check' ).each(  function(  ) {
			var $els = 		$(this),
				$select = 	$els.find('select'),
				$resetBtn = $els.find('.reset_variations'),
				btn = 		$els.find('.single_add_to_cart_button');

			btn.addClass('disabled');

			$select
				  .change(function() {
					$select.find( "option:selected" ).each(function() {
					   	 var $el 	= $(this),
				   	 		$parent = $el.parent(),
				   	 		$str 	= $el.val() ,
				   	 		$box1 	= $els.find('.variations-1'),
				   	 		$box2 	= $els.find('.variations-2');

					   	 if (  $str != '') {
							$parent.addClass('has-value');
							$resetBtn.removeClass('hidden');
						} else {
							$parent.removeClass('has-value');
							$resetBtn.addClass('hidden');
						}

						if ( $box1.hasClass('has-value') && $box2.hasClass('has-value') ) {
					   		btn.removeClass('disabled');
					   } else {
					   		btn.addClass('disabled');
					   }

					});

				  })
				  .trigger( "change" );
		} );
	};

	/**
	 * Portfolio mansonry
	 */


	Ballylike.portfolioMasonry = function () {
	 	var $portfolio = $( '.portfolio-projects--masonry' );

	 	if ( ! $portfolio.length ) {
			return;
		}

		var options = {
				itemSelector: '.portfolio',
				layoutMode: 'masonry'
			};

			$portfolio.isotope(options);
	};

	Ballylike.productsMasonry = function () {

	 	Ballylike.initProductsMasonry($( 'ul.products.layout-masonry' ));

	 	$( '.Ballylike-product-masonry ul.products' )
		.on( 'layoutComplete', function( event ) {
			var $container = $( event.currentTarget );

			if ( $container.closest( '.Ballylike-product-masonry' ).hasClass( 'has-heading' ) ) {
				var top = $container.children( ':nth-child(6)' ).css( 'top' );
				$container.children( ':nth-child(5)' ).css( 'top', top );
			}
		} );

	 	Ballylike.initProductsMasonry($( '.Ballylike-product-masonry ul.products' ));
	};

	Ballylike.initProductsMasonry = function ( $products ) {
		if ( ! $products.length ) {
			return;
		}

		// init Isotope
		var $grid = $products.isotope({
			itemSelector: '.product',
			  percentPosition: true,
			  masonry: {
				columnWidth: '.product-size'
			  }
		});
		$grid.isotope('layout');
	}

	/**
	 * Ajax load more posts.
	 */
	Ballylike.loadMorePosts = function() {
		if ( $( document.body ).hasClass( 'page-template-flex-posts' ) ) {
			return;
		}

		$( document.body ).on( 'click', '.navigation.next-posts-navigation a', function( event ) {
			event.preventDefault();

			var $el = $( this );

			if ( $el.hasClass( 'loading' ) ) {
				return;
			}

			$el.addClass( 'loading' );
		} );
	};

	/**
	 * Sticky social icon on page template Flex Posts.
	 */
	Ballylike.stickySocials = function() {
		var $footer = $( '#colophon' ),
			$socials = $( '#sticky-socials' ),
			$window = $( window ),
			waiting = false,
			endScrollHandle;

		if ( !$socials.length ) {
			return;
		}

		toggleSocials();

		$window.on( 'scroll', function() {
			if ( waiting ) {
				return;
			}

			if ( $window.width() < 1440 ) {
				return;
			}

			waiting = true;

			// clear previous scheduled endScrollHandle
			clearTimeout( endScrollHandle );

			toggleSocials();

			setTimeout( function() {
				waiting = false;
			}, 100 );

			// schedule an extra execution of toggleSocials() after 200ms
			// in case the scrolling stops in next 100ms.
			endScrollHandle = setTimeout( function() {
				waiting = false;
				toggleSocials();
			}, 200 );
		} );

		/**
		 * Toggle social icons on footer.
		 */
		function toggleSocials() {
			if ( $window.scrollTop() + $window.height() >= $footer.offset().top - 200 ) {
				$socials.fadeOut();
			} else {
				$socials.fadeIn();
			}
		}
	};

	/**
	 * Back to top icon
	 */
	Ballylike.backToTop = function () {
		var $button = $( '#gotop' ),
			$window = $( window ),
			waiting = false,
			endScrollHandle;

		$button.on( 'click', function ( e ) {
			e.preventDefault();

			$( 'html, body' ).animate( {scrollTop: 0}, 800 );
		} );

		if ( $button.length ) {
			toggleButton();

			$window.on( 'scroll', function() {
				if ( waiting ) {
					return;
				}

				waiting = true;

				// clear previous scheduled endScrollHandle
				clearTimeout( endScrollHandle );

				toggleButton();

				setTimeout( function() {
					waiting = false;
				}, 100 );

				// schedule an extra execution of toggleArrow() after 200ms
				// in case the scrolling stops in next 100ms.
				endScrollHandle = setTimeout( function() {
					waiting = false;
					toggleButton();
				}, 200 );
			} );
		}

		/**
		 * Toggle the button when scrolling
		 */
		function toggleButton() {
			if ( $window.scrollTop() < $window.height() * 1.5 ) {
				$button.fadeOut();
			} else {
				$button.fadeIn();
			}
		}
	};

	Ballylike.scrollDown = function() {
		var $window = $( window ),
			$scrollDown = $( '.Ballylike-sliders-scrolldown' );

		$scrollDown.on( 'click', function( e ) {
			e.preventDefault();

			$( 'html, body' ).animate( {scrollTop: $window.scrollTop() + $window.height()}, 800 );
		} );
	}

	/**
	 * Scroll down arrow sticky.
	 * This arrow appears on flex posts template and portfolio page.
	 */
	Ballylike.stickyScrollDown = function() {
		var $window = $( window ),
			$arrow = $( '.sticky-scrolldown, .scroll' ),
			waiting = false,
			endScrollHandle,
			offset = $( '#masthead' ).height();

		if ( !$arrow.length ) {
			return;
		}

		$arrow.on( 'click', function() {
			$( 'html, body' ).animate( {scrollTop: $window.scrollTop() + $window.height()}, 800 );
		} );

		toggleArrow();

		$window.on( 'scroll', function() {
			if ( waiting ) {
				return;
			}

			if ( $window.width() < 1440 ) {
				return;
			}

			waiting = true;

			// clear previous scheduled endScrollHandle
			clearTimeout( endScrollHandle );

			toggleArrow();

			setTimeout( function() {
				waiting = false;
			}, 100 );

			// schedule an extra execution of toggleArrow() after 200ms
			// in case the scrolling stops in next 100ms.
			endScrollHandle = setTimeout( function() {
				waiting = false;
				toggleArrow();
			}, 200 );
		} );

		/**
		 * Toggle social icons on footer.
		 */
		function toggleArrow() {
			if ( $window.scrollTop() >= offset ) {
				$arrow.fadeOut();
			} else {
				$arrow.fadeIn();
			}
		}
	};

	/**
	 * Init masonry layout for template Flex Posts.
	 */
	Ballylike.pageTemplateFlexPosts = function() {
		var $posts = $( '#flex-posts' );

		if ( !$posts.length) {
			return;
		}

		// Add class left-item and right-item
		$posts.on( 'layoutComplete', function( event ) {
			var $items = $posts.children();

			$items.filter( function() {
				return parseInt( $( this ).get( 0 ).style.left ) === 0;
			} ).removeClass( 'right-item' ).addClass( 'left-item' );

			$items.filter( function() {
				return $( this ).get( 0 ).style.left === '50%';
			} ).removeClass( 'left-item' ).addClass( 'right-item' );
		} );

		initFlexPostsMasonry();

		// Ajax load more posts
		$( 'body.page-template-flex-posts' ).on( 'click', '.navigation.next-posts-navigation a', function( event ) {
			event.preventDefault();

			var $el = $( this );

			if ( $el.hasClass( 'loading' ) ) {
				return;
			}

			$el.addClass( 'loading' );
		} );

		if ( typeof ScrollTrigger !== undefined ) {
			$posts.children().attr( 'data-scroll', '' ).addClass( 'animated' );

			var trigger = new ScrollTrigger( {
				toggle: {
					visible: 'BallylikeFadeInUp',
					hidden : ''
				},
				offset: {
					x: 0,
					y: -20
				},
				once  : true
			}, document.body, window );
		}

		/**
		 * Init flex posts masonry
		 */
		function initFlexPostsMasonry() {
			 var options_masonry = {
				itemSelector: '.flex_post',
				percentPosition:    true,
				transitionDuration: 0,
				layoutMode: 'masonry'
			};

			$posts.isotope(options_masonry);
		}
	};

	Ballylike.sliders = function() {
		if ( ! $.fn.slick ) {
			return;
		}

		$( '.Ballylike-sliders' ).each( function () {
			var $el = $( this ),
				options = $el.data('slider_options'),
				navStyle = $el.data('nav_style'),
				$wrapper = $el.closest('.Ballylike-sliders-wrapper'),
			 	$arrow_wrapper  = $wrapper.find( '.arrows-inner' ),
			 	$box_control  = $wrapper.find( '.Ballylike-sliders-wrapper__control-box' ),
				navText = {};

			if ('angle' === navStyle) {
				navText.prev = '<button type="button" class="slick-prev product-carousel-arrow"><span class="svg-icon icon-left"><svg width="16px" height="16px" viewBox="0 0 16 16"><g><rect fill="none" width="16" height="16"/><g><polygon points="8.394,13.941 4.073,8 8.394,2.059 9.606,2.941 5.927,8 9.606,13.059"/></g></g></svg></span></button>';
				navText.next = '<button type="button" class="slick-next product-carousel-arrow"><span class="svg-icon icon-right"><svg width="16px" height="16px" viewBox="0 0 16 16"><g><rect fill="none" width="16" height="16"/><g><polygon points="7.606,13.941 11.927,8 7.606,2.059 6.394,2.941 10.073,8 6.394,13.059"/></g></g></svg></span></button>';
			} else {
				navText.prev = '<button type="button" class="slick-prev product-carousel-arrow"><span class="svg-icon icon-arrow-left"><svg viewBox="0 0 32 32"><g><rect y="0" style="fill:none;" width="32" height="32"/><path d="M14,17h14v-2H14V9L4,16l10,7V17z M7.488,15.96L12,12.841V19v0.079L7.488,15.96z"/></g></svg></span></button>';
				navText.next = '<button type="button" class="slick-next product-carousel-arrow"><span class="svg-icon icon-arrow-left"><svg viewBox="0 0 32 32"><g><rect y="0" style="fill:none;" width="32" height="32"/><path d="M14,17h14v-2H14V9L4,16l10,7V17z M7.488,15.96L12,12.841V19v0.079L7.488,15.96z"/></g></svg></span></button>';
			}

			options = $.extend(options, {
				prevArrow: navText.prev,
				nextArrow: navText.next,
				appendArrows : $arrow_wrapper,
				fade         : options.fade,
				cssEase		 : options.fade ? 'ease-out' : '',
				pauseOnHover : options.pauseOnHover,
				responsive: [
					{
						breakpoint: 767,
						settings: {
							arrows: $wrapper.is('.arrow-bottom, .arrow-bottom-right') ? true : false,
							dots: $wrapper.is('.arrow-bottom, .arrow-bottom-right') ? false : true,
						}
					}
				]
			});

			var animation   = $el.data( 'animation' ),
				timeout     = $el.data('content-delay');

			if ( $wrapper.hasClass('has-control-box')) {
				$el.slick({
				   autoplay: false,
				   pauseOnHover: true,
				   arrows: false,
				   dots: false,
				   infinite: false,
				   fade: false,
				   asNavFor: $box_control
				});
				$box_control.slick({
				   slidesToShow: 5,
				   arrows: false,
				   dots: false,
				   infinite: false,
				   focusOnSelect: true,
					responsive: [
						{
							breakpoint: 767,
							settings: {
								arrows: false,
								dots:  true,
							}
						}
					],
				   asNavFor: $el
				});
			} else {
				$el.not( '.slick-initialized' ).slick( options);
			}

			if (!$wrapper.hasClass('dots-right-bottom')) {
				$el.find('.slick-dots').addClass('Ballylike-container-fluid');
			}

			if ($wrapper.hasClass('scroll-slick')) {

				$el.on('wheel', (function(e) {
				  e.preventDefault();

				  if (e.originalEvent.deltaY < 0) {
					$(this).slick('slickNext');
				  } else {
					$(this).slick('slickPrev');
				  }
				}));
			}

			if ( animation ) {
				$el
				.on( 'beforeChange', function () {
					var $sliderContent = $el.find( '.Ballylike-sliders__content' ).children();

					$sliderContent.removeClass( 'animated' + ' ' + animation ).fadeTo( 0, 0 );

				} )
				.on( 'afterChange', function ( event, slick, currentSlide ) {
					var $currentSlide = $( slick.$slides.get( currentSlide ) ).find( '.Ballylike-sliders__content').children();

					$currentSlide.each(function () {
						var $i = $(this).index();
						setTimeout( function () {
							var    $currentSlideEl = $( slick.$slides.get( currentSlide ) ).find( '.Ballylike-sliders__content').children().eq($i);
							$currentSlideEl.fadeTo( 100, 1 ).addClass( 'animated' + ' ' + animation );
						}, timeout*1000 + ($i-1)*500);
					});
				} );
			}
		} );
	};

	/**
	 * Scripts for page template "split.php"
	 */
	Ballylike.pageTemplateSplit = function() {
		if ( !$( document.body ).hasClass( 'page-template-split' ) ) {
			return;
		}

		var $window = $( window ),
			$topbar = $( '#topbar' ),
			ps = null;

		// Scrollbar.
		if ( $window.width() >= 992 ) {
			ps = new PerfectScrollbar( $( '.split-page-content .entry-content' ).get( 0 ) );
		}

		// Full height.
		$window.on( 'resize', function() {
			$( '.split-page.page' ).height( fullHeight() );

			if ( $window.width() < 992 ) {
				if ( ps ) {
					ps.destroy();
				}

				ps = null;
			} else {
				ps = new PerfectScrollbar( $( '.split-page-content .entry-content' ).get( 0 ) );
			}
		} );

		$( '.split-page.page' ).height( fullHeight() );

		/**
		 * Get the windown height.
		 */
		function fullHeight() {
			var height = $window.height();

			if ( $topbar.length ) {
				height -= $topbar.outerHeight();
			}

			return height;
		}
	};

	/**
	 * Using Ajax for add to cart button on single product page.
	 */
	Ballylike.singleProductAjaxAddToCart = function() {
		$( document.body ).on( 'submit', 'form.cart', function() {
			var $form = $( this ),
				$button = $form.find( '.single_add_to_cart_button' );

			if ( $form.closest( 'div.product' ).hasClass( 'product-type-external' ) ) {
				return;
			}

			$button.removeClass( 'added' ).addClass( 'loading disabled' ).prop( 'disabled', true );

			return false;
		} );
	};

	/**
	 * Using Ajax for add to cart button on single product page.
	 */
	Ballylike.BallylikeToggle = function() {

		$('.Ballylike-toggle').each(function(){
			var el = $(this),
				$btn = el.find('.Ballylike-toggle__btn'),
				$content = el.find('.Ballylike-toggle__content');

			$('.Ballylike-toggle__content').hide();

			$btn.on('click', function(e){
				e.preventDefault();
				$(this).siblings('.Ballylike-toggle__content').slideToggle();
			});
		});
	};

	/**
	 * Proudcts quick search.
	 */
	Ballylike.productsQuickSearch = function() {
		var $form = $( '.products-quick-search-form' );

		if ( $.fn.select2 ) {
			$form.find( 'select' ).select2( {
				width                  : 'auto',
				minimumResultsForSearch: -1,
				dropdownCssClass       : 'products-quick-search-options'
			} ).on( 'select2:change', function() {
				$form.addClass( 'changed' );
			} );
		}

		$form.find( 'select' ).on( 'change', function() {
			$form.addClass( 'changed' );
		} );
	};

	/**
	 * Proudcts carousel layout.
	 */
	Ballylike.productsCarousel = function() {
		var $container = $( '.products-carousel' );

		if ( !$container.length ) {
			return;
		}

		$container.find( 'ul.products li.product' ).addClass( 'swiper-slide' );

		var carousel = new Swiper( '.products-carousel', {
			loop         : false,
			slidesPerView: 4,
			spaceBetween : 40,
			scrollbar    : {
				el       : '.swiper-scrollbar',
				hide     : false,
				draggable: true
			},
			on           : {
				init: function() {
					$container.css( 'opacity', 1 );
				}
			},
			breakpoints  : {
				1199: {
					slidesPerView: 3
				},
				991 : {
					slidesPerView: 2
				},
				320 : {
					slidesPerView: 1
				}
			}
		} );

		var loadingHolder = document.createElement( 'li' );

		$( loadingHolder )
			.addClass( 'swiper-slide loading-placeholder' )
			.css( {height: carousel.height - 140} )
			.append( '<span class="spinner"></span>' );

		carousel.appendSlide( loadingHolder );
	};

	Ballylike.getWsection_stretch_left =function(){
		$('.section_stretch_left_no_padding').each(function(){
			$(this).css( {
				paddingRight: 0,
				paddingLeft: 0,
				width: $(this).width() + $(this).position().left,
				left: - $(this).position().left,
				position: 'relative'
			} ).trigger( 'resize' );
		});

		$( '.section_stretch_half_left_no_padding' ).each(function(){
			var left = ( $( window ).width() - $(this).width() ) / 2;
			$(this).css( {
				paddingRight: 0,
				paddingLeft: 0,
				width: $(this).width() + left,
				left: - left,
				position: 'relative'
			} ).trigger( 'resize' );
		});;
	};

	Ballylike.carouselTestimonial =function(){
		if ( ! $.fn.slick ) {
			return;
		}

		$('.Ballylike-testimonial-carousel').each(function(){
			var item = $(this).find('.Ballylike-testimonial-carousel__photos'),
				btn  = $(this).find('.Ballylike-testimonial-carousel__testimonials');

			item.slick( {
				arrows: false,
				fade: true,
				asNavFor: btn
			} );

			btn.slick( {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
				dots: true,
				asNavFor: item
			} );
		});

	};

	/**
	 *    Fire when document ready
	 */
	$( function() {
		Ballylike.init();
	} );
})( jQuery );
