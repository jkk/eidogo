TODO
======

* Loader for non-javascript coders.  Due to the separation of the rendering bits, we need some bootstrap code to load everything easily given a DOM tag in the form of <div id="fooGoban">SGFDATA</div> or <div id="fooGoban" eidogo-sgf-url="..."></div>

* Cleaned up CSS theme to go with the above.

* Fix localization.   I cannot get YUI to load the localization files correctly, when I add them to the shaper build config, the YUI loader crashes.

* A better navigation tree
	I like this style over other nav-trees, but it has some bugs with the scrollIntoView() behavior and being really ugly.

* Add tool selection to NavTree/Enable different tools in the SGF Player.

* Board and stone textures.
	These should preferably be embedded SVGs in the javascript using Blob urls to render into the canvas.

* Min/Max position point recording in the Sgf Parser to pass to the renderer for cropping purposes (useful in problem mode)

* Implement cropping in the Canvas renderer.

* Fallback HTML renderer.

* Game Info Widget.

* Handle and document preferences better.   I added next-variation visualization.

* Need to decide where JS properties, and YUI attributes are appropriate and be consistent with those variables.   E.G. boardSize is mixed between these right now.

* Re-implement problem mode.

DONE
======

* Basic canvas renderer  (schancel)

* Ported the code-base to YUI  (schancel)