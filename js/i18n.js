/**
 * EidoGo -- Web-based SGF Replayer
 * Copyright (c) 2006, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under the BSD license:
 * http://www.opensource.org/licenses/bsd-license.php
 *
 * Internationalization (i18n) support. The appropriate language
 * file must be included before this file.
 *
 * Thanks to Halan Pinheiro for the idea and for getting it started.
 */
if (typeof eidogo.i18n == "undefined") {
    eidogo.i18n = {
        'move':             'Move',
        'loading':          'Loading',
        
        'variations':       'Variations',
        'no variations':    'none',
        
        'tool':             'Tool',
        'play':             'Play',
        'region':           'Select Region',
        'add_b':            'Black Stone',
        'add_w':            'White Stone',
        'triangle':         'Triangle',
        'square':           'Square',
        'circle':           'Circle',
        'x':                'X',
        'letter':           'Letter',
        'number':           'Number',
        'search':           'Search for Pattern',
        
        'captures':         'captures',
    
        'game':             'Game',
    
        'white':            'White',
        'white rank':       'White rank',
        'white team':       'White team',
    
        'black':            'Black',
        'black rank':       'Black rank',
        'black team':       'Black team',
    
        'handicap':         'Handicap',
        'komi':             'Komi',
        'result':           'Result',
        'date':             'Date',
        'info':             'Info',
        'place':            'Place',
        'event':            'Event',
        'round':            'Round',
        'overtime':         'Overtime',
        'opening':          'Openning',
        'ruleset':          'Ruleset',
        'annotator':        'Annotator',
        'copyright':        'Copyright',
        'source':           'Source',
        'time limit':       'Time limit',
        'transcriber':      'Transcriber',
        'created with':     'Created with',
    
        'january':          'January',
        'february':         'February',
        'march':            'March',
        'april':            'April',
        'may':              'May',
        'june':             'June',
        'july':             'July',
        'august':           'August',
        'september':        'September',
        'october':          'October',
        'november':         'November',
        'december':         'December',
    
        'dom error':        'Error finding DOM container',
        'error retrieving': 'There was a problem retrieving the game data.',
        'invalid data':     'Received invalid game data',
        'error board':      'Error loading board container',
        
        'gnugo thinking':   'GNU Go is thinking...'
    }
}