/**
 * Developed by Matias Niklison <matias.niklison@gmail.com>.
 */

go = {};
go.problems = {};

function tx(s) {
    if (eidogo.p18n[s]) return eidogo.p18n[s];
    return s;
}

/**
 * Go Problem's consturctor.
 * 
 * @param containerId {String} Id of the dom element that will contain the
 *    player. Its innerHTML must be the sgf configuration. Cannot be empty or
 *    null.
 * @param configuration {Object} goproblem's configuration.
 * @param configuration.commentsURL {String} The url to retrieve the problem
 *   comments. Mandatory.
 * @param configuration.dbId {Integer} The id of the problem, mandatory.
 * @param configuration.userId {Integer} The id of the user, mandatory.
 * @param configuration.trialId {Integer} The id of the trial, optional. If
 *     given the player goes into "time trial" mode.
 * @param configuration.lives {Integer} The number of lives left in the trial,
 *     mandatory if a trialId was given. Otherwise optional.
 * @param configuration.totalTime {Integer} Total time, in seconds, for the time
 *   trial. Optional. Default is 60 seconds.
 * @param configuration.seenbefore {Boolean} If <code>true</code> it is assumed
 *     that the user has already played this problem, so it can see the solution
 *     from the beginning. It's <code>false</code> by default. Optional.
 * @param configuration.showIsoLines {Boolean} If <code>true</code> the
 *     isomorphic will be shown in the navigation tree. False by default.
 *     Optional.
 * @param configuration.debugMode {Boolean} Optional
 * @param configuration.demoMode {Boolean} Optional (no message will be sent to
 *     the back end or requested from it).
 * @param {Function} callback Callback after the sgf has been loaded. Can be
 *    null or undefined.
 */
go.problems.Player = function(containerId, configuration, callback) {
  this.init(containerId, configuration, callback);
};

