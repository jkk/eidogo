var NS = Y.namespace('Eidogo.Renderers'), ShapeRenderers;

//Define some callbacks for some functional programming magic.
//These expect to be "called" with a canvas context as their context.
ShapeRenderers =
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
        //TODO: Swap this out for rendering vector textures.
        stone: function (pt, angle, color)
        {
            return function()
            {
                this.beginPath();
                this.fillStyle = color;
                this.strokeStyle = "#000000";
                this.arc(this.stoneSize*(pt.x + 0.5),
                         this.stoneSize*(pt.y + 0.5),
                         this.stoneSize/2*0.90,
                         2 * Math.PI, false);
                this.stroke();
                this.fill();
                this.closePath();
            };
        },
        square: function(pt)
        {
            return function()
            {
                this.fillRect(this.stoneSize*(pt.x + 0.25),
                              this.stoneSize*(pt.y + 0.25),
                              this.stoneSize/2,
                              this.stoneSize/2);
                this.strokeRect(this.stoneSize*(pt.x + 0.25),
                                this.stoneSize*(pt.y + 0.25),
                                this.stoneSize/2,
                                this.stoneSize/2);
            };
        },
        triangle: function (pt)
        {
            return function() {
                this.beginPath();
                this.moveTo(this.stoneSize*(pt.x + 0.5),
                            this.stoneSize*(pt.y + 0.15));
                this.lineTo(this.stoneSize*(pt.x + 0.75),
                            this.stoneSize*(pt.y + 0.70));
                this.lineTo(this.stoneSize*(pt.x + 0.25),
                            this.stoneSize*(pt.y + 0.70));
                this.lineTo(this.stoneSize*(pt.x + 0.5),
                            this.stoneSize*(pt.y + 0.15));
                this.fill();
                this.stroke();
                this.closePath();
            };
        },
        current: function(pt) { return ShapeRenderers.circle(pt); },
        circle: function(pt)
        {
            return function()
            {
                this.beginPath();
                this.arc(this.stoneSize*(pt.x + 0.5),
                         this.stoneSize*(pt.y + 0.5),
                         this.stoneSize/4,
                         2 * Math.PI, false);
                this.fill();
                this.stroke();
                this.closePath();
            };
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
            return function () {return null; };
        },
        text: function(pt, text)
        {
            return function()
            {
                this.textAlign = "center";
                this.textBaseline = 'middle';
                this.font = 'bold '+ this.stoneSize*0.5 + 'pt Calibri';
                this.fillText(text, this.stoneSize*(pt.x + 0.5),
                              this.stoneSize*(pt.y + 0.5));
                this.strokeText(text, this.stoneSize*(pt.x + 0.5),
                                this.stoneSize*(pt.y + 0.5));
            };
        }
    };

NS.CanvasRenderer = function (cfg) {
    this.boardSize = parseInt(cfg.boardSize, 10);
    this.antislip = true;
    
    NS.CanvasRenderer.superclass.constructor.apply(this, arguments);


    //Replace the given node with the canvas so we can resize the canvas to fit into the original container.
    //Maybe we shouldn't do this -- but it seems like it works out better for layout.
    this.canvas = Y.Node.create('<canvas></canvas>');
    var srcNode = Y.one(cfg.srcNode);
    this.srcNode = srcNode.ancestor();
    srcNode.insert(this.canvas, 'replace');

    this.set('boardSize', this.boardSize || 19);

    this.boardSize = this.get('boardSize');
    this.set('stoneSize', 20);
    
    Y.one(document).on('windowresize', this.resizeBoard, this );

    this.canvas.on('mousedown', this.handleMouseDown, this);
    this.canvas.on('mouseover', this.handleHover, this);
    this.canvas.on('mouseup', this.handleMouseUp, this);
    this.canvas.on( cfg.antislip ? 'dblclick' : 'click', this.handleClick, this);

    this.renderCache = {
        stones: new Array(this.boardSize * this.boardSize),
        markers: new Array(this.boardSize * this.boardSize)
    };
    this.resizeBoard();  //resize it for the first time... (heh..)
};

NS.CanvasRenderer.NAME = "eidogo-renderer-canvas";

NS.CanvasRenderer.ATTRS = {
    boardSize: {value: 19},
    stoneSize: {value: 20} //Default stonesize.  This will get set when the board renders into the space provided.
};

