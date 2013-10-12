
var NS = Y.namespace('Eidogo');

NS.Toolbar = function (cfg) {
    cfg = cfg || {};
    NS.Toolbar.superclass.constructor.apply(this,arguments);

    if(cfg.player)
    {
	this.player = cfg.player;
    }
    else
    {
	throw "No player!";
    }

    this.srcNode = Y.one(cfg.srcNode);
    this.set('boundingBox', this.srcNode);

    this.player.on('execNode', this.resetVariations, this);
    
    if( this.srcNode )
    {
	this.render();
    }
};

NS.Toolbar.NAME = "eidogo-toolbar";

NS.Toolbar.ATTRS = {};

Y.extend(NS.Toolbar, Y.Widget, {
    renderUI: function()
    {
        /*jslint maxlen: 1000 */
        var html = "<button class='eidogo-rewind'>&lt;&lt;</button><button class='eidogo-back'>&lt;</button><button class='eidogo-fwd'>&gt;</button><button class='eidogo-fastFwd'>&gt;&gt;</button><div class='eidogo-variations'>Variations:</div>";
        this.srcNode.append(html);
        this.backButton = new Y.Button({
            srcNode: this.srcNode.one('.eidogo-back')
        }).render();
        this.forwardButton = new Y.Button({
            srcNode: this.srcNode.one('.eidogo-fwd')
        }).render();
        this.rewindButton = new Y.Button({
            srcNode: this.srcNode.one('.eidogo-rewind')
        }).render();
        this.fastFwdButton = new Y.Button({
            srcNode: this.srcNode.one('.eidogo-fastFwd')
        }).render();
        
        this.variationsDiv = this.srcNode.one('.eidogo-variations');
    },
    bindUI: function()
    {
        this.backButton.on('click', function(){this.player.back();}, this);
        this.forwardButton.on('click', function(){this.player.forward();}, this);
        this.rewindButton.on('click', function(){
            var curPath =  this.player.cursor.getPath();
            this.player.goTo(curPath.slice(0,curPath.length-10), true);
        }, this);
        this.fastFwdButton.on('click', function(){
            var curDepth =  this.player.cursor.getPath().length,  cursor = new NS.GameCursor(this.player.cursor.getNextNodeWithVariations());
            this.player.goTo(cursor.getPath().slice(0,curDepth+10), true);
        }, this);
    },
    syncUI: function()
    {
        this.resetVariations();
    },
    resetVariations: function()
    {
        this.variationsDiv.setHTML('Variations: ');
        if(!this.player.variations) { return; }

        var gotoVariation = function(e, varNum) { this.player.variation(varNum); };

        for(i = 0; i < this.player.variations.length; i++)
        {
            p = Y.Node.create('<a class="eidogo-variation" href="#">' + (i+1) + '</a>');
            p.on('click', gotoVariation, this, i );
            this.variationsDiv.appendChild(p);
        }
    }
});