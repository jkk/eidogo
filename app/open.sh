#!/bin/sh
# Settings to use with Platypus:
#   App Name: EidoGo
#   Is Droppable, add type sgf
#   Icon: icon.png
sgf=`$1/Contents/Resources/urlencode.sh -l "$2"`
url="http://eidogo.com/#raw:$sgf"
open $url
