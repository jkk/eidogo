%module libkombilo
%include "std_string.i"
%include "std_vector.i"

namespace std {
  %template(vectors) vector<string>;
  %template(vectori) vector<int>;
};

%{
#include "sgfparser.h"
#include "abstractboard.h"
#include "search.h"
%}

%include "sgfparser.h"
%include "abstractboard.h"
%include "search.h"
%template(vectorMNC) std::vector<MoveNC>;


