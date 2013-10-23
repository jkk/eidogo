var NS = Y.namespace('Eidogo');


//TODO: Do something different.  Manipulating the DOM is much slower than I expected.
NS.NavTree = function (cfg) {
    cfg = cfg || {};
    NS.Toolbar.superclass.constructor.apply(this,cfg);

    if(cfg.player) {
	this.player = cfg.player;
    } else {
	throw "No player!";
    }

    this.srcNode = Y.one(cfg.srcNode);
    this.srcNode.addClass('eidogo-navtree');

    this.player.on('loadComplete', this.walkTree, this);
    this.player.on('loadComplete', //We don't want to know about executed nodes until our tree is built.
                   function() { this.player.on('execNode', this.selectNode, this); }, this);


    this.nodeTags = {};
};

NS.NavTree.NAME = "eidogo-navtree";

NS.NavTree.ATTRS = {};

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
        this.player.collectionRoot.walk( this.visitNode, this, false);// walk depth first
        this.selectNode();
    },
    visitNode: function(node)
    {
        var curDomNode, position,parentDomNode, ol;
        
        curDomNode = Y.Node.create('<li class="eidogo-node" ><a></a></li>');
        curDomNode.sgfNode = node;
        this.setNodeText(curDomNode);
        (curDomNode).on('click', this.gotoNodeHandler, this, node);

        if(node._parent )
        {
            position = node.getPosition(),
            parentDomNode = this.nodeTags[node._parent._id];
            
            if( position > 0 )
            {
                ul = Y.Node.create('<ol></ol>');
                ul.appendChild(curDomNode);
                parentDomNode.appendChild(ul);
            } else {
                parentDomNode.insert(curDomNode, 'after');//Retarded syntax in YUI.. whoot
            }
        } else
        {
            ol = Y.Node.create('<ol></ol');
            ol.appendChild(curDomNode);
            this.srcNode.appendChild(ol);
        }

        this.nodeTags[node._id] = curDomNode;
    },

    setNodeText: function(yuinode)
    {
        var data = [yuinode.sgfNode.getMoveColor(), 'Vars:', yuinode.sgfNode.countChildren()].join(' ');
        yuinode.one('a').set('text', data);

    },

    selectNode: function()
    {
        var id = this.player.cursor.node._id;
        if( ! this.nodeTags[id] ) {
            this.visitNode(this.player.cursor.node);
        }
        if(this.activeNode)
        {
            this.activeNode.removeClass('eidogo-activeNode');
            this.activeNode.ancestors("ol,li").removeClass('eidogo-activeNode');
            
            this.setNodeText(this.activeNode);
        }
        this.activeNode = this.nodeTags[id];

        this.activeNode.ancestors("ol,li").addClass('eidogo-activeNode');
        this.activeNode.addClass('eidogo-activeNode');
        this.activeNode.scrollIntoView();
    }
});