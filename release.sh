#!/bin/sh

DEST="releases/$1"

mkdir -p $DEST
cp -r player $DEST
find $DEST -name .svn | xargs rm -rf
cp sgf/test.sgf $DEST
cp examples/example.html $DEST