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
        'passed':           'passed',
        'resigned':         'resigned',
        
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
        'dim':              'Dim',
        'search':           'Search',
        'search corner':    'Corner Search',
        'search center':    'Center Search',
        'region info':      'Click and drag to select a region.',
        'two stones':       'Please select at least two stones to search for.',
        'two edges':        'For corner searches, your selection must touch two adjacent edges of the board.',
        'no search url':    'No search URL provided.',
    
        'white':            'White',
        'white rank':       'White rank',
        'white team':       'White team',
    
        'black':            'Black',
        'black rank':       'Black rank',
        'black team':       'Black team',

        'captures':         'captures',
        'time left':        'time left',
        
        'you':              'You',
    
        'game':             'Game',
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
        
        'gw':               'Good for White',
        'vgw':              'Very good for White',
        'gb':               'Good for Black',
        'vgb':              'Very good for Black',
        'dm':               'Even position',
        'dmj':              'Even position (joseki)',
        'uc':               'Unclear position',
        'te':               'Tesuji',
        'bm':               'Bad move',
        'vbm':              'Very bad move',
        'do':               'Doubtful move',
        'it':               'Interesting move',
        'black to play':    'Black to play',
        'white to play':    'White to play',
        'ho':               'Hotspot',
    
        'dom error':        'Error finding DOM container',
        'error retrieving': 'There was a problem retrieving the game data.',
        'invalid data':     'Received invalid game data',
        'error board':      'Error loading board container',
        'unsaved changes':  'There are unsaved changes in this game. You must save before you can permalink or download.',
        
        'gnugo thinking':   'GNU Go is thinking...'
    }
}