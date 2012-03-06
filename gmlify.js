/*
 * jQuery Bookmarklet - version 1.0
 * Originally written by: Brett Barros
 * With modifications by: Paul Irish
 *
 * If you use this script, please link back to the source
 *
 * Copyright (c) 2010 Latent Motion (http://latentmotion.com/how-to-create-a-jquery-bookmarklet/)
 * Released under the Creative Commons Attribution 3.0 Unported License,
 * as defined here: http://creativecommons.org/licenses/by/3.0/
 *
 */
 
window.bookmarklet = function(opts){fullFunc(opts)};
 
// These are the styles, scripts and callbacks we include in our bookmarklet:
window.bookmarklet({
 
    threejs:['https://raw.github.com/mrdoob/three.js/master/build/Three.js'],
    js:['https://raw.github.com/feesta/GMLify/master/gmlify_3drender.js'],    
    ready:function(){
		// The meat of your jQuery code goes here
		// $("body").html("Hello World");
	    $("<div id='gmlify_loader'>Downloading GML... please wait.</div>").css({
	        position:'fixed',
	        left:0,
	        top:0,
	        'font-size':18,
	        padding:10,
	        'font-family':'Helvetica',
	        'font-weight':'bold',
	        color:'black',
	        'background-color':'white',
	        'z-index':999999999999
	    }).appendTo("body");

		$('a').click(function(){
			var href = $(this).attr('href');
		    console.info('a click: ' + href);
		    var callback = function(){
		    	location.href = href;
		    	// console.info('click');
		    };
		    renderGML(callback);
		    return false;
		});


		getGMLJSON();
   	}
})
 
function fullFunc(a){function d(b){if(b.length===0){a.ready();return false}$.getScript(b[0],function(){d(b.slice(1))})}function e(b){$.each(b,function(c,f){$("<link>").attr({href:f,rel:"stylesheet"}).appendTo("head")})}a.jqpath="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js";(function(b){var c=document.createElement("script");c.type="text/javascript";c.src=b;c.onload=function(){e(a.threejs);d(a.js)};document.body.appendChild(c)})(a.jqpath)};
