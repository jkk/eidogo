import sys
from distutils.core import setup, Extension
 
sgfext = Extension('_libkombilo', 
                   sources = ['sgfparser.cpp', 'abstractboard.cpp', 'search.cpp', 'libkombilo_wrap.cxx'],
                   libraries=['stdc++', 'sqlite3'], 
                   library_dirs=['/usr/lib'],
                   # extra_compile_args = ['-O3'], # can use this w/ g++ to max optimization
                  )

setup(name = 'libkombilo', ext_modules = [ sgfext ])

