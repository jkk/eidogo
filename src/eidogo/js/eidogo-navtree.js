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

    this.player.once('newNode', this.selectNode, this);
    this.player.on('loadComplete', //We don't want to know about executed nodes until our tree is built.
                   function() {
                       this.player.on('execNode', this.selectNode, this);
                   }, this);


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
    walkTree: function(e)
    {
        this.numWalk = 50;
        e.node.walk( this.visitNode, this, true);// walk depth first
    },
    visitNode: function(node)
    {
        if ( ! this.numWalk ) { return true; }

        this.numWalk--;

        if( this.nodeTags[node._id] ) {
            this.setNodeText(this.nodeTags[node._id]);
            this.nodeTags[node._id].sgfNode = node;
        } else {
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
        }

    },

    setNodeText: function(yuinode)
    {
        var data = yuinode.sgfNode.getMoveColor();
        data += yuinode.sgfNode._moveNum;
        data += ' - Nodes: ';
        data += yuinode.sgfNode.countChildren();
        yuinode.one('a').set('text', data);

    },

    selectNode: function(e)
    {
        var id = this.player.cursor.node._id;

        this.walkTree( {node:e.node} ); //Refresh the tree.

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