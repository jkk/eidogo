var NS = Y.namespace('Eidogo.Renderers');

//Define some callbacks for some functional programming magic.
//These expect to be "called" with a canvas context as their context.
var ShapeRenderers = 
    {
        //white stone
        white: function (pt, angle)
        {
	        return ShapeRenderers.stone(pt, angle, '#ffffff');
        },
        //black stone
        black: function(pt, angle)
        {
	        return ShapeRenderers.stone(pt, angle, '#000000');
        },
        stone: function (pt, angle, color) 
        {
	        return function()
	        {
				this.beginPath()
				this.fillStyle = color;
	            this.strokeStyle = "#000000";
	            this.arc(this.stoneSize*(pt.x + 0.5),  
		                 this.stoneSize*(pt.y + 0.5),
		                 this.stoneSize/2*.90, 
		                 2 * Math.PI, false);
	            this.stroke();
	            this.fill();
	            this.closePath();
	        }
        },
        square: function(pt)
        {
	        return function()
	        {
	            this.fillStyle = "#ff0000";
	            this.strokeStyle = "#000";
	            this.fillRect(this.stoneSize*(pt.x + 0.25),  
			                  this.stoneSize*(pt.y + 0.25),
			                  this.stoneSize/2, 
			                  this.stoneSize/2);
				this.strokeRect(this.stoneSize*(pt.x + 0.25),  
								this.stoneSize*(pt.y + 0.25),
								this.stoneSize/2, 
								this.stoneSize/2);
	        }
        },
		triangle: function (pt)
		{
			return function() {
				this.beginPath()
				this.fillStyle = "#ff0000";
				this.strokeStyle = "#000";
				this.moveTo(this.stoneSize*(pt.x + 0.5),  
							this.stoneSize*(pt.y + 0.15));
				this.lineTo(this.stoneSize*(pt.x + 0.75),  
							this.stoneSize*(pt.y + 0.70));
				this.lineTo(this.stoneSize*(pt.x + 0.25),  
							this.stoneSize*(pt.y + 0.70));
				this.lineTo(this.stoneSize*(pt.x + 0.5),  
							this.stoneSize*(pt.y + 0.15))
				this.fill();
				this.stroke();
				this.closePath();
			}
		},
		circle: function(pt)
        {
	        return function()
	        {
				this.beginPath()
	            this.fillStyle = "#ff0000";
	            this.strokeStyle = "#000";
	            this.arc(this.stoneSize*(pt.x + 0.5),  
		                 this.stoneSize*(pt.y + 0.5),
		                 this.stoneSize/4, 
		                 2 * Math.PI, false);
	            this.fill();
				this.stroke();
	            this.closePath();
	        }
        },
		'territory-white': function ()
		{
			return function () { return null; };
		},
		'territory-black': function()
		{
			return function () {return null; };
		},
		dim: function()
		{
			return function () {return null; }
		},
        text: function(pt, text)
        {
	        return function()
	        {
	            this.fillStyle = "#ffffff";
	            this.strokeStyle = "#000000";
				this.textAlign = "center";
				this.textBaseline = 'middle';
	            this.font = 'bold '+ this.stoneSize*.5 + 'pt Calibri';
	            this.fillText(text, this.stoneSize*(pt.x + 0.5),  
			                  this.stoneSize*(pt.y + 0.5));
	            this.strokeText(text, this.stoneSize*(pt.x + 0.5),  
								this.stoneSize*(pt.y + 0.5));
	        }
        }
    }


NS.CanvasRenderer = function (cfg) {
    if(typeof cfg.player == 'undefined') throw "no renderer configuration";
    

    //domContainer, boardSize, player, crop

    this.player = cfg.player;
    this.boardSize = parseInt(cfg.boardSize);
    this.antislip = true;
    
    NS.CanvasRenderer.superclass.constructor.apply(this, arguments);

    this.canvas = Y.Node.create('<canvas></canvas>');
    this.srcNode = Y.one(cfg.srcNode);
    this.srcNode.appendChild(this.canvas);

    this.set('boardSize', this.boardSize || 19);
    this.set('stoneSize', 20);
    
    Y.one(document).on('windowresize', this.resizeBoard, this );

    this.canvas.on('mousedown', this.handleMouseDown, this);
    this.canvas.on('mouseover', this.handleHover, this);
    this.canvas.on('mouseup', this.handleMouseUp, this);
    this.canvas.on( this.antislip ? 'dblclick' : 'click', this.handleClick, this);

    this.renderCache = {
	    stones: new Array(this.boardSize * this.boardSize),
	    markers: new Array(this.boardSize * this.boardSize)
    }
    this.resizeBoard();  //resize it for the first time... (heh..)
}