Y.extend(NS.CanvasRenderer, Y.Widget, {
    intToXy: function (i)
    {
        var boardSize = this.get('boardSize');
        return {x: i%boardSize, y: Math.floor(i/boardSize)};
    },
    XyToInt: function (pt)
    {
        var boardSize = this.get('boardSize');
        return pt.x + pt.y*boardSize;
    },

    getXY: function(evt)
    {
        var stoneSize = this.get('stoneSize'),
        XY = this.canvas.get('region'),
        stoneX = Math.floor( (evt.pageX - XY[0])/stoneSize ),
        stoneY = Math.floor( (evt.pageY - XY[1])/stoneSize );

        return {x:stoneX, y:stoneY, e:e};
    },
    resizeBoard: function()
    {
        var rect = this.srcNode.get('region'),
        totalWidth = Math.min(rect.width, rect.height),
        stoneSize = Math.floor(totalWidth / this.get('boardSize'));
        this.stoneSize = stoneSize;

        this.canvas.set('height', totalWidth);
        this.canvas.set('width', totalWidth);
        this.render();
    },
    render: function()
    {
        var boardSize = this.get('boardSize'),
        stoneSize = this.stoneSize,
        renderedStones, renderedMarkers,
        context = this.canvas.getDOMNode().getContext("2d"),
        i, j,
        hoshi = [3, Math.ceil(boardSize/2)-1, boardSize - 4],
        x=0,y = 0;  //Indices are zero based.;

        context.stoneSize = stoneSize; //Our stone renderers want this;

        context.fillStyle = "#FFFFCC" ;
        context.fillRect(0, 0, boardSize * stoneSize, boardSize * stoneSize);

        context.beginPath();
        context.fillStyle = "#000";
        context.strokeStyle = "#000";
        
        //Draw Hoshi
        for(i = 0; i < 3; i++ ) {
            for(j = 0; j < 3; j++ ) {
                x = hoshi[i] + 0.5;
                y = hoshi[j] + 0.5;
                context.beginPath();
                context.arc(stoneSize*(x),
                            stoneSize*(y),
                            stoneSize * 0.1,
                            2 * Math.PI, false);
                context.fill();
                context.stroke();
                context.closePath();
            }
        }
        
        //Draw board intersections
        for(i = 0.5; i<=boardSize; i++)
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

        renderedStones = this.renderCache.stones;
        renderedMarkers = this.renderCache.markers;
        for( i = 0; i < renderedStones.length; i++)
        {
            if(renderedStones[i])
            {
                renderedStones[i].call(context);
            }
            if(renderedMarkers[i])
            {
                if( ! renderedStones[i] )
                {
                    context.fillStyle = "#FFFFCC" ;
                    context.fillRect( (i%boardSize) * stoneSize, Math.floor(i/boardSize) * stoneSize, stoneSize, stoneSize);
                }
                //this only matters if there was a stone rendered before.  So the above if statement won't break anything.
                context.fillStyle = (context.fillStyle === "#000000") ? "#FFFFFF" : "#000000";

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

        if(color === 'empty' )
        {
            this.renderCache.stones[pt.x + pt.y*boardSize] = 0;
        } else
        {
            this.renderCache.stones[this.XyToInt(pt)] = ShapeRenderers[color](pt, Math.random()); //random angle
        }
        return null;
    },
    setMarker: function(pt, type) {
        var xy = this.XyToInt(pt), markers = this.renderCache.markers, text;
        
        //Remove the marker, so we can add another one
        if (markers[xy]) {
            markers[xy] = 0;
        }

        if (type === "empty" || !type) {
            this.renderCache.markers[xy] = 0;
            return null;
        } else if( ! ShapeRenderers[type] ) {
            if (type.indexOf("var:") === 0) {
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
    handleClick: function(e) {
        var xy = this.getXY(e);
        this.fire('boardClick', xy);
    },
    handleDoubleClick: function(e) {
        var xy = this.getXY(e);
        this.fire('boardDoubleClick', xy);
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
        return bounds;//todo implement;
    },
    hideRegion: function() {
        return null;
    },
    crop: function(crop) {
        //TODO: Implement
        return crop;
    }
});