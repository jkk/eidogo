#!/bin/sh

DEST="releases/$1"

mkdir -p $DEST/sgf
cp -r player $DEST
find $DEST -name .svn | xargs rm -rf
find $DEST -name '*.psd' | xargs rm -rf
rm $DEST/player/custom_rhino.jar
cp sgf/example.sgf $DEST/sgf
cp sgf/test.sgf $DEST/sgf
cp example.html $DEST
cp example2.html $DEST