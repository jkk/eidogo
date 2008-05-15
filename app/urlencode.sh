:
##########################################################################
# Title      :	urlencode - encode URL data
# Author     :	Heiner Steven (heiner.steven@odn.de)
# Date       :	2000-03-15
# Requires   :	awk
# Categories :	File Conversion, WWW, CGI
# SCCS-Id.   :	@(#) urlencode	1.4 06/10/29
##########################################################################
# Description
#	Encode data according to
#	    RFC 1738: "Uniform Resource Locators (URL)" and
#	    RFC 1866: "Hypertext Markup Language - 2.0" (HTML)
#
#	This encoding is used i.e. for the MIME type
#	"application/x-www-form-urlencoded"
#
# Notes
#    o	The default behaviour is not to encode the line endings. This
#	may not be what was intended, because the result will be
#	multiple lines of output (which cannot be used in an URL or a
#	HTTP "POST" request). If the desired output should be one
#	line, use the "-l" option.
#
#    o	The "-l" option assumes, that the end-of-line is denoted by
#	the character LF (ASCII 10). This is not true for Windows or
#	Mac systems, where the end of a line is denoted by the two
#	characters CR LF (ASCII 13 10).
#	We use this for symmetry; data processed in the following way:
#		cat | urlencode -l | urldecode -l
#	should (and will) result in the original data
#
#    o	Large lines (or binary files) will break many AWK
#    	implementations. If you get the message
#		awk: record `...' too long
#		 record number xxx
#	consider using GNU AWK (gawk).
#
#    o	urlencode will always terminate it's output with an EOL
#    	character
#
# Thanks to Stefan Brozinski for pointing out a bug related to non-standard
# locales.
#
# See also
#	urldecode
##########################################################################

PN=`basename "$0"`			# Program name
VER='1.4'

: ${AWK=awk}

Usage () {
    echo >&2 "$PN - encode URL data, $VER
usage: $PN [-l] [file ...]
    -l:  encode line endings (result will be one line of output)

The default is to encode each input line on its own."
    exit 1
}

Msg () {
    for MsgLine
    do echo "$PN: $MsgLine" >&2
    done
}

Fatal () { Msg "$@"; exit 1; }

set -- `getopt hl "$@" 2>/dev/null` || Usage
[ $# -lt 1 ] && Usage			# "getopt" detected an error

EncodeEOL=no
while [ $# -gt 0 ]
do
    case "$1" in
    	-l)	EncodeEOL=yes;;
	--)	shift; break;;
	-h)	Usage;;
	-*)	Usage;;
	*)	break;;			# First file name
    esac
    shift
done

LANG=C	export LANG
$AWK '
    BEGIN {
	# We assume an awk implementation that is just plain dumb.
	# We will convert an character to its ASCII value with the
	# table ord[], and produce two-digit hexadecimal output
	# without the printf("%02X") feature.

	EOL = "%0A"		# "end of line" string (encoded)
	split ("1 2 3 4 5 6 7 8 9 A B C D E F", hextab, " ")
	hextab [0] = 0
	for ( i=1; i<=255; ++i ) ord [ sprintf ("%c", i) "" ] = i + 0
	if ("'"$EncodeEOL"'" == "yes") EncodeEOL = 1; else EncodeEOL = 0
    }
    {
	encoded = ""
	for ( i=1; i<=length ($0); ++i ) {
	    c = substr ($0, i, 1)
	    if ( c ~ /[a-zA-Z0-9.-]/ ) {
		encoded = encoded c		# safe character
	    } else if ( c == " " ) {
		encoded = encoded "+"	# special handling
	    } else {
		# unsafe character, encode it as a two-digit hex-number
		lo = ord [c] % 16
		hi = int (ord [c] / 16);
		encoded = encoded "%" hextab [hi] hextab [lo]
	    }
	}
	if ( EncodeEOL ) {
	    printf ("%s", encoded EOL)
	} else {
	    print encoded
	}
    }
    END {
    	#if ( EncodeEOL ) print ""
    }
' "$@"

