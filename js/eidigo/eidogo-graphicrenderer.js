YUI.add('eidogo-graphicrenderer', 
	function(Y) {
	    var NS = Y.namespace('Eidogo');

	    function GraphicRenderer() {
		this.init.apply(this, arguments);
	    }
	    GraphicRenderer.NAME = "Goban"
	    GraphicRenderer.ATTRS = {
		boardSize: {value: 19},
		stoneSize: {value: 20} //Default stonesize.  This will get set when the board renders into the space provided.
	    };

	    NS.GraphicRenderer = GraphicRenderer;

	    Y.extend(NS.GraphicRenderer, Y.Widget, {
		init: function(domContainer, boardSize, player, crop) {
		    if(typeof player == 'undefined') return;
		    this.player = player;
		    this.boardSize = parseInt(boardSize);

		    this.antislip = true;
		    
		    GraphicRenderer.superclass.constructor.apply(this, arguments);

		    this.Graphics = new Y.Graphic({
			render: domContainer,
			autoSize: 'sizeGraphicToContent',
		    });

		    this.srcNode = Y.one(domContainer);

		    this.set('boardSize', boardSize || 19);
		    this.set('stoneSize', 20);

		    this.boardSize = this.get('boardSize');
		    
		    Y.one(document).on('windowresize', this.resizeBoard, this );
		    
		    var graphidNode = Y.one(this.Graphics.get('node'));

		    graphicNode.on('mousedown', this.handleMouseDown, this);
		    graphicNode.on('mouseover', this.handleHover, this);
		    graphicNode.on('mouseup', this.handleMouseUp, this);
		    graphicNode.on( this.antislip ? 'dblclick' : 'click', this.handleClick, this);

		    this.renderCache = {
			stones: new Array(boardSize * boardSize),
			markers: new Array(boardSize * boardSize)
		    }
		    this.resizeBoard();  //resize it for the first time... (heh..)
		},
		intToXy: function (i)
		{  
		    var boardSize = this.get('boardSize');
		    return {x: i%boardSize, y: Math.floor(i/boardSize)}
		},
		XyToInt: function (ptr)
		{
		    var boardSize = this.get('boardSize');
		    return pt.x + pt.y*boardSize;
		},
		getXY: function(evt)
		{
		    var stoneSize = this.get('stoneSize');
		    var XY = this.Graphics.getXY();
		    var stoneX = Math.floor( (evt.pageX - XY[0])/stoneSize );
		    var stoneY = Math.floor( (evt.pageY - XY[1])/stoneSize );
		    return [stoneX, stoneY, evt.pageX, evt.pageY];
		},

		resizeBoard: function()
		{
		    var rect = this.srcNode.get('region');
		    var totalWidth = Math.min(rect.width, rect.height);
		    var stoneSize = Math.floor(totalWidth / this.get('boardSize'));
		    this.set('stoneSize', stoneSize);
		    this.Graphics.set('height', totalWidth);
		    this.Graphics.set('width', totalWidth);
		    this.redrawBoard();
		},

		redrawBoard: function()
		{
		    this.Graphics.clear();
		    var boardSize = this.get('boardSize');
		    var stoneSize = this.get('stoneSize');

		    var bgRect = this.Graphics.addShape({
			type: Y.Rect,
			fill: { color: "#FFFFCC" },
			x: 0,
			y: 0,
			height: boardSize * stoneSize,
			width: boardSize * stoneSize,
		    });

		    var myPath = this.Graphics.addShape({
			type: Y.Path,
			fill: {
			    color: "#9aa"
			},
			stroke: {
			    weight: 1,
			    color: "#000"
			}
		    });
		    
		    for(var i = 0.5; i<=boardSize; i++)
		    {
			myPath.moveTo(stoneSize*i,
				      stoneSize/2);
			myPath.lineTo(stoneSize*i,
				      (boardSize-0.5)*stoneSize );
			myPath.moveTo(stoneSize/2,   
				      stoneSize*i );
			myPath.lineTo( (boardSize-0.5)*stoneSize,
				       i*stoneSize);
		    }

		    var renderedStones = this.renderCache.stones;
		    for( var i = 0; i < renderedStones.length; i++)
		    {
			if(renderedStones[i])
			{
			    this.renderStone(this.intToXy(i), renderedStones[i].get('fill').color);
			}
		    }

		    myPath.end();

		},
		clear: function()
		{
		    
		    redrawBoard();
		},
		renderStone: function(pt, color)
		{
		    var boardSize = this.get('boardSize');
		    var stoneSize = this.get('stoneSize');
		    if(color == 'empty' )	
		    {
			if( this.renderCache.stones[pt.x + pt.y*boardSize] )
			{
			    this.Graphics.removeShape(this.renderCache.stones[pt.x + pt.y*boardSize])
			    this.renderCache.stones[pt.x + pt.y*boardSize] = 0;
			}
		    } else
		    {
			var bgRect = this.Graphics.addShape({
			    type: Y.Circle,
			    radius: stoneSize/2*.95,
			    fill: {
				color: color
			    },
			    stroke: {
				weight: 1,
				color: "black"
			    },
			    x: stoneSize*pt.x,
			    y: stoneSize*pt.y
			});

			this.renderCache.stones[XyToInt(pt)] = bgRect;
		    }
		    return null;
		},
		renderMarker: function(pt, type) {
		    var xy = this.XyToInt(pt);
		    var markers = this.renderCache.markers;
		   
		    //Remove the marker, so we can add another one
		    if (markers[xy]) {
			this.Graphics.removeShape(markers[xy]);
			markers[xy] = 0;
		    }

		    if (type == "empty" || !type) { 
			this.renderCache.markers[this.XyToInt(pt)] = 0;
			return null;
		    }

		    if (type) {
			switch (type) {
			case "triangle":
			case "square":
			case "circle":
			case "ex":
			case "territory-white":
			case "territory-black":
			case "dim":
			case "current":
			    //TODO: Fix this.
			    this.renderCache.markers[this.XyToInt(pt)] = 0;
			    break;
			default:
			    if (type.indexOf("var:") == 0) {
				text = type.substring(4);
				type = "variation";
			    } else {
				text = type;
				type = "label";
			    }
			    break;
			}
		    }
		    return null;
		},

		setCursor: function(cursor) {
		    this.srcNode.setStyle('cursor', cursor);
		},
		handleClick: function(e) 
		{
		    var xy = this.getXY(e);
		    this.fire('boardClick', xy);
		},
		handleHover: function(e) {
		    var xy = this.getXY(e);
		    this.fire('boardHover', xy);
		},
		handleMouseDown: function(e) {
		    var xy = this.getXY(e);
		    this.fire('boardMouseDown', xy);
		},
		handleMouseUp: function(e) {
		    var xy = this.getXY(e);
		    this.fire('boardMouseUp', xy);
		},
		showRegion: function(bounds) {
		    return null;
		},
		hideRegion: function() { 
		    return null;
		},
		crop: function(crop) {
		    return null;
		}
	    });
	}, 
	'1.0.0',
	{ requires: [ 'graphics', 'widget', 'event', 'eidogo' ] });