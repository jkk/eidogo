
var NS = Y.namespace('Eidogo');

NS.Toolbar = function (cfg) {
	cfg = cfg || {}
    NS.Toolbar.superclass.constructor.apply(this,arguments);

	if(cfg.player)
		this.player = cfg.player;
	else
		throw "No player!"

	this.srcNode = Y.one(cfg.srcNode);

	this.player.on('execNode', this.resetVariations, this);

	if( this.srcNode )
		this.render();
}
NS.Toolbar.NAME = "eidogo-toolbar";

NS.Toolbar.ATTRS = {
};

Y.extend(NS.Toolbar, Y.Widget, {
    renderUI: function()
	{
		var html = "<button class='eidogo-beginning'>&lt;&lt;<button class='eidogo-back'>&lt;</button><button class='eidogo-fwd'>&gt;</button><div class='eidogo-variations'></div>";
		this.srcNode.append(html);
		this.backButton = new Y.Button({
			srcNode: this.srcNode.one('.eidogo-back')
		}).render();
		this.forwardButton = new Y.Button({
			srcNode: this.srcNode.one('.eidogo-fwd')
		}).render();
		this.beginningButton = new Y.Button({
			srcNode: this.srcNode.one('.eidogo-beginning')
		}).render();
		this.variationsDiv = this.srcNode.one('.eidogo-variations');
	},
	bindUI: function()
	{
		this.backButton.on('click', function(e){this.player.back()}, this); 
		this.forwardButton.on('click', function(e){this.player.forward()}, this); 
		this.beginningButton.on('click', function(e){this.player.resetCursor(false, false)}, this); 
	},
	syncUI: function()
	{
		this.resetVariations();
	},

	resetVariations: function()
	{
		if(!this.player.variations) return;

		this.variationsDiv.setHTML('Variations: ');
		for(var i = 0; i < this.player.variations.length; i++)
		{
			var p = Y.Node.create('<a class="eidogo-variation" href="#">' + (i+1) + '</a>');
			p.on('click', function(e, varNum) { this.player.variation(varNum); }, this, i );
			this.variationsDiv.appendChild(p);
		}
	}
});