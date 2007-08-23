// File: search.cpp
// part of libkombilo, http://www.u-go.net/kombilo/

// Copyright (c) 2006-7 Ulrich Goertz <u@g0ertz.de>

// Permission is hereby granted, free of charge, to any person obtaining a copy of 
// this software and associated documentation files (the "Software"), to deal in 
// the Software without restriction, including without limitation the rights to 
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is furnished to do 
// so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all 
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
// SOFTWARE.

#include "sgfparser.h"
#include "abstractboard.h"
#include "search.h"
#include <stdio.h>
#include <string>
#include <cstring>

using std::min;
using std::max;
using std::string;
using std::vector;
using std::map;
using std::pair;
using std::make_pair;
using std::stack;

#if defined(_MSC_VER)
#include <algorithm>
#else
using std::sort;
#endif

SnapshotVector::SnapshotVector() : vector<unsigned char>() {
  current = begin();
}

SnapshotVector::SnapshotVector(char* c, int size) : vector<unsigned char>() {
  for(int i=0; i<size; i++) push_back(c[i]);
  current = begin();
}

void SnapshotVector::pb_int(int d) {
  for(int i = 0; i < 4; i++) {
    push_back((unsigned char)(d % 256));
    d = d >> 8;
  }
}

void SnapshotVector::pb_charp(char* c, int size) {
  pb_int(size);
  for(int i=0; i<size; i++) push_back(c[i]);
}

void SnapshotVector::pb_intp(int* p, int size) {
  pb_int(size);
  for(int i=0; i<size; i++) pb_int(p[i]);
}

void SnapshotVector::pb_string(string s) {
  pb_int(s.size()+1);
  for(unsigned int i=0; i<s.size(); i++) push_back(s[i]);
  push_back(0);
}

void SnapshotVector::pb_char(char c) {
  push_back(c);
}

int SnapshotVector::retrieve_int() {
  int result = 0;
  for(int i=0; i<4; i++) {
    result += *current << (i*8);
    current++;
  }
  return result;
}

int* SnapshotVector::retrieve_intp() {
  int sz = retrieve_int();
  int* result = new int[sz];
  for(int i=0; i<sz; i++)
    result[i] = retrieve_int();
  return result;
}

char SnapshotVector::retrieve_char() {
  char c = *current;
  current++;
  return c;
}

char* SnapshotVector::retrieve_charp() {
  int sz = retrieve_int();
  char* result = new char[sz];
  for(int i=0; i<sz; i++) {
    result[i] = *current;
    current++;
  }
  return result;
}

string SnapshotVector::retrieve_string() {
  char* cp = retrieve_charp();
  string s(cp);
  delete [] cp;
  return s;
}

char* SnapshotVector::to_charp() {
  char* result = new char[size()];
  int counter = 0;
  for(SnapshotVector::iterator it = begin(); it != end(); it++) result[counter++] = *it;
  return result;
}


PatternError::PatternError() {}

Continuation::Continuation() {
  B  = 0;
  W  = 0;
  tB = 0;
  tW = 0;
  wB = 0;
  lB = 0;
  wW = 0;
  lW = 0;
}

void Continuation::from_snv(SnapshotVector& snv) {
  B = snv.retrieve_int();
  W = snv.retrieve_int();
  tB = snv.retrieve_int();
  tW = snv.retrieve_int();
  wB = snv.retrieve_int();
  lB = snv.retrieve_int();
  wW = snv.retrieve_int();
  lW = snv.retrieve_int();
}

void Continuation::to_snv(SnapshotVector& snv) {
  snv.pb_int(B);
  snv.pb_int(W);
  snv.pb_int(tB);
  snv.pb_int(tW);
  snv.pb_int(wB);
  snv.pb_int(lB);
  snv.pb_int(wW);
  snv.pb_int(lW);
}

Symmetries::Symmetries(char sX, char sY) {
  sizeX = sX;
  sizeY = sY;
  dataX = new char[sizeX*sizeY];
  dataY = new char[sizeX*sizeY];
  dataCS = new char[sizeX*sizeY];
  for(int i=0; i<sizeX*sizeY; i++) {
    dataX[i] = -1;
    dataY[i] = -1;
    dataCS[i] = -1;
  }
}

Symmetries::~Symmetries() {
  delete [] dataX;
  delete [] dataY;
  delete [] dataCS;
}

Symmetries::Symmetries(const Symmetries& s) {
  sizeX = s.sizeX;
  sizeY = s.sizeY;
  dataX = new char[sizeX*sizeY];
  dataY = new char[sizeX*sizeY];
  dataCS = new char[sizeX*sizeY];
  for(int i=0; i<sizeX*sizeY; i++) {
    dataX[i] = s.dataX[i];
    dataY[i] = s.dataY[i];
    dataCS[i] = s.dataCS[i];
  }
}

Symmetries& Symmetries::operator=(const Symmetries& s) {
  if (&s != this) {
    sizeX = s.sizeX;
    sizeY = s.sizeY;
    delete [] dataX;
    delete [] dataY;
    delete [] dataCS;
    dataX = new char[sizeX*sizeY];
    dataY = new char[sizeX*sizeY];
    dataCS = new char[sizeX*sizeY];
    for(int i=0; i<sizeX*sizeY; i++) {
      dataX[i] = s.dataX[i];
      dataY[i] = s.dataY[i];
      dataCS[i] = s.dataCS[i];
    }
  }
  return *this;
}

void Symmetries::set(char i, char j, char k, char l, char cs) throw(PatternError) {
  if (0 <= i && i < sizeX && 0 <= j && j < sizeY) {
    dataX[i + j*sizeX] = k;
    dataY[i + j*sizeX] = l;
    dataCS[i + j*sizeX] = cs;
  }
  else throw PatternError();
}

char Symmetries::getX(char i, char j) throw(PatternError) {
  if (0 <= i && i < sizeX && 0 <= j && j < sizeY) return dataX[i + j*sizeX];
  else throw PatternError();
  return -1;
}

char Symmetries::getY(char i, char j) throw(PatternError) {
  if (0 <= i && i < sizeX && 0 <= j && j < sizeY) return dataY[i + j*sizeX];
  else throw PatternError();
  return -1;
}

char Symmetries::getCS(char i, char j) throw(PatternError) {
  if (0 <= i && i < sizeX && 0 <= j && j < sizeY) return dataCS[i + j*sizeX];
  else throw PatternError();
  return -1;
}

char Symmetries::has_key(char i, char j) throw(PatternError) {
  if (0 <= i && i < sizeX && 0 <= j && j < sizeY) {
    if (dataX[i + j*sizeX] == -1) return 0;
    else return 1;
  }
  else throw PatternError();
  return 0;
}


// ----------- class Pattern -----------------------------------------------

int Pattern::operator==(const Pattern& p) {
  if (boardsize != p.boardsize) return 0;
  if (sizeX != p.sizeX || sizeY != p.sizeY) return 0;
  if (left != p.left || right != p.right || top != p.top || bottom != p.bottom) return 0; 
  for(int i=0; i < sizeX*sizeY; i++)
    if (initialPos[i] != p.initialPos[i]) return 0;
  if (contList != p.contList) return 0;
  return 1;
}


char Pattern::BW2XO(char c) {
  if (c == 'B') return 'X';
  if (c == 'W') return 'O';
  return c;
}

char Pattern::getInitial(int i, int j) {
  return initialPos[i + sizeX*j];
}
 
char Pattern::getFinal(int i, int j) {
  return finalPos[i + sizeX*j];
}
 

Pattern::Pattern() {
  initialPos = 0;
  finalPos = 0;
  flip = 0;
  colorSwitch = 0;
  sizeX = 0;
  sizeY = 0;
  boardsize = 0;
  contLabels = 0;
}


Pattern::Pattern(int type, int BOARDSIZE, int sX, int sY, char* iPos, char* CONTLABELS) {
  flip = 0;
  colorSwitch = 0;
  sizeX = sX;
  sizeY = sY;
  boardsize = BOARDSIZE;
  if (CONTLABELS) {
    contLabels = new char[sizeX * sizeY];
    for(int i=0; i<sizeX*sizeY; i++) contLabels[i] = CONTLABELS[i];
  } else contLabels = 0;

  if (type == CORNER_NW_PATTERN || type == FULLBOARD_PATTERN) {
    left = right = top = bottom = 0;
  } else if (type == CORNER_NE_PATTERN) {
    top = bottom = 0;
    left = right = boardsize - sizeX;
  } else if (type == CORNER_SE_PATTERN) {
    top = bottom = boardsize - sizeY;
    left = right = boardsize - sizeX;
  } else if (type == CORNER_SW_PATTERN) {
    top = bottom = boardsize - sizeY;
    left = right = 0;
  } else if (type == SIDE_N_PATTERN) {
    top = bottom = 0;
    left = 1;
    right = boardsize -1 - sizeX;
  } else if (type == SIDE_E_PATTERN) {
    left = right = boardsize - sizeX;
    top = 1;
    bottom = boardsize -1 - sizeY;
  } else if (type == SIDE_W_PATTERN) {
    left = right = 0;
    top = 1;
    bottom = boardsize -1 - sizeY;
  } else if (type == SIDE_S_PATTERN) {
    top = bottom = boardsize - sizeY;
    left = 1;
    right = boardsize -1 - sizeX;
  } else if (type == CENTER_PATTERN) {
    left = top = 1;
    right = boardsize -1 - sizeX;
    bottom = boardsize -1 - sizeY;
  }

  initialPos = new char[sizeX * sizeY];
  finalPos = new char[sizeX*sizeY];
  for(int i=0; i<sizeX*sizeY; i++) {
    initialPos[i] = iPos[i];
    finalPos[i] = iPos[i];
  }
}

Pattern::Pattern(int type, int BOARDSIZE, int sX, int sY,
                 char* iPos, vector<MoveNC> CONTLIST, char* CONTLABELS) {
  flip = 0;
  colorSwitch = 0;
  sizeX = sX;
  sizeY = sY;
  boardsize = BOARDSIZE;
  if (CONTLABELS) {
    contLabels = new char[sizeX * sizeY];
    for(int i=0; i<sizeX*sizeY; i++) contLabels[i] = CONTLABELS[i];
  } else contLabels = 0;

  if (type == CORNER_NW_PATTERN || type == FULLBOARD_PATTERN) {
    left = right = top = bottom = 0;
  } else if (type == CORNER_NE_PATTERN) {
    top = bottom = 0;
    left = right = boardsize - sizeX;
  } else if (type == CORNER_SE_PATTERN) {
    top = bottom = boardsize - sizeY;
    left = right = boardsize - sizeX;
  } else if (type == CORNER_SW_PATTERN) {
    top = bottom = boardsize - sizeY;
    left = right = 0;
  } else if (type == SIDE_N_PATTERN) {
    top = bottom = 0;
    left = 1;
    right = boardsize -1 - sizeX;
  } else if (type == SIDE_E_PATTERN) {
    left = right = boardsize - sizeX;
    top = 1;
    bottom = boardsize -1 - sizeY;
  } else if (type == SIDE_W_PATTERN) {
    left = right = 0;
    top = 1;
    bottom = boardsize -1 - sizeY;
  } else if (type == SIDE_S_PATTERN) {
    top = bottom = boardsize - sizeY;
    left = 1;
    right = boardsize -1 - sizeX;
  } else if (type == CENTER_PATTERN) {
    left = top = 1;
    right = boardsize -1 - sizeX;
    bottom = boardsize -1 - sizeY;
  }

  initialPos = new char[sizeX * sizeY];
  finalPos = new char[sizeX*sizeY];
  for(int i=0; i<sizeX*sizeY; i++) {
    initialPos[i] = iPos[i];
    finalPos[i] = iPos[i];
  }

  contList = CONTLIST;
}

Pattern::Pattern(int le, int ri, int to, int bo, int BOARDSIZE, int sX, int sY,
                 char* iPos, const vector<MoveNC>& CONTLIST, char* CONTLABELS) throw(PatternError) {
  // check whether anchor rectangle is valid
  if (le < 0 || ri+sX > BOARDSIZE || to < 0 || bo+sY > BOARDSIZE || ri < le || bo < to) throw PatternError();

  flip = 0;
  colorSwitch = 0;

  left = le;
  right = ri;
  top = to;
  bottom = bo;
  boardsize = BOARDSIZE;

  sizeX = sX;
  sizeY = sY;
  if (CONTLABELS) {
    contLabels = new char[sizeX * sizeY];
    for(int i=0; i<sizeX*sizeY; i++) contLabels[i] = CONTLABELS[i];
  } else contLabels = 0;

  initialPos = new char[sizeX * sizeY];
  finalPos = new char[sizeX*sizeY];
  for(int i=0; i<sizeX*sizeY; i++) {
    initialPos[i] = iPos[i];
    finalPos[i] = iPos[i];
  }

  contList = CONTLIST;
}

Pattern::Pattern(SnapshotVector& snv) {
  flip = snv.retrieve_int();
  colorSwitch = snv.retrieve_int();
  left = snv.retrieve_int();
  right = snv.retrieve_int();
  top = snv.retrieve_int();
  bottom = snv.retrieve_int();
  boardsize = snv.retrieve_int();
  sizeX = snv.retrieve_int();
  sizeY = snv.retrieve_int();
  if (snv.retrieve_char()) { // contLabels?
    contLabels = snv.retrieve_charp();
  } else contLabels = 0;
  initialPos = snv.retrieve_charp();
  finalPos = snv.retrieve_charp();

  int size = snv.retrieve_int();
  for(int i=0; i<size; i++)
    contList.push_back(MoveNC(snv.retrieve_char(), snv.retrieve_char(), snv.retrieve_char())); // x, y, color
}

void Pattern::to_snv(SnapshotVector& snv) {
  snv.pb_int(flip);
  snv.pb_int(colorSwitch);
  snv.pb_int(left);
  snv.pb_int(right);
  snv.pb_int(top);
  snv.pb_int(bottom);
  snv.pb_int(boardsize);
  snv.pb_int(sizeX);
  snv.pb_int(sizeY);
  if (contLabels) {
    snv.pb_char(1);
    snv.pb_charp(contLabels, sizeX*sizeY);
  } else snv.pb_char(0);
  snv.pb_charp(initialPos, sizeX*sizeY);
  snv.pb_charp(finalPos, sizeX*sizeY);
  snv.pb_int(contList.size());
  for(vector<MoveNC>::iterator it = contList.begin(); it != contList.end(); it++) {
    snv.pb_char(it->x);
    snv.pb_char(it->y);
    snv.pb_char(it->color);
  }
}

Pattern::~Pattern() {
  if (initialPos) delete [] initialPos;
  if (finalPos) delete [] finalPos;
  if (contLabels) delete [] contLabels;
}

Pattern::Pattern(const Pattern& p) {
  left = p.left;
  right = p.right;
  top = p.top;
  bottom = p.bottom;
  boardsize = p.boardsize;
  sizeX = p.sizeX;
  sizeY = p.sizeY;
  flip = p.flip;
  colorSwitch = p.colorSwitch;

  initialPos = new char[sizeX*sizeY];
  finalPos = new char[sizeX*sizeY];
  if (p.contLabels) contLabels = new char[sizeX*sizeY];
  else contLabels = 0;
  for(int i=0; i<sizeX*sizeY; i++) {
    initialPos[i] = p.initialPos[i];
    finalPos[i] = p.finalPos[i];
    if (p.contLabels) contLabels[i] = p.contLabels[i];
  }
  contList = p.contList;
}

Pattern& Pattern::operator=(const Pattern& p) {
  if (&p != this) {
    left = p.left;
    right = p.right;
    top = p.top;
    bottom = p.bottom;
    boardsize = p.boardsize;
    sizeX = p.sizeX;
    sizeY = p.sizeY;
    flip = p.flip;
    colorSwitch = p.colorSwitch;

    if (initialPos) delete [] initialPos;
    if (finalPos) delete [] finalPos;
    if (contLabels) delete [] contLabels;

    initialPos = new char[sizeX*sizeY];
    finalPos = new char[sizeX*sizeY];
    if (p.contLabels) contLabels = new char[sizeX*sizeY];
    else contLabels = 0;
    for(int i=0; i<sizeX*sizeY; i++) {
      initialPos[i] = p.initialPos[i];
      finalPos[i] = p.finalPos[i];
      if (p.contLabels) contLabels[i] = p.contLabels[i];
    }
    contList = p.contList;
  }
  return *this;
}


Pattern& Pattern::copy(const Pattern& p) {
  if (&p != this) {
    left = p.left;
    right = p.right;
    top = p.top;
    bottom = p.bottom;
    boardsize = p.boardsize;
    sizeX = p.sizeX;
    sizeY = p.sizeY;
    flip = p.flip;
    colorSwitch = p.colorSwitch;

    if (initialPos) delete [] initialPos;
    if (finalPos) delete [] finalPos;

    initialPos = new char[sizeX*sizeY];
    finalPos = new char[sizeX*sizeY];
    if (p.contLabels) contLabels = new char[sizeX*sizeY];
    else contLabels = 0;
    for(int i=0; i<sizeX*sizeY; i++) {
      initialPos[i] = p.initialPos[i];
      finalPos[i] = p.finalPos[i];
      if (p.contLabels) contLabels[i] = p.contLabels[i];
    }
    contList = p.contList;
  }
  return *this;
}

string Pattern::printPattern() {
  string result;
  char buf[100];
  sprintf(buf, "boardsize: %d, area: %d, %d, %d, %d\nsize: %d, %d\n", boardsize, left, right, top, bottom, sizeX, sizeY);
  result += buf;
  for(int i=0; i<sizeY; i++) {
    for(int j=0; j<sizeX; j++) {
      if (initialPos[i*sizeX + j] == 'X' || initialPos[i*sizeX + j] == 'O' || initialPos[i*sizeX + j] == 'x' || initialPos[i*sizeX + j] == 'x' || initialPos[i*sizeX+j] == '*') result += initialPos[i*sizeX+j];
      else result += '.';
    }
    result += "\n";
  }
  result += "\n";
  return result;
}


int Pattern::flipsX(int i, int x, int y, int XX, int YY) {
  if (i==0) return x;
  if (i==1) return XX-x;
  if (i==2) return x;
  if (i==3) return XX-x;
  if (i==4) return y;
  if (i==5) return YY-y;
  if (i==6) return y;
  if (i==7) return YY-y;
  return -1;
}

int Pattern::flipsY(int i, int x, int y, int XX, int YY) {
  if (i==0) return y;
  if (i==1) return y;
  if (i==2) return YY-y;
  if (i==3) return YY-y;
  if (i==4) return x;
  if (i==5) return x;
  if (i==6) return XX-x;
  if (i==7) return XX-x;
  return -1;
}


int Pattern::PatternInvFlip(int i) {
  if (i == 5) return 6;
  if (i == 6) return 5;
  return i;
}

const int composition_table[] = {
  0, 1, 2, 3, 4, 5, 6, 7,
  1, 0, 3, 2, 5, 4, 7, 6,
  2, 3, 0, 1, 6, 7, 4, 5,
  3, 2, 1, 0, 7, 6, 5, 4,
  4, 6, 5, 7, 0, 2, 1, 3,
  5, 7, 4, 6, 1, 3, 0, 2,
  6, 4, 7, 5, 2, 0, 3, 1,
  7, 5, 6, 4, 3, 1, 2, 0 };

int Pattern::compose_flips(int i, int j) {
  return composition_table[j+8*i];
}

PatternList::PatternList(Pattern& p, int fColor, int nMove) throw(PatternError) {
  pattern.copy(p);
  fixedColor = fColor;
  nextMove = nMove;
  special = -1;
  flipTable = new int[16];
  for(int i=0; i<16; i++) flipTable[i] = -1; // (patternList() relies on this)

  patternList();
  continuations = new Continuation[pattern.sizeX * pattern.sizeY];
}

PatternList::~PatternList() {
  delete [] continuations;
  delete [] flipTable;
}

char PatternList::invertColor(char co) {
  if (co == 'X') return 'O';
  if (co == 'x') return 'o';

  if (co == 'O') return 'X';
  if (co == 'o') return 'x';

  return co;
}

void PatternList::patternList() {
  vector<Pattern> lCS;
  vector<pair<int,int> > sy;
  int boardsize = pattern.boardsize;

  for(int f = 0; f < 8; f++) {
    int newSizeX = max(Pattern::flipsX(f,0,0,pattern.sizeX,pattern.sizeY),
                       Pattern::flipsX(f,pattern.sizeX,pattern.sizeY,pattern.sizeX,pattern.sizeY));
    int newSizeY = max(Pattern::flipsY(f,0,0,pattern.sizeX,pattern.sizeY),
                       Pattern::flipsY(f,pattern.sizeX,pattern.sizeY,pattern.sizeX,pattern.sizeY));

    int newLeft = min(Pattern::flipsX(f,pattern.left,pattern.top,boardsize-1,boardsize-1),
                      Pattern::flipsX(f,pattern.right+pattern.sizeX-1,pattern.bottom+pattern.sizeY-1,
                                      boardsize-1,boardsize-1));
    int newRight = max(Pattern::flipsX(f,pattern.left,pattern.top,boardsize-1,boardsize-1),
                       Pattern::flipsX(f,pattern.right+pattern.sizeX-1,pattern.bottom+pattern.sizeY-1,
                                       boardsize-1,boardsize-1)) - (newSizeX-1);
    int newTop = min(Pattern::flipsY(f,pattern.left,pattern.top,boardsize-1,boardsize-1),
                     Pattern::flipsY(f,pattern.right+pattern.sizeX-1,pattern.bottom+pattern.sizeY-1,
                                     boardsize-1,boardsize-1));
    int newBottom = max(Pattern::flipsY(f,pattern.left,pattern.top,boardsize-1,boardsize-1),
                        Pattern::flipsY(f,pattern.right+pattern.sizeX-1,pattern.bottom+pattern.sizeY-1,
                        boardsize-1,boardsize-1)) - (newSizeY - 1);

    // printf("%d, %d, %d, %d, %d, %d, %d\n", f, newSizeX, newSizeY, newLeft, newRight, newTop, newBottom);
    char* newInitialPos = new char[pattern.sizeX*pattern.sizeY];
    int i=0;
    for(i=0; i<pattern.sizeX; i++) {
      for(int j=0; j<pattern.sizeY; j++) {
        newInitialPos[Pattern::flipsX(f,i,j,pattern.sizeX-1,pattern.sizeY-1) + \
                      newSizeX*Pattern::flipsY(f,i,j,pattern.sizeX-1,pattern.sizeY-1)] = pattern.getInitial(i, j);
      }
    }

    vector<MoveNC> newContList;
    for(i=0; (unsigned int)i<pattern.contList.size(); i++) {
      newContList.push_back(MoveNC(Pattern::flipsX(f, pattern.contList[i].x, pattern.contList[i].y, 
                                                      pattern.sizeX-1,pattern.sizeY-1),
                                  Pattern::flipsY(f, pattern.contList[i].x, pattern.contList[i].y,
                                                      pattern.sizeX-1,pattern.sizeY-1),
                                  pattern.contList[i].color));
    }

    Pattern pNew(newLeft, newRight, newTop, newBottom, pattern.boardsize, newSizeX, newSizeY,
                 newInitialPos, newContList);

    pNew.flip = f;
    // printf("new size %d %d\n", pNew.sizeX, pNew.sizeY);

    delete [] newInitialPos;

    vector<Pattern>::iterator it;
    bool foundNewPattern = true;
    for(it = data.begin(); it != data.end(); it++) {
      if (pNew == *it) {
        foundNewPattern = false;
        flipTable[f] = flipTable[it->flip];
        break;
      }
    }
    if (foundNewPattern) {
      flipTable[f] = data.size();
      data.push_back(pNew);
    }

    if (pNew == pattern) sy.push_back(pair<int,int>(f,0));

    if (nextMove || !fixedColor) {
      char* newInitialPos = new char[pattern.sizeX*pattern.sizeY];
      for(int i=0; i<pattern.sizeX; i++) {
        for(int j=0; j<pattern.sizeY; j++) {
          newInitialPos[Pattern::flipsX(f,i,j,pattern.sizeX-1,pattern.sizeY-1) + newSizeX*Pattern::flipsY(f,i,j,pattern.sizeX-1,pattern.sizeY-1)] =
            invertColor(pattern.getInitial(i, j));
        }
      }
      vector<MoveNC> newContList;
      {
        for(unsigned int i=0; i<pattern.contList.size(); i++) {
          newContList.push_back(MoveNC(Pattern::flipsX(f, pattern.contList[i].x, pattern.contList[i].y, 
                  pattern.sizeX-1,pattern.sizeY-1),
                Pattern::flipsY(f, pattern.contList[i].x, pattern.contList[i].y,
                  pattern.sizeX-1,pattern.sizeY-1),
                invertColor(pattern.contList[i].color)));
        }
      }


      // printf("new size %d %d", newSizeX, newSizeY);
      Pattern pNew1(newLeft, newRight, newTop, newBottom, pattern.boardsize, newSizeX, newSizeY,
                    newInitialPos, newContList);
      pNew1.flip = f;
      pNew1.colorSwitch = 1;

      delete [] newInitialPos;

      if (!fixedColor) {
        bool foundNewPattern = true;
        int lCS_ctr = 0;
        for(vector<Pattern>::iterator it = lCS.begin(); it != lCS.end(); it++) {
          if (pNew1 == *it) {
            foundNewPattern = false;
            flipTable[f+8] = lCS_ctr;
            break;
          }
          lCS_ctr++;
        }
        if (foundNewPattern) {
          lCS.push_back(pNew1);
        }
      }

      if (pNew1 == pattern) {
        if (!fixedColor) sy.push_back(pair<int,int>(f,1));
        if (nextMove) special = Pattern::PatternInvFlip(f);
      }
    }
  }

  int lCS_ctr = 0;
  for(vector<Pattern>::iterator it = lCS.begin(); it != lCS.end(); it++) {
    bool contained_in_l = false;
    for(vector<Pattern>::iterator it_l = data.begin(); it_l != data.end(); it_l++)
      if (*it == *it_l) {
        contained_in_l = true;
        flipTable[8+it->flip] = flipTable[it_l->flip];
        break;
      }
    if (!contained_in_l) {
      flipTable[8+it->flip] = data.size();
      data.push_back(*it);
    }
    for(int ii=it->flip+1; ii<8; ii++) 
      if (flipTable[8+ii] == lCS_ctr) flipTable[8+ii] = flipTable[8+it->flip];
    lCS_ctr++;
  }

  Symmetries symm(pattern.sizeX, pattern.sizeY);
  for(int i=0; i<symm.sizeX; i++)
    for(int j=0; j<symm.sizeY; j++)
      symm.set(i,j, i,j,0);

  for(vector<pair<int,int> >::iterator it_s=sy.begin(); it_s!=sy.end(); it_s++) {
    int s = it_s->first;
    int newSizeX = max(Pattern::flipsX(s,0,0,pattern.sizeX,pattern.sizeY),
                       Pattern::flipsX(s,pattern.sizeX,pattern.sizeY,pattern.sizeX,pattern.sizeY));
    int newSizeY = max(Pattern::flipsY(s,0,0,pattern.sizeX,pattern.sizeY),
                       Pattern::flipsY(s,pattern.sizeX,pattern.sizeY,pattern.sizeX,pattern.sizeY));
    int c = it_s->second;
    Symmetries symm1(newSizeX, newSizeY);

    for(int i=0; i < pattern.sizeX; i++) {
      for(int j=0; j < pattern.sizeY; j++) {
        int fX = Pattern::flipsX(s, i, j, pattern.sizeX-1, pattern.sizeY-1);
        int fY = Pattern::flipsY(s, i, j, pattern.sizeX-1, pattern.sizeY-1);
        if ((i != fX || j != fY) && !symm1.has_key(fX, fY))
          symm1.set(i,j, fX, fY, c);
      }
    }

    {
      int cs;
      for(int i=0; i<symm.sizeX; i++)
        for(int j=0; j<symm.sizeY; j++)
          if (symm1.has_key(symm.getX(i,j), symm.getY(i,j))) {
            if ((symm1.getCS(symm.getX(i,j),symm.getY(i,j)) || symm.getCS(i,j)) && 
                !(symm1.getCS(symm.getX(i,j),symm.getY(i,j)) && symm.getCS(i,j)))
              cs = 1;
            else cs = 0;
            symm.set(i,j,symm1.getX(symm.getX(i,j),symm.getY(i,j)), 
                symm1.getY(symm.getX(i,j),symm.getY(i,j)), cs);
          }
    }
  }

  symmetries.push_back(symm);
  {
    vector<Pattern>::iterator it = data.begin();
    it++;
    for(; it != data.end(); it++) {
      // printf("ne %d, %d\n", it->sizeX, it->sizeY);
      int f = it->flip;
      Symmetries s(it->sizeX, it->sizeY);
      for(int i=0; i<pattern.sizeX; i++) {
        for(int j=0; j<pattern.sizeY; j++) {
          if (!it->colorSwitch) {
            s.set(Pattern::flipsX(f,i,j,pattern.sizeX-1,pattern.sizeY-1), 
                Pattern::flipsY(f,i,j,pattern.sizeX-1,pattern.sizeY-1), 
                symm.getX(i,j), symm.getY(i,j), symm.getCS(i,j));
          } else {
            s.set(Pattern::flipsX(f,i,j,pattern.sizeX-1,pattern.sizeY-1), 
                Pattern::flipsY(f,i,j,pattern.sizeX-1,pattern.sizeY-1), 
                symm.getX(i,j), symm.getY(i,j), 1-symm.getCS(i,j));
          }
        }
      }
      symmetries.push_back(s);
    }
  }
}


