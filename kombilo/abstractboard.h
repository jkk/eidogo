// File: abstractboard.h
// part of libkombilo, http://www.u-go.net/kombilo/

// Copyright (c) 2006 Ulrich Goertz <u@g0ertz.de>

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

#ifndef _ABSTRACTBOARD_H_
#define _ABSTRACTBOARD_H_

#include <vector>
#include <utility>
#include <stack>

class BoardError {
 public:
  BoardError();
};

typedef std::pair<char,char> p_cc;


class MoveNC {
  public:
    char x;
    char y;
    char color;

    MoveNC();
    MoveNC(char X, char Y, char COLOR);
    bool operator==(const MoveNC& mnc) const;
};

class Move : public MoveNC {
  public:
    Move(char xx, char yy, char cc);
    Move(const Move& m);
    ~Move();
    Move& operator=(const Move& m);

    std::vector<p_cc >* captures;
};


class abstractBoard {
  public:
    int boardsize;
    char* status;
    std::stack<Move> undostack;

    abstractBoard(int bs = 19) throw(BoardError);
    abstractBoard(const abstractBoard& ab);
    ~abstractBoard();
    abstractBoard& operator=(const abstractBoard& ab);
    void clear();
    int play(int x, int y, char* color) throw(BoardError);
    void undo(int n=1);
    void remove(int x, int y);
    char getStatus(int x, int y);
    void setStatus(int x, int y, char val);
    int len_cap_last() throw(BoardError);
    void undostack_append_pass();
    // abstractBoard& copy(const abstractBoard& ab);

  private:
    int* neighbors(int x, int y);
    std::vector<p_cc >* legal(int x, int y, char color);
    std::vector<p_cc >* hasNoLibExcP(int x1, int y1, int exc=-1);
    char invert(char);
};

#endif

