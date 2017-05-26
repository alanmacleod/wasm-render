(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Stats = factory());
}(this, (function () { 'use strict';

/**
 * @author mrdoob / http://mrdoob.com/
 */

 navigator.sayswho= (function(){
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();



var Stats = function (clickHandler) {

	var mode = 0;

	var container = document.createElement( 'div' );
	container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.7;z-index:10000';
	container.addEventListener( 'click', function ( event ) {

		event.preventDefault();
		// showPanel( ++ mode % container.children.length );

    if (clickHandler)
      clickHandler();

	}, false );


	//

	function addPanel( panel ) {

		container.appendChild( panel.dom );
		return panel;

	}

	function showPanel( id ) {

		for ( var i = 0; i < container.children.length; i ++ ) {

			container.children[ i ].style.display = i === id ? 'block' : 'none';

		}

		mode = id;

	}

	//

	var beginTime = ( performance || Date ).now(), prevTime = beginTime, frames = 0;

	var fpsPanel = addPanel( new Stats.Panel( 'FPS', '#0ff', '#002' ) );
	var msPanel = addPanel( new Stats.Panel( 'MS', '#000', '#060' ) );

	if ( self.performance && self.performance.memory ) {

		var memPanel = addPanel( new Stats.Panel( 'MB', '#f08', '#201' ) );

	}

	showPanel( 0 );

	return {

		REVISION: 16,

		dom: container,

		addPanel: addPanel,
		showPanel: showPanel,

		setview: function(title) {
				//console.log(msPanel);
				msPanel.textlabel = title;
		},

		begin: function () {

			beginTime = ( performance || Date ).now();

		},

		end: function () {

			frames ++;

			var time = ( performance || Date ).now();

			msPanel.update( time - beginTime, 200 );

			if ( time > prevTime + 1000 ) {

				fpsPanel.update( ( frames * 1000 ) / ( time - prevTime ), 100 );

				prevTime = time;
				frames = 0;

				if ( memPanel ) {

					var memory = performance.memory;
					memPanel.update( memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576 );

				}

			}

			return time;

		},

		update: function () {

			beginTime = this.end();

		},

		// Backwards Compatibility

		domElement: container,
		setMode: showPanel

	};

};

Stats.Panel = function ( name, fg, bg ) {

  var system = navigator.sayswho;

	var min = Infinity, max = 0, round = Math.round;
	var PR = round( window.devicePixelRatio || 1 );

	var WIDTH = 8 * 80 * PR, HEIGHT = 2* 48 * PR,
			TEXT_X = 6 * PR, TEXT_Y = 1 * PR,
			GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
			GRAPH_WIDTH = 8 * 74 * PR, GRAPH_HEIGHT = 2* 30 * PR;

	var canvas = document.createElement( 'canvas' );
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.style.cssText = 'width:'+WIDTH +'px;height:'+HEIGHT+'px';

	var context = canvas.getContext( '2d' );
	context.font = 'bold ' + ( 15 * PR ) + 'px Helvetica,Arial,sans-serif';
	context.textBaseline = 'top';

	context.fillStyle = bg;
	// context.fillRect( 0, 0, WIDTH, HEIGHT );

  // context.globalAlpha = 1;
	context.fillStyle = fg;
	// context.fillText( name, TEXT_X, TEXT_Y );
  //graph background
  // context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

  context.fillStyle = '#ffffff';//bg;
	context.globalAlpha = 1;//0.9;
  context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

	return {

		dom: canvas,

		textlabel: "JavaScript:",

		update: function ( value, maxValue ) {

			min = Math.min( min, value );
			max = Math.max( max, value );

			context.fillStyle = bg;
			context.globalAlpha = 1;
      // title bar
      context.fillRect( GRAPH_X, GRAPH_HEIGHT+ 15, GRAPH_WIDTH, GRAPH_Y + 3 );

      // title text
			context.fillStyle = '#ffffff'; //fg
      //let text = ' JavaScript ('+system+') frame time: ' + round( value ) + ' ' + name + ' (' + round( min ) + '-' + round( max ) + ')';
      let text = ' '+this.textlabel +' '+ round( value ) + ' ' + name;
			context.fillText(text, TEXT_X, GRAPH_HEIGHT+16);
      context.fillStyle = fg;

      // Shift the graph <--- left
			context.drawImage( canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT );

      // context.fillStyle = bg;
			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT );


			context.fillStyle = '#ffffff';//bg;
			context.globalAlpha = 1;
			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round( ( 1 - ( value / maxValue ) ) * GRAPH_HEIGHT ) );

		}

	};

};

return Stats;

})));