Pattern PatternList::get(int i) {
  return data[i];
}


int PatternList::size() {
  return data.size();
}


char* PatternList::updateContinuations(int index, int x, int y, char co, bool tenuki, char winner) {
  char xx;
  char yy;
  char cSymm;
  char cc;
  xx = symmetries[index].getX(x,y);
  yy = symmetries[index].getY(x,y);
  cSymm = symmetries[index].getCS(x,y);
  if (co == 'X' || co == 'B') {
    if (cSymm) cc = 'W'; else cc = 'B';
  } else {
    if (cSymm) cc = 'B'; else cc = 'W';
  }

  if ((nextMove == 1 && cc == 'W') || (nextMove == 2 && cc == 'B')) {
    if (special != -1) {
      char xx1 = xx;
      // printf("s1 xx %d, yy %d sp %d\n", xx, yy, special);
      xx = Pattern::flipsX(special, xx, yy, pattern.sizeX-1, pattern.sizeY-1);
      yy = Pattern::flipsY(special, xx1, yy, pattern.sizeX-1, pattern.sizeY-1);
      // printf("s2 xx %d, yy %d\n", xx, yy);
      if (cc == 'B') cc = 'W';
      else cc = 'B';
      cSymm = 1-cSymm;
    } else {
      return 0;
    }
  }

  if (cc == 'B') {
    continuations[xx + pattern.sizeX*yy].B++;
    if (tenuki) continuations[xx + pattern.sizeX*yy].tB++;
    if ((winner == 'B' && !cSymm) || (winner == 'W' && cSymm)) continuations[xx + pattern.sizeX*yy].wB++;
    else if ((winner == 'W' && !cSymm) || (winner == 'B' && cSymm)) continuations[xx + pattern.sizeX*yy].lB++;
  } else {
    // printf("xx %d, yy %d\n", xx, yy);
    continuations[xx + pattern.sizeX*yy].W++;
    if (tenuki) continuations[xx + pattern.sizeX*yy].tW++;
    if ((winner == 'B' && !cSymm) || (winner == 'W' && cSymm)) continuations[xx + pattern.sizeX*yy].wW++;
    else if ((winner == 'W' && !cSymm) || (winner ='B' && cSymm)) continuations[xx + pattern.sizeX*yy].lW++;
  }
  char* result = new char[3];
  result[0] = xx;
  result[1] = yy;
  result[2] = cSymm;
  return result;
}


char* PatternList::sortContinuations() {
  char* labels = new char[pattern.sizeX*pattern.sizeY+1];
  labels[pattern.sizeX * pattern.sizeY] = 0; // so we can just printf the labels as a string
  for(int i=0; i<pattern.sizeX*pattern.sizeY; i++) {
    if (continuations[i].B || continuations[i].W) labels[i] = '?'; // need to assign label
    else labels[i] = '.';
  }
  string labelList = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  unsigned int labelIndex = 0;

  // assign labels which are in the contLabels array passed to the original pattern
  // (these will usually be labels "already present in the SGF file")
  
  if (pattern.contLabels) {
    for(int i=0; i<pattern.sizeX*pattern.sizeY; i++) {
      if (pattern.contLabels[i] != '.') {
        labels[i] = pattern.contLabels[i];
        unsigned int j = labelList.find(pattern.contLabels[i]);
        if (j != string::npos) labelList.erase(j,1);
      }
    }
  }

  // now give labels to the remaining points, starting with the one with
  // most hits
  
  int max_hits = 0;
  int max_hits_index = 0;
  while (max_hits != -1 && labelIndex < labelList.size()) {
    for(int i=0; i<pattern.sizeX*pattern.sizeY; i++) {
      if (labels[i] == '?' && continuations[i].B + continuations[i].W > max_hits) {
        max_hits = continuations[i].B + continuations[i].W;
        max_hits_index = i;
      }
    }
    if (max_hits != 0) { // found another point needing a label
      labels[max_hits_index] = labelList[labelIndex++];
      max_hits = 0;
    } else max_hits = -1; // done
  }
  return labels;
}

DBError::DBError() {
}

int dbinsert1blob(sqlite3* db, char* sql, int id, char* blob, int size) {
  sqlite3_stmt *ppStmt=0;
  int rc = sqlite3_prepare(db, sql, -1, &ppStmt, 0);
  if (rc != SQLITE_OK || ppStmt==0) return rc;
  rc = sqlite3_bind_int(ppStmt, 1, id);
  if (rc != SQLITE_OK) return rc;
  rc = sqlite3_bind_blob(ppStmt, 2, blob, size, SQLITE_TRANSIENT);
  if (rc != SQLITE_OK) return rc;
  rc = sqlite3_step(ppStmt);
  if (rc != SQLITE_DONE) return rc;
  rc = sqlite3_finalize(ppStmt);
  if (rc != SQLITE_OK) return rc;
  return 0; // Success
}

int dbinsert2blobs(sqlite3* db, char* sql, int id, char* blob1, int size1, char* blob2, int size2) {
  sqlite3_stmt *ppStmt=0;
  int rc = sqlite3_prepare(db, sql, -1, &ppStmt, 0);
  if (rc != SQLITE_OK || ppStmt==0) return rc;
  rc = sqlite3_bind_int(ppStmt, 1, id);
  if (rc != SQLITE_OK) return rc;
  rc = sqlite3_bind_blob(ppStmt, 2, blob1, size1, SQLITE_TRANSIENT);
  if (rc != SQLITE_OK) return rc;
  rc = sqlite3_bind_blob(ppStmt, 3, blob2, size2, SQLITE_TRANSIENT);
  if (rc != SQLITE_OK) return rc;
  rc = sqlite3_step(ppStmt);
  if (rc != SQLITE_DONE) return rc;
  rc = sqlite3_finalize(ppStmt);
  if (rc != SQLITE_OK) return rc;
  return 0; // Success
}
    
Algorithm::Algorithm(int bsize) {
  boardsize = bsize;
  db = 0;
}

Algorithm::~Algorithm() {}

void Algorithm::initialize_process(sqlite3* DB) {}
void Algorithm::newgame_process(int game_id) {}
void Algorithm::AB_process(int x, int y) {}
void Algorithm::AW_process(int x, int y) {}
void Algorithm::AE_process(int x, int y, char removed) {}
void Algorithm::endOfNode_process() {}
void Algorithm::move_process(Move m) {}
void Algorithm::pass_process() {}
void Algorithm::branchpoint_process() {}
void Algorithm::endOfVariation_process() {}
void Algorithm::endgame_process(bool commit) {}
void Algorithm::finalize_process() {}
int Algorithm::readDB(sqlite3* DB) { return 0; }
int Algorithm::search(PatternList& patternList, GameList& gl, SearchOptions& options) { 
  return -1; 
}

Algo_signature::Algo_signature(int bsize) : Algorithm(bsize) {
  main_variation = true;
}

Algo_signature::~Algo_signature() {
}