go.problems.Player.prototype = {

  /**
   * goproblmes player configuration. It contains all the necesary globarl
   * variables.
   */
  configuration : null,
  
  /**
   * The callback function, can be undefined or null.
   */
  callback : null,

  /**
   * Eidogo's player.
   */
  player : null,

  /**
   * Comments widget.
   */
  comments : null,

  /**
   * Comments container.
   */
  commentsContainer : null,

  /**
   * Time Trial Widget
   */
  timeTrial : null,

  /**
   * Player's configuration.
   */
  cfg : null,

  /**
   * Stores whether or not the user has reached the end of the exercise.
   * 0 it not.
   * 1 if it has.
   */
  hardstop : null,

  /**
   * Time (in milliseconds) when the user started the exercise.
   */
  startTime : null,

  /**
   * Initialices the player.
   */
  init : function(containerId, configuration, callback) {
    this.configuration = configuration || {};
    if (callback && typeof callback == "function") {
      this.callback = callback;
    }

    this.validateConfiguration();

    this.cfg = {
      progressiveLoad:    false,
      markCurrent:        true,
      markVariations:     false,
      markNext:           false,
      showGameInfo:       false,
      showPlayerInfo:     false,
      showOptions:        false,
      showTools:          false,
      showNavTree:        false,
      problemMode:        true,
      showProblemComments: true,
      sgf:                $("#" + containerId).html()
    };

    var hooks = {
      playProblemResponse : $.proxy(this.playProblemResponse, this),
      showComments : this.showComments.bind(this),
      afterGameParse : this.afterGameParse,
      beforePlayMove : this.beforePlayMove.bind(this),
      beforeVariation : this.beforeVariation.bind(this),
      initGame : this.resetTimer.bind(this),
      beforeShowNavTreeCurrent : this.beforeShowNavTreeCurrent.bind(this)
    };

    this.player = new eidogo.Player({
      container:          containerId,
      shrinkToFit:        true,
      shrinkBoard:        false,
      enableShortcuts:    true,
      stoneSize: configuration.stoneSize || 30,
      hooks:              hooks,
      enableShortcuts: false,
      showIsoLines: configuration.showIsoLines
    });

    $(this.player.dom.controlForward).remove();
    $(this.player.dom.controlLast).remove();
    $(this.player.dom.controlPass).remove();
    $(this.player.dom.navSlider).remove();
    $(this.player.dom.variationsContainer).remove();
    $(this.player.dom.moveNumber).remove();

    /* 'To move' panel. */
    $(this.player.dom.controls)
    .append('<li class="to-move"><span></span> ' + tx('tomove') + '</li>');

    /* Show result button */
    var showResultsButton = $('<button />');
    this.showResultsLi = $('<li class="show-solution" />')
        .append(showResultsButton.html(
                                       tx("solution") + ' (<span id="number-of-comments"></span>)'))
        .appendTo($(this.player.dom.controls));
    this.disableSolutionButton();

    this.showResultsLi.click(function(event) {
      this.showSolution(event, showResultsButton);
      event.stopPropagation();
      return false;
    }.bind(this));

    $(this.player.dom.controlFirst).click(function() {
      this.resetTimer();
      return false;
    }.bind(this));

    if (this.configuration.trialId) {
      this.timeTrial = new go.problems.TimeTrial({
        trialId: this.configuration.trialId,
        lives: this.configuration.lives || 5,
        goproblems: this,
        totalTime: this.configuration.totalTime || 60
      });

      this.commentsContainer = $('<div class="column time-trial">')
        .append(this.timeTrial.getDom()).prependTo($(this.player.dom.player));
    }

    this.player.loadSgf(this.cfg, this.onSgfLoaded.bind(this));
  },

  onSgfLoaded: function () {
    this.initComments();
    if (this.configuration.trialId) {
        this.timeTrial.startTimer();
    }
  },

  /**
   * Initialices the comments.
   */
  initComments : function() {
    this.comments = new go.problems.Comments({
      dbId : this.configuration.dbId,
      userId : this.configuration.userId,
      goToPath : this.goToPath.bind(this),
      commentsURL : this.configuration.commentsURL,
      postCommentsURL : this.configuration.postCommentsURL,
      onCommentsLoaded : this.onCommentsLoaded.bind(this),
      debugMode : this.configuration.debugMode,
      demoMode : this.configuration.demoMode
    });

    this.commentsContainer = $('<div style="display:none;">')
        .append(this.comments.getDom()).appendTo($(this.player.dom.comments)
        .parent());
  },

  /**
   * Actions to be taken when the external comments have been loaded.
   *
   * @param thePathJsonCommentsMap {String : Json[]} The path of the commented
   *     moves, as keys. An array of json comments as keys.
   * @param numberOfActiveComments {Number} The number of active comments.
   * @param hasFailed {Boolean} True if the loading of external comments failed.
   */  
  onCommentsLoaded : function (thePathJsonCommentsMap, numberOfActiveComments,
      hasFailed) {
    this.loadExternalMoves(thePathJsonCommentsMap, hasFailed);
    this.setNumberOfComments(numberOfActiveComments || 0);

    if(!$(this.player.dom.container).is(":visible")) {
      this.player.show();
      if (this.callback) {
        callback();
      }
    }
  },

  /**
   * Sets the number of comments.
   * @param numberOfComments The number of comments.
   */
  setNumberOfComments : function (numberOfComments) {
    this.showResultsLi.find('#number-of-comments').text(numberOfComments);
  },
   /**
   * Validate goproblem's configuration.
   */
  validateConfiguration : function () {
    if(!go.problems.utils.isValidId(this.configuration.dbId)) {
      throw "Missing or wrong dbId parameter in goproblem's player configuration.";
    }
    if(!go.problems.utils.isValidId(this.configuration.userId)) {
      this.configuration.userId = null;
    }

    if (this.configuration.trialId) {
      if(!go.problems.utils.isValidId(this.configuration.trialId)) {
        throw "Missing or wrong trialId parameter in goproblem's player configuration.";
      }
      if(!go.problems.utils.isValidId(this.configuration.lives)) {
        throw "Missing or wrong lives parameter in goproblem's player configuration.";
      }
    }

    if (!this.configuration.commentsURL) {
      throw "Missing comments URL parameter in goproblem's player configuration.";
    }
  },

  /** Shows the solution to the problem. */
  showSolution : function(event, showResultsButton) {
    this.configuration.seenbefore = true;
    this.player.problemMode = false;
    this.player.prefs.showNavTree = true;

    showResultsButton.html(tx("reset"));
    this.player.navTree.updateNavTree();
    this.player.navTree.show();
    this.commentsContainer.show();
    this.player.execNode();

    showResultsButton.parent().unbind('click').click(function(event) {
      this.reset(event, showResultsButton);
      return false;
    }.bind(this));
  },

  /** Resets the problem. */
  reset : function(event, showResultsButton) {
    this.player.problemMode = true;
    this.player.prefs.showNavTree = false;

    showResultsButton.html(tx("solution") + ' (<span id="number-of-comments">' +
        this.comments.numberOfActiveComments + '</span>)');
    this.player.navTree.hide();
    this.commentsContainer.hide();
    this.player.goTo(0);

    this.disableSolutionButton();

    showResultsButton.parent().unbind('click').click(function(event) {
      this.showSolution(event, showResultsButton);
      return false;
    }.bind(this));
  },

  /**
   * Disables the solution button, if the user has not seen this problem before.
   */
  disableSolutionButton : function() {
    if (!this.configuration.seenbefore) {
      this.showResultsLi.find("button").attr("disabled","disabled");
    }
  },

  /**
   * Enables the solution button.
   */
  enableSolutionButton : function () {
    this.showResultsLi.find("button").removeAttr("disabled");
  },

  /**
   * Returns the seconds elapsed since the beginning of the exercise,
   * in seconds.
   */
  currentTime : function () {
    return parseInt((new Date().getTime() - this.startTime)/1000);
  },

  /**
   * Resets the timer.
   */
  resetTimer : function () {
    this.startTime = new Date().getTime();
  },

  /**
   * Generates and returns a string with the played path, as expected by the
   * server. The format is:
   * <p> X1y1X2y2X3y3... <p>
   * <p>
   *   Where X and y are the coordinates of each move (in Go format, i.e. Aa
   *   for the upper left corner of the board), being X1y1 the first move made.
   * </p>
   */
  generatePath : function (theCursor) {
    var path = "";
    $.each(theCursor.getPathMoves(), function(index, move) {
      if (move) {
        path += move.charAt(0).toUpperCase() + move.charAt(1);
      }
    });
    return path;
  },

  /**
   * Takes a path in the server's format and goes there. The server's format is:
   * <p> X1y1X2y2X3y3... <p>
   * <p>
   *   Where X and y are the coordinates of each move (in Go format, i.e. Aa
   *   for the upper left corner of the board), being X1y1 the first move made.
   * </p>
   */
  goToPath : function (thePath) {
    var path = thePath.toLowerCase();
    var moves = [];
    for (var i = 0, len = thePath.length; i<len; i+=2) {
      moves[i/2] = path.slice(i, i+2);
    }

    this.player.goTo(moves, true);
  },

  /**
   * Sends the result of the problem to the server.
   */
  sendResult2Server : function (success, hardstop, cursor) {
        if (false) {
            // by default, send anon results to the server
            if (!this.configuration.userId) {
                // The user is not logged in.
                return;
            }
        }

    var data = {
      id : this.configuration.dbId,
      solved : (success? 1 : 0),
      userid : this.configuration.userId,
      hardstop : hardstop,
      secs : this.currentTime(),
      path : this.generatePath(cursor),
      player : 'js'
    };

    if (this.configuration.trialId) {
      data.trialid = this.configuration.trialId;
      data.lives = this.timeTrial.getLives();
    }

    if (!this.configuration.debugMode && !this.configuration.demoMode) {
      $.post("solve.php3", data, function(data, textStatus){
        if (textStatus !== "success") {
          go.problems.utils.showMessageDialog("There was an error saving the " +
              "result of the exercise to the server!");
        }
      });

    } else if (!this.configuration.demoMode) {
      var url = window.location.host + "\n Params:\n";

      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var value = data[key];
          url += "   " + key + ": " + value + "\n";
        }
      }
      url = url.substring(0, url.length-1);
      go.problems.utils.showMessageDialog("POST to:" + url);
    }
  },
  
  /**
   * Loads the moves that were added in the comments by external users.
   *
   * @param thePathJsonCommentsMap {String : Json[]} The path of the commented
   *     moves, as keys. An array of json comments as keys.
   * @param hasFailed {Boolean} True if the loading of external comments failed.
   */
  loadExternalMoves : function(thePathJsonCommentsMap, hasFailed) {
    if (hasFailed) {
      return;
    }

    var root = this.player.cursor.getGameRoot();
    var cursor = new eidogo.GameCursor(root);
    
    var paths = go.problems.utils.getKeys(thePathJsonCommentsMap);
    for (var i = 0, len = paths.length; i < len; i++) {
      cursor.init(root);
      var path = paths[i].toLowerCase();
      var currentPath = "";

      var move = cursor.node.getMove();
      // get node's move
      if (typeof move != 'string') {
        continue;
      }
      currentPath += move;
      if (currentPath === path) {
       // The node has thePathJsonCommentsMap[path].length comments
        cursor.node.increaseExternalCommentCount(
            thePathJsonCommentsMap[paths[i]].length);
      }
      while (currentPath != path) {

        // look for next node.
        move = path.slice(currentPath.length, currentPath.length+2);

        var nextMoves = cursor.getNextMoves();
        if (nextMoves && move in nextMoves) {
          // move already exists
          currentPath += move;

          cursor.next(nextMoves[move]);
          if (currentPath == path) {
            // The node has thePathJsonCommentsMap[path].length comments
            cursor.node.increaseExternalCommentCount(
                thePathJsonCommentsMap[paths[i]].length);
          }
        } else {
          var node = cursor.node;
          // move doesn't exist yet
          for (var k = currentPath.length, lenk = path.length; k < lenk; k+=2) {
            var nextColor;
            if (node.W || node.B) {
              nextColor = node.W? 'B': 'W';
            } else {
              nextColor = this.player.problemColor;
            }

            var props = {};
            props[nextColor] = path.slice(k, k+2);
            currentPath += props[nextColor];
            var newNode = new eidogo.GameNode(null, props);

            // adds the type of comment, will be used to set the css class in the
            // navigation tree.
            $.each(thePathJsonCommentsMap[paths[i]], function(index, value) {
              if (value.genre &&
                  (!newNode.commentType || newNode.commentType === "comment")){
                newNode.commentType = value.genre;
                newNode.setOffPath(true);
              }
            });
            node.appendChild(newNode);
            node = newNode;
          }
          if (currentPath === path) {
            // The node has thePathJsonCommentsMap[path].length comments
             node.increaseExternalCommentCount(
                 thePathJsonCommentsMap[paths[i]].length);
           }
          break;
        }
      }
    }
  },

  /*-----HOOKS------------*/
  playProblemResponse : function () {
    if (this.player.cursor.node.isOffPath()) {
        this.player.prependComment(tx('off path') + "\n", "terminate-wrong");
    }
    if (!this.player.cursor.hasNext() || this.player.cursor.getNext().commentType) {
      if (this.player.cursor.node.goproblems
          && this.player.cursor.node.goproblems.right) {
          this.player.prependComment(tx('solved') + "\n", "terminate-right");
      } else {
          this.player.prependComment(tx('wrong') + "\n", "terminate-wrong");
      }
      this.enableSolutionButton();
    }
  },
  showComments : function (params) {
    var comments = params.comments;
    if ($.isArray(comments)) {
        if (this.configuration.ptrans) {
            var pt = this.configuration.ptrans;
            for (var i = 0; i < comments.length; i++) {
                var c = comments[i];
                if (pt[c])
                    comments[i] = pt[c];
            }
        }
        comments = comments.join("<br/>");
    }
    this.player.dom.comments.innerHTML += comments.replace(/^(\n|\r|\t|\s)+/, "")
        .replace(/\n/g, "<br />");
  },
  afterGameParse : function (params) {
    var leafs = params.rootNode.getLeafs();

    for (var i = 0, len = leafs.length; i<len; i++) {
      var node = leafs[i];
      if (node.goproblems && node.goproblems.right) {

        node.walkUp(function() {
          // this is the node.
          if (!this.success) {
            this.success = true;
            return true;
          } else {
            // once we reach a already marked node, we don't need to continue.
            return false;
          }
        });
      }

      // Walks up all the leafs marking the nodes that have CHOICE
      node.walkUp(function() {
        // 'this' is the node.
        if (this.choice) {
          return true;
        }

        this.choice = false;
        if (this.goproblems && this.goproblems.choice) {
          // if I have been marked as choice, I do it properly.
          this.choice = true;
        } else if (this._children) {
          for (var i=0, len=this._children.length; i<len; i++) {
            if (this._children[i].choice) {
              // if it has a children with choice, then mark it.
              this.choice = true;
              break;
            }
          }
        }
        return true;
      });
    }
  },

  /**
   * Called before playing a move on the board (a computer or a player move).
   * @param params
   * @return
   */
  beforePlayMove : function (params) {
    if (this.player.problemMode) {
      if (this.player.cursor.hasNext() && !this.player.cursor.getNext().commentType) {
        if (this.player.currentColor === this.player.problemColor
            && !this.player.cursor.node.success
            && this.hardstop === null) {
          this.hardstop = 0;
          this.sendResult2Server(this.player.cursor.node.success,
              this.hardstop, this.player.cursor);
        }
      } else {
        // end of the problem
          if (this.configuration.trialId) {
              this.timeTrial.endGame(this.player.cursor.node.success);
          }
          if (this.hardstop !== 1) {
              this.hardstop = 1;
              this.sendResult2Server(this.player.cursor.node.success, this.hardstop,
                                     this.player.cursor);
          }
      }
    }
  },

  beforeVariation : function () {
    var stone = $(this.player.dom.controls).find(".to-move span");
    stone.removeClass();
    stone.addClass(this.player.cursor.getNextColor() === "B"? "black":"white");

    // Saves the current path in the comment container, so it can be saved if
    // the user saves a new comment.
    if (this.commentsContainer) {
      this.commentsContainer.find("input.path").val(
          this.generatePath(this.player.cursor));
    }
  },
  beforeShowNavTreeCurrent : function (params) {
    this.comments.showLocalComments(this.generatePath(this.player.cursor));
  }
  /*-----------------------*/
};


go.problems.utils = {

  /**
   * Returns true if the id is a valid one, false otherwise.
   */
  isValidId : function (theId) {
    return theId && !isNaN(theId);
  },
  
  /**
   * Returns the list of keys of an object.
   */
  getKeys : function(obj) {
    var keys = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    return keys;
  },

  /**
   * Shows a mesasge.
   */
  showMessageDialog : function (theMessage) {
    alert(theMessage);
  },

  /**
   * Adds the 'default value' feature to a text input.
   */
  addDefaultValue : function (input){
    input.focus(function() {
      if ($(this).val().trim() === $(this)[0].title) {
          $(this).removeClass("default-text");
          $(this).val("");
      }
    });
    input.blur(function() {
      if ($(this).val().trim() === "") {
        $(this).addClass("default-text");
        $(this).val($(this)[0].title);
      }
    });

    input.blur();
  }
};

