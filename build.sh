#!/bin/sh

# depends on http://dojotoolkit.org/svn/dojo/trunk/buildscripts/lib/custom_rhino.jar

OUTFILE="player/player.compressed.js"
RHINOC="java -jar custom_rhino.jar -c "

rm $OUTFILE

$RHINOC js/jquery.js >> $OUTFILE 2>&1
$RHINOC js/jquery.dimensions.js >> $OUTFILE 2>&1
$RHINOC js/jquery.history.js >> $OUTFILE 2>&1
$RHINOC js/lang.js >> $OUTFILE 2>&1
$RHINOC js/eidogo.js >> $OUTFILE 2>&1
$RHINOC js/util.js >> $OUTFILE 2>&1
$RHINOC js/i18n.js >> $OUTFILE 2>&1
$RHINOC js/gametree.js >> $OUTFILE 2>&1
$RHINOC js/sgf.js >> $OUTFILE 2>&1
$RHINOC js/board.js >> $OUTFILE 2>&1
$RHINOC js/rules.js >> $OUTFILE 2>&1
$RHINOC js/player.js >> $OUTFILE 2>&1
