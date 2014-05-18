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
 * @fileOverview Handling of remote documents.
 * @author <a href="mailto:jgb@bitergia.com">Jesus M. Gonzalez-Barahona</a>
 */

if (Documents === undefined) var Documents = {};

(function() {

    // Public API
    Documents.promisesCachedDocuments = promisesCachedDocuments;

    // Implementation
    /**
     * Creates an object for caching remote files, accessible through url.
     *
     * Example of use:
     *   cachedDocuments = promisesCachedDocuments();
     *   cachedDocuments( url ).done( function (data) {...}) 
     */
    function promisesCachedDocuments() {
	/**
	 * Cache of remote documents. Key is url, value is content.
	 */
	var documents = {};

	/**
	 * Deferred objects for accessing documents. Key is url, value is a deferred.
	 *
	 * For each url, a deferred is used to avoid multiple simulatenous GET
	 * operations: while one is on the works, we just wait at a promise for
	 * the corresponding deferred. When the GET ends, all promises are fired.
	 */
	var deferred = {};

	/**
	 * Get a promise to obtain a document, via HTTP GET, from a url.
	 */
	function getDocument( url ) {
	    var deferred = $.Deferred();
	    var get_url = $.get ( url );
	    get_url.done ( function( content ) {
		Report.log ( "getDocument(): Document received " + url );
		deferred.resolve( content );
	    });
	    return deferred.promise();
	}

	/**
	 * Obtain a promise for getting a document via HTTP GET.
	 *
	 * If document is already in chache:
	 *   Just fire the corresponding deferred and return a promise
	 * Else if we already have a deferred for it:
	 *   We're already getting the document, just return a promise
	 * Else:
	 *   Create a new deferred, start the downloaed, and return a promise
	 *
	 * @param {string} url - Url to GET document from
	 * @returns {jQuery Promise} - Promise to get the document content
	 */
	function obtainPromise( url ) {
	    if ( url in documents ) {
		// We already have the document, should have the deferred too. 
		Report.log ( "promisesCachedDocuments(): " +
			     "Document in cache " + url );
		deferred[url].resolve ( documents[url] );
	    } else if ( url in deferred ) {
		// We found a deferred, so we already started to get the document.
		// Nothing else to do.
		Report.log( "promisesCachedDocuments(): " +
			    "Already getting document, no new deferred for " +
			    url);
	    } else {
		// No deferred, so create a new one, and start GET.
		deferred[url] = $.Deferred();
		Report.log( "promisesCachedDocuments(): " +
			    "Created new deferred for getting document" + url );
		getDocument( url ).then(
		    function(document) {
			Report.log( "promisesCachedDocuments(): " +
				    "Received document " + url );
			documents[url] = document;
			deferred[url].resolve ( document );
		    });
	    }
	    return deferred[url].promise();
	}
	return obtainPromise;
    }

})();
