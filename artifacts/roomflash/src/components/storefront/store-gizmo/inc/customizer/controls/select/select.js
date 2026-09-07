;( function( $ ) {

 	'use strict';

 	wp.customize.controlConstructor['shopwell-select'] = wp.customize.Control.extend({

		ready: function() {

			'use strict';

			var control = this;

			if ( control.params.is_select2 ) {

				// Prepare select2 config
				var select2Config = {
					placeholder: control.params.placeholder ?? shopwell_customizer_localized.strings.select_category,
					allowClear: true,
					minimumInputLength: 0,
					width: '100%'
				};

				var ajaxUrl = ( typeof shopwell_customizer_localized !== 'undefined' && shopwell_customizer_localized.ajaxurl ) ? shopwell_customizer_localized.ajaxurl : ajaxurl;
				var nonce = control.params.nonce || ( typeof shopwell_customizer_localized !== 'undefined' ? shopwell_customizer_localized.wpnonce : '' );

				if ( control.params.data_source ) {
				select2Config.ajax = {
					url: ajaxUrl,
					type: 'POST',
					dataType: 'json',
					delay: 250,
					data: function( params ) {
						return {
							action: 'shopwell_load_select2_data',
							search: params.term || '',
							page: params.page || 1,
							data_source: control.params.data_source,
							data_source_name: control.params.data_source_name,
							nonce: nonce
						};
					},
					processResults: function( data, params ) {
						params.page = params.page || 1;

						if ( data.success && data.data && data.data.results ) {
							return {
								results: data.data.results,
								pagination: {
									more: data.data.pagination && data.data.pagination.more ? data.data.pagination.more : false
								}
							};
						}

						return {
							results: []
						};
					},
					cache: true,
					error: function(error) {
						console.error( shopwell_customizer_localized.strings.error_loading_data, error );
					}
				};
			}

				// Init select2
				control.container.find( '.shopwell-select-control' ).select2( select2Config );

				// Handle select2 changes
				control.container.on( 'select2:select select2:unselect select2:clear', '.shopwell-select-control', function() {
					var value = $( this ).val();

					if ( ! value || value.length === 0 ) {
						control.setting.set( control.params.multiple ? [] : '' );
					} else {
						control.setting.set( value );
					}
				});

			} else {
				// Regular select: no special handling needed, just sanitize on change
				control.container.on( 'change', '.shopwell-select-control', function() {
					var value = $( this ).val();
					control.setting.set( value );
				});
			}

		}

	});

}( jQuery ) );


