/* 
 * Copyright (C) 2014 Bitergia
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 *
 * This file is a part of the VizGrimoireJS-lib package
 */

/**
 * @fileOverview jQuery plugin for (very) simple handling of templates.
 * @author <a href="mailto:jgb@bitergia.com">Jesus M. Gonzalez-Barahona</a>
 */

(function ( $ ) {

    cachedDocuments = Documents.promisesCachedDocuments();

    /**
     * jQuery plugin function for inserting content from a template in an
     * HTML element.
     *
     * @param {string} url - Url to get template from.
     * @param {string} url - Selector of element to be extracted from
     *   template. If none, all the template is extracted.
     *
     * Examples: 
     *   * All content in template.html to #navbar element:
     *     $( "#navbar" ).template( "template.html");
     *   * Content in #footer element in template.html to #thefooter element:
     *     $( "#thefooter" ).template( "template.html", "#footer");
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
