
var NS = Y.namespace('Eidogo');

NS.NavTree = function (cfg) {
    cfg = cfg || {}
    NS.Toolbar.superclass.constructor.apply(this,cfg);

	if(cfg.player)
		this.player = cfg.player;
	else
		throw "No player!"

	this.srcNode = Y.one(cfg.srcNode);

	this.player.on('execNode', this.selectNode, this);
	this.player.on('loadComplete', this.walkTree, this);

	this.nodeTags = {}
}
NS.NavTree.NAME = "eidogo-navtree";

NS.NavTree.ATTRS = {
};

Y.extend(NS.NavTree, Y.Widget, {   
	renderUI: function()
	{
	},
	bindUI: function()
	{
		
	},
	syncUI: function()
	{
		//this.walkTree();
	},
	gotoNodeHandler: function(e, node) {
		this.player.goTo((new NS.GameCursor(node)).getPath(), true); 
		e.stopPropagation();
		e.preventDefault();
	},
	walkTree: function()
	{
		this.varNum = 0;
		
		this.player.collectionRoot.walk( this.visitNode, this, false) // walk depth first
		this.selectNode();
	},
	visitNode: function(node)
	{
		var curDomNode;
		curDomNode = Y.Node.create('<li class="eidogo-node" ><a></a></li>');
		curDomNode.sgfNode = node;
		this.setNodeText(curDomNode);
		(curDomNode).on('click', this.gotoNodeHandler, this, node);

		if(node._parent )
		{
			var position = node.getPosition();
			var parentDomNode = this.nodeTags[node._parent._id];
			
			if( position > 0 )
			{
				var ul = Y.Node.create('<ol></ol>');
				ul.appendChild(curDomNode);
				parentDomNode.appendChild(ul); 
			} else {
				parentDomNode.insert(curDomNode, 'after'); //Retarded syntax in YUI.. whoot
			}
		} else
		{
			var ol = Y.Node.create('<ol></ol');
			ol.appendChild(curDomNode);
			this.srcNode.appendChild(ol);
		}

		this.nodeTags[node._id] = curDomNode; 
	},

	setNodeText: function(yuinode)
	{
		var data = [yuinode.sgfNode.getMoveColor(), 'Vars:', yuinode.sgfNode.countChildren(), ].join(' ');
		yuinode.one('a').set('text', data);
		
	},

	selectNode: function()
	{
		var id = this.player.cursor.node._id
		if( ! this.nodeTags[id] ) {
			this.visitNode(this.player.cursor.node);
		}
		if(this.activeNode)
		{
			this.activeNode.removeClass('eidogo-activeNode');
			this.activeNode.ancestors("ol,li").removeClass('eidogo-activeNode');
			
			this.setNodeText(this.activeNode)
			
		}
		this.activeNode = this.nodeTags[id];

		this.activeNode.ancestors("ol,li").addClass('eidogo-activeNode');
		this.activeNode.addClass('eidogo-activeNode');	
		this.activeNode.scrollIntoView();
	}
});