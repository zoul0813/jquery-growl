/*
* jQuery Growl plugin
* Version 1.1.0
* @requires jQuery v1.3.2 or later
*
* Examples at: http://fragmentedcode.com/jquery-growl
* Copyright (c) 2008-2013 David Higgins
* 
* Special thanks to Daniel Mota for inspiration:
* http://icebeat.bitacoras.com/mootools/growl/
*/

(function($) {

	// default settings for $.growl
	var settings = {
		growlVersion: '1.1.0',
		dockTemplate: '<div></div>',
		dockDefaultCss: {
			position: 'fixed',
			top: '10px',
			right: '10px',
			width: '300px',
			zIndex: 50000
		},
		dockCss: {},
		noticeTemplate: 
			'<div class="notice">' +
			' <h3 style="margin-top: 15px"><a rel="close">%title%</a></h3>' +
			' <p>%message%</p>' +
			'</div>',
		noticeDefaultCss: {
			backgroundColor: 'rgba(100, 100, 100, 0.75)',
			color: '#ffffff'
		},
		noticeCss: {},
		noticeDisplay: function(notice) {
			notice.css({'opacity':'0'}).fadeIn(settings.noticeFadeTimeout);
		},
		noticeRemove: function(notice, callback) {
			notice.animate({opacity: '0', height: '0px'}, {duration:settings.noticeFadeTimeout, complete: callback});
		},
		noticeFadeTimeout: 'slow',
		displayTimeout: 3500,
		defaultImage: 'growl.jpg',
		defaultStylesheet: null,
		noticeElement: function(el) {
			$.growl.settings.noticeTemplate = $(el);
		}	
	};

	var methods = {
		// $.growl('init', {dockTemplate:'<span></span>'});
		init: function(options) {
			// extend/override default settings
			settings = $.extend(settings, options);
		},
		// $.growl('notify', {title:'Title',,message:'Message',image:'image.png',priority:'high'})
		notify: function(options) {
			var opts = $.extend(settings, options);
			
			var instance = $('#growlDock');
			if(!instance || instance.length < 1) {
				instance = $(settings.dockTemplate)
					.css(settings.dockDefaultCss)
					.css(settings.dockCss)
					.attr('id', 'growlDock')
					.addClass('growl');
				if(settings.defaultStylesheet) {
					$('head').append('<link rel="stylesheet" type="text/css" href="' + settings.defaultStylesheet + '" />');
				}
				$('body').append(instance.css(settings.dockCss));
			}
			
			function r(text, expr, val) {
				while(expr.test(text)) {
					text = text.replace(expr, val);
				}
				return text;
			};
			
			var html = settings.noticeTemplate;
			if(typeof(html) == 'object') html = $(html).html();
			html = r(html, /%message%/, (opts.message?opts.message:''));
			html = r(html, /%title%/, (opts.title?opts.title:''));
			html = r(html, /%image%/, (opts.image?opts.image:settings.defaultImage));
			html = r(html, /%priority%/, (opts.priority?opts.priority:'normal'));

			var notice = $(html)
				.hide()
				.css(settings.noticeDefaultCss)
				.css(settings.noticeCss)
				.fadeIn(settings.notice);;

			settings.noticeDisplay(notice);
			instance.append(notice);
			$('a[rel="close"]', notice).click(function() {
				notice.remove();
			});
			if (settings.displayTimeout > 0) {
				setTimeout(function(){
					settings.noticeRemove(notice, function(){
						notice.remove();
					});
				}, settings.displayTimeout);
			}
		},
	};

	$.extend({
		growl: function( method ) {
			if ( methods[method] ) {
				return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
			} else if ( typeof method === 'object' || ! method ) {
				return methods.init.apply( this, arguments );
			} else {
				$.error( 'Method ' +  method + ' does not exist on jQuery.growl' );
			}
		}
	});
})(jQuery);