NS.CanvasRenderer.NAME = "eidogo-renderer-canvas";

NS.CanvasRenderer.ATTRS = {
    boardSize: {value: 19},
    stoneSize: {value: 20} //Default stonesize.  This will get set when the board renders into the space provided.
};

Y.extend(NS.CanvasRenderer, Y.Widget, {
    intToXy: function (i)
    {  
	    var boardSize = this.get('boardSize');
	    return {x: i%boardSize, y: Math.floor(i/boardSize)}
    },
    XyToInt: function (pt)
    {
	    var boardSize = this.get('boardSize');
	    return pt.x + pt.y*boardSize;
    },
    getXY: function(evt)
    {
	    var stoneSize = this.get('stoneSize');
	    var XY = this.srcNode.get('region');
	    var stoneX = Math.floor( (evt.pageX - XY[0])/stoneSize );
	    var stoneY = Math.floor( (evt.pageY - XY[1])/stoneSize );
	    return {x:stoneX, y:stoneY};
    },
    resizeBoard: function()
    {
	    var rect = this.srcNode.get('region');
	    var totalWidth = Math.min(rect.width, rect.height);
	    var stoneSize = Math.floor(totalWidth / this.get('boardSize'));
	    this.set('stoneSize', stoneSize);
	    this.canvas.set('height', totalWidth);
	    this.canvas.set('width', totalWidth);
	    this.render();
    },
    render: function()
    {
	    var boardSize = this.get('boardSize');
	    var stoneSize = this.get('stoneSize');

	    var context = this.canvas.getDOMNode().getContext("2d");
	    context.stoneSize = stoneSize; //Our stone renderers want this;

	    context.fillStyle = "#FFFFCC" ;
	    context.fillRect(0, 0, boardSize * stoneSize, boardSize * stoneSize);

	    context.beginPath();
	    context.fillStyle = "#000000" ;
	    context.strokeStyle = "#000000" ;
	    
	    for(var i = 0.5; i<=boardSize; i++)
	    {
	        context.moveTo(stoneSize*i,
			               stoneSize/2);
	        context.lineTo(stoneSize*i,
			               (boardSize-0.5)*stoneSize );
	        context.moveTo(stoneSize/2,   
			               stoneSize*i );
	        context.lineTo( (boardSize-0.5)*stoneSize,
			                i*stoneSize);
	    }
	    context.stroke();
	    context.closePath();

	    var renderedStones = this.renderCache.stones;
	    var renderedMarkers = this.renderCache.markers;
	    for( var i = 0; i < renderedStones.length; i++)
	    {
	        if(renderedStones[i])
	        {
		        renderedStones[i].call(context);
	        }
	        if(renderedMarkers[i])
	        {
		        renderedMarkers[i].call(context);
	        }
	    }

    },
    clear: function()
    {
		for( var i =0; i <this.boardSize*this.boardSize; i++ )
		{
			this.renderCache.stones[i] = 0;
			this.renderCache.markers[i] = 0;
		}
	    render();
    },
    setStone: function(pt, color)
    {
	    var boardSize = this.get('boardSize');
	    var stoneSize = this.get('stoneSize');
	    if(color == 'empty' )	
	    {
		    this.renderCache.stones[pt.x + pt.y*boardSize] = 0;
	    } else
	    {
	        this.renderCache.stones[this.XyToInt(pt)] = ShapeRenderers[color](pt, Math.random()); //random angle
	    }
	    return null;
    },
    setMarker: function(pt, type) {
	    var xy = this.XyToInt(pt);
	    var markers = this.renderCache.markers;
	    var text;
	    
	    //Remove the marker, so we can add another one
	    if (markers[xy]) {
	        markers[xy] = 0;
	    }

	    if (type == "empty" || !type) { 
	        this.renderCache.markers[xy] = 0;
	        return null;
	    } else
		{
			if( ShapeRenderers[type] )
			{
				
			} else if (type.indexOf("var:") == 0) {
		        text = type.substring(4);
		        type = "text";
		    } else {
		        text = type;
		        type = "text";
		    }
	    }
	    
	    this.renderCache.markers[xy] = ShapeRenderers[type](pt,text); 
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