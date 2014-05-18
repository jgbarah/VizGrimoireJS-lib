

(function ( $ ) {

    cachedDocuments = Documents.promisesCachedDocuments();

    /**
     * jQuery plugin function for inserting content from a template in an
     * HTML element.
     */
    $.fn.template = function( url, selector ) {
	var element = this;
	if (typeof selector === 'undefined') {
	    // No selector, all document is to be used
	    cachedDocuments(url).done( function( content ) {
		element.html( content );
	    });
	} else {
	// Only the content of selector is to be used
	    cachedDocuments(url).done( function( content ) {
		console.log( selector );
		console.log( $( content ).find ( selector ).html());
		text = $( content ).find ( selector ).html();
		element.html( text );
	    });
	}
    }

}( jQuery ));