void Algo_signature::initialize_process(sqlite3* DB) throw(DBError) {
  db = DB;
  char sql[100];
  sprintf(sql, "create table if not exists algo_signature_%d ( id integer primary key, signature varchar(12) );", boardsize);
  int rc = sqlite3_exec(db, sql, 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();
  sprintf(sql, "create index if not exists sig_idx on algo_signature_%d(signature);", boardsize);
  rc = sqlite3_exec(db, sql, 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();
}

void Algo_signature::newgame_process(int game_id) {
  main_variation = true;
  counter = 0;
  gid = game_id;
  signature = new char[12];
  for(int i=0; i<12; i++) signature[i] = '?';
}

void Algo_signature::AB_process(int x, int y) {
}

void Algo_signature::AW_process(int x, int y) {
}

void Algo_signature::AE_process(int x, int y, char removed) {
}

void Algo_signature::endOfNode_process() {
}

void Algo_signature::move_process(Move m) {
  if (!main_variation) return;
  counter++;

  if (counter==20) {
    signature[0] = m.x + 97;
    signature[1] = m.y + 97;
  }
  if (counter==40) {
    signature[2] = m.x + 97;
    signature[3] = m.y + 97;
  }
  if (counter==60) {
    signature[4] = m.x + 97;
    signature[5] = m.y + 97;
  }
  if (counter==31) {
    signature[6] = m.x + 97;
    signature[7] = m.y + 97;
  }
  if (counter==51) {
    signature[8] = m.x + 97;
    signature[9] = m.y + 97;
  }
  if (counter==71) {
    signature[10] = m.x + 97;
    signature[11] = m.y + 97;
  }
}

void Algo_signature::pass_process() {
  if (main_variation) move_process(Move(19,19,'p'));
}

void Algo_signature::branchpoint_process() {

}

void Algo_signature::endOfVariation_process() {
  main_variation = false;
}

char* symmetrize(char* signature, int boardsize) {
  // symmetrize signature
  char* min_signature = new char[12];
  for(int i=0; i<12; i++) min_signature[i] = signature[i];
  for (int f=0; f<8; f++) { // for all flips
    // compute flipped signature
    char* next = new char[12];
    for(int i=0; i<6; i++) {
      if ('a' <= signature[2*i] && signature[2*i] <= 's')
        next[2*i] = Pattern::flipsX(f, signature[2*i]-'a', signature[2*i+1]-'a', boardsize-1, boardsize-1)+'a';
      else next[2*i] = signature[2*i];
      if ('a' <= signature[2*i+1] && signature[2*i+1] <= 's')
        next[2*i+1] = Pattern::flipsY(f, signature[2*i]-'a', signature[2*i+1]-'a', boardsize-1, boardsize-1)+'a';
      else next[2*i+1] = signature[2*i+1];
    }
    // if next < min_signature, then swap
    for(int j=0; j<12; j++) {
      if (next[j] > min_signature[j]) break;
      if (next[j] < min_signature[j]) {
        char* help = next;
        next = min_signature;
        min_signature = help;
        break;
      }
    }
    delete [] next;
  }
  return min_signature;
}

void Algo_signature::endgame_process(bool commit) throw(DBError) {
  if (commit) {
    char* min_signature = symmetrize(signature, boardsize);
    char sql[100];
    sprintf(sql, "insert into algo_signature_%d (id, signature) values (?,?);", boardsize);
    if (dbinsert1blob(db, sql, gid, min_signature, 12)) throw DBError();
    // for(int i=0; i<12; i++) printf("%c", min_signature[i]); printf("\n");
    delete [] min_signature;
  }
  delete [] signature;
}

void Algo_signature::finalize_process() {
}

char* Algo_signature::get_current_signature() {
  return symmetrize(signature, boardsize);
}

vector<int> Algo_signature::search_signature(char* sig) {
  // to be used during processing! (because we need the db)
  char sql[100];
  sprintf(sql, "select id from algo_signature_%d where signature=? order by id", boardsize);
  sqlite3_stmt *ppStmt=0;
  vector<int> result;
  int rc = sqlite3_prepare(db, sql, -1, &ppStmt, 0);
  if (rc != SQLITE_OK || ppStmt==0) throw DBError();
  rc = sqlite3_bind_blob(ppStmt, 1, sig, 12, SQLITE_TRANSIENT);
  if (rc != SQLITE_OK || ppStmt==0) throw DBError();
  do {
    rc = sqlite3_step(ppStmt);
    if (rc != SQLITE_DONE && rc != SQLITE_ROW) throw DBError();
    if (rc == SQLITE_ROW) {
      result.push_back(sqlite3_column_int(ppStmt, 0));
    }
  } while (rc == SQLITE_ROW);
  rc = sqlite3_finalize(ppStmt);
  if (rc != SQLITE_OK) throw DBError();
  return result;
}

Algo_finalpos::Algo_finalpos(int bsize) : Algorithm(bsize) {
  fp = 0;
  fpIndex = -1;
  data = 0;
}

Algo_finalpos::~Algo_finalpos() {
  if (data) {
    for(map<int, char* >::iterator it = data->begin(); it != data->end(); it++) delete [] it->second;
    delete data;
  }
}

void Algo_finalpos::initialize_process(sqlite3* DB) throw(DBError) {
  // printf("init Algo_finalpos\n");
  db = DB;
  char sql[100];
  sprintf(sql, "create table if not exists algo_finalpos_%d ( id integer primary key, data blob );", boardsize);
  int rc = sqlite3_exec(db, sql, 0, 0, 0);
  if (rc != SQLITE_OK) {
    throw DBError();
  }
  // printf("init Algo_finalpos\n");
}

void Algo_finalpos::newgame_process(int game_id) {
  gid = game_id;
  fp = new char[100];
  for(int i=0; i<100; i++) fp[i] = 255;
}

void Algo_finalpos::AB_process(int x, int y) {
  fp[y/2 + 10*(x/2)] &= ~(1 << (2*(x%2 + 2*(y%2))));
}

void Algo_finalpos::AW_process(int x, int y) {
  fp[y/2 + 10*(x/2)] &= ~(1 << (2*(x%2 + 2*(y%2))+1));
}

void Algo_finalpos::AE_process(int x, int y, char removed) {
}

void Algo_finalpos::endOfNode_process() {
}

void Algo_finalpos::move_process(Move m) {
  if (m.color == 'B')
    fp[m.y/2 + 10*(m.x/2)] &= ~(1 << (2*(m.x%2 + 2*(m.y%2))));
  else if (m.color == 'W')
    fp[m.y/2 + 10*(m.x/2)] &= ~(1 << (2*(m.x%2 + 2*(m.y%2))+1));
}

void Algo_finalpos::pass_process() {
}

void Algo_finalpos::branchpoint_process() {
}

void Algo_finalpos::endOfVariation_process() {
}

void Algo_finalpos::endgame_process(bool commit) throw(DBError) {
  if (commit) {
    char sql[100];
    sprintf(sql, "insert into algo_finalpos_%d (id, data) values (?,?);", boardsize);
    if (dbinsert1blob(db, sql, gid, fp, 100)) throw DBError();
  }
  delete [] fp;
}

void Algo_finalpos::finalize_process() {
}

int Algo_finalpos::readDB(sqlite3* DB) { 
  db = DB;
  if (data) {
    for(map<int, char* >::iterator it = data->begin(); it != data->end(); it++) delete [] it->second;
    delete data;
  }
  data = new map<int, char* >;
  int rc = sqlite3_exec(db, "begin transaction;", 0, 0, 0);
  if (rc) throw DBError();
  sqlite3_stmt *ppStmt=0;
  char sql[100];
  sprintf(sql, "select id, data from algo_finalpos_%d order by id", boardsize);
  rc = sqlite3_prepare(db, sql, -1, &ppStmt, 0);
  if (rc != SQLITE_OK || ppStmt==0) return rc; // FIXME: catch certain errors, (and/or throw DBError?)
  while (sqlite3_step(ppStmt) == SQLITE_ROW) {
    // printf("step0\n");
    int index = sqlite3_column_int(ppStmt, 0);
    char* d = (char*)sqlite3_column_blob(ppStmt, 1);
    // printf("step1\n");
    char* d1 = new char[100];
    // printf("step2\n");
    for(int i=0; i<100; i++) d1[i] = d[i];
    // printf("step3\n");
    // printf("insert %d %p\n", index, d1);
    data->insert(make_pair(index, d1));
  }
  // printf("done\n");
  rc = sqlite3_finalize(ppStmt);
  if (rc != SQLITE_OK) return rc;
  rc = sqlite3_exec(db, "commit;", 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();
  return 0;
}

int Algo_finalpos::search(PatternList& patternList, GameList& gl, SearchOptions& options) { // progress bar?!

  // Put the pattern into bitmap format, which is the format the final
  // positions are stored in in the database. This makes the comparisons
  // faster.

  int plS = patternList.size();
  char_p** allbits = new char_p*[plS];
  int** allbitlengths = new int*[plS];
  for(int N=0; N<plS; N++) {
    Pattern* pattern = &patternList.data[N];
    allbits[N] = new char_p[4];
    allbitlengths[N] = new int[4];

    for(int i=0; i<2; i++) {
      for(int j=0; j<2; j++) {
        int xBlocks = (pattern->sizeY+i+1)/2;
        int yBlocks = (pattern->sizeX+j+1)/2;
        char* nextBlock = new char[400];
        int nextBlockIndex = 0;
        nextBlock[nextBlockIndex++] = yBlocks;

        for(int k1=0; k1 < yBlocks; k1++) {
          char nlist[400];
          int nlistIndex = 0;

          for(int k2=0; k2 < xBlocks; k2++) {
            int n = 0;
            for(int x=0; x<2; x++) {
              for(int y=0; y<2; y++) {
                int indexX = k1 * 2 + y - j;
                int indexY = k2 * 2 + x - i;
                if (0 <= indexX && indexX < pattern->sizeX && 0 <= indexY && indexY < pattern->sizeY) {
                  if (pattern->getFinal(indexX,indexY)=='X')
                    n |= 1 << (2*(2*x+y));
                  else if (pattern->getFinal(indexX,indexY)=='O')
                    n |= 1 << (2*(2*x+y)+1);
                }
              }
            }
            nlist[nlistIndex++] = n;
          }              

          int start = 0;
          int end = nlistIndex;

          while (start < end && !nlist[start]) start++;
          while (end > start && !nlist[end-1]) end--;

          nextBlock[nextBlockIndex++] = start;
          nextBlock[nextBlockIndex++] = end-start;
          for(int current=start; current < end; current++) 
            nextBlock[nextBlockIndex++] = nlist[current];
        }
        char* nB = new char[nextBlockIndex];
        for(int ii=0; ii<nextBlockIndex; ii++) nB[ii] = nextBlock[ii];
        allbitlengths[N][2*i + j] = nextBlockIndex;
        allbits[N][2*i + j] = nB;
        delete [] nextBlock;
      }
    }
  }

  int index = gl.start();
  // int counter = 0; // to keep track of progress bar
  // printf("%d patterns\n", plS);
  char start;
  char length;
  char x;
  char y;
  while (index != -1) {   
    // if (!(counter++ % 1000)) printf("counter: %d, index: %d\n", counter, index);
    // if (progBar && !(counter % 100))
    //   progBar.redraw((progEnd-progStart)*counter/len(gl.current) + progStart);

    map<int, char* >::iterator it = data->find(index);
    if (it == data->end()) {
      // printf("skip\n");
      index = gl.next();
      continue;
    }
    char* finalpos = it->second;
    // printf("index %d, %p\n", index, finalpos);
    vector<Candidate* > *matchList = new vector<Candidate* >;;

    for(int N=0; N<plS; N++) {
      Pattern* pattern = &patternList.data[N];
      for(int a0=pattern->left; a0 <= pattern->right; a0++) {
        for(int a1 = pattern->top; a1 <= pattern->bottom; a1++) {
          int matches = 1;

          int pIndex = 2*(a1%2) + (a0%2);
          char* pbits = allbits[N][pIndex];
          int pbIndex = 0;
          int fpIndex = a1/2 + (a0/2)*10;

          for(x=0; x < pbits[0]; x++) {
            start = pbits[++pbIndex];
            length = pbits[++pbIndex];
            fpIndex += start;
            for(y=0; y<length; y++) {
              pbIndex++;
              if (pbits[pbIndex] & finalpos[fpIndex]) {
                matches = 0;
                break;
              }
              fpIndex++;
            }
            if (!matches) break;
            fpIndex += 10 - start - length;
          }                
          if (matches) matchList->push_back(new Candidate(a0,a1,N));
        }
      }
    }

    if (matchList->size()) gl.makeCurrentCandidate(matchList);
    else delete matchList;

    index = gl.next();
  }
  {
    for(int N=0; N<plS; N++) {
      delete [] allbitlengths[N];
      for(int i=0; i<4; i++)
        if (allbits[N][i]) delete [] allbits[N][i];
      delete [] allbits[N];
    }
  }
  delete [] allbitlengths;
  delete [] allbits;
  return 0;
}

bool Algo_finalpos::equal(unsigned int i1, unsigned int i2) { 
  // not to be used during processing
  // i1, i2 correspond to game id's
  sqlite3_stmt *ppStmt=0;
  char sql[100];
  sprintf(sql, "select data from algo_finalpos_%d where id = %d or id = %d", boardsize, i1, i2);
  int rc = sqlite3_prepare(db, sql, -1, &ppStmt, 0);
  if (rc != SQLITE_OK || ppStmt==0) return false; // FIXME: catch certain errors, (and/or throw DBError?)
  if (sqlite3_step(ppStmt) == SQLITE_ROW) {
    char* dd1 = (char*)sqlite3_column_blob(ppStmt, 0);
    char* d1 = new char[100];
    for(int i=0; i<100; i++) d1[i] = dd1[i]; // FIXME: is this necessary?
    if (sqlite3_step(ppStmt) == SQLITE_ROW) {
      char* d2 = (char*)sqlite3_column_blob(ppStmt, 0);
      for(int i=0; i<100; i++) 
        if (d1[i] != d2[i]) {
          delete [] d1;
          sqlite3_finalize(ppStmt);
          return false;
        }
      delete [] d1;
      sqlite3_finalize(ppStmt);
      return true;
    }
    delete [] d1;
  }
  sqlite3_finalize(ppStmt);
  return false;
}

bool Algo_finalpos::equals_current(unsigned int id1) { 
  // to be used only during processing
  // id1 here corresponds to a game id
  bool result = true;
  sqlite3_stmt *ppStmt=0;
  char sql[100];
  sprintf(sql, "select data from algo_finalpos_%d where id = %d", boardsize, id1);
  int rc = sqlite3_prepare(db, sql, -1, &ppStmt, 0);
  if (rc != SQLITE_OK || ppStmt==0) return false; // FIXME: catch certain errors, (and/or throw DBError?)
  if (sqlite3_step(ppStmt) == SQLITE_ROW) {
    char* d = (char*)sqlite3_column_blob(ppStmt, 0);
    for(int i=0; i<100; i++) 
      if (d[i] != fp[i]) {
        result = false;
        break;
      }
  } else result = false;
  sqlite3_finalize(ppStmt);
  return result;
}


Algo_movelist::Algo_movelist(int bsize) : Algorithm(bsize) {
  data1 = 0;
  data2 = 0;
  data1l = 0;
}

Algo_movelist::~Algo_movelist() {
  if (data1) {
    for(map<int, char* >::iterator it = data1->begin(); it != data1->end(); it++) {
      delete [] it->second;
    }
    delete data1;
  }
  if (data2) {
    for(map<int, char* >::iterator it = data2->begin(); it != data2->end(); it++) {
      delete [] it->second;
    }
    delete data2;
  }
  if (data1l) delete data1l;
}

void Algo_movelist::initialize_process(sqlite3* DB) throw(DBError) {
  // printf("init Algo_movelist\n");
  db = DB;
  char sql[100];
  sprintf(sql, "create table if not exists algo_movelist_%d ( id integer primary key, movelist blob, fpC blob );", boardsize);
  int rc = sqlite3_exec(db, sql, 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();
  // printf("init Algo_movelist\n");
}

void Algo_movelist::newgame_process(int game_id) {
  gid = game_id;
  movelist = vector<char>();

  fpC = new char[50];
  for(int i=0; i<50; i++) fpC[i] = 0;
}

void Algo_movelist::AB_process(int x, int y) {
  movelist.push_back((char)x);
  movelist.push_back((char)(y | BLACK));
}
        

void Algo_movelist::AW_process(int x, int y) {
  movelist.push_back((char)x);
  movelist.push_back((char)(y | WHITE));
}


void Algo_movelist::AE_process(int x, int y, char removed) {
  movelist.push_back((char)x);
  if (removed == 'B') movelist.push_back((char)(y | REMOVE | BLACK));
  else if (removed == 'W') movelist.push_back((char)(y | REMOVE | WHITE));
}

void Algo_movelist::endOfNode_process() {
  if (movelist.size()>1) {
    if (movelist[movelist.size()-2] & (ENDOFNODE | BRANCHPOINT | ENDOFVARIATION)) {
      movelist.push_back(ENDOFNODE);
      movelist.push_back(0);
    } else {
      movelist[movelist.size()-2] |= ENDOFNODE;
    }
  } else {
    movelist.push_back(ENDOFNODE);
    movelist.push_back(0);
  }
}

void Algo_movelist::move_process(Move m) {
  if (!movelist.size()) {
    movelist.push_back(ENDOFNODE);
    movelist.push_back(0);
  }
  movelist.push_back(m.x);
  if (m.color=='B') movelist.push_back(m.y | BLACK);
  else movelist.push_back(m.y | WHITE);

  if (m.captures) {
    vector<p_cc>::iterator it;
    for(it = m.captures->begin(); it != m.captures->end(); it++) {
      int xx = it->first;
      int yy = it->second;

      movelist.push_back(xx);
      if (m.color=='B') movelist.push_back(yy | REMOVE | WHITE);
      else movelist.push_back(yy | REMOVE | BLACK);
      fpC[yy/4 + 5*(xx/2)] |= 1 << (xx%2 + 2*(yy%4));
    }
  }
}

void Algo_movelist::pass_process() {
  movelist.push_back(19);
  movelist.push_back(19);
}

void Algo_movelist::branchpoint_process() {
  movelist.push_back(BRANCHPOINT);
  movelist.push_back(0);
}

void Algo_movelist::endOfVariation_process() {
  movelist.push_back(ENDOFVARIATION);
  movelist.push_back(0);
}

void Algo_movelist::endgame_process(bool commit) throw(DBError) {
  if (commit) {
    char* ml = new char[movelist.size()];
    int mlIndex = 0;
    for(vector<char>::iterator it = movelist.begin(); it != movelist.end(); it++) {
      ml[mlIndex++] = *it;
    }
    char sql[100];
    sprintf(sql, "insert into algo_movelist_%d (id, movelist, fpC) values (?, ?, ?);", boardsize);
    if (dbinsert2blobs(db, sql, gid, ml, mlIndex, fpC, 50)) throw DBError();
    delete [] ml;
  }
  delete [] fpC;
}

void Algo_movelist::finalize_process() {
}

int Algo_movelist::readDB(sqlite3* DB) {
  if (data1) {
    for(map<int, char* >::iterator it = data1->begin(); it != data1->end(); it++) delete [] it->second;
    delete data1;
  }
  data1 = new map<int, char* >;
  if (data1l) delete data1l;
  data1l = new map<int, int >;
  if (data2) {
    for(map<int, char* >::iterator it = data2->begin(); it != data2->end(); it++) delete [] it->second;
    delete data2;
  }
  data2 = new map<int, char* >;
  db = DB;

  int rc = sqlite3_exec(db, "begin transaction;", 0, 0, 0);
  if (rc) throw DBError();

  sqlite3_stmt *ppStmt=0;
  char sql[100];
  sprintf(sql, "select movelist,fpC,id from algo_movelist_%d order by id", boardsize);
  rc = sqlite3_prepare(db, sql, -1, &ppStmt, 0);
  if (rc != SQLITE_OK || ppStmt==0) return rc; // FIXME: catch certain errors, (and/or throw DBError?)
  while (sqlite3_step(ppStmt) == SQLITE_ROW) {
    int l = sqlite3_column_bytes(ppStmt,0);
    // printf("len movelist: %d\n", l);
    char* d = (char*)sqlite3_column_blob(ppStmt, 0);
    char* d1 = new char[l];
    for(int i=0; i<l; i++) {
      d1[i] = d[i];
      // printf("%c", (d[i] & 31)+97);
    }
    int index = sqlite3_column_int(ppStmt, 2);
    // printf("\n");
    data1->insert(make_pair(index, d1));
    data1l->insert(make_pair(index, l));
    d = (char*)sqlite3_column_blob(ppStmt, 1);
    d1 = new char[50];
    {
      for(int i=0; i<50; i++) d1[i] = d[i];
    }
    data2->insert(make_pair(index, d1));
  }
  rc = sqlite3_finalize(ppStmt);
  if (rc != SQLITE_OK) return rc;

  rc = sqlite3_exec(db, "commit;", 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();
  // printf("data sizes %d, %d, %d\n", data1->size(), data1l->size(), data2->size());
  return 0;
}


MovelistCand::MovelistCand(Pattern* P, int ORIENTATION, char* DICTS, int NO, char X, char Y) {
  orientation = ORIENTATION;
  p = P;
  mx = X;
  my = Y;
  Xinterv = make_pair(mx, mx+p->sizeX);
  Yinterv = make_pair(my, my+p->sizeY);

  dicts = DICTS;
  dictsNO = NO;
  contListIndex = 0;
  dictsFound = false;
  dictsFoundInitial = false;
  dictsDR = false;
  contList = p->contList; // FIXME
}

MovelistCand::~MovelistCand() {
  delete [] dicts;
}

char MovelistCand::dictsget(char x, char y) {
  return dicts[x-mx + p->sizeX*(y-my)];
}

void MovelistCand::dictsset(char x, char y, char d) {
  dicts[x-mx + p->sizeX*(y-my)] = d;
}

bool MovelistCand::in_relevant_region(char x, char y) {
  return (mx <= x && x < mx + p->sizeX && my <= y && y < my + p->sizeY);
}


VecMC::VecMC() : vector<MovelistCand* >() {
  candssize = 0;
}

VecMC::~VecMC() {
  for(VecMC::iterator it = begin(); it != end(); it++) {
    if (*it) delete *it;
  }
}

VecMC* VecMC::deepcopy(ExtendedMoveNumber& COUNTER, int CANDSSIZE) {
  VecMC* result = new VecMC;
  result->candssize = CANDSSIZE;
  result->counter = COUNTER;
  for(VecMC::iterator it = begin(); it != end(); it++) {
    MovelistCand* mlc = 0;
    if (*it) {
      char* DICTS = new char[(*it)->p->sizeX * (*it)->p->sizeY];
      for (int i=0; i < (*it)->p->sizeX * (*it)->p->sizeY; i++) DICTS[i] = (*it)->dicts[i];
      mlc = new MovelistCand((*it)->p, (*it)->orientation, DICTS, (*it)->dictsNO, (*it)->mx, (*it)->my);
      mlc->contListIndex = (*it)->contListIndex;
      mlc->dictsFound = (*it)->dictsFound;
      mlc->dictsF = (*it)->dictsF;
      mlc->dictsFoundInitial = (*it)->dictsFoundInitial;
      mlc->dictsFI = (*it)->dictsFI;
      mlc->dictsDR = (*it)->dictsDR;
      mlc->contList = mlc->p->contList; // FIXME
    }
    result->push_back(mlc);
  }
  return result;
}

int Algo_movelist::search(PatternList& patternList, GameList& gl, SearchOptions& options) { 
  // FIXME progbar

  // printf("Enter Algo_movelist::search\n");
  int numOfHits = 0;
  int self_numOfSwitched = 0;
  int Bwins = 0;
  int Wwins = 0;

  int movelimit = options.moveLimit;

  int index = gl.start();
  // int gameCounter = 0;

  while (index != -1) {

    // gameCounter++;
    // if (progBar && !(gameCounter % 10))
    //   progBar.redraw((progEnd-progStart)*gameCounter/len(db.current) + progStart);
    
    // printf("Process index %d\n", index);

    vector<Hit* > * result = new vector<Hit* >;
    int numOfSwitched = 0;
    stack<VecMC* > branchpoints;

    char* movel = (*data1)[index];
    int movelistIndex = 0;
    int endMovelist = (*data1l)[index];
    // printf("len movelist: %d\n", (*data1l)[index]);
    // int nodeCtr = 0;
    // for(int i=0; i<endMovelist/2; i++) {
      // printf(" - ");
      // if (movel[2*i] & BRANCHPOINT) printf("BP\n");
      // if (movel[2*i] & ENDOFVARIATION) printf("EV\n");
      // if (movel[2*i+1] & BLACK) printf("B");
      // if (movel[2*i+1] & WHITE) printf("W");
      // if (movel[2*i+1] & REMOVE) printf("C");
      // printf("%c", (movel[2*i] & 31)+97);
      // printf("%c", (movel[2*i+1] & 31)+97);
      // if (movel[2*i] & ENDOFNODE) printf("\n%d ", nodeCtr++);
    // }
    // printf("\n");

    char* fpC = (*data2)[index];

    vector<Candidate* > *currentMatchList = gl.getCurrentCandidateList();
    int candssize = currentMatchList->size();
    VecMC* cands = new VecMC;
    cands->reserve(currentMatchList->size());

    for(int mCounter=0; mCounter<(int)currentMatchList->size(); mCounter++) {
      Candidate* m = (*currentMatchList)[mCounter];
      int dNO = 0;
      Pattern* p = &patternList.data[m->orientation];
      char* d = new char[p->sizeX * p->sizeY];
      for(int i=0; i<p->sizeX; i++) {
        for(int j=0; j<p->sizeY; j++) {
          char p_ij = p->getInitial(i,j);
          if (p_ij != '.') d[i+p->sizeX*j] = p_ij;
          else d[i+p->sizeX*j] = 0;
          if (p_ij == 'X' || p_ij == 'O') dNO++;
        }
      }
      cands->push_back(new MovelistCand(p, m->orientation, d, dNO, m->x, m->y));
    }
    // printf("candssize %d\n", cands->size());

    ExtendedMoveNumber counter(0);

    while (movelistIndex < endMovelist) {
      // printf("\nnextmove %d\n", counter.total_move_num());
      if (counter.total_move_num() == movelimit+1) {
        for(vector<MovelistCand* >::iterator it = cands->begin(); it != cands->end(); it++) {
          if (*it == 0) continue;
          if (!(*it)->dictsFound) {
            delete *it;
            *it = 0;
            candssize--;
          }
        }
      }
      if (options.searchInVariations && movel[movelistIndex] & BRANCHPOINT) {
        // printf("branchpoint\n");
        branchpoints.push(cands->deepcopy(counter, candssize));
        movelistIndex += 2;
        continue;
      } 
      if (options.searchInVariations && movel[movelistIndex] & ENDOFVARIATION) {
        // printf("endofvariation\n");
        if (!patternList.nextMove) { // deal with hits w/o continuation
          for(vector<MovelistCand* >::iterator it = cands->begin(); it != cands->end(); it++) {
            if (*it == 0) continue;
            if ((*it)->dictsFound) {
              if ((*it)->p->colorSwitch) {
                numOfSwitched++;
                char* rstr = new char[3];
                rstr[0] = NO_CONT;
                rstr[1] = 0;
                rstr[2] = 1;
                result->push_back(new Hit(new ExtendedMoveNumber((*it)->dictsF), rstr));
              } else {
                char* rstr = new char[3];
                rstr[0] = NO_CONT;
                rstr[1] = 0;
                rstr[2] = 0;
                result->push_back(new Hit(new ExtendedMoveNumber((*it)->dictsF), rstr));
              }
            }
          }
        }

        delete cands;
        cands = branchpoints.top();
        counter = cands->counter;
        candssize = cands->candssize;
        counter.down();
        branchpoints.pop();
        movelistIndex += 2;
        continue;
      }

      char x = movel[movelistIndex] & 31;
      char y = movel[movelistIndex+1] & 31;

      char co = 'O';
      char invco = 'X';
      char lower_invco = 'x';

      if (!(movel[movelistIndex+1] & REMOVE) && (movel[movelistIndex+1] & (BLACK | WHITE))) {
        // printf("mv\n");
        if (movel[movelistIndex+1] & BLACK) {
          co = 'X';
          invco = 'O';
          lower_invco = 'o';
        }

        for(vector<MovelistCand* >::iterator it = cands->begin(); it != cands->end(); it++) {
          if (*it == 0) continue;
          if ((*it)->in_relevant_region(x,y)) {
            // printf("loop 1\n %c", (*it)->dictsget(x,y));
            if ((*it)->dictsFound) { // found, so now we have found the continuation
              // printf("found\n");
              char* label;
              label = patternList.updateContinuations(
                  (*it)->orientation, // pattern in question
                  x-(*it)->mx, y-(*it)->my, // pos of continuation
                  co, // color of continuation
                  (counter.total_move_num()-(*it)->dictsF.total_move_num())>2, // tenuki?
                  gl.getCurrentWinner()
                  );
              if (label) { // otherwise no hit because continuation has wrong color (i.e. nextMove set)
                numOfSwitched += label[2];
                result->push_back(new Hit(new ExtendedMoveNumber((*it)->dictsF), label));
              }

              delete *it;
              *it = 0;
              candssize--;
              continue;
            } else if ((*it)->dictsFoundInitial) { // foundInitial, so now look for contList
              if (MoveNC(x, y, co) == ((*it)->contList)[(*it)->contListIndex]) {
                (*it)->contListIndex++;
                if ((*it)->contListIndex == (int)(*it)->contList.size()) {
                  (*it)->dictsF = counter;
                  (*it)->dictsFound = true;
                }
              } else {
                if ((*it)->dictsDR) { // don't restore
                  delete *it;
                  *it = 0;
                  candssize--;
                  continue;
                } else {
                  (*it)->contListIndex = 0;
                  (*it)->dictsFoundInitial = false;
                }
              }
            }

            if (!(*it)->dictsget(x,y)) { // this move occupies a spot which should be empty
              if (!(fpC[y/4 + 5*(x/2)] & (1 << (x%2 + 2*(y%4))))) {
                if (!(*it)->contListIndex) {
                  delete *it;
                  *it = 0;
                  candssize--;
                  continue;
                } else (*it)->dictsDR = true;
              } else {
                (*it)->dictsset(x,y,'.');
                (*it)->dictsNO++; // printf("++ A\n");
              }
            } else if ((*it)->dictsget(x,y) == lower_invco) {
              // this move occupies a wildcard spot of the wrong color
              if (!(fpC[y/4 + 5*(x/2)] & (1 << (x%2 + 2*(y%4))))) {
                if (!(*it)->contListIndex) {
                  delete *it;
                  *it = 0;
                  candssize--;
                  continue;
                } else (*it)->dictsDR = true;
              } else (*it)->dictsNO++; // printf("++ B\n");
            } else if ((*it)->dictsget(x,y) == co) {
              // this move gives us the stone we are looking for
              (*it)->dictsset(x,y,0);
              (*it)->dictsNO--; // printf("-- A\n");
            }
          }
        }
      }
      else if (movel[movelistIndex+1] & REMOVE) {
        if (movel[movelistIndex+1] & BLACK) {
          co = 'X';
          invco = 'O';
          lower_invco = 'o';
        } else if (movel[movelistIndex+1] & WHITE) {
          co = 'O';
          invco = 'X';
          lower_invco = 'x';
        }

        for(vector<MovelistCand* >::iterator it = cands->begin(); it != cands->end(); it++) {
          // printf("loop 2\n");
          if (*it == 0) continue;
          if (!(*it)->dictsFound) { // not found yet
            if ((*it)->in_relevant_region(x,y)) {
              if ((*it)->dictsFoundInitial) { // foundInitial
                int ii = (*it)->contListIndex;
                while (ii < (int)(*it)->contList.size() && (*it)->contList[ii].color == '-' &&
                    (x != (*it)->contList[ii].x || y != (*it)->contList[ii].y))
                  ii++;
                if (ii < (int)(*it)->contList.size() && (*it)->contList[ii].color == '-') {
                  MoveNC help = (*it)->contList[ii];
                  (*it)->contList[ii] = (*it)->contList[(*it)->contListIndex];
                  (*it)->contList[(*it)->contListIndex] = help;

                  (*it)->contListIndex++;
                } else {
                  if ((*it)->dictsDR) {
                    delete *it;
                    *it = 0;
                    candssize--;
                    continue;
                  } else {
                    (*it)->contListIndex = 0;
                    (*it)->dictsFoundInitial = false; 
                  }
                }
              }
              if (!(*it)->dictsget(x,y)) { 
                // the stone at this position was what we needed,
                // since it was captured, we are once again looking for it:
                (*it)->dictsset(x,y,co);
                (*it)->dictsNO++; // printf("++ C\n");
              }
              else if ((*it)->dictsget(x,y) == lower_invco) { 
                (*it)->dictsNO--; // printf("-- B\n");
              }
              else if ((*it)->dictsget(x,y) == '.') {
                // we are looking for an empty spot here, so this capture is helpful:
                (*it)->dictsset(x,y,0);
                (*it)->dictsNO--; // printf("-- C\n");
              }
            }
          }
        }
      }

      if (movel[movelistIndex] & ENDOFNODE) {
        vector<MovelistCand* >::iterator candsend = cands->end();
        for(vector<MovelistCand* >::iterator it = cands->begin(); it != candsend; it++) {
          if (*it == 0) continue;
          if (!(*it)->dictsNO && !(*it)->dictsFound) {
            if (!(*it)->contList.size()) {
              (*it)->dictsF = counter;
              (*it)->dictsFound = true;
            } else if (!(*it)->dictsFoundInitial) {
              (*it)->dictsFI = counter;
              (*it)->dictsFoundInitial = true;
            } else if (!(*it)->dictsDR) { // found initial position again during processing of contList
              char* d = new char[(*it)->p->sizeX*(*it)->p->sizeY];
              for (int ct=0; ct < (*it)->p->sizeX*(*it)->p->sizeY; ct++) d[ct] = (*it)->dicts[ct];
              MovelistCand* mlc = new MovelistCand((*it)->p, (*it)->orientation, d, 0, (*it)->mx, (*it)->my);
              mlc->dictsFI = counter;
              cands->push_back(mlc);
              candssize++;
            }
          }
        }
        counter.next();
      }

      if (candssize==0 && branchpoints.size()==0) break;
      movelistIndex += 2;
    }

    // printf("assemble results\n");

    if (!patternList.nextMove) { // look at matches w/o continuation
      for(vector<MovelistCand* >::iterator it = cands->begin(); it != cands->end(); it++) {
        if (*it == 0) continue;
        if ((*it)->dictsFound) {
          if ((*it)->p->colorSwitch) {
            numOfSwitched++;
            char* rstr = new char[3];
            rstr[0] = NO_CONT;
            rstr[1] = 0;
            rstr[2] = 1;
            result->push_back(new Hit(new ExtendedMoveNumber((*it)->dictsF), rstr)); // FIXME what w/ variations?
          } else {
            char* rstr = new char[3];
            rstr[0] = NO_CONT;
            rstr[1] = 0;
            rstr[2] = 0;
            result->push_back(new Hit(new ExtendedMoveNumber((*it)->dictsF), rstr));
          }
        }
      }
    }

    if (result->size()) {
      numOfHits += result->size();
      self_numOfSwitched += numOfSwitched;

      if (gl.getCurrentWinner() == 'B') {
        Bwins += result->size() - numOfSwitched;
        Wwins += numOfSwitched;
      } else if (gl.getCurrentWinner() == 'W') {
        Bwins += numOfSwitched;
        Wwins += result->size() - numOfSwitched;
      }
      gl.makeCurrentHit(result);
    } else delete result;
    index = gl.next();
    delete cands;
  }
  gl.num_hits = numOfHits;
  gl.num_switched = self_numOfSwitched;
  gl.Bwins = Bwins;
  gl.Wwins = Wwins;
  return 0;
}

#if (defined(__BORLANDC__) || defined(_MSC_VER))
const hashtype Algo_hash::hashCodes[] = {
  1448047776469843i64 ,  23745670021858756i64 ,  2503503679898819i64 ,  
  20893061577159209i64 ,  10807838381971450i64 ,  2362252468869198i64 ,  
  24259008893265414i64 ,  12770534669822463i64 ,  6243872632612083i64 ,  
  9878602848666731i64 ,  15403460661141300i64 ,  23328125617276831i64 ,  
  24399618481479321i64 ,  6553504962910284i64 ,  1670313139184804i64 ,  
  12980312942597170i64 ,  20479559860862969i64 ,  9622188310955879i64 ,  
  240315181816498i64 ,  15806748501866401i64 ,  11025185739521454i64 ,  
  9892014082139049i64 ,  24468178939325513i64 ,  18336761931886570i64 ,  
  17607110247268341i64 ,  1659968630984898i64 ,  15644176636883129i64 ,  
  21288430710467667i64 ,  21718647773405600i64 ,  8449573198599383i64 ,  
  12949198458251018i64 ,  13260609204816340i64 ,  15942818511406502i64 ,  
  19422389391992560i64 ,  2306873372585698i64 ,  13245768415868578i64 ,  
  3527685889767840i64 ,  16821792770065498i64 ,  14659578113224043i64 ,  
  8882299950073676i64 ,  7855747638699870i64 ,  11443553816792995i64 ,  
  10278034782711378i64 ,  9888977721917330i64 ,  8622555585025384i64 ,
  20622776792089008i64 ,  6447699412562541i64 ,  21593237574254863i64 ,
  4100056509197325i64 ,  8358405560798101i64 ,  24120904895822569i64 ,
  21004758159739407i64 ,  4380824971205155i64 ,  23810250238005035i64 ,
  11573868012372637i64 ,  21740007761325076i64 ,  20569500166060069i64 ,
  23367084743140030i64 ,  832128940274250i64 ,  3863567854976796i64 ,
  8401188629788306i64 ,  20293444021869434i64 ,  12476938100997420i64 ,
  5997141871489394i64 ,  777596196611050i64 ,  8407423122275781i64 ,
  23742268390341663i64 ,  6606677504119583i64 ,  17099083579458611i64 ,
  128040681345920i64 ,  7441253945309846i64 ,  17672412151152227i64 ,
  14657002484427869i64 ,  3764334613856311i64 ,  7399928989161192i64 ,
  24730167942169592i64 ,  13814924480574978i64 ,  5810810907567287i64 ,
  7008927747711241i64 ,  3714629224790215i64 ,  9946435535599731i64 ,
  20057491299504334i64 ,  15866852457019228i64 ,  123155262761331i64 ,
  1315783062254243i64 ,  24497766846727950i64 ,  12902532251391440i64 ,
  16788431106050494i64 ,  15993209359043506i64 ,  6163570598235227i64 ,
  23479274902645580i64 ,  12086295521073246i64 ,  14074331278381816i64 ,
  1049820141442769i64 ,  5160957003350972i64 ,  24302799572195320i64 ,
  23881606652035662i64 ,  23969818184919245i64 ,  19374430422494128i64 ,
  9346353622623467i64 ,  13646698673919768i64 ,  20787456987251805i64 ,
  19834903548127921i64 ,  8194151691638546i64 ,  7687885124853709i64 ,
  4843137186034754i64 ,  23141719256229263i64 ,  5528755394284040i64 ,
  22362536622784133i64 ,  7624654257445620i64 ,  8792845080211956i64 ,
  24991012676161170i64 ,  5382030845010972i64 ,  1942150054817210i64 ,
  1024267612932772i64 ,  14257279792025309i64 ,  11127353401828247i64 ,
  4123063511789286i64 ,  363215666444395i64 ,  15523634951795520i64 ,
  21114031740764324i64 ,  12549698630972549i64 ,  7906682572409157i64 ,
  9682658163949194i64 ,  14445831019902887i64 ,  19796086007848283i64 ,
  25041651202294181i64 ,  434144873391024i64 ,  24468825775827696i64 ,
  16436890395501393i64 ,  16373785289815135i64 ,  16626551488832360i64 ,
  7748715007439309i64 ,  22731617567631698i64 ,  14232800365889972i64 ,
  10951727445457549i64 ,  8041373240290953i64 ,  24930514145406896i64 ,
  9591184974667554i64 ,  24880672410562956i64 ,  23221721160805093i64 ,
  20593543181655919i64 ,  23599230930155014i64 ,  15520097083998302i64 ,
  14424914931817466i64 ,  7073972177203460i64 ,  16674214483955582i64 ,
  4557916889838393i64 ,  14520120252661131i64 ,  2948253205366287i64 ,
  18549806070390636i64 ,  10409566723123418i64 ,  18398906015238963i64 ,
  21169009649313417i64 ,  18391044531337716i64 ,  2911838512392375i64 ,
  13771057876708721i64 ,  11955633853535396i64 ,  18911960208175147i64 ,
  1483143365895487i64 ,  5864164841327281i64 ,  16798674080914657i64 ,
  21169543712647072i64 ,  2554895121282201i64 ,  12465286616181485i64 ,
  5756888636558955i64 ,  2597276631190750i64 ,  2560624395830604i64 ,
  20296901708171088i64 ,  14642976680682096i64 ,  12194169777111940i64 ,
  938262584370639i64 ,  7206443811292574i64 ,  501111636607822i64 ,
  5705951146039127i64 ,  19098237626875269i64 ,  5726006303511723i64 ,
  5717532750720198i64 ,  4848344546021481i64 ,  7407311808156422i64 ,
  2061821731974308i64 ,  8556380079387133i64 ,  13575103943220600i64 ,
  10594365938844562i64 ,  19966653780019989i64 ,  24412404083453688i64 ,
  8019373982039936i64 ,  7753495706295280i64 ,  838015840877266i64 ,
  5235642127051968i64 ,  10225916255867901i64 ,  14975561937408701i64 ,
  4914762527221109i64 ,  16273933213731410i64 ,  25240707945233645i64 ,
  6477894775523777i64 ,  16128190602024745i64 ,  12452291569329611i64 ,
  51030855211419i64 ,  1848783942303739i64 ,  2537297571305471i64 ,
  24811709277564335i64 ,  23354767332363093i64 ,  11338712562024830i64 ,
  10845782284945582i64 ,  20710115514013598i64 ,  19611282767915684i64 ,
  11160258605900113i64 ,  17875966449141620i64 ,  8400967803093668i64 ,
  6871997953834029i64 ,  13914235659320051i64 ,  8949576634650339i64 ,
  2143755776666584i64 ,  13309009078638265i64 ,  17871461210902733i64 ,
  11987276750060947i64 ,  19212042799964345i64 ,  9684310155516547i64 ,
  1307858104678668i64 ,  8369225045337652i64 ,  11470364009363081i64 ,
  10726698770860164i64 ,  22857364846703600i64 ,  25284735055035435i64 ,
  19224377054148393i64 ,  16403807100295998i64 ,  4653376186522389i64 ,
  15242640882406966i64 ,  15315275662931969i64 ,  11642086728644568i64 ,
  12158439227609947i64 ,  5366950703441186i64 ,  21989897136444615i64 ,
  21241101455718813i64 ,  1591417368086590i64 ,  14579493634035095i64 ,
  23329624772309429i64 ,  4022767503269837i64 ,  12858990365780377i64 ,
  1546772101519453i64 ,  23839228242060485i64 ,  3152020333001361i64 ,
  7700997223270546i64 ,  7886359803633970i64 ,  18794372628879385i64 ,
  22159114735365084i64 ,  7999390508114986i64 ,  17413096555746886i64 ,
  9385231705999634i64 ,  15875377080359488i64 ,  4319895571584052i64 ,
  15831501864738265i64 ,  23927036136254152i64 ,  9023165779396619i64 ,
  6131245054225200i64 ,  20314359892927215i64 ,  1896686091879468i64 ,
  14130616725563771i64 ,  22653904323575475i64 ,  9831497463521490i64 ,
  13110057076369419i64 ,  5902087517632052i64 ,  23714067728868348i64 ,
  10422641883492326i64 ,  10327276345146850i64 ,  795518417987648i64 ,
  25452954487907785i64 ,  3500196309207718i64 ,  14513995844064906i64 ,
  7844549909962914i64 ,  9407804562184273i64 ,  15229768031797498i64 ,
  14111656085687927i64 ,  16834184600349678i64 ,  7291182384885469i64 ,
  17771577974633552i64 ,  21586473553657942i64 ,  18166326806718423i64 ,
  10928317030329388i64 ,  13135712137024532i64 ,  12947681282864548i64 ,
  21220312239923983i64 ,  9606249244876101i64 ,  4653965165819933i64 ,
  5039148287631156i64 ,  3987726544496362i64 ,  11235885894214833i64 ,
  3549024987193191i64 ,  6369560450327424i64 ,  5296536600431238i64 ,
  10833371878822587i64 ,  5746338282416722i64 ,  20335144029844343i64 ,
  14857534135172842i64 ,  13933887642921338i64 ,  3610489245941154i64 ,
  7780064458218242i64 ,  18217608762631328i64 ,  4861734558486078i64 ,
  19138089389909524i64 ,  162404484845663i64 ,  6326150309736266i64 ,
  5691634479075905i64 ,  14377989390160001i64 ,  7788436404648140i64 ,
  20312143630017606i64 ,  6781467023516504i64 ,  7265384191721189i64 ,
  13990392558924592i64 ,  4811546322556989i64 ,  3891404257596968i64 ,
  19222546653408634i64 ,  9733466771346453i64 ,  20011679489309705i64 ,
  11556921572925005i64 ,  13429005557512149i64 ,  16680841455593148i64 ,
  394589115298971i64 ,  22224576785554448i64 ,  18262625753524808i64 ,
  20893780129453860i64 ,  25064972830160559i64 ,  241970110039610i64 ,
  7452533933839720i64 ,  10726026396546933i64 ,  17312051917081899i64 ,
  17281553837379637i64 ,  24008819488103387i64 ,  5193878516496164i64 ,
  21529615734706496i64 ,  22844915602846365i64 ,  17118246686087168i64 ,
  6560869056902581i64 ,  10553021967047717i64 ,  3729950813036887i64 ,
  14459986099519295i64 ,  15808907290234758i64 ,  6234512969275540i64 ,
  18690008075805909i64 ,  492531108753402i64 ,  7721002928884704i64 ,
  4886156035126456i64 ,  21716374046066558i64 ,  11035311630511661i64 ,
  16837692753538891i64 ,  20172053977953882i64 ,  15488511700491202i64 ,
  17477921115358343i64 ,  24726937211646877i64 ,  22480504880004621i64 ,
  18521326635500559i64 ,  8076560603417178i64 ,  22382516625473209i64 ,
  21696842111535623i64 ,  12559160944089288i64 ,  1661142873895453i64 ,
  18379772814447567i64 ,  10295321430586466i64 ,  12378145201769592i64 ,  
  11815752235866582i64 };
#else
const hashtype Algo_hash::hashCodes[] = {
  1448047776469843LL ,  23745670021858756LL ,  2503503679898819LL ,  
  20893061577159209LL ,  10807838381971450LL ,  2362252468869198LL ,  
  24259008893265414LL ,  12770534669822463LL ,  6243872632612083LL ,  
  9878602848666731LL ,  15403460661141300LL ,  23328125617276831LL ,  
  24399618481479321LL ,  6553504962910284LL ,  1670313139184804LL ,  
  12980312942597170LL ,  20479559860862969LL ,  9622188310955879LL ,  
  240315181816498LL ,  15806748501866401LL ,  11025185739521454LL ,  
  9892014082139049LL ,  24468178939325513LL ,  18336761931886570LL ,  
  17607110247268341LL ,  1659968630984898LL ,  15644176636883129LL ,  
  21288430710467667LL ,  21718647773405600LL ,  8449573198599383LL ,  
  12949198458251018LL ,  13260609204816340LL ,  15942818511406502LL ,  
  19422389391992560LL ,  2306873372585698LL ,  13245768415868578LL ,  
  3527685889767840LL ,  16821792770065498LL ,  14659578113224043LL ,  
  8882299950073676LL ,  7855747638699870LL ,  11443553816792995LL ,  
  10278034782711378LL ,  9888977721917330LL ,  8622555585025384LL ,
  20622776792089008LL ,  6447699412562541LL ,  21593237574254863LL ,
  4100056509197325LL ,  8358405560798101LL ,  24120904895822569LL ,
  21004758159739407LL ,  4380824971205155LL ,  23810250238005035LL ,
  11573868012372637LL ,  21740007761325076LL ,  20569500166060069LL ,
  23367084743140030LL ,  832128940274250LL ,  3863567854976796LL ,
  8401188629788306LL ,  20293444021869434LL ,  12476938100997420LL ,
  5997141871489394LL ,  777596196611050LL ,  8407423122275781LL ,
  23742268390341663LL ,  6606677504119583LL ,  17099083579458611LL ,
  128040681345920LL ,  7441253945309846LL ,  17672412151152227LL ,
  14657002484427869LL ,  3764334613856311LL ,  7399928989161192LL ,
  24730167942169592LL ,  13814924480574978LL ,  5810810907567287LL ,
  7008927747711241LL ,  3714629224790215LL ,  9946435535599731LL ,
  20057491299504334LL ,  15866852457019228LL ,  123155262761331LL ,
  1315783062254243LL ,  24497766846727950LL ,  12902532251391440LL ,
  16788431106050494LL ,  15993209359043506LL ,  6163570598235227LL ,
  23479274902645580LL ,  12086295521073246LL ,  14074331278381816LL ,
  1049820141442769LL ,  5160957003350972LL ,  24302799572195320LL ,
  23881606652035662LL ,  23969818184919245LL ,  19374430422494128LL ,
  9346353622623467LL ,  13646698673919768LL ,  20787456987251805LL ,
  19834903548127921LL ,  8194151691638546LL ,  7687885124853709LL ,
  4843137186034754LL ,  23141719256229263LL ,  5528755394284040LL ,
  22362536622784133LL ,  7624654257445620LL ,  8792845080211956LL ,
  24991012676161170LL ,  5382030845010972LL ,  1942150054817210LL ,
  1024267612932772LL ,  14257279792025309LL ,  11127353401828247LL ,
  4123063511789286LL ,  363215666444395LL ,  15523634951795520LL ,
  21114031740764324LL ,  12549698630972549LL ,  7906682572409157LL ,
  9682658163949194LL ,  14445831019902887LL ,  19796086007848283LL ,
  25041651202294181LL ,  434144873391024LL ,  24468825775827696LL ,
  16436890395501393LL ,  16373785289815135LL ,  16626551488832360LL ,
  7748715007439309LL ,  22731617567631698LL ,  14232800365889972LL ,
  10951727445457549LL ,  8041373240290953LL ,  24930514145406896LL ,
  9591184974667554LL ,  24880672410562956LL ,  23221721160805093LL ,
  20593543181655919LL ,  23599230930155014LL ,  15520097083998302LL ,
  14424914931817466LL ,  7073972177203460LL ,  16674214483955582LL ,
  4557916889838393LL ,  14520120252661131LL ,  2948253205366287LL ,
  18549806070390636LL ,  10409566723123418LL ,  18398906015238963LL ,
  21169009649313417LL ,  18391044531337716LL ,  2911838512392375LL ,
  13771057876708721LL ,  11955633853535396LL ,  18911960208175147LL ,
  1483143365895487LL ,  5864164841327281LL ,  16798674080914657LL ,
  21169543712647072LL ,  2554895121282201LL ,  12465286616181485LL ,
  5756888636558955LL ,  2597276631190750LL ,  2560624395830604LL ,
  20296901708171088LL ,  14642976680682096LL ,  12194169777111940LL ,
  938262584370639LL ,  7206443811292574LL ,  501111636607822LL ,
  5705951146039127LL ,  19098237626875269LL ,  5726006303511723LL ,
  5717532750720198LL ,  4848344546021481LL ,  7407311808156422LL ,
  2061821731974308LL ,  8556380079387133LL ,  13575103943220600LL ,
  10594365938844562LL ,  19966653780019989LL ,  24412404083453688LL ,
  8019373982039936LL ,  7753495706295280LL ,  838015840877266LL ,
  5235642127051968LL ,  10225916255867901LL ,  14975561937408701LL ,
  4914762527221109LL ,  16273933213731410LL ,  25240707945233645LL ,
  6477894775523777LL ,  16128190602024745LL ,  12452291569329611LL ,
  51030855211419LL ,  1848783942303739LL ,  2537297571305471LL ,
  24811709277564335LL ,  23354767332363093LL ,  11338712562024830LL ,
  10845782284945582LL ,  20710115514013598LL ,  19611282767915684LL ,
  11160258605900113LL ,  17875966449141620LL ,  8400967803093668LL ,
  6871997953834029LL ,  13914235659320051LL ,  8949576634650339LL ,
  2143755776666584LL ,  13309009078638265LL ,  17871461210902733LL ,
  11987276750060947LL ,  19212042799964345LL ,  9684310155516547LL ,
  1307858104678668LL ,  8369225045337652LL ,  11470364009363081LL ,
  10726698770860164LL ,  22857364846703600LL ,  25284735055035435LL ,
  19224377054148393LL ,  16403807100295998LL ,  4653376186522389LL ,
  15242640882406966LL ,  15315275662931969LL ,  11642086728644568LL ,
  12158439227609947LL ,  5366950703441186LL ,  21989897136444615LL ,
  21241101455718813LL ,  1591417368086590LL ,  14579493634035095LL ,
  23329624772309429LL ,  4022767503269837LL ,  12858990365780377LL ,
  1546772101519453LL ,  23839228242060485LL ,  3152020333001361LL ,
  7700997223270546LL ,  7886359803633970LL ,  18794372628879385LL ,
  22159114735365084LL ,  7999390508114986LL ,  17413096555746886LL ,
  9385231705999634LL ,  15875377080359488LL ,  4319895571584052LL ,
  15831501864738265LL ,  23927036136254152LL ,  9023165779396619LL ,
  6131245054225200LL ,  20314359892927215LL ,  1896686091879468LL ,
  14130616725563771LL ,  22653904323575475LL ,  9831497463521490LL ,
  13110057076369419LL ,  5902087517632052LL ,  23714067728868348LL ,
  10422641883492326LL ,  10327276345146850LL ,  795518417987648LL ,
  25452954487907785LL ,  3500196309207718LL ,  14513995844064906LL ,
  7844549909962914LL ,  9407804562184273LL ,  15229768031797498LL ,
  14111656085687927LL ,  16834184600349678LL ,  7291182384885469LL ,
  17771577974633552LL ,  21586473553657942LL ,  18166326806718423LL ,
  10928317030329388LL ,  13135712137024532LL ,  12947681282864548LL ,
  21220312239923983LL ,  9606249244876101LL ,  4653965165819933LL ,
  5039148287631156LL ,  3987726544496362LL ,  11235885894214833LL ,
  3549024987193191LL ,  6369560450327424LL ,  5296536600431238LL ,
  10833371878822587LL ,  5746338282416722LL ,  20335144029844343LL ,
  14857534135172842LL ,  13933887642921338LL ,  3610489245941154LL ,
  7780064458218242LL ,  18217608762631328LL ,  4861734558486078LL ,
  19138089389909524LL ,  162404484845663LL ,  6326150309736266LL ,
  5691634479075905LL ,  14377989390160001LL ,  7788436404648140LL ,
  20312143630017606LL ,  6781467023516504LL ,  7265384191721189LL ,
  13990392558924592LL ,  4811546322556989LL ,  3891404257596968LL ,
  19222546653408634LL ,  9733466771346453LL ,  20011679489309705LL ,
  11556921572925005LL ,  13429005557512149LL ,  16680841455593148LL ,
  394589115298971LL ,  22224576785554448LL ,  18262625753524808LL ,
  20893780129453860LL ,  25064972830160559LL ,  241970110039610LL ,
  7452533933839720LL ,  10726026396546933LL ,  17312051917081899LL ,
  17281553837379637LL ,  24008819488103387LL ,  5193878516496164LL ,
  21529615734706496LL ,  22844915602846365LL ,  17118246686087168LL ,
  6560869056902581LL ,  10553021967047717LL ,  3729950813036887LL ,
  14459986099519295LL ,  15808907290234758LL ,  6234512969275540LL ,
  18690008075805909LL ,  492531108753402LL ,  7721002928884704LL ,
  4886156035126456LL ,  21716374046066558LL ,  11035311630511661LL ,
  16837692753538891LL ,  20172053977953882LL ,  15488511700491202LL ,
  17477921115358343LL ,  24726937211646877LL ,  22480504880004621LL ,
  18521326635500559LL ,  8076560603417178LL ,  22382516625473209LL ,
  21696842111535623LL ,  12559160944089288LL ,  1661142873895453LL ,
  18379772814447567LL ,  10295321430586466LL ,  12378145201769592LL ,  
  11815752235866582LL };
#endif

HashFEntry::HashFEntry(hashtype HASHCODE, char* BUF, int LENGTH) {
  hashCode = HASHCODE;
  buf = BUF;
  length = LENGTH;
}

HashFEntry::HashFEntry(const HashFEntry& hfe) {
  hashCode = hfe.hashCode;
  length = hfe.length;
  buf = new char[length];
  for(int i=0; i<length; i++) buf[i] = hfe.buf[i];
}

HashFEntry::~HashFEntry() {
  if (buf) {
    delete [] buf;
    buf = 0;
  }
}

HashhitF::HashhitF(int GAMEID, char ORIENTATION, char* blob) {
  gameid = GAMEID;
  orientation = ORIENTATION;
  cont = new MoveNC(blob[0], blob[1], blob[2]);
  emn = new ExtendedMoveNumber;
  emn->length = blob[3] * 256 + blob[4];
  emn->data = new int[emn->length];
  for(int i=0; i<emn->length; i++) {
    emn->data[i] = blob[5+2*i]*256 + blob[6+2*i];
  }
}

HashhitF::HashhitF() {
  cont = 0;
  emn = 0;
}

HashhitF::~HashhitF() {
  if (cont) delete cont;
  if (emn) delete emn;
}

bool cmp_HashhitF(const HashhitF* a, const HashhitF* b) {
  return a->gameid < b->gameid;
}

HashhitCS::HashhitCS(int GAMEID, int POSITION, bool CS) {
  gameid = GAMEID;
  position = POSITION;
  cs = CS;
}

bool cmp_HashhitCS(const HashhitCS* a, const HashhitCS* b) {
  return a->gameid < b->gameid;
}


typedef vector<HashhitF* >* vpsip;


HashVarInfo::HashVarInfo(hashtype CHC, vector<pair<hashtype, ExtendedMoveNumber>* > * LFC,
                         ExtendedMoveNumber* MOVENUMBER, int NUMSTONES) {
  chc = CHC;
  numStones = NUMSTONES;
  moveNumber = new ExtendedMoveNumber(*MOVENUMBER);
  lfc = new vector<pair<hashtype, ExtendedMoveNumber>* >;
  for(vector<pair<hashtype, ExtendedMoveNumber>* >::iterator it = LFC->begin(); it != LFC->end(); it++) {
    lfc->push_back(new pair<hashtype, ExtendedMoveNumber>((*it)->first, (*it)->second));
  }
}


Algo_hash_full::Algo_hash_full(int bsize, int MAXNUMSTONES) : Algorithm(bsize) {
  branchpoints = 0;
  maxNumStones = MAXNUMSTONES;
}

Algo_hash_full::~Algo_hash_full() {
}

int Algo_hash_full::insert_hash(hashtype hashCode, ExtendedMoveNumber& mn, Move* continuation) {
  // printf("insert %lld\n", hashCode);
  char* buf = new char[30 + mn.length*2];
  if (continuation) {
    buf[0] = continuation->x;
    buf[1] = continuation->y;
    buf[2] = continuation->color;
  } else {
    buf[0] = NO_CONT;
    buf[1] = 0;
    buf[2] = 0;
  }
  buf[3] = mn.length/256;
  buf[4] = mn.length%256;
  for (int i=0; i<mn.length; i++) {
    buf[5+2*i] = mn.data[i]/265;
    buf[6+2*i] = mn.data[i]%256;
  }
  hash_vector.push_back(HashFEntry(hashCode, buf, 5+2*mn.length));
  return 0;
}

int Algo_hash_full::insert_all_hashes() {
  char sql[100];
  sprintf(sql, "insert into algo_hash_full_%d (hash, gameid, hit) values (?,?,?);", boardsize);
  sqlite3_stmt *ppStmt=0;
  int rc = sqlite3_prepare(db, sql, -1, &ppStmt, 0);
  if (rc != SQLITE_OK || ppStmt==0) return rc;
  for(vector<HashFEntry>::iterator it = hash_vector.begin(); it != hash_vector.end(); it++) {
    rc = sqlite3_bind_int64(ppStmt, 1, it->hashCode);
    if (rc != SQLITE_OK) return rc;
    rc = sqlite3_bind_int(ppStmt, 2, gid);
    if (rc != SQLITE_OK) return rc;
    rc = sqlite3_bind_blob(ppStmt, 3, it->buf, it->length, SQLITE_TRANSIENT); 
    if (rc != SQLITE_OK) return rc;
    rc = sqlite3_step(ppStmt);
    if (rc != SQLITE_DONE) return rc;
    rc = sqlite3_reset(ppStmt);
    if (rc != SQLITE_OK) return rc;
  }
  rc = sqlite3_finalize(ppStmt);
  if (rc != SQLITE_OK) return rc;
  hash_vector.clear();
  return 0; // success
}

void Algo_hash_full::initialize_process(sqlite3* DB) throw(DBError) {
  // printf("enter algo_hash_full::initialize_processing\n");
  db = DB;
  char sql[200];
  sprintf(sql, "create table if not exists algo_hash_full_%d ( id integer primary key, hash integer, gameid integer, hit text );", boardsize);
  int rc = sqlite3_exec(db, sql, 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();
  sprintf(sql, "create index if not exists hash_idx on algo_hash_full_%d(hash);", boardsize);
  rc = sqlite3_exec(db, sql, 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();
  // printf("leave algo_hash_full::initialize_processing\n");
}

void Algo_hash_full::newgame_process(int game_id) {
  numStones = 0;
  gid = game_id;
  moveNumber = new ExtendedMoveNumber(0);
  currentHashCode = 0; // start with empty board
  lfc = new vector<pair<hashtype, ExtendedMoveNumber>* >;
  branchpoints = new stack<HashVarInfo>;
}

void Algo_hash_full::AB_process(int x, int y) {
  for(vector<pair<hashtype, ExtendedMoveNumber>* >::iterator it = lfc->begin(); it != lfc->end(); it++) {
    Move* continuation = new Move(x,y,'B');
    if (insert_hash((*it)->first, (*it)->second, continuation) != 0) throw DBError();
    delete continuation;
    delete *it;
  }
  delete lfc;
  lfc = new vector<pair<hashtype, ExtendedMoveNumber>* >;
  currentHashCode += Algo_hash::hashCodes[x + boardsize*y];
  numStones++;
}

void Algo_hash_full::AW_process(int x, int y) {
  for(vector<pair<hashtype, ExtendedMoveNumber>* >::iterator it = lfc->begin(); it != lfc->end(); it++) {
    Move* continuation = new Move(x,y,'W');
    if (insert_hash((*it)->first, (*it)->second, continuation) != 0) throw DBError();
    delete continuation;
    delete *it;
  }
  delete lfc;
  lfc = new vector<pair<hashtype, ExtendedMoveNumber>* >;
  currentHashCode -= Algo_hash::hashCodes[x + boardsize*y];
  numStones++;
}                 

void Algo_hash_full::AE_process(int x, int y, char removed) {
  if (removed == 'B') currentHashCode -= Algo_hash::hashCodes[x + boardsize*y];
  else currentHashCode += Algo_hash::hashCodes[x + boardsize*y];
  numStones--;
}

void Algo_hash_full::endOfNode_process() {
  if (numStones <= maxNumStones) lfc->push_back(new pair<hashtype, ExtendedMoveNumber>(currentHashCode, *moveNumber));
  moveNumber->next();
}

void Algo_hash_full::pass_process() {
  // (we do not count pass as continuation)
}

void Algo_hash_full::move_process(Move m) throw(DBError) {
  for(vector<pair<hashtype, ExtendedMoveNumber>* >::iterator it = lfc->begin(); it != lfc->end(); it++) {
    Move* continuation = new Move(m);
    int rc = insert_hash((*it)->first, (*it)->second, continuation);
    if (rc != 0) throw DBError();
    delete continuation;
    delete *it;
  }
  delete lfc;
  lfc = new vector<pair<hashtype, ExtendedMoveNumber>* >;
  int epsilon = (m.color == 'B' || m.color == 'X' ? 1 : -1);
  currentHashCode += epsilon * Algo_hash::hashCodes[m.x + boardsize*m.y];
  numStones++;

  if (m.captures) {
    vector<p_cc>::iterator it;
    for(it = m.captures->begin(); it != m.captures->end(); it++) {
      int xx = it->first;
      int yy = it->second;

      currentHashCode += epsilon * Algo_hash::hashCodes[xx + boardsize*yy];
      numStones--;
    }
  }
}

void Algo_hash_full::branchpoint_process() {
  branchpoints->push(HashVarInfo(currentHashCode, lfc, moveNumber, numStones));
  // printf("push %lld\n", currentHashCode);
}

void Algo_hash_full::endOfVariation_process() throw(DBError) {
  for(vector<pair<hashtype, ExtendedMoveNumber>* >::iterator it = lfc->begin(); it != lfc->end(); it++) {
    int rc = insert_hash((*it)->first, (*it)->second, 0);
    if (rc != 0) throw DBError();
    delete *it;
  }
  delete lfc;
  delete moveNumber;
  currentHashCode = branchpoints->top().chc;
  lfc = branchpoints->top().lfc;
  moveNumber = branchpoints->top().moveNumber;
  numStones = branchpoints->top().numStones;
  // printf("pop %lld\n", currentHashCode);
  branchpoints->pop();
}

void Algo_hash_full::endgame_process(bool commit) throw(DBError) {
  for(vector<pair<hashtype, ExtendedMoveNumber>* >::iterator it = lfc->begin(); it != lfc->end(); it++) {
    Move* continuation = 0;
    int rc = insert_hash((*it)->first, (*it)->second, continuation);
    if (rc != 0) throw DBError();
    delete *it;
  }
  if (commit) {
    int rc = insert_all_hashes();
    if (rc) printf("ouch %d\n",rc);
  } else hash_vector.clear();
  delete lfc;
  delete moveNumber;
  delete branchpoints;
}
 
void Algo_hash_full::finalize_process() {
}


hashtype Algo_hash_full::compute_hashkey(Pattern& pattern) {
  if (pattern.sizeX != boardsize || pattern.sizeY != boardsize)
    return NOT_HASHABLE;
  hashtype hashkey = 0;
  int ns = 0;          
  for(int i=0; i<boardsize; i++) {
    for(int j=0; j<boardsize; j++) {
      char p = pattern.finalPos[i + boardsize*j];
      if (p == 'x' || p ==  'o' || p == '*') return NOT_HASHABLE;
      else if (p == 'X') {
        hashkey += Algo_hash::hashCodes[i + boardsize*j];
        ns++;
      } else if (p == 'O') {
        hashkey -= Algo_hash::hashCodes[i + boardsize*j];
        ns++;
      }
    }
  }
  if (ns > maxNumStones) return NOT_HASHABLE;
  return hashkey;
}

int insert_result_hf(void *results, int argc, char **argv, char **azColName) throw (DBError) {
  vpsip res = ((pair<vpsip, int>*)results)->first;
  int orientation = ((pair<vpsip, int>*)results)->second;
  if (argc==2 && argv[0]) {
    res->push_back(new HashhitF(atoi(argv[0]), orientation, argv[1]));
  } else throw DBError();
  return 0;
}


int Algo_hash_full::search(PatternList& patternList, GameList& gl, SearchOptions& options, sqlite3* db) {
  // printf("enter algo_hash_full::search\n");
  int numOfHits = 0;
  int self_numOfSwitched = 0;
  int Bwins = 0;
  int Wwins = 0;

  int hash_result = -1; // -1 = failure; 0 = ok, but have to check w/ Algo_movelist, 1 = ok, produced final result
  int plS = patternList.size();
  vpsip results = new vector<HashhitF* >;
  for(int N=0; N<plS; N++) {
    hashtype hashCode = compute_hashkey(patternList.data[N]);
    if (hashCode == NOT_HASHABLE) return -1; // failure

    char sql[100];
#if (defined(__BORLANDC__) || defined(_MSC_VER))
    sprintf(sql, "select gameid,hit from algo_hash_full_%d where hash = %I64d", boardsize, hashCode);
#else
    sprintf(sql, "select gameid,hit from algo_hash_full_%d where hash = %lld", boardsize, hashCode);
#endif
    // printf("hc %lld, %s\n", hashCode, sql);
    pair<vpsip, int> rN(results, N);
    sqlite3_exec(db, sql, insert_result_hf, &rN, 0);
  }
  if (options.trustHashFull && patternList.pattern.contList.size()==0) hash_result = 1;
  else hash_result = 0;
  if (gl.start_sorted() == 0) {
    sort(results->begin(), results->end(), cmp_HashhitF);
    // printf("res-size %d\n", results->size());
    vector<HashhitF* >::iterator resultIT = results->begin();
    while (resultIT != results->end()) {
      int index = (*resultIT)->gameid;

      if (hash_result) {
        gl.setCurrentFromIndex(index);
        int numOfSwitched = 0;
        vector<Hit* >* hits = new vector<Hit* >;
        while ((*resultIT)->gameid == index) {
          if ((*resultIT)->emn->total_move_num() > options.moveLimit) {
            resultIT++;
            continue;
          }
          char *label;
          if ((*resultIT)->cont->x != NO_CONT) { // continuation
            label = patternList.updateContinuations((*resultIT)->orientation, 
                                                    (*resultIT)->cont->x, (*resultIT)->cont->y, (*resultIT)->cont->color,
                                                    false, // tenuki impossible with full board pattern
                                                    gl.getCurrentWinner());
            if (label) {
              hits->push_back(new Hit((*resultIT)->emn, label));
              (*resultIT)->emn = 0;
              numOfSwitched += label[2];
            }
          } else {
            label = new char[3];
            label[0] = NO_CONT;
            label[1] = 0;
            label[2] = patternList.data[(*resultIT)->orientation].colorSwitch;
            numOfSwitched += label[2];
            hits->push_back(new Hit((*resultIT)->emn, label));
            (*resultIT)->emn = 0;
          }
          resultIT++;
          if (resultIT == results->end()) break;
        }
        if (hits->size()) {
          numOfHits += hits->size();
          self_numOfSwitched += numOfSwitched;
          if (gl.getCurrentWinner() == 'B') {
            Bwins += hits->size() - numOfSwitched;
            Wwins += numOfSwitched;
          } else if (gl.getCurrentWinner() == 'W') {
            Bwins += numOfSwitched;
            Wwins += hits->size() - numOfSwitched;
          }
          gl.makeCurrentHit(hits);
        } else delete hits;
      } else { // produce Candidate list, check using another algorithm
        vector<Candidate* >* candidates = new vector<Candidate* >;
        while ((*resultIT)->gameid == index) {
          if ((*resultIT)->emn->total_move_num() > options.moveLimit) continue;
          candidates->push_back(new Candidate(0,0,(*resultIT)->orientation));
          resultIT++;
          if (resultIT == results->end()) break;
        }
        gl.makeIndexCandidate(index, candidates);
      }
    }
    for(vector<HashhitF* >::iterator it = results->begin(); it != results->end(); it++) delete *it;
    delete results;
    gl.end_sorted();
  }
  gl.num_hits = numOfHits;
  gl.num_switched = self_numOfSwitched;
  gl.Bwins = Bwins;
  gl.Wwins = Wwins;
  return hash_result;
}

// -----------------------------------------------------------------------------------

Algo_hash::Algo_hash(int bsize, const string& DBNAMEEXT, int MAXNUMSTONES) : Algorithm(bsize) {
  dbnameext = DBNAMEEXT;
  hi = 0;
  maxNumStones = MAXNUMSTONES;
}

Algo_hash::~Algo_hash() {
  if (hi) delete hi;
}

int Algo_hash::insert_hash(hashtype hashCode, int pos) {
  hash_vector.push_back(make_pair(hashCode, pos));
  return 0;
}

int Algo_hash::insert_all_hashes() {
  // printf("insert all hashes %d\n", hash_vector.size());
  char sql[200];
  sprintf(sql, "insert into algo_hash_%d_%s (hash, gameid, position) values (?,?,?);", boardsize, dbnameext.c_str());
  sqlite3_stmt *ppStmt=0;
  int rc = sqlite3_prepare(db, sql, -1, &ppStmt, 0);
  if (rc != SQLITE_OK || ppStmt==0) return rc;
  rc = sqlite3_bind_int(ppStmt, 2, gid);
  if (rc != SQLITE_OK) return rc;
  for(vector<pair<hashtype, int> >::iterator it = hash_vector.begin(); it != hash_vector.end(); it++) {
    // printf("insert %d %d\n", it->first, it->second);
    rc = sqlite3_bind_int64(ppStmt, 1, it->first);
    if (rc != SQLITE_OK) return rc;
    rc = sqlite3_bind_int(ppStmt, 3, it->second);
    if (rc != SQLITE_OK) return rc;
    rc = sqlite3_step(ppStmt);
    if (rc != SQLITE_DONE) return rc;
    rc = sqlite3_reset(ppStmt);
    if (rc != SQLITE_OK) return rc;
  }
  rc = sqlite3_finalize(ppStmt);
  if (rc != SQLITE_OK) return rc;
  return 0; // success
}

void Algo_hash::initialize_process(sqlite3* DB) throw(DBError) {
  // printf("enter algo_hash::initialize_processing\n");
  db = DB;
  char buf[200];
  sprintf(buf, "create table if not exists algo_hash_%d_%s ( hash integer, gameid integer, position integer );", boardsize, dbnameext.c_str());
  int rc = sqlite3_exec(db, buf, 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();
  sprintf(buf, "create index if not exists hash_idx_%d_%s on algo_hash_%d_%s(hash);", boardsize, dbnameext.c_str(), boardsize, dbnameext.c_str());
  rc = sqlite3_exec(db, buf, 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();
  // printf("leave algo_hash::initialize_processing\n");
}
        
void Algo_hash::newgame_process(int game_id) {
  gid = game_id;
  for(vector<HashInstance>::iterator it = hi->begin(); it != hi->end(); it++)
    it->initialize();
}

void Algo_hash::AB_process(int x, int y) {
  for(vector<HashInstance>::iterator it = hi->begin(); it != hi->end(); it++)
    it->addB(x,y);
}

void Algo_hash::AW_process(int x, int y) {
  for(vector<HashInstance>::iterator it = hi->begin(); it != hi->end(); it++)
    it->addW(x,y);
}                 

void Algo_hash::AE_process(int x, int y, char removed) {
  if (removed == 'B') {
    for(vector<HashInstance>::iterator it = hi->begin(); it != hi->end(); it++) it->removeB(x,y);
  } else { 
    for(vector<HashInstance>::iterator it = hi->begin(); it != hi->end(); it++) it->removeW(x,y);
  }
}

void Algo_hash::endOfNode_process() {
  for(vector<HashInstance>::iterator it = hi->begin(); it != hi->end(); it++) {
    if (it->numStones <= maxNumStones && it->changed) {
      it->changed = false;
      pair<hashtype,int> phi = it->cHC();
      insert_hash(phi.first, phi.second);
      // printf("insert hash CORNER %d %d\n", phi.first, phi.second);
    }
  }
}

void Algo_hash::pass_process() {
  // (we do not count pass as continuation)
}

void Algo_hash::move_process(Move m) throw(DBError) {
  if (m.color == 'B') {
    for(vector<HashInstance>::iterator it = hi->begin(); it != hi->end(); it++)
      it->addB(m.x, m.y);
    if (m.captures) {
      for(vector<p_cc>::iterator cap_it = m.captures->begin(); cap_it != m.captures->end(); cap_it++) {
        for(vector<HashInstance>::iterator it = hi->begin(); it != hi->end(); it++)
          it->removeW(cap_it->first, cap_it->second);
      }
    }
  } else {
    for(vector<HashInstance>::iterator it = hi->begin(); it != hi->end(); it++)
      it->addW(m.x, m.y);
    if (m.captures) {
      for(vector<p_cc>::iterator cap_it = m.captures->begin(); cap_it != m.captures->end(); cap_it++) {
        for(vector<HashInstance>::iterator it = hi->begin(); it != hi->end(); it++)
          it->removeB(cap_it->first, cap_it->second);
      }
    }
  }
}

void Algo_hash::branchpoint_process() {
  for(vector<HashInstance>::iterator it = hi->begin(); it != hi->end(); it++)
    it->bppush();
}

void Algo_hash::endOfVariation_process() {
  for(vector<HashInstance>::iterator it = hi->begin(); it != hi->end(); it++)
    it->bppop();
}

void Algo_hash::endgame_process(bool commit) {
  for(vector<HashInstance>::iterator it = hi->begin(); it != hi->end(); it++)
    it->finalize();
  if (commit) {
    int rc = insert_all_hashes();
    if (rc) printf("ouch %d\n",rc);
    hash_vector.clear();
  } else hash_vector.clear();
}
 
void Algo_hash::finalize_process() {
}


pair<hashtype,int> Algo_hash::compute_hashkey(PatternList& pl, int CS) {
  return make_pair(NOT_HASHABLE,0);
}

int insert_result(void *rN, int argc, char **argv, char **azColName) throw (DBError) {
  vector<HashhitCS* >* results = ((pair<vector<HashhitCS* >*, hashtype>*)rN)->first;
  hashtype hashCode = ((pair<vector<HashhitCS* >*, hashtype>*)rN)->second;

  if (argc==3 && argv[0] && argv[1] && argv[2]) {
    // printf("found %s, %lld", argv[2], atoi(argv[2]));
#if (defined(__BORLANDC__) || defined(_MSC_VER))
    ((vector<HashhitCS* >*)results)->push_back(new HashhitCS(atoi(argv[0]), atoi(argv[1]), _atoi64(argv[2])!=hashCode));
#else
    ((vector<HashhitCS* >*)results)->push_back(new HashhitCS(atoi(argv[0]), atoi(argv[1]), atoll(argv[2])!=hashCode));
#endif
  } else throw DBError();
  return 0;
}


int Algo_hash::search(PatternList& patternList, GameList& gl, SearchOptions& options, sqlite3* db) {
  // return value: -1 = failure; 0 = ok, but have to check w/ Algo_movelist

  vector<HashhitCS* >* results = new vector<HashhitCS* >;

  pair<hashtype, int> hco = compute_hashkey(patternList, 0);
  hashtype hashCode = hco.first;
  // printf("HC %lld\n", hashCode);
  hashtype hashCode2 = hashCode;
  if (hashCode == NOT_HASHABLE) {
    delete results;
    return -1; // failure
  }
  int fl = patternList.data[hco.second].flip;
  int fl2 = fl;
  char buf[100];
#if (defined(__BORLANDC__) || defined(_MSC_VER))
  sprintf(buf, "select gameid,position,hash from algo_hash_%d_%s where hash = %I64d", 
      boardsize, dbnameext.c_str(), hashCode);
#else
  sprintf(buf, "select gameid,position,hash from algo_hash_%d_%s where hash = %lld", 
      boardsize, dbnameext.c_str(), hashCode);
#endif
  string sql = buf;

  bool cs = patternList.data[patternList.size()-1].colorSwitch;
  if (cs) {
    pair<hashtype, int> hco = compute_hashkey(patternList, 1);
    hashCode2 = hco.first;
    // printf("HC2 %lld\n", hashCode2);
    if (hashCode == NOT_HASHABLE) {
      delete results;
      return -1; // failure
    }
    fl2 = patternList.data[hco.second].flip;

    if (hashCode != hashCode2) {
#if (defined(__BORLANDC__) || defined(_MSC_VER))
      sprintf(buf, " or hash = %I64d", hashCode2);
#else
      sprintf(buf, " or hash = %lld", hashCode2);
#endif
      sql += buf;
    }
  }
  sql += " order by gameid";

  if (gl.start_sorted() == 0) {
    // query database

    // printf("%s\n", sql);
    pair<vector<HashhitCS* >*, hashtype> rN(results, hashCode);
    sqlite3_exec(db, sql.c_str(), insert_result, &rN, 0);
    // printf("results->size() %d\n", results->size());

    // communicate results of query to database
    
    vector<HashhitCS* >::iterator resultIT = results->begin();
    while (resultIT != results->end()) {
      // printf("gid %d\n", (*resultIT)->gameid);
      int index = (*resultIT)->gameid;

      vector<Candidate* >* candidates = new vector<Candidate* >;
      while ((*resultIT)->gameid == index) {
        // int pos = (*resultIT)->position % (1<<16);
        int ori = (*resultIT)->position / (1<<16);
        // printf("%d %d\n", pos, ori);
        if (cs && hashCode == hashCode2) { // this is a somewhat pathological case ...
          int ind = patternList.flipTable[Pattern::compose_flips(Pattern::PatternInvFlip(ori),fl)];
          candidates->push_back(new Candidate(patternList.data[ind].left, patternList.data[ind].top, ind));
          ind = patternList.flipTable[8+Pattern::compose_flips(Pattern::PatternInvFlip(ori),fl2)];
          candidates->push_back(new Candidate(patternList.data[ind].left, patternList.data[ind].top, ind));
        } else {
          if ((*resultIT)->cs) {
            // FIXME works only for corner patterns right now!
            int ind = patternList.flipTable[8+Pattern::compose_flips(Pattern::PatternInvFlip(ori),fl2)];
            // printf("cand cs %d %d %d\n", patternList.flipTable[8+Pattern::compose_flips(Pattern::PatternInvFlip(ori),fl2)], patternList.data[ind].left, patternList.data[ind].top);
            candidates->push_back(new Candidate(patternList.data[ind].left, patternList.data[ind].top, ind));
          } else {
            int ind = patternList.flipTable[Pattern::compose_flips(Pattern::PatternInvFlip(ori),fl)];
            // printf("cand %d %d %d\n", patternList.flipTable[Pattern::compose_flips(Pattern::PatternInvFlip(ori),fl)], patternList.data[ind].left, patternList.data[ind].top);
            candidates->push_back(new Candidate(patternList.data[ind].left, patternList.data[ind].top, ind));
          }
        }
        resultIT++;
        if (resultIT == results->end()) break;
      }
      gl.makeIndexCandidate(index, candidates);
    }
    for(vector<HashhitCS* >::iterator it = results->begin(); it != results->end(); it++) delete *it;
    delete results;
    gl.end_sorted();
  } else return -1;
  return 0;
}

Algo_hash_corner::Algo_hash_corner(int bsize, int SIZE, int MAXNUMSTONES) : Algo_hash(bsize, "CORNER", MAXNUMSTONES) {
  size = SIZE;
  char buf[5];
  sprintf(buf, "%d", size);
  dbnameext += buf;
  hi = new vector<HashInstance>;
  hi->push_back(HashInstance(0,0,size,size,boardsize));
  hi->push_back(HashInstance(0,bsize-size,size,size,boardsize));
  hi->push_back(HashInstance(bsize-size,0,size,size,boardsize));
  hi->push_back(HashInstance(bsize-size, bsize-size, size, size,boardsize));
}

pair<hashtype,int> Algo_hash_corner::compute_hashkey(PatternList& pl, int CS) {
  if (pl.data[0].sizeX < size || pl.data[0].sizeY < size || pl.data[0].left != pl.data[0].right || pl.data[0].top != pl.data[0].bottom || (pl.data[0].left != 0 && pl.data[0].left != boardsize-size) || (pl.data[0].top != 0 && pl.data[0].top != boardsize-size)) return make_pair(NOT_HASHABLE,0);
  hashtype hk = NOT_HASHABLE;
  int f = 0;
  vector<hashtype> hCodes;
  for(int pCtr=0; pCtr<pl.size(); pCtr++) {
    if (CS == pl.data[pCtr].colorSwitch) {
      hashtype hashkey = 0;
      int ns = 0;

      Pattern *pattern = & pl.data[pCtr];
      int offsetX = 0;
      int offsetY = 0;
      if (pattern->left > 0) offsetX = boardsize-size-pattern->left; // pattern located on east side of board
      if (pattern->top > 0) offsetY = boardsize-size-pattern->top;   // ... south ...
      for(int i=0; i<size; i++) {
        for(int j=0; j<size; j++) {
          char p = pattern->finalPos[i+offsetX + pattern->sizeX*(j+offsetY)];
          if (p == 'x' || p ==  'o' || p == '*') return make_pair(NOT_HASHABLE,0);
          else if (p == 'X') {
            hashkey += hashCodes[i+offsetX+pattern->left + boardsize*(j+offsetY+pattern->top)];
            ns++;
          } else if (p == 'O') {
            hashkey -= hashCodes[i+offsetX+pattern->left + boardsize*(j+offsetY+pattern->top)];
            ns++;
          }
        }
      }
      if (ns < 3 || ns > maxNumStones) return make_pair(NOT_HASHABLE,0);

      // make sure all hash keys are unique
      for(vector<hashtype>::iterator it = hCodes.begin(); it != hCodes.end(); it++)
        if (*it == hashkey) return make_pair(NOT_HASHABLE, 0);
      hCodes.push_back(hashkey);

      if (hk==NOT_HASHABLE || hashkey<hk) {
        hk = hashkey;
        f = pCtr;
      }
    }
  }
  return make_pair(hk, f);
}

// Algo_hash_side::Algo_hash_side(int bsize, int SIZEX, int SIZEY) : Algo_hash(bsize, "SIDE") {
//   sizeX = SIZEX;
//   sizeY = SIZEY;
//   char buf[10];
//   sprintf(buf, "%d_%d", sizeX, sizeY);
//   dbnameext += buf;
// 
//   hi = new vector<HashInstance>;
//   for(int i=1; i<bsize-1-sizeX; i++)
//     hi->push_back(HashInstance(i,0,sizeX, sizeY,boardsize));
//   for(int i=1; i<bsize-1-sizeX; i++)
//     hi->push_back(HashInstance(i,bsize-sizeY,sizeX, sizeY,boardsize));
//   for(int i=1; i<bsize-1-sizeX; i++)
//     hi->push_back(HashInstance(0, i, sizeY, sizeX,boardsize));
//   for(int i=1; i<bsize-1-sizeX; i++)
//     hi->push_back(HashInstance(bsize-sizeY, i, sizeY, sizeX,boardsize));
// }

HashInstance::HashInstance(char X, char Y, char SIZEX, char SIZEY, int BOARDSIZE) {
  boardsize = BOARDSIZE;
  xx = X;
  yy = Y;
  pos = xx + boardsize*yy;
  sizeX = SIZEX; 
  sizeY = SIZEY;
  branchpoints = 0;
  currentHashCode = 0;
  numStones = 0;
  changed = true;
}

HashInstance::~HashInstance() {
  finalize();
}

void HashInstance::finalize() {
  if (branchpoints) {
    while (branchpoints->size()) {
      delete [] branchpoints->top().first;
      branchpoints->pop();
    }
    delete branchpoints;
    branchpoints = 0;
  }
  if (currentHashCode) {
    delete [] currentHashCode;
    currentHashCode = 0;
  }
}

bool HashInstance::inRelevantRegion(char X, char Y) {
  if (xx <= X && X < xx+sizeX && yy <= Y && Y < yy+sizeY) return true;
  return false;
}

void HashInstance::initialize() {
  currentHashCode = new hashtype[8]; 
  for(int i=0; i<8; i++) currentHashCode[i] = 0; // start with empty board
  numStones = 0;
  branchpoints = new stack<pair<hashtype*,int> >;
  changed = true; // do record empty pattern ...
}

void HashInstance::addB(char x, char y) {
  if (inRelevantRegion(x,y)) {
    changed = true;
    for(int i=0; i<8; i++) {
      currentHashCode[i] += Algo_hash::hashCodes[Pattern::flipsX(i,x,y,boardsize-1, boardsize-1) + boardsize*Pattern::flipsY(i,x,y,boardsize-1, boardsize-1)];
    }
    numStones++;
  }
}

void HashInstance::addW(char x, char y) {
  if (inRelevantRegion(x,y)) {
    changed = true;
    for(int i=0; i<8; i++) {
      currentHashCode[i] -= Algo_hash::hashCodes[Pattern::flipsX(i,x,y,boardsize-1, boardsize-1) + boardsize*Pattern::flipsY(i,x,y,boardsize-1, boardsize-1)];
    }
    numStones++;
  }
}

void HashInstance::removeB(char x, char y) {
  if (inRelevantRegion(x,y)) {
    changed = true;
    for(int i=0; i<8; i++) {
      currentHashCode[i] -= Algo_hash::hashCodes[Pattern::flipsX(i,x,y,boardsize-1, boardsize-1) + boardsize*Pattern::flipsY(i,x,y,boardsize-1, boardsize-1)];
    }
    numStones++;
  }
}

void HashInstance::removeW(char x, char y) {
  if (inRelevantRegion(x,y)) {
    changed = true;
    for(int i=0; i<8; i++) {
      currentHashCode[i] += Algo_hash::hashCodes[Pattern::flipsX(i,x,y,boardsize-1, boardsize-1) + boardsize*Pattern::flipsY(i,x,y,boardsize-1, boardsize-1)];
    }
    numStones++;
  }
}

pair<hashtype,int> HashInstance::cHC() {
  int flip = 0;
  hashtype minCHC = currentHashCode[0];
  for(int i=1; i<8; i++) { 
    if (currentHashCode[i] < minCHC) {
      minCHC = currentHashCode[i];
      flip = i;
    }
  }
  return make_pair(minCHC, flip*(1<<16)  + pos);
}

void HashInstance::bppush() {
  hashtype* chc = new hashtype[8];
  for(int i=0; i<8; i++) chc[i] = currentHashCode[i];
  branchpoints->push(make_pair(chc, numStones));
}

void HashInstance::bppop() {
  delete [] currentHashCode;
  currentHashCode = branchpoints->top().first;
  numStones = branchpoints->top().second;
  branchpoints->pop();
}


// UIntervals::UIntervals(intervs = []) {
//   data = intervs;
// }
// 
// 
// void UIntervals::first() {
//   if (data->size()) return data[0].first;
//   else return -1; // FIXME ?!
// }
// 
// void UIntervals::append(int interv_start, int interv_end) {
//   data.push_back(pair<int,int>(interv_start, interv_end));
// }
// 
// 
// void UIntervals::inters(UIntervals& uinterv) {
//   int current2low = 0;
//   int current2high = 0;
// 
//   vector<pair<int,int>> newUInt();
// 
//   for(int current1=0; current1 < data.size(); current1++) {
//     while (current2low < uinterv.data.size && !(uinterv.data[current2low].second > data[current1].first))
//       current2low++;
//     current2high = current2low;
//     while (current2high < uinterv.data.size() && uinterv.data[current2high].first < data[current1].second)
//       current2high++;
//     current2high--;
// 
//     if (current2low == uinterv.data.size()) break;
//     if (current2high < current2low) continue;
// 
//     newUInt.append(max(self.data[current1][0], uinterv.data[current2low][0]),
//       min(self.data[current1][1], uinterv.data[current2low][1]));
// 
//     for(int c=current2low+1; c < current2high; c++)
//       newUInt.append(uinterv.data[c].first, uninterv.data[c].second);
// 
//     if (current2high > current2low)
//       newUInt.append(uinterv.data[current2high].first, min(uinterv.data[current2high].second, data[current1].second));
// 
//     current2low = current2high;
//   }
//   data = newUInt;
// }
// 
// void UIntervals::isEmpty() {
//   int isEmpty = 1;
//   for(int i=0; i<data.size(); i++) 
//     if (data[i].first < data[i].second) isEmpty = 0;
//   return isEmpty;
// }
// 
// 
// 
// Algo_intervals::Algo_intervals(int bsize) {
//   boardsize = bsize;
// }                        
// 
// 
// void Algo_intervals::initialize_process(int l) {
// 
//   movesArr = vector<long>();
//   moveIntsArr = vector<long>();
// }
// 
// void Algo_intervals::newgame_process() {
//   counter = 0;
//   moves = [];
//   for(int i=0; i<boardsize*boardsize; i++) moves.append([]);
//   ignore = 0;
// }
// 
// void Algo_intervals::AB_process(int x, int y) {
//   if (ignore) return;
//   moves[boardsize*x+y]->push_back(counter | FLAG_BLACK);
// }
// 
// 
// void Algo_intervals::AW_process(int x, int y) {
//   if (ignore) return;
//   moves[boardsize*x+y]->push_back(counter | FLAG_WHITE);
// }
// 
// void Algo_intervals::AE_process(int x, int y, char removed) {
//   if (ignore) return;
//   self.moves[self.boardsize*x+y]->push_back(counter | FLAG_REMOVE);
// }
// 
// void Algo_intervals::endOfNode_process() {
//   if (ignore) return;
//   counter++;
// }
// 
// void Algo_intervals::B_process(int x, int y, cap) {
//   if (ignore) return;
//   moves[self.boardsize*x+y]->push_back(counter | FLAG_BLACK);
//   for(c in cap)
//     moves[self.boardsize*c[0] + c[1]]->push_back(counter | FLAG_REMOVE);
// }
// 
// void Algo_intervals::W_process(int x, int y, cap) {
//   if (ignore) return;
//   moves[self.boardsize*x+y]->push_back(counter | FLAG_WHITE);
//   for(c in cap)
//     moves[self.boardsize*c[0] + c[1]]->push_back(counter | FLAG_REMOVE);
// }
// 
// void Algo_intervals::branchpoint_process() {
// }
// 
// 
// void Algo_intervals::endOfVariation_process() {
//   ignore = 1;
// }
// 
// 
// void Algo_intervals::endgame_process() {
//   for(int x=0; x < boardsize; x++) {
//     for(int y=0; y < boardsize; y++) {
//       if (!moves[self.boardsize*x+y]->size())
//  movesArr.push_back(0);
//       else if (moves[self.boardsize*x+y]->size() == 1) {
//  long d = (*moves[self.boardsize*x+y])[0];
//  self.movesArr.append(d);
//       }
//       else {
//  vector<int>* mvs = moves[self.boardsize*x+y];
//  long d = moveIntsArr.size() | FLAG_POINTER;
// 
//  vector<long> Blist;
//  vector<long> Wlist;
//  vector<long> Elist;
// 
//  Elist.push_back(0);
// 
//  int moveIndex = 0;
//  while (moveIndex < mvs.size()) {
//    if (mvs[moveIndex] & FLAG_BLACK) {
//      d = d | FLAG_BLACK;
//      Blist.push_back(mvs[moveIndex] & ~FLAG_BLACK);
//      Elist.push_back(mvs[moveIndex] & ~FLAG_BLACK);
//      if (moveIndex + 1 < mvs->size()) {
//        Blist.push_back(mvs[moveIndex+1] & ~(FLAG_BLACK|FLAG_WHITE|FLAG_REMOVE));
//        Elist.push_back(mvs[moveIndex+1] & ~(FLAG_BLACK|FLAG_WHITE|FLAG_REMOVE));
//      }
//      else Blist.push_back(MAXNOMOVES);
//    }
//    if (mvs[moveIndex] & FLAG_WHITE) {
//      d = d | FLAG_WHITE;
//      Wlist.push_back(mvs[moveIndex] & ~FLAG_WHITE);
//      Elist.push_back(mvs[moveIndex] & ~FLAG_WHITE);
//      if (moveIndex + 1 < mvs->size()) {
//        Wlist.push_back(mvs[moveIndex+1] & ~(FLAG_BLACK|FLAG_WHITE|FLAG_REMOVE));
//        Elist.push_back(mvs[moveIndex+1] & ~(FLAG_BLACK|FLAG_WHITE|FLAG_REMOVE));
//      }
//      else Wlist.append(MAXNOMOVES);
//    }
//    moveIndex += 2;
//  }
//          
//  if ((!Blist.size() || Blist[Blist.size()-1] != MAXNOMOVES) &&
//      (!Wlist.size() || Wlist[Wlist.size()-1] != MAXNOMOVES))
//    Elist.push_back(MAXNOMOVES);
// 
//  moveIntsArr.push_back(Blist.size());
//  moveIntsArr.push_back(Wlist.size());
//  moveIntsArr.push_back(Elist.size());
//  moveIntsArr.extend(Blist);
//  moveIntsArr.extend(Wlist);
//  moveIntsArr.extend(Elist);
// 
//  movesArr.push_back(d);
//       }
//     }
//   }
// }
// 
// void Algo_intervals::finalize_process(datap) {
//   // FIXME
//  extract datap0, datap1 from datap
//  
//  String fn = datap0 + "/movesarr" + datap1 + ".db"; // FIXME: linux specific!?
//  ofstream file(fn, ios::out|ios::trunc|ios::binary) // FIXME: careful with ios::trunc
//   file.write(movesArr, movesArrSize);
//   file.close();
//  
//  fn = datap0 + "/moveints" + datap1 + ".db"; // FIXME: linux specific!?
//  file(fn, ios::out|ios::trunc|ios::binary) // FIXME: careful with ios::trunc
//   file.write(moveIntsArr, moveIntsArrSize);
//   file.close();
//         
// }        
// 
// 
// int Algo_intervals::retrieve_db(datap) {
//  String fn = ... "/movesarr" ...; // FIXME
//  ifstream file (fn, ios::in|ios::binary|ios::ate);
//  if (file.is_open()) {
//    ifstream::pos_type size = file.tellg();
//    delete [] movesArr;
//    movesArr = new char[size]; // FIXME: not a char array?
//    file.seekg (0, ios::beg);
//    file.read (memblock, size);
//    file.close();
//  }
//   else {
//    return 0;
//  }
//  String fn = ... "/moveints" ...; // FIXME
//  ifstream file (fn, ios::in|ios::binary|ios::ate);
//  if (file.is_open()) {
//    ifstream::pos_type size = file.tellg();
//    delete [] moveIntsArr;
//    moveIntsArr = new char[size]; // FIXME: not a char array?
//    file.seekg (0, ios::beg);
//    file.read (memblock, size);
//    file.close();
//  }
//   else {
//    return 0;
//  }
//   return 0;
// }
// 
// void Algo_intervals::getUInterv(mves, vector<long> mves1, int gameno, int x, int y, char color) {
// 
//   UIntervals UInterv();
//   int typeInterv = 0;
//   long d = mves[gameno*boardsize*boardsize + boardsize*x + y];
// 
//   if (d & FLAG_POINTER) {
//         
//     if (color == 'X' && !(d & FLAG_BLACK)) return 0, UIntervals();
//     if (color == 'O' && !(d & FLAG_WHITE)) return 0, UIntervals();
//     
//    long p = d & MAXNOMOVES;
//    long lenB = moves1[p];
//    long lenW = moves1[p+1];
//    long lenE = moves1[p+2];
//    long start;
//    long length;
// 
//    if (color == 'X') {
//      start = p + 3;
//      length = lenB;
//    }
//    else if (color == 'O') {
//      start = p + 3 + lenB;
//      length = lenW;
//    }
//    else if (color == '.') {
//      start = p + 3 + lenB + lenW;
//      length = lenE;
//    }
// 
//    l = [];
//    for(int i=0; i<length/2; i++) 
//      l.append((moves1[start+2*i], moves1[start+2*i+1]));
// 
//    if (l[-1][1] == MAXNOMOVES) typeInterv = length-1;
//    else typeInterv = length;
//    return typeInterv, UIntervals(l);
//   }
//   else {
//     if (color == 'X' && (d & FLAG_BLACK))
//       return 1, UIntervals([( d & MAXNOMOVES , MAXNOMOVES)]);
//     else if (color == 'O' && (d & FLAG_WHITE))
//       return 1, UIntervals([( d & MAXNOMOVES , MAXNOMOVES)]);
//     else if (color == '.') {
//       if (!d) return -1, UIntervals([(0, MAXNOMOVES)]);
//       else return 1, UIntervals([(0, d & MAXNOMOVES)]);
//     }
//   }
//   return 0, UIntervals();
// }
//  
// 
// void Algo_intervals::search(patternList, options, db,
//          continuations, contLabelsIndex, contLabels,
//          progBar, progStart, progEnd) {
//   int ctr = 0;
//   int numOfHits = 0;
//   int overallSwitched = 0;
//   int Bwins = 0;
//   int Wwins = 0;
//   int index = db.start();
// 
//   if (!self.retrieve_db(db.datapath)) {
//     printf("Error!\n"); // FIXME
//     return;
//   }
//   
//   int movelimit = MAXNOMOVES;
//   if (options.has_key('movelimit')) movelimit = options['movelimit'];
//   
//   //  moves, moves1 = self.movesArr, self.moveIntsArr;
// 
//   while (index != -1) {
//     ctr++;
// 
//     matchList = db.getCurrentMatchlist();
//     result = [];
//     int numOfSwitched = 0;
//             
//     if (progBar && !(ctr % 10))
//       progBar.redraw((progEnd-progStart)*ctr/len(db.current) + progStart);
//             
//     for(m in matchList) {
//       Pattern p = patternList.get(m[0]);
//       a0, a1 = m[1];
//                 
//       UIntervals currentUInterv([(0, self.movelimit)]);
// 
//       toDo = {};
//       cont = [(MAXNOMOVES, -1,-1)];
//       int i = 0;
//       int j = 0;
// 
//       while (i < p.sizeX && !currentUInterv.isEmpty()) {
//  
//  if (p.data[i][j] == '*') {
//    Bint = self.getUInterv(moves, moves1, index, i+a0, j+a1, 'X')[1];
//    if (Bint.data) cont.extend([(x,i,j) for x in [z[0] for z in Bint.data]]);
//    Wint = self.getUInterv(moves, moves1, index, i+a0, j+a1, 'O')[1];
//    if (Wint.data) cont.extend([(x,i,j) for x in [z[0] for z in Wint.data]]);
//  }
//  else if p.data[i][j] == 'x': printf("oops\n"); // FIXME
//  else if p.data[i][j] == 'o': printf("oops\n"); // FIXME
//                         
//  else {
//    typeInt, nextInt = self.getUInterv(moves, moves1, index, i+a0, j+a1, p.data[i][j]);
//                         
//    if (typeInt == -1) ;
//    else if (typeInt == 0) currentUInterv = UIntervals();
//    else if (typeInt == 1) {
//      if (p.data[i][j] == '.' && cont[0][0] > nextInt.data[0][1]) {
//        Bi = self.getUInterv(moves, moves1, index, i+a0, j+a1, 'X')[1];
//        Wi = self.getUInterv(moves, moves1, index, i+a0, j+a1, 'O')[1];
//        counter = nextInt.data[0][1];
//        cont[0] = (nextInt.data[0][1], i, j);
//      }
//      currentUInterv.inters(nextInt);
//    }
//    else {
//      if (toDo.has_key(typeInt)) toDo[typeInt].append((i,j,nextInt));
//      else toDo[typeInt] = [(i, j, nextInt)];
//    }
//  }      
//  j++;
//  if (j == p.sizeY) {
//    j = 0;
//    i++;
//  }
//       }
// 
//       toDoList = [];
//       for(ii in toDo.keys()) toDoList.extend(toDo[ii]);
// 
//       while (toDoList && !currentUInterv.isEmpty()) {
//  i, j, nextInt = toDoList[0];
//  del toDoList[0];
// 
//  currentUInterv.inters(nextInt);
//  if (currentUInterv.isEmpty()) break;
//                     
//  if (p.data[i][j] == 'X') Bint = nextInt;
//  else Bint = self.getUInterv(moves, moves1, index, i+a0, j+a1, 'X')[1];
//  if (Bint.data) cont.extend([(x,i,j) for x in [z[0] for z in Bint.data]]);
//  if (p.data[i][j] == 'O') Wint = nextInt;
//  else Wint = self.getUInterv(moves, moves1, index, i+a0, j+a1, 'O')[1];
//  if (Wint.data) cont.extend([(x,i,j) for x in [z[0] for z in Wint.data]]);
//       }
//       
//       if (!currentUInterv.isEmpty()) {
// 
//  cont.sort();
//  for(counter, x, y in cont)
//    if (counter > currentUInterv.first()) break;
// 
//  if (counter == MAXNOMOVES || counter <= currentUInterv.first()) {
//    hit = 1;
//    label = '';
//    switched = p.colorSwitch;
//  }
//  else {
//    Xint = (m[1][0], m[1][0] + patternList.get(m[0]).sizeX);
//    Yint = (m[1][1], m[1][1] + patternList.get(m[0]).sizeY);
// 
//    Bint = self.getUInterv(moves, moves1, index, x+a0, y+a1, 'X')[1];
//    Wint = self.getUInterv(moves, moves1, index, x+a0, y+a1, 'O')[1];
//    if (counter in [z[0] for z in Bint.data]) co = 'W';   // !!! FIXME (cf. Algo_movelist.search)
//    else if (counter in [z[0] for z in Wint.data]) co = 'B'; // !!!
//    else raise Exception; // FIXME
//                         
//    hit, label, contLabelsIndex, switched =
//      patternList.updateContinuations(m[0], x+a0, y+a1, co, Xint, Yint,
//              currentUInterv.first(), counter-1,
//              continuations, contLabels, contLabelsIndex,
//              gl.getCurrentWinner());
//  }
//  
//  if (hit) {
//    numOfSwitched += switched;
//    if (switched) result.append(str(currentUInterv.first())+label+'-');
//    else result.append(str(currentUInterv.first())+label);
//  }
//       }
//     }
// 
//     if (result) {
//       result.sort();
//       db.makeCurrentHit(join(result, ', '));
//       numOfHits = numOfHits + len(result);
//       overallSwitched += numOfSwitched;
//             
//       if (gl.getCurrentWinner() == 'B') {
//  Bwins = Bwins + len(result) - numOfSwitched;
//  Wwins = Wwins + numOfSwitched;
//       }
//       else if (gl.getCurrentWinner() == 'W') {
//  Bwins = Bwins + numOfSwitched;
//  Wwins = Wwins + len(result) - numOfSwitched;
//       }
//     }
//     else db.discardCurrent();
//       
//     index = db.next();
//   }
//   return numOfHits, Bwins, Wwins, overallSwitched;
// }




// ----------------------------------------------------------------------------------------------

// GameList and related stuff

Candidate::Candidate(char X, char Y, char ORIENTATION) {
  x = X;
  y = Y;
  orientation = ORIENTATION;
}

Hit::Hit(ExtendedMoveNumber* POS, char* LABEL) { // LABEL is a char[3]
  pos = POS; // note that we do not copy these!
  label = LABEL;
}

Hit::~Hit() {
  delete pos;
  delete [] label;
}

Hit::Hit(SnapshotVector& snv) {
  int length = snv.retrieve_int();
  int* data = snv.retrieve_intp();
  pos = new ExtendedMoveNumber(length, data);
  delete [] data;
  label = snv.retrieve_charp();
}

void Hit::to_snv(SnapshotVector& snv) {
  snv.pb_int(pos->length);
  snv.pb_intp(pos->data, pos->length);
  snv.pb_charp(label, 3);
}

bool Hit::cmp_pts(Hit* a, Hit* b) {
  if (a->pos->length != b->pos->length) return a->pos->length < b->pos->length;
  for(int i=0; i < a->pos->length; i++)
    if (a->pos->data[i] != b->pos->data[i]) return a->pos->data[i] < b->pos->data[i];
  return false;
}

SearchOptions::SearchOptions() {
  fixedColor = 0;
  moveLimit = 10000;
  nextMove = 0;
  trustHashFull = false;
  searchInVariations = true;
  algos = (1<<30) - 1; // use all available algorithms
}

SearchOptions::SearchOptions(int FIXEDCOLOR, int NEXTMOVE, int MOVELIMIT) {
  fixedColor = FIXEDCOLOR;
  moveLimit = MOVELIMIT;
  nextMove = NEXTMOVE;
  trustHashFull = false;
  searchInVariations = true;
  algos = (1<<30) - 1; // use all available algorithms
}

SearchOptions::SearchOptions(SnapshotVector& snv) {
  fixedColor = snv.retrieve_int();
  moveLimit = snv.retrieve_int();
  nextMove = snv.retrieve_int();
  trustHashFull = snv.retrieve_int();
  searchInVariations= snv.retrieve_int();
  algos = snv.retrieve_int();
}

void SearchOptions::to_snv(SnapshotVector& snv) {
  snv.pb_int(fixedColor);
  snv.pb_int(moveLimit);
  snv.pb_int(nextMove);
  snv.pb_int(trustHashFull);
  snv.pb_int(searchInVariations);
  snv.pb_int(algos);
}

ProcessOptions::ProcessOptions() {
  processVariations = true;
  sgfInDB = true;
  rootNodeTags = "BR,CA,DT,EV,HA,KM,PB,PC,PW,RE,RO,RU,SZ,US,WR";
  algos = ALGO_FINALPOS | ALGO_MOVELIST | ALGO_HASH_FULL | ALGO_HASH_CORNER;
  algo_hash_full_maxNumStones = 50;
  algo_hash_corner_maxNumStones = 20;
}

ProcessOptions::ProcessOptions(string s) {
  int p = 0;
  if (s[p++] == 't') processVariations = true;
  else processVariations = false;

  if (s[p++] == 't') sgfInDB = true;
  else sgfInDB = false;

  p++;
  int pn = s.find('|', p) + 1;
  algos = atoi(s.substr(p, pn-p-1).c_str());
  
  p = pn;
  pn = s.find('|', p) + 1;
  algo_hash_full_maxNumStones = atoi(s.substr(p, pn-p-1).c_str());
  
  p = pn;
  pn = s.find('|', p) + 1;
  algo_hash_corner_maxNumStones = atoi(s.substr(p, pn-p-1).c_str());
  
  rootNodeTags = s.substr(pn);
}

string ProcessOptions::asString() {
  string result;
  if (processVariations) result += "t";
  else result += "f";
  if (sgfInDB) result += "t";
  else result += "f";
  char buf[200];
  sprintf(buf, "|%d|%d|%d|%s", algos, algo_hash_full_maxNumStones, algo_hash_corner_maxNumStones, rootNodeTags.c_str());
  result += buf;
  return result;
}

void ProcessOptions::validate() {
  string::iterator it = rootNodeTags.begin();
  while (it != rootNodeTags.end()) {
    if (*it == ' ') it = rootNodeTags.erase(it);
    else it++;
  }
  if (rootNodeTags.find("PB") == string::npos) rootNodeTags += ",PB";
  if (rootNodeTags.find("PW") == string::npos) rootNodeTags += ",PW";
  if (rootNodeTags.find("RE") == string::npos) rootNodeTags += ",RE";
  if (rootNodeTags.find("DT") == string::npos) rootNodeTags += ",DT";

  algos |= ALGO_FINALPOS | ALGO_MOVELIST; // these are mandatory at the moment
}

vector<string>* ProcessOptions::SGFTagsAsStrings() {
  vector<string>* SGFtags = new vector<string>;
  int ctr = 0;
  unsigned int p = 0;
  unsigned int pn = rootNodeTags.find(',', p);
  while (pn != string::npos) {
    SGFtags->push_back(rootNodeTags.substr(p,pn-p));
    ctr++;
    p = pn+1;
    pn = rootNodeTags.find(',', p);
  }
  SGFtags->push_back(rootNodeTags.substr(p));
  return SGFtags;
}

GameListEntry::GameListEntry(int ID, char WINNER, string GAMEINFOSTR) {
  // printf("GLE %d %c %s\n", ID, WINNER, GAMEINFOSTR);
  id = ID;
  if (WINNER == 'B' || WINNER == 'b') winner = 'B';
  else if (WINNER == 'W' || WINNER == 'w') winner = 'W';
  else if (WINNER == 'J' || WINNER == 'j') winner = 'J';
  else winner = '-';
  gameInfoStr = GAMEINFOSTR;
  hits = 0;
  candidates = 0;
}

GameListEntry::~GameListEntry() {
  if (hits) {
    for(vector<Hit* >::iterator it = hits->begin(); it != hits->end(); it++) delete *it;
    delete hits;
    hits = 0;
  }
  if (candidates) {
    for(vector<Candidate* >::iterator it = candidates->begin(); it != candidates->end(); it++) delete *it;
    delete candidates;
    candidates = 0;
  }
}

void GameListEntry::hits_from_snv(SnapshotVector& snv) {
  int h_size = snv.retrieve_int();
  hits = new vector<Hit* >;
  for(int j=0; j<h_size; j++) {
    hits->push_back(new Hit(snv));
  }
}

int insertEntry(void *gl, int argc, char **argv, char **azColName) {
  char winner = '-';
  if (argv[1] && (argv[1][0] == 'B' || argv[1][0] == 'W' || argv[1][0] == 'J')) winner = argv[1][0];
  string gameInfoStr = ((GameList*)gl)->format2;
  for(int i=0; i<((GameList*)gl)->numColumns; i++) {
    char strpip1[20];
    sprintf(strpip1, "[[%d[[F", i);
    unsigned int p = gameInfoStr.find(strpip1);
    if (p != string::npos) {
      if (argv[i]) {
        string fn = argv[i];
        if (fn.substr(fn.size()-4) == ".sgf" || fn.substr(fn.size()-4) == ".mgt") 
          gameInfoStr.replace(p, strlen(strpip1), fn.substr(0,fn.size()-4));
        else gameInfoStr.replace(p, strlen(strpip1), fn);
      } else gameInfoStr.erase(gameInfoStr.find(strpip1), strlen(strpip1));
      continue;
    }

    sprintf(strpip1, "[[%d", i);
    p = gameInfoStr.find(strpip1);
    if (p != string::npos) {
      if (argv[i]) gameInfoStr.replace(p, strlen(strpip1), argv[i]);
      else gameInfoStr.erase(gameInfoStr.find(strpip1), strlen(strpip1));
    }
  }
  unsigned int p = gameInfoStr.find("[[W");
  if (p != string::npos) gameInfoStr.replace(p, 3, 1, winner);

  // printf("id %s\n", argv[0]);
  ((GameList*)gl)->all->push_back(new GameListEntry(atoi(argv[0]), winner, gameInfoStr));
  return 0;
}

int dbinfo_callback(void *s, int argc, char **argv, char **asColName) {
  char** cpp = (char**)s;
  if (argc && argv[0]) {
    // printf("dbi_cb %s\n", argv[0]);
    *cpp = new char[strlen(argv[0])+1];
    strcpy(*cpp, argv[0]);
  }
  return 0;
}

GameList::GameList(char* DBNAME, string ORDERBY, string FORMAT, ProcessOptions* p_options, int cache) throw(DBError) {
  duplicates = 0;
  labels = 0;
  continuations = 0;
  mrs_pattern = 0;
  searchOptions = 0;
  dbname = new char[strlen(DBNAME)+2];
  strcpy(dbname, DBNAME);
  db = algo_db1 = algo_db2 = 0;

  dbname[strlen(DBNAME)] = '1';
  dbname[strlen(DBNAME)+1] = 0;
  int rc = sqlite3_open(dbname, &algo_db1); 
  if (rc) {
    sqlite3_close(algo_db1);
    algo_db1 = 0;
    throw DBError();
  }
  rc = sqlite3_busy_timeout(algo_db1, 200);
  if (rc) throw DBError();
  rc = sqlite3_exec(algo_db1, "pragma synchronous = off;", 0, 0, 0);
  if (rc) throw DBError();
  char cache_str[100];
  sprintf(cache_str, "pragma cache_size = %d", cache*1000);
  rc = sqlite3_exec(algo_db1, cache_str, 0, 0, 0);
  if (rc) throw DBError();
  dbname[strlen(DBNAME)] = '2';
  dbname[strlen(DBNAME)+1] = 0;
  rc = sqlite3_open(dbname, &algo_db2); 
  if (rc) {
    sqlite3_close(algo_db2);
    algo_db2 = 0;
    throw DBError();
  }
  rc = sqlite3_busy_timeout(algo_db2, 200);
  if (rc) throw DBError();
  rc = sqlite3_exec(algo_db2, "pragma synchronous = off;", 0, 0, 0);
  if (rc) throw DBError();
  sprintf(cache_str, "pragma cache_size = %d", cache*7000);
  rc = sqlite3_exec(algo_db2, cache_str, 0, 0, 0);
  if (rc) throw DBError();

  // try to retrieve basic options from database
  dbname[strlen(DBNAME)] = 0;
  rc = sqlite3_open(dbname, &db); 
  if (rc) {
    sqlite3_close(db);
    db = 0;
    throw DBError();
  }
  rc = sqlite3_busy_timeout(db, 200);
  if (rc) throw DBError();
  rc = sqlite3_exec(db, "pragma synchronous = off;", 0, 0, 0);
  if (rc) throw DBError();
  sprintf(cache_str, "pragma cache_size = %d", cache*1000);
  rc = sqlite3_exec(db, cache_str, 0, 0, 0);
  if (rc) throw DBError();

  rc = sqlite3_exec(db, "create table if not exists db_info ( info text );", 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();
  char* dbinfo = 0;
  rc = sqlite3_exec(db, "select * from db_info where rowid = 1;", dbinfo_callback, &dbinfo, 0);
  if (rc != SQLITE_OK) throw DBError();

  if (dbinfo) {
    // printf("dbinfo: %s\n", dbinfo);
    p_op = new ProcessOptions(dbinfo);
    delete [] dbinfo;
    char* bsizes = 0;
    rc = sqlite3_exec(db, "select * from db_info where rowid = 2;", dbinfo_callback, &bsizes, 0);
    if (rc != SQLITE_OK) throw DBError();
    if (bsizes) {
      // printf("board sizes %s\n", bsizes); // should be a comma-sep. list of integers *ending w/ a comma*
      string bsizes_str(bsizes);
      delete [] bsizes;
      unsigned int p = 0;
      unsigned int pn = bsizes_str.find(",",p);
      while (pn > p && pn != string::npos) {
        boardsizes.push_back(atoi(bsizes_str.substr(p, pn-p).c_str()));
        p = pn+1;
        pn = bsizes_str.find(",",p);
      }
    }
  } else { // if this does not work: create database and read p_options (or use defaults)
    // printf("retrieving dbinfo failed\n");
    if (p_options == 0) p_op = new ProcessOptions(); // use default values
    else {
      // printf("use p_options\n");
      p_op = new ProcessOptions(*p_options);
      p_op->validate(); // make sure the most important information is contained in rootNodeTags list
    }
    string sql = "insert into db_info (rowid,info) values (1,'";
    sql += p_op->asString();
    sql += "');";
    rc = sqlite3_exec(db, sql.c_str(), 0, 0, 0);
    if (rc != SQLITE_OK) throw DBError();
    rc = sqlite3_exec(db, "insert into db_info (rowid, info) values (2, ',');", 0, 0, 0);
    if (rc != SQLITE_OK) throw DBError();
  }

  // set up snapshot db
  rc = sqlite3_exec(db, "create table if not exists snapshots ( data text );", 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();

  // printf("set up Algorithm instances\n");
  for(vector<int>::iterator it = boardsizes.begin(); it != boardsizes.end(); it++)
    addAlgos(*it);
  all = 0;
  currentList = oldList = 0;
  readDBs = 0;
  resetFormat(ORDERBY, FORMAT);
}

void GameList::resetFormat(string ORDERBY, string FORMAT) {
  // printf("enter resetFormat\n");
  if (FORMAT == "") { // use default format string
    numColumns = 5;
    format1 = "id,re,pw,pb,dt";
    format2 = "[[2 - [[3 ([[W), [[4, ";
  } else {
    char buf[10];
    numColumns = 2;
    format1 = "id,re";
    format2 = FORMAT;
    unsigned int p = 0;
    unsigned int q = 0;
    while (p != string::npos) {
      p = format2.find("[[",p);
      q = format2.find("]]",p);
      if (p+2 < format2.size() && q != string::npos) {
        string col = format2.substr(p+2, q-p-2);
        // check availability
        if (col == "id" || col == "filename" || col == "pos" || col == "duplicate" || col == "date" || p_op->rootNodeTags.find(col) != string::npos) {
          sprintf(buf, "[[%d", numColumns++); 
          format2.replace(p,q+2-p, buf);
          format1 += ",";
          format1 += col;
        } else if (col == "winner") format2.replace(p,q+2-p, "[[W");
        else if (col == "filename.") {
          sprintf(buf, "[[%d[[F", numColumns++); 
          format2.replace(p, q+2-p, buf);
          format1 += ",filename";
        }
        p++;
      } else break;
    }
  }
  if (ORDERBY == "" || ORDERBY == "id" || ORDERBY == "ID" || ORDERBY == "Id" || ORDERBY == "iD") orderby = "id";
  else orderby = ORDERBY + ",id";
  // printf("finished parsing\n");

  readDB();
}


void GameList::addAlgos(int bs) {
  int ctr = algo_ps.size()/20;
  // printf("add algos %d %d %d\n", bs, ctr, p_op->algos);
  for(int i=0; i<20; i++) {
    algo_ps.push_back(0);
    algo_dbs.push_back(0);
  }

  algo_ps[20*ctr] = new Algo_signature(bs);
  algo_dbs[20*ctr] = db;
  if (p_op->algos & ALGO_FINALPOS) {
    algo_ps[algo_finalpos+20*ctr] = new Algo_finalpos(bs);
    algo_dbs[algo_finalpos+20*ctr] = algo_db1;
  }
  if (p_op->algos & ALGO_MOVELIST) {
    algo_ps[algo_movelist+20*ctr] = new Algo_movelist(bs);
    algo_dbs[algo_movelist+20*ctr] = algo_db1;
  }
  if (p_op->algos & ALGO_HASH_FULL) {
    algo_ps[algo_hash_full+20*ctr] = new Algo_hash_full(bs, p_op->algo_hash_corner_maxNumStones);
    algo_dbs[algo_hash_full+20*ctr] = algo_db2;
  }
  if (p_op->algos & ALGO_HASH_CORNER) {
    algo_ps[algo_hash_corner+20*ctr] = new Algo_hash_corner(bs, 7, p_op->algo_hash_corner_maxNumStones);
    algo_dbs[algo_hash_corner+20*ctr] = algo_db2;
  }
  // for(int a=20*ctr; a<20*(ctr+1); a++) printf("aa %d %p\n", a, algo_ps[a]);
  // if (algos & ALGO_HASH_SIDE) 
  //   algo_ps[algo_hash_side] = new Algo_hash_side(boardsize, 6, 4, p_op->algo_hash_side_maxNumStones);
}

void GameList::readDB() throw(DBError) {
  // printf("read dbs\n");
  if (oldList) delete oldList;
  if (currentList) delete currentList;
  if (all) {
    for(vector<GameListEntry* >::iterator it = all->begin(); it != all->end(); it++)
      delete *it;
    delete all;
  }
  current = -1;
  all = new vector<GameListEntry* >;
  currentList = 0;
  oldList = 0;

  int rc;
  rc = sqlite3_exec(db, "begin transaction;", 0, 0, 0);
  if (rc) throw DBError();

  string sql = "select ";
  sql += format1;
  sql += " from games order by ";
  sql += orderby;
  // printf("sql: %s\n", sql.c_str());
  rc = sqlite3_exec(db, sql.c_str(), insertEntry, this, 0);
  if (rc != SQLITE_OK && rc != SQLITE_ERROR) {
    throw DBError(); 
  }
  // printf("read.\n");
  // SQLITE_ERROR may occur since table might not yet exist

  readPlayersList();
  rc = sqlite3_exec(db, "commit;", 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();

  if (rc == SQLITE_OK && !readDBs) {
    for(unsigned int a=0; a < 20*boardsizes.size(); a++) {
      if (algo_ps[a]) algo_ps[a]->readDB(algo_dbs[a]);
    }
    readDBs = 1;
  }
  // printf("read.\n");

  reset();
  // printf("leave readDB\n");
}

GameList::~GameList() {
  // printf("enter ~GameList\n");
  if (mrs_pattern) delete mrs_pattern;
  if (searchOptions) delete searchOptions;
  if (p_op) delete p_op;
  if (labels) delete [] labels;
  if (continuations) delete [] continuations; // FIXME CHECK whether the Continuation destructor is invoked!
  if (duplicates) delete duplicates;
  delete [] dbname;
  if (all) {
    for(vector<GameListEntry* >::iterator it = all->begin(); it != all->end(); it++)
      delete *it;
    delete all;
  }
  if (currentList) delete currentList;
  if (oldList) delete oldList;
  for(unsigned int i=0; i<20*boardsizes.size(); i++) 
    if (algo_ps[i]) delete algo_ps[i];
  if (db) sqlite3_close(db);
  db = 0;
  if (algo_db1) sqlite3_close(algo_db1);
  algo_db1 = 0;
  if (algo_db2) sqlite3_close(algo_db2);
  algo_db2 = 0;
  // printf("leave ~GameList\n");
}


int GameList::start() {
  current = 0;
  if (oldList) delete oldList;
  oldList = currentList;
  currentList = new vector<pair<int,int> >;
  if (oldList && oldList->size()) return (*oldList)[0].first;
  else {
    if (oldList) delete oldList;
    oldList = 0;
    return -1;
  }
}

int GameList::next() {
  current++;
  if (current < (int)oldList->size()) return (*oldList)[current].first;
  else {
    if (oldList) delete oldList;
    oldList = 0;
    return -1;
  }
}

bool sndcomp(const pair<int,int>& a, const pair<int,int>& b) {
  return a.second < b.second;
}

int GameList::start_sorted() {
  current = 0;
  if (oldList) delete oldList;
  oldList = currentList;
  currentList = new vector<pair<int,int> >;
  if (!oldList || !oldList->size()) {
    if (oldList) delete oldList;
    oldList = 0;
    return -1;
  }
  sort(oldList->begin(), oldList->end());
  return 0;
}

int GameList::end_sorted() {
  // printf("end sorted\n");
  sort(currentList->begin(), currentList->end(), sndcomp);
  delete oldList;
  oldList = 0;
  return 0;
}

char GameList::getCurrentWinner() {
  return (*all)[(*oldList)[current].second]->winner;
}

vector<Candidate* > * GameList::getCurrentCandidateList() {
  return (*all)[(*oldList)[current].second]->candidates;
}

void GameList::makeCurrentCandidate(vector<Candidate* > * candidates) {
  GameListEntry* gle = (*all)[(*oldList)[current].second];
  if (gle->candidates) delete gle->candidates;
  gle->candidates = candidates;
  currentList->push_back((*oldList)[current]);
}

void GameList::makeCurrentHit(vector<Hit* > * hits) {
  GameListEntry* gle = (*all)[(*oldList)[current].second];
  if (gle->hits) delete gle->hits;
  gle->hits = hits;
  sort(gle->hits->begin(), gle->hits->end(), Hit::cmp_pts);
  currentList->push_back((*oldList)[current]);
}

void GameList::setCurrentFromIndex(int index) {
  int start = current;
  int end = oldList->size();
  int m = start;
  while (start < end) {
    m = (end+start)/2;
    if (index == (*oldList)[m].first) {
      break;
    } else {
      if (index < (*oldList)[m].first) end = m;
      else start = m+1;
    }
  }
  current = m;
}

void GameList::makeIndexHit(int index, vector<Hit* > * hits) {
  int m = get_current_index(index, &current);
  if (m != -1) {
    currentList->push_back((*oldList)[m]);
    if (hits) {
      if ((*all)[(*oldList)[m].second]->hits) delete (*all)[(*oldList)[m].second]->hits;
      (*all)[(*oldList)[m].second]->hits = hits;
    }
  }
}

void GameList::makeIndexCandidate(int index, vector<Candidate* > * candidates) {
  int m = get_current_index(index, &current);
  if (m != -1) {
    currentList->push_back((*oldList)[m]);
    if (candidates) {
      if ((*all)[(*oldList)[m].second]->candidates) delete (*all)[(*oldList)[m].second]->candidates;
      (*all)[(*oldList)[m].second]->candidates = candidates;
    }
  }
}


void GameList::reset() {
  if (oldList) delete oldList;
  oldList = 0;
  if (currentList) delete currentList;
  currentList = new vector<pair<int,int> >;
  int counter = 0;
  for(vector<GameListEntry* >::iterator it = all->begin(); it != all->end(); it++) {
    if ((*it)->hits) {
      for(vector<Hit* >::iterator ith = (*it)->hits->begin(); ith != (*it)->hits->end(); ith++)
        delete *ith;
      delete (*it)->hits;
      (*it)->hits = 0;
    }
    if ((*it)->candidates) {
      for(vector<Candidate* >::iterator itc = (*it)->candidates->begin(); itc != (*it)->candidates->end(); itc++)
        delete *itc;
      delete (*it)->candidates;
      (*it)->candidates = 0;
    }
    currentList->push_back(make_pair((*it)->id, counter++));
  }
  num_hits = 0;
  num_switched = 0;
  Bwins = 0;
  Wwins = 0;
}

void GameList::tagsearch(int tag) throw(DBError) {
  char sql[200];

  if (!tag) return;
  if (tag > 0) {
    sprintf(sql, "select games.id from games join game_tags on games.id = game_tags.game_id where game_tags.tag_id = %d order by games.id", tag);
  } else {
    sprintf(sql, "select games.id from games except select games.id from games join game_tags on games.id = game_tags.game_id where game_tags.tag_id = %d order by games.id;", -tag);
  }
  gisearch(sql, 1);
}

void GameList::setTag(int tag, int start, int end) throw(DBError) {
  if (end==0) end = currentList->size();
  if (start>end || end > (int)currentList->size()) return;
  int rc = sqlite3_exec(db, "begin transaction", 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();
  for(int i = start; i < end; i++) {
    if (getTags(i, tag).size()) continue;
    char sql[200];
    sprintf(sql, "insert into game_tags (game_id, tag_id) values (%d, %d)", (*all)[(*currentList)[i].second]->id, tag);
    rc = sqlite3_exec(db, sql, 0, 0, 0);
    if (rc != SQLITE_OK) throw DBError();
  }
  rc = sqlite3_exec(db, "commit", 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();
}

void GameList::deleteTag(int tag, int i) throw(DBError) {
  char sql[200];
  if (i == -1) sprintf(sql, "delete from game_tags where tag_id=%d", tag);
  else sprintf(sql, "delete from game_tags where game_id=%d and tag_id=%d", (*all)[(*currentList)[i].second]->id, tag);
  int rc = sqlite3_exec(db, sql, 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();
}

int gettags_callback(void *res, int argc, char **argv, char **azColName) {
  if (!argc) return 1;
  ((vector<int>*)res)->push_back(atoi(argv[0]));
  return 0;
}

vector<int> GameList::getTags(int i, int tag) throw(DBError) {
  vector<int> result;
  char sql[200];
  if (tag==0) sprintf(sql, "select tag_id from game_tags where game_id=%d", (*all)[(*currentList)[i].second]->id);
  else sprintf(sql, "select tag_id from game_tags where game_id=%d and tag_id=%d", (*all)[(*currentList)[i].second]->id, tag);
  int rc = sqlite3_exec(db, sql, gettags_callback, &result, 0);
  if (rc != SQLITE_OK) throw DBError();
  return result;
}

void GameList::insert_duplicate(int i1, int i2, vector<vector<int> >* dupl) {
  int ii1 = get_current_index_CL(i1);
  int ii2 = get_current_index_CL(i2);
  // printf("insert_duplicate %d, %d\n", ii1, ii2);
  if (ii1 == -1 || ii2 == -1) return;
  bool inserted = false;
  for(vector<vector<int> >::iterator it = dupl->begin(); it != dupl->end(); it++) {
    vector<int>::iterator i = it->begin();
    while(i != it->end() && *i != ii1 && *i != ii2) i++;
    if (i == it->end()) continue;
    int insert = ii1;
    if (*i == ii1) insert = ii2;
    while (i != it->end() && *i != insert) i++;
    if (i == it->end()) it->push_back(insert);
    sort(it->begin(), it->end());
    inserted = true;
    break;
  }
  if (!inserted) {
    vector<int> new_list;
    if (ii1 < ii2) {
      new_list.push_back(ii1);
      new_list.push_back(ii2);
    } else {
      new_list.push_back(ii2);
      new_list.push_back(ii1);
    }
    dupl->push_back(new_list);
  }
}

int GameList::find_duplicates(int bs, bool strict) throw(DBError) {
  if (!currentList->size()) return 0; // this also deals with the case of an empty db
  int bs_index = 0;
  if (duplicates) delete duplicates;
  duplicates = new vector<vector<int> >;
  if (strict) {
    vector<int>::iterator it = boardsizes.begin();
    while (it != boardsizes.end() && *it != bs) {
      bs_index++;
      it++;
    }
    if (it == boardsizes.end()) {
      return 0;
    }
  }
  sort(currentList->begin(), currentList->end());
  sqlite3_stmt *ppStmt=0;
  char sql[200];
  sprintf(sql, "select as1.id,as2.id from algo_signature_%d as1 join algo_signature_%d as2 on as1.signature = as2.signature where as1.id < as2.id;", bs, bs);
  int rc = sqlite3_prepare(db, sql, -1, &ppStmt, 0);
  if (rc != SQLITE_OK || ppStmt==0) throw DBError();
  do {
    rc = sqlite3_step(ppStmt);
    if (rc != SQLITE_DONE && rc != SQLITE_ROW) throw DBError();
    if (rc == SQLITE_ROW) {
      if (!strict || ((Algo_finalpos*)algo_ps[20*bs_index+algo_finalpos])->equal(sqlite3_column_int(ppStmt, 0), sqlite3_column_int(ppStmt, 1)))
        insert_duplicate(sqlite3_column_int(ppStmt, 0), sqlite3_column_int(ppStmt, 1), duplicates);
    }
  } while (rc == SQLITE_ROW);
  rc = sqlite3_finalize(ppStmt);
  if (rc != SQLITE_OK) throw DBError();
  sort(currentList->begin(), currentList->end(), sndcomp);
  return duplicates->size();
}

vector<int> GameList::retrieve_duplicates_VI(unsigned int i) {
  if (i>=duplicates->size()) return vector<int>();
  return (*duplicates)[i];
}

int* GameList::retrieve_duplicates_PI(unsigned int i) {
  if (i>=duplicates->size()) return 0;
  int* result = new int[(*duplicates)[i].size()+1];
  int j = 0;
  for(vector<int>::iterator it = (*duplicates)[i].begin(); it != (*duplicates)[i].end(); it++)
    result[j++] = *it;
  result[(*duplicates)[i].size()] = -1;
  return result;
}


int GameList::get_current_index(int id, int* start) {
  // use this in between start_sorted() and end_sorted() only!
  int end = oldList->size();
  int m = *start;
  while (*start < end) {
    m = (end+*start)/2;
    if (id == (*oldList)[m].first) {
      *start = m;
      return m;
    } else {
      if (id < (*oldList)[m].first) end = m;
      else *start = m+1;
    }
  }
  return -1; 
}

int GameList::get_current_index_CL(int id, int start) {
  // use this in between start_sorted() and end_sorted() only!
  int end = currentList->size();
  int m = start;
  while (start < end) {
    m = (end+start)/2;
    if (id == (*currentList)[m].first) return m;
    else {
      if (id < (*currentList)[m].first) end = m;
      else start = m+1;
    }
  }
  return -1; 
}

void GameList::sigsearch(char* sig, int boardsize) throw(DBError) {
  if (start_sorted() == 0) { 
    char* symmetrized_sig = 0;
    if (boardsize) symmetrized_sig = symmetrize(sig, boardsize);
    // char ssig[13];
    // for(int i=0; i<12; i++) ssig[i] = symmetrized_sig[i];
    // ssig[12] = 0;
    // printf("ssig: %s\n", ssig);
    string query = "select id from algo_signature_19 where signature like ? order by id";
    // int rc = sqlite3_exec(db, query.c_str(), sigs_callback, this, 0);
    sqlite3_stmt *ppStmt=0;
    int rc = sqlite3_prepare(db, query.c_str(), -1, &ppStmt, 0);
    if (rc != SQLITE_OK || ppStmt==0) throw DBError();
    if (boardsize) rc = sqlite3_bind_blob(ppStmt, 1, symmetrized_sig, 12, SQLITE_TRANSIENT);
    else rc = sqlite3_bind_blob(ppStmt, 1, sig, 12, SQLITE_TRANSIENT);
    if (rc != SQLITE_OK || ppStmt==0) throw DBError();
    do {
      rc = sqlite3_step(ppStmt);
      if (rc != SQLITE_DONE && rc != SQLITE_ROW) throw DBError();
      if (rc == SQLITE_ROW) {
        makeIndexHit(sqlite3_column_int(ppStmt, 0), 0);
      }
    } while (rc == SQLITE_ROW);
    rc = sqlite3_finalize(ppStmt);
    if (symmetrized_sig) delete [] symmetrized_sig;
    if (rc != SQLITE_OK) throw DBError();

    end_sorted();
  }
}

int gis_callback(void *gl, int argc, char **argv, char **azColName) {
  if (!argc) return 1;
  ((GameList*)gl)->makeIndexHit(atoi(argv[0]), 0);
  return 0;
}

void GameList::gisearch(char* sql, int complete) throw(DBError) {
  if (start_sorted() == 0) { 
    string query;
    if (!complete) query = "select id from games where ";
    query += sql;
    if (!complete) query += " order by id";
    // printf("%s\n", query.c_str());
    int rc = sqlite3_exec(db, query.c_str(), gis_callback, this, 0);
    if( rc!=SQLITE_OK ) throw DBError();

    end_sorted();
  }
}

int GameList::numHits() {
  return num_hits;
}

int GameList::size() {
  return currentList->size();
}

string GameList::resultsStr(GameListEntry* gle) {
  string result;
  if (!gle->hits) return result;
  char buf[20];
  result.reserve(gle->hits->size()*8);
  for(vector<Hit* >::iterator it = gle->hits->begin(); it != gle->hits->end(); it++) {
    sprintf(buf, "%d", (*it)->pos->data[0]);
    result += buf;
    for(int i=1; i<(*it)->pos->length; i++) {
      sprintf(buf, "-%d", (*it)->pos->data[i]);
      result += buf;
    }
    if ((*it)->label[0] != NO_CONT) result += lookupLabel((*it)->label[0], (*it)->label[1]); // coordinates of Hit
    if ((*it)->label[2]) result += "-, ";
    else result += ", ";
  }
  return result;
}

char GameList::lookupLabel(char x, char y) {
  if (!labels || !mrs_pattern || x < 0 || x >= mrs_pattern->sizeX || y < 0 || y >= mrs_pattern->sizeY) return '?';
  return labels[x+y*mrs_pattern->sizeX];
}

Continuation GameList::lookupContinuation(char x, char y) {
  if (!continuations || !mrs_pattern || x < 0 || x >= mrs_pattern->sizeX || y < 0 || y >= mrs_pattern->sizeY) return Continuation();
  return continuations[x+y*mrs_pattern->sizeX];
}

vector<string> GameList::currentEntriesAsStrings(int start, int end) {
  if (end==0) end = currentList->size();
  vector<string> result;
  if (start>end || end > (int)currentList->size()) return result;
  for(int i=start; i<end; i++) {
    result.push_back((*all)[(*currentList)[i].second]->gameInfoStr + resultsStr((*all)[(*currentList)[i].second]));
  }
  return result;
}

string GameList::currentEntryAsString(int i) {
  if (i < 0 || i >= (int)currentList->size()) {
    return "";
  } else return (*all)[(*currentList)[i].second]->gameInfoStr + resultsStr((*all)[(*currentList)[i].second]);
}

int getpropcallback(void *s, int argc, char **argv, char **azColName) {
  char** prop = (char**)s;
  if (argc && argv[0]) {
    *prop = new char[strlen(argv[0])+1];
    strcpy(*prop, argv[0]);
  }
  return 0;
}

string GameList::getSignature(int i) throw(DBError) {
  if (i < 0 || i >= (int)currentList->size()) {
    // printf("index out of range\n");
    return "";
  }
  int index = (*all)[(*currentList)[i].second]->id;
  char* prop = 0;
  char sql[200];
  sprintf(sql, "select signature from algo_signature_19 where id = %d;", index);
  // printf("%s\n", sql);
  int rc = sqlite3_exec(db, sql, getpropcallback, &prop, 0);
  if (rc != SQLITE_OK) throw DBError();

  if (!prop) return "";
  string prop_str(prop);
  delete [] prop;
  return prop_str;
}

string GameList::getSGF(int i) throw(DBError) {
  if (!p_op->sgfInDB) return "";
  return getCurrentProperty(i, "sgf");
}

string GameList::getCurrentProperty(int i, string tag) throw(DBError) {
  if (i < 0 || i >= (int)currentList->size()) {
    // printf("index out of range\n");
    return "";
  }
  int index = (*all)[(*currentList)[i].second]->id;
  char* prop = 0;
  char sql[200];
  sprintf(sql, "select %s from games where id = %d;", tag.c_str(), index);
  // printf("%s\n", sql);
  int rc = sqlite3_exec(db, sql, getpropcallback, &prop, 0);
  if (rc != SQLITE_OK) throw DBError();

  if (!prop) return "";
  string prop_str(prop);
  delete [] prop;
  return prop_str;
}

void GameList::search(Pattern& pattern, SearchOptions* so) throw(DBError) {
  if (mrs_pattern) delete mrs_pattern;
  mrs_pattern = new Pattern(pattern);
  if (searchOptions) delete searchOptions;
  if (so) searchOptions = new SearchOptions(*so);
  else searchOptions = new SearchOptions();
  PatternList pl(pattern, searchOptions->fixedColor, searchOptions->nextMove);

  vector<int>::iterator it = boardsizes.begin();
  int bs_index = 0;
  while (it != boardsizes.end() && *it != pattern.boardsize) {
    bs_index++;
    it++;
  }
  if (it == boardsizes.end()) {
    delete searchOptions;
    searchOptions = 0;
    if (oldList) delete oldList;
    oldList = 0;
    if (currentList) delete currentList;
    currentList = new vector<pair<int,int> >;
    return;
  }

  if (boardsizes.size() != 1) {
    char buf[20];
    sprintf(buf, "sz = %d", pattern.boardsize);
    gisearch(buf);
  }
  if (!readDBs) {
    for(unsigned int a=0; a < 20*boardsizes.size(); a++) if (algo_ps[a]) algo_ps[a]->readDB(algo_dbs[a]);
    readDBs = 1;
  }

  int hash_result = -1;
  // FULL BOARD PATTERN?
  if ((searchOptions->algos & ALGO_HASH_FULL) && pattern.sizeX == pattern.boardsize && pattern.sizeY == pattern.boardsize && algo_ps[algo_hash_full+20*bs_index]) {
    hash_result = ((Algo_hash_full*)algo_ps[algo_hash_full+20*bs_index])->search(pl, *this, *searchOptions, algo_dbs[algo_hash_full+20*bs_index]);
    if (hash_result == 1) {
    } else if (hash_result == 0) {
      if (searchOptions->algos & ALGO_MOVELIST && algo_ps[algo_movelist+20*bs_index])
        algo_ps[algo_movelist+20*bs_index]->search(pl, *this, *searchOptions);
    }
  }
  if (hash_result == -1) { // not a full board pattern (or not hashable)

    // CORNER PATTERN?
    if ((searchOptions->algos & ALGO_HASH_CORNER) && pattern.sizeX >= 7 && pattern.sizeY >= 7 && algo_ps[algo_hash_corner+20*bs_index]) {
      hash_result = ((Algo_hash_corner*)algo_ps[algo_hash_corner+20*bs_index])->search(pl, *this, *searchOptions, algo_dbs[algo_hash_corner+20*bs_index]);
      if (hash_result == 0) {
        if (searchOptions->algos & ALGO_MOVELIST && algo_ps[algo_movelist+20*bs_index])
          algo_ps[algo_movelist+20*bs_index]->search(pl, *this, *searchOptions);
      }
    }

    if (hash_result == -1) {
      if (searchOptions->algos & ALGO_FINALPOS && algo_ps[algo_finalpos+20*bs_index])
        algo_ps[algo_finalpos+20*bs_index]->search(pl, *this, *searchOptions);
      if (searchOptions->algos & ALGO_MOVELIST && algo_ps[algo_movelist+20*bs_index])
        algo_ps[algo_movelist+20*bs_index]->search(pl, *this, *searchOptions);
    }
  }
  if (labels) delete [] labels;
  labels = pl.sortContinuations();
  if (continuations) delete [] continuations;
  continuations = pl.continuations;
  pl.continuations = new Continuation[pattern.sizeX*pattern.sizeY];

  // FIXME: delete all candidate lists!
}


int GameList::plSize() {
  return pl.size();
}

string GameList::plEntry(int i) {
  if (i < 0 || i >= (int)pl.size()) return "";
  else return pl[i];
}

int rpl_callback(void *pl, int argc, char **argv, char **azColName) {
  if (!argc) return 1;
  ((vector<string>*)pl)->push_back(string(argv[0]));
  return 0;
}

void GameList::readPlayersList() throw(DBError) {
  if (pl.size()) pl = vector<string>();
  sqlite3_exec(db, "select p from (select pw p from games union select pb p from games) order by lower(p)", rpl_callback, &pl, 0);
  // we ignore possible errors, since the table might not yet exist
}

void GameList::createGamesDB() throw(DBError) {
  SGFtags = p_op->SGFTagsAsStrings();

  string sql1 =          "create table if not exists GAMES ( ";
  sql1 +=                  "id integer primary key, ";
  sql1 +=                  "path text, ";
  sql1 +=                  "filename text, ";
  sql1 +=                  "pos integer default 0, ";
  sql1 +=                  "duplicate integer, ";
  sql1 +=                  "dbtree text, ";
  sql1 +=                  "date date";

  sql_ins_rnp =            "insert into games (path, filename, pos, dbtree, date";
  string question_marks =  "?,?,?,?,?";

  if (p_op->sgfInDB) {
    sql1 +=                ", sgf text";
    sql_ins_rnp +=         ", sgf";
    question_marks += ",?";
  }

  SGFtagsSize = SGFtags->size();
  int ctr = 0;
  posDT = posSZ = posWR = posBR = posHA = -1;
  for(vector<string>::iterator it = SGFtags->begin(); it != SGFtags->end(); it++) {
    sql1 += ", " + *it + " text";
    sql_ins_rnp += ", " + *it;
    question_marks += ",?";
    if (*it == "DT") posDT = ctr;

    if (*it == "SZ") posSZ = ctr;
    if (*it == "WR") posWR = ctr;
    if (*it == "BR") posBR = ctr;
    if (*it == "HA") posHA = ctr;
    ctr++;
  }
  if (posDT == -1) throw DBError();
  if (posSZ == -1) {
    posSZ = SGFtags->size();
    SGFtags->push_back("SZ");
  }
  if (posWR == -1) {
    posWR = SGFtags->size();
    SGFtags->push_back("WR");
  }
  if (posBR == -1) {
    posBR = SGFtags->size();
    SGFtags->push_back("BR");
  }
  if (posHA == -1) {
    posHA = SGFtags->size();
    SGFtags->push_back("HA");
  }

  sql1 +=                  ");";
  sql_ins_rnp +=           ") values (" + question_marks + ");";

  int rc = sqlite3_exec(db, sql1.c_str(), 0, 0, 0);
  if(rc != SQLITE_OK) throw DBError();

  sql1 = "create table if not exists TAGS ( id integer primary key, name text, visible integer default 1 );";
  rc = sqlite3_exec(db, sql1.c_str(), 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();
  char sql[100];
  sprintf(sql, "insert into TAGS (id, name) values (%d, '%d');", HANDI_TAG, HANDI_TAG);
  rc = sqlite3_exec(db, sql, 0, 0, 0);
  // if (rc != SQLITE_OK) throw DBError();
  sprintf(sql, "insert into TAGS (id, name) values (%d, '%d');", PROFESSIONAL_TAG, PROFESSIONAL_TAG);
  rc = sqlite3_exec(db, sql, 0, 0, 0);
  // if (rc != SQLITE_OK) throw DBError();
  sql1 = "create table if not exists GAME_TAGS ( id integer primary key, game_id integer, tag_id integer );";
  rc = sqlite3_exec(db, sql1.c_str(), 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();
}

void GameList::start_processing(int PROCESSVARIATIONS) throw(DBError) {
  // printf("enter start_processing %p\n", p_op);

  delete_all_snapshots();

  if (PROCESSVARIATIONS != -1) processVariations = PROCESSVARIATIONS;
  else processVariations = p_op->processVariations;
  readDBs = 0;
  // printf("dt %d sz %d\n", posDT, posSZ);

  int rc;

  createGamesDB();

  char* sql = "begin transaction;";
  rc = sqlite3_exec(db, sql, 0, 0, 0);
  if (rc) { throw DBError(); }
  rc = sqlite3_exec(algo_db1, sql, 0, 0, 0);
  if (rc) { throw DBError(); }
  rc = sqlite3_exec(algo_db2, sql, 0, 0, 0);
  if (rc) { throw DBError(); }
  current = 0;
  for(unsigned int a=0; a < 20*boardsizes.size(); a++) {
    if (algo_ps[a]) algo_ps[a]->initialize_process(algo_dbs[a]);
  }
}

void GameList::finalize_processing() throw(DBError) {
  for(unsigned int a=0; a<20*boardsizes.size(); a++) 
    if (algo_ps[a]) algo_ps[a]->finalize_process();
  int rc = sqlite3_exec(db, "commit;", 0, 0, 0);
  if (rc != SQLITE_OK) {
    sqlite3_close(db);
    db = 0;
    throw DBError();
  }
  rc = sqlite3_exec(algo_db1, "commit;", 0, 0, 0);
  if (rc != SQLITE_OK) {
    sqlite3_close(algo_db1);
    algo_db1 = 0;
    throw DBError();
  }
  rc = sqlite3_exec(algo_db2, "commit;", 0, 0, 0);
  if (rc != SQLITE_OK) {
    sqlite3_close(algo_db2);
    algo_db2 = 0;
    throw DBError();
  }
  string sql = "update db_info set info = '";
  for(vector<int>::iterator it = boardsizes.begin(); it != boardsizes.end(); it++) {
    char buf[20];
    sprintf(buf, "%d,", *it);
    sql += buf;
  } 
  sql += "' WHERE rowid = 2;";
  rc = sqlite3_exec(db, sql.c_str(), 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();
  // sqlite3_close(db);
  // db = 0;
  readDBs = 0;
  readDB();
  delete SGFtags;
}

int GameList::process(const char* sgf, const char* path, const char* fn,
                      const char* DBTREE, int flags) throw(SGFError,DBError) {
  process_results_vector.clear();
  const char* dbtree = "";
  if (DBTREE) dbtree = DBTREE;

  Cursor* c = 0;
  try {
    c = new Cursor(sgf, 1); // parse sgf sloppily
  } catch (SGFError) {
    return 0;
  }

  Node* root = c->root->next;

  int pos = 0;
  while (root) {
    current++;
    int return_val = 0;
    // if (!(current%1000)) {
    //  char* sql = "end transaction;";
    //  int rc = sqlite3_exec(db, sql, 0, 0, 0);
    //  if (rc) {
    //    sqlite3_close(db);
    //    db = 0;
    //    throw DBError();
    //  }
    //  sql = "begin transaction;";
    //  rc = sqlite3_exec(db, sql, 0, 0, 0);
    //  if (rc) {
    //    sqlite3_close(db);
    //    db = 0;
    //    throw DBError();
    //  }
    // }
    vector<string>* rootNodeProperties = parseRootNode(root, SGFtags);
    // for(vector<string>::iterator rnp = rootNodeProperties->begin(); rnp != rootNodeProperties->end(); rnp++)
    // printf("rnp %s\n", rnp->c_str());

    // check board size
    string sz = (*rootNodeProperties)[posSZ];
    // printf("sz %s\n", sz.c_str());
    if (sz=="") sz = "19";
    int bs = atoi(sz.c_str());
    if (bs < 1) {
      return_val |= UNACCEPTABLE_BOARDSIZE;
      process_results_vector.push_back(return_val);
      delete rootNodeProperties;
      root = root->down;
      pos++;
      continue;
    }
    int algo_offset = -1;
    int bs_ctr = 0;
    for(vector<int>::iterator it = boardsizes.begin();  it != boardsizes.end(); it++) {
      if (*it == bs) {
        algo_offset = bs_ctr;
        break;
      }
      bs_ctr++;
    }  
    if (algo_offset == -1) { // not found
      boardsizes.push_back(bs);
      addAlgos(bs);
      algo_offset = algo_ps.size()/20 - 1;
      // printf("algo_offset %d %d \n", algo_offset, algo_ps.size());
      for(int a=20*algo_offset; a < 20*(algo_offset+1); a++) {
        // printf("a %d\n", a);
        // printf("%p\n", algo_ps[a]);
        if (algo_ps[a]) algo_ps[a]->initialize_process(algo_dbs[a]);
      }
    }

    // parse DT tag
    string dt = (*rootNodeProperties)[posDT];
    // printf("dt %s\n", dt.c_str());
    string date;

    bool year_found = false;
    int p = 0;
    while (!year_found && p < (int)dt.size()) {
      p = dt.find_first_of("0123456789", p);
      if (p == (int)string::npos || p+4 > (int)dt.size() ) break;
      else {
        year_found = (('0' <= dt[p] && dt[p] <= '9') && ('0' <= dt[p+1] && dt[p+1] <= '9') && ('0' <= dt[p+2] && dt[p+2] <= '9') && ('0' <= dt[p+3] && dt[p+3] <= '9'));
        if (year_found && (int)dt.find_first_of("0123456789", p+4) != p+4) { // success: found 4 digits in a row
          date += dt.substr(p,4);
          date += '-';
          dt.erase(p,4);
        } else {
          while ('0' <= dt[p] && dt[p] <= '9') p++;
          year_found = false;
          continue;
        }
      }
    }
    if (!year_found) date = "0000-00-00";
    else {
      bool month_found = false;
      p = 0;
      while (!month_found && p < (int)dt.size()) {
        p = dt.find_first_of("0123456789", p);
        if (p == (int)string::npos || p+2 > (int)dt.size() ) break;
        else {
          month_found = ('0' <= dt[p] && dt[p] <= '9' && '0' <= dt[p+1] && dt[p+1] <= '9');
          if (month_found && (int)dt.find_first_of("0123456789", p+2) != p+2) {
            date += dt.substr(p,2);
            date += '-';
            dt.erase(p,2);
          } else {
            while ('0' <= dt[p] && dt[p] <= '9') p++;
            month_found = false;
            continue;
          }
        }
      }
      if (!month_found) date += "00-00";
      else {
        bool day_found = false;
        p = 0;
        while (!day_found && p < (int)dt.size()) {
          p = dt.find_first_of("0123456789", p);
          if (p == (int)string::npos || p+2 > (int)dt.size() ) break;
          else {
            day_found = ('0' <= dt[p] && dt[p] <= '9' && '0' <= dt[p+1] && dt[p+1] <= '9');
            if (day_found && (int)dt.find_first_of("0123456789", p+2) != p+2) {
              date += dt.substr(p,2);
            } else {
              while ('0' <= dt[p] && dt[p] <= '9') p++;
              day_found = false;
              continue;
            }
          }
        }
        if (!day_found) date += "00";
      }
    }

    // printf("sql %s\n", sql_ins_rnp.c_str());
    sqlite3_stmt *ppStmt=0;
    int rc = sqlite3_prepare(db, sql_ins_rnp.c_str(), -1, &ppStmt, 0);
    if (rc != SQLITE_OK || ppStmt==0) {
      throw DBError(); // FIXME: catch busy error, (and/or throw DBError?)
    }

    int stmt_ctr = 1;
    rc = sqlite3_bind_text(ppStmt, stmt_ctr++, path, -1, SQLITE_TRANSIENT);
    if (rc != SQLITE_OK) throw DBError();
    rc = sqlite3_bind_text(ppStmt, stmt_ctr++, fn, -1, SQLITE_TRANSIENT); 
    if (rc != SQLITE_OK) throw DBError();
    rc = sqlite3_bind_int(ppStmt, stmt_ctr++, pos);
    if (rc != SQLITE_OK) throw DBError();
    rc = sqlite3_bind_text(ppStmt, stmt_ctr++, dbtree, -1, SQLITE_TRANSIENT);
    if (rc != SQLITE_OK) throw DBError();
    rc = sqlite3_bind_text(ppStmt, stmt_ctr++, date.c_str(), -1, SQLITE_TRANSIENT); 
    if (rc != SQLITE_OK) throw DBError();

    if (p_op->sgfInDB) {
      if (c->root->numChildren == 1) rc = sqlite3_bind_text(ppStmt, stmt_ctr++, sgf, -1, SQLITE_TRANSIENT); 
      else {
        string s= "(";
        s += c->outputVar(root);
        s+= ")";
        rc = sqlite3_bind_text(ppStmt, stmt_ctr++, s.c_str(), -1, SQLITE_TRANSIENT); 
      }
      if (rc != SQLITE_OK) throw DBError();
    }

    for(int i=0; i < SGFtagsSize; i++) {
      rc = sqlite3_bind_text(ppStmt, stmt_ctr++, (*rootNodeProperties)[i].c_str(), -1, SQLITE_TRANSIENT); 
      if (rc != SQLITE_OK) throw DBError();
    }

    rc = sqlite3_step(ppStmt);
    if (rc != SQLITE_DONE)  throw DBError();
    rc = sqlite3_finalize(ppStmt);
    if (rc != SQLITE_OK)  throw DBError();
    int game_id = sqlite3_last_insert_rowid(db);


    // printf("play through the game\n");
    bool commit = true;

    Node* currentN = root;
    for(int a=20*algo_offset; a < 20*(algo_offset+1); a++) 
      if (algo_ps[a]) algo_ps[a]->newgame_process(game_id);

    abstractBoard b = abstractBoard(bs);
    int whichVar = 0;
    stack<VarInfo> branchpoints;

    while (currentN) {
      // printf("nn\n");
      bool caughtSGFError = false;
      char* propValue = 0;

      try {

        // parse current node, watch out for B, W, AB, AW, AE properties
        const char* s = currentN->SGFstring.c_str();
        int lSGFstring = strlen(s);
        int i = 0;
        while (i < lSGFstring && s[i] != ';' && (s[i]==' ' || s[i]=='\n' || s[i]=='\r' || s[i]=='\t')) 
          i++;

        if (i>=lSGFstring || s[i] != ';') throw SGFError();
        i++;

        while (i < lSGFstring) { // while parsing

          while (i < lSGFstring && (s[i]==' ' || s[i]=='\n' || s[i]=='\r' || s[i]=='\t')) 
            i++;
          if (i >= lSGFstring) break;

          char ID[30];
          int IDindex = 0;

          while (i < lSGFstring && s[i] != '[' && IDindex < 30) {
            if (65 <= s[i] && s[i] <= 90)
              ID[IDindex++] = s[i];
            else if (!(97 <= s[i] && s[i] <= 122) && !(s[i]==' ' || s[i]=='\n' || s[i]=='\r' || s[i]=='\t')) {
              throw SGFError();
            }
            i++;
          }

          i++;

          if (i >= lSGFstring || IDindex >= 30 || !IDindex) {
            throw SGFError();
          }
          ID[IDindex] = 0; // found next property ID
          bool IDrelevant= (!strcmp(ID,"B") || !strcmp(ID,"W") || !strcmp(ID,"AB") || !strcmp(ID,"AW") || !strcmp(ID,"AE"));
          propValue = new char[100000];
          int propValueIndex = 0;
          int oldPropValueIndex = 0;

          while (i < lSGFstring) { // while looking for property values of the current property
            while (s[i] != ']' && i < lSGFstring) {
              if (s[i] == '\\') i++;
              if (!IDrelevant || s[i] == '\t' || s[i] == ' ' || s[i] == '\r' || s[i] == '\n') {
                i++;
                continue;
              }
              if (97 <= s[i] && s[i] <= 96+bs) { // valid board coordinate?
                propValue[propValueIndex++] = s[i];
                if (propValueIndex > 99990) throw SGFError();
              } else if (s[i] == 't') { ; // allow passes, but do not record them (we handle them a little sloppily here)
              } else if (s[i] == ':') {
                if (propValueIndex - oldPropValueIndex != 2)
                  throw SGFError();
                char rect1 = 'a';
                char rect2 = 'a';
                i++;
                while (i<lSGFstring && (s[i] == '\t' || s[i] == ' ' || s[i] == '\r' || s[i] == '\n')) i++;
                if (i >= lSGFstring) throw SGFError();
                if (97 <= s[i] && s[i] <= 96+bs) // valid board coordinate?
                  rect1 = s[i];
                else throw SGFError();
                i++;
                while (i<lSGFstring && (s[i] == '\t' || s[i] == ' ' || s[i] == '\r' || s[i] == '\n')) i++;
                if (i >= lSGFstring) throw SGFError();
                if (97 <= s[i] && s[i] <= 96+bs) // valid board coordinate?
                  rect2 = s[i];
                else throw SGFError();
                i++;
                while (i<lSGFstring && (s[i] == '\t' || s[i] == ' ' || s[i] == '\r' || s[i] == '\n')) i++;
                if (i >= lSGFstring) throw SGFError();
                if (s[i] == ']') {
                  char st1 = propValue[propValueIndex-2];
                  char st2 = propValue[propValueIndex-1];
                  propValueIndex -= 2; // do not want to have the first entry twice!
                  for(char x1 = st1; x1 <= rect1; x1++) {
                    for(char x2 = st2; x2 <= rect2; x2++) {
                      propValue[propValueIndex++] = x1;
                      propValue[propValueIndex++] = x2;
                      if (propValueIndex > 99990) throw SGFError();
                    }
                  }
                  oldPropValueIndex = propValueIndex;
                  break;
                } else throw SGFError();
              } else {
                throw SGFError();
              }
              i++;
            }
            if (i >= lSGFstring) throw SGFError();

            if (propValueIndex - oldPropValueIndex != 0 && propValueIndex - oldPropValueIndex != 2) {
              throw SGFError();
            }
            oldPropValueIndex = propValueIndex;

            i++;
            while (i < lSGFstring && (s[i]==' ' || s[i]=='\n' || s[i]=='\r' || s[i]=='\t')) i++;

            if (i >= lSGFstring || s[i] != '[') break; // end of node, or found next property
            else i++; // s[i] == '[', so another property value follows. 
          }
          int p_len = propValueIndex/2;

          if (!propValueIndex) { // in particular, this happens if !IDrelevant
            if (!strcmp(ID, "B") || !strcmp(ID, "W")) {
              for(int a=20*algo_offset; a < 20*(algo_offset+1); a++) 
                if (algo_ps[a]) algo_ps[a]->pass_process();
            }
            delete [] propValue;
            propValue = 0;
            continue;
          }

          if (!strcmp(ID, "B") || !strcmp(ID, "W")) {
            char x = propValue[0]-97; // 97 == ord('a'), (0,0) <= (x,y) <= (bs-1, bs-1)
            char y = propValue[1]-97;

            if (!b.play(x, y, ID)) throw SGFError();
            Move m = b.undostack.top();

            for(int a=20*algo_offset; a < 20*(algo_offset+1); a++) 
              if (algo_ps[a]) algo_ps[a]->move_process(m);
          } else
            if (!strcmp(ID, "AB")) {
              for(int pp=0; pp < p_len; pp++) {
                char x = propValue[2*pp]-97;
                char y = propValue[2*pp+1]-97;
                if (!b.play(x, y, "B")) throw SGFError();
                for(int a=20*algo_offset; a < 20*(algo_offset+1); a++) 
                  if (algo_ps[a]) algo_ps[a]->AB_process(x, y);
              }
            } else
              if (!strcmp(ID, "AW")) {
                for(int pp=0; pp < p_len; pp++) {
                  char x = propValue[2*pp]-97;
                  char y = propValue[2*pp+1]-97;
                  if (!b.play(x, y, "W")) throw SGFError();
                  for(int a=20*algo_offset; a < 20*(algo_offset+1); a++) 
                    if (algo_ps[a]) algo_ps[a]->AW_process(x, y);
                }
              } else {
                if (!strcmp(ID, "AE")) {
                  for(int pp=0; pp < p_len; pp++) {
                    char x = propValue[2*pp]-97;
                    char y = propValue[2*pp+1]-97;
                    char removed = b.getStatus(x,y);
                    if (removed==' ') throw SGFError();
                    b.remove(x, y);
                    for(int a=20*algo_offset; a < 20*(algo_offset+1); a++) 
                      if (algo_ps[a]) algo_ps[a]->AE_process(x, y, removed);
                  }
                }
              }
              delete [] propValue;
              propValue = 0;
        } 
      } catch (SGFError) {
        if (propValue) {
          delete [] propValue;
          propValue = 0;
        }
        return_val |= SGF_ERROR;
        caughtSGFError = true;
        if (flags & OMIT_GAMES_WITH_SGF_ERRORS) {
          commit = false;
          // (FIXME should exit from the loop here)
        }
      }

      {
        for(int a=20*algo_offset; a < 20*(algo_offset+1); a++) 
          if (algo_ps[a]) algo_ps[a]->endOfNode_process();
      }

      if (processVariations && currentN->numChildren > 1) { // several variations start from this node;
        for(int a=20*algo_offset; a < 20*(algo_offset+1); a++) 
          if (algo_ps[a]) algo_ps[a]->branchpoint_process();
        branchpoints.push(VarInfo(currentN, new abstractBoard(b), 0));
      }

      if (caughtSGFError) currentN = 0; // stop here with this branch
      else currentN = currentN->next;

      if (!currentN && branchpoints.size()) {
        currentN = branchpoints.top().n;
        b = abstractBoard(*branchpoints.top().b);
        whichVar = branchpoints.top().i;
        branchpoints.pop();
        for(int a=20*algo_offset; a < 20*(algo_offset+1); a++) 
          if (algo_ps[a]) algo_ps[a]->endOfVariation_process();
        if (whichVar+2 < currentN->numChildren) {
          for(int a=20*algo_offset; a < 20*(algo_offset+1); a++) 
            if (algo_ps[a]) algo_ps[a]->branchpoint_process();
          branchpoints.push(VarInfo(currentN, new abstractBoard(b), whichVar+1));
        }
        currentN = currentN->next;
        for(int vi=0; vi < whichVar+1; vi++) currentN = currentN->down;
      } 
    } // while
    {
      // check for duplicates (if desired)
      bool is_duplicate = false;
      if (flags & (CHECK_FOR_DUPLICATES|CHECK_FOR_DUPLICATES_STRICT)) {
        char* sig = ((Algo_signature*)algo_ps[20*algo_offset])->get_current_signature();
        vector<int> all_duplicates = ((Algo_signature*)algo_ps[20*algo_offset])->search_signature(sig);
        if (all_duplicates.size()) {
          // printf("dupl %d\n", all_duplicates.size());
          is_duplicate = true;
          if ((flags & CHECK_FOR_DUPLICATES_STRICT) && (p_op->algos & ALGO_FINALPOS)) {
            vector<int>::iterator d_it = all_duplicates.begin();
            while (d_it != all_duplicates.end() && !((Algo_finalpos*)algo_ps[20*algo_offset + algo_finalpos])->equals_current(*d_it))
              d_it++;
            if (d_it == all_duplicates.end()) is_duplicate = false;
          }
          if (is_duplicate) {
            return_val |= IS_DUPLICATE;
            if (flags & OMIT_DUPLICATES) commit = false;
          }
        }
        delete [] sig;
      }

      if (commit) {
        // evaluate tags
        if ((*rootNodeProperties)[posHA] != "") { // handicap game
          char sql[100];
          sprintf(sql, "insert into GAME_TAGS (game_id, tag_id) values (%d, %d);", game_id, HANDI_TAG);
          rc = sqlite3_exec(db, sql, 0, 0, 0);
          if (rc != SQLITE_OK)  throw DBError();
        }
        if ((*rootNodeProperties)[posWR].find('p') != string::npos ||
            (*rootNodeProperties)[posBR].find('p') != string::npos) { 
          // at least one of the players is professional
          char sql[100];
          sprintf(sql, "insert into GAME_TAGS (game_id, tag_id) values (%d, %d);", game_id, PROFESSIONAL_TAG);
          rc = sqlite3_exec(db, sql, 0, 0, 0);
          if (rc != SQLITE_OK)  throw DBError();
        }
      } else {
        return_val |= NOT_INSERTED_INTO_DB;
        char sql[200];
        sprintf(sql, "delete from GAMES where id=%d", game_id);
        rc = sqlite3_exec(db, sql, 0, 0, 0);
        if (rc) printf("ouch %d\n", rc);
      }
      for(int a=20*algo_offset; a < 20*(algo_offset+1); a++) {
        // printf("endgame %d\n", a);
        if (algo_ps[a]) algo_ps[a]->endgame_process(commit);
      }
    }
    delete rootNodeProperties;
    process_results_vector.push_back(return_val);
    root = root->down;
    pos++;
  }
  delete c;
  return process_results_vector.size();
}

int GameList::process_results(unsigned int i) {
  if (i<0 || i>=process_results_vector.size()) return INDEX_OUT_OF_RANGE;
  return process_results_vector[i];
}


int GameList::snapshot() throw(DBError) {
  // return a handle to a snapshot stored in the main GameList db
  // the snapshot contains copies of
  // - orderby, format1, format2
  // - currentList
  // - all hits in the GameListEntry's of currentList
  // - pattern, labels, continuations, num_hits, num_switched, Bwins, Wwins

  SnapshotVector snapshot;
  snapshot.pb_string(orderby);
  snapshot.pb_string(format1);
  snapshot.pb_string(format2);

  snapshot.pb_int(currentList->size());
  for(vector<pair<int,int> >::iterator it = currentList->begin(); it != currentList->end(); it++) {
    snapshot.pb_int(it->first);
    snapshot.pb_int(it->second);
    vector<Hit* >* hits = (*all)[it->second]->hits;
    snapshot.pb_int(hits->size());
    for (vector<Hit* >::iterator it_h = hits->begin(); it_h != hits->end(); it_h++) {
      (*it_h)->to_snv(snapshot);
    }
  }

  if (mrs_pattern) {
    snapshot.pb_char(1);
    mrs_pattern->to_snv(snapshot);
  } else snapshot.pb_char(0);
  if (searchOptions) {
    snapshot.pb_char(1);
    searchOptions->to_snv(snapshot);
  } else snapshot.pb_char(0);
  if (mrs_pattern && labels && continuations) {
    snapshot.pb_char(1);
    snapshot.pb_charp(labels, mrs_pattern->sizeX * mrs_pattern->sizeY);
    for(int i=0; i<mrs_pattern->sizeX * mrs_pattern->sizeY; i++) continuations[i].to_snv(snapshot);
  } else snapshot.pb_char(0);
  snapshot.pb_int(num_hits);
  snapshot.pb_int(num_switched);
  snapshot.pb_int(Bwins);
  snapshot.pb_int(Wwins);

  // insert snapshot into database
  sqlite3_stmt *ppStmt=0;
  int rc = sqlite3_prepare(db, "insert into snapshots (data) values (?)", -1, &ppStmt, 0);
  if (rc != SQLITE_OK || ppStmt==0) throw DBError();
  char* snchp = snapshot.to_charp();
  rc = sqlite3_bind_blob(ppStmt, 1, snchp, snapshot.size(), SQLITE_TRANSIENT);
  delete [] snchp;
  if (rc != SQLITE_OK) throw DBError();
  rc = sqlite3_step(ppStmt);
  if (rc != SQLITE_DONE) throw DBError();
  rc = sqlite3_finalize(ppStmt);
  if (rc != SQLITE_OK) throw DBError();
  return sqlite3_last_insert_rowid(db);
}

void GameList::restore(int handle, bool del) throw(DBError) {
  // restore the state of the GameList associated with handle

  // retrieve info associated with handle from db

  char* sn = 0;
  int sn_size = 0;
  sqlite3_stmt *ppStmt=0;
  int rc = sqlite3_prepare(db, "select data from snapshots where rowid = ?", -1, &ppStmt, 0);
  if (rc != SQLITE_OK || ppStmt==0) {
    throw DBError();
  }
  rc = sqlite3_bind_int(ppStmt, 1, handle);
  if (rc != SQLITE_OK) throw DBError();
  rc = sqlite3_step(ppStmt);
  if (rc == SQLITE_ROW) {
    sn = (char*)sqlite3_column_blob(ppStmt, 0);
    sn_size = sqlite3_column_bytes(ppStmt, 0);
  } else throw DBError();

  SnapshotVector snapshot(sn, sn_size);

  // parse info

  string ob = snapshot.retrieve_string();
  string f1 = snapshot.retrieve_string();
  string f2 = snapshot.retrieve_string();
  if (ob != orderby || f1 != format1 || f2 != format2) resetFormat();

  if (oldList) delete oldList;
  oldList = 0;
  if (currentList) delete currentList;
  currentList = new vector<pair<int,int> >;
  for(vector<GameListEntry* >::iterator it = all->begin(); it != all->end(); it++) {
    if ((*it)->hits) {
      for(vector<Hit* >::iterator ith = (*it)->hits->begin(); ith != (*it)->hits->end(); ith++)
        delete *ith;
      delete (*it)->hits;
      (*it)->hits = 0;
    }
    if ((*it)->candidates) {
      for(vector<Candidate* >::iterator itc = (*it)->candidates->begin(); itc != (*it)->candidates->end(); itc++)
        delete *itc;
      delete (*it)->candidates;
      (*it)->candidates = 0;
    }
  }

  int cl_size = snapshot.retrieve_int();
  for(int i=0; i<cl_size; i++) {
    int i1 = snapshot.retrieve_int();
    int i2 = snapshot.retrieve_int();

    currentList->push_back(make_pair(i1, i2));
    // if ((*currentList)[currentList->size()-1].second >= all->size()) printf("ouch %d\n", (*currentList)[currentList->size()-1].second);
    (*all)[(*currentList)[currentList->size()-1].second]->hits_from_snv(snapshot);
  }

  if (mrs_pattern) delete mrs_pattern;
  if (snapshot.retrieve_char()) mrs_pattern = new Pattern(snapshot);
  else mrs_pattern = 0;

  if (searchOptions) delete searchOptions;
  if (snapshot.retrieve_char()) searchOptions = new SearchOptions(snapshot);
  else searchOptions = 0;

  if (labels) delete [] labels;
  if (continuations) delete [] continuations; // FIXME check (cf. ~GameList)
  if (snapshot.retrieve_char()) {
    labels = snapshot.retrieve_charp();
    continuations = new Continuation[mrs_pattern->sizeX * mrs_pattern->sizeY];
    for(int i=0; i<mrs_pattern->sizeX * mrs_pattern->sizeY; i++) 
      continuations[i].from_snv(snapshot);
  } else {
    labels = 0;
    continuations = 0;
  }
  num_hits = snapshot.retrieve_int();
  num_switched = snapshot.retrieve_int();
  Bwins = snapshot.retrieve_int();
  Wwins = snapshot.retrieve_int();

  rc = sqlite3_finalize(ppStmt);
  if (rc != SQLITE_OK) throw DBError();
  if (del) { // delete snapshot from db
    char sql[100];
    sprintf(sql, "delete from snapshots where rowid = %d", handle);
    rc = sqlite3_exec(db, sql, 0, 0, 0);
    if (rc != SQLITE_OK) throw DBError();
  }
}

void GameList::delete_snapshot(int handle) throw(DBError) {
  char sql[100];
  sprintf(sql, "delete from snapshots where rowid = %d", handle);
  int rc = sqlite3_exec(db, sql, 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();
}

void GameList::delete_all_snapshots() throw(DBError) {
  int rc = sqlite3_exec(db, "delete from snapshots", 0, 0, 0);
  if (rc != SQLITE_OK) throw DBError();
}

VarInfo::VarInfo(Node* N, abstractBoard* B, int I) {
  n = N;
  b = B;
  i = I;
}

VarInfo::VarInfo(const VarInfo& v) {
  n = v.n;
  b = new abstractBoard(*v.b);
  i = v.i;
}

VarInfo::~VarInfo() {
  delete b;
}

