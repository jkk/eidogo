// File: sgfparser.h
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

#ifndef _SGFPARSER_H_
#define _SGFPARSER_H_

#include <string>
#include <vector>
#include <utility>
#include <stack>
#include <map>

typedef std::pair<char,char> p_cc;

class SGFError {
  public:
    SGFError();
};

class ExtendedMoveNumber {
  public:
    int length;
    int* data; // "even" entries: go right, "odd" entries: go down in game tree.

    ExtendedMoveNumber();
    ExtendedMoveNumber(int LENGTH, int* DATA);
    ExtendedMoveNumber(int D);
    ExtendedMoveNumber(const ExtendedMoveNumber& emn);
    ~ExtendedMoveNumber();

    ExtendedMoveNumber& operator=(const ExtendedMoveNumber& emn);
    void next();
    void down() throw(SGFError);
    int total_move_num();
    // void down();
};


char* SGFescape(const char* s);

class PropValue {
  public:
    PropValue(std::string IDC, std::vector<std::string>* PV);
    ~PropValue();
    std::string IDcomplete;
    std::vector<std::string>* pv;
};

class Node {
  public:
    Node* previous;
    Node* next;
    Node* up;
    Node* down;
    int numChildren;
    int level;
    std::string SGFstring;
    int parsed;
    std::vector<std::string> gpv(const std::string& prop);
    std::vector<std::string>* get_property_value(const std::string& prop);
    void set_property_value(std::string& IDcomplete, std::vector<std::string>* propValue) throw(SGFError);

    int posyD; // used when displaying SGF structure graphically as a tree

    Node(Node* prev, char* SGFst, int lvl) throw(SGFError);
    ~Node();
    ExtendedMoveNumber get_move_number();
    void parseNode() throw(SGFError);
    static int sloppy;
  private:
    std::map<std::string, PropValue> data; // use get_property_value to access this
};

typedef char* char_p;

std::vector<std::string>* parseRootNode(Node* n, std::vector<std::string>* tags) throw(SGFError);

class Cursor {
  public:
    Cursor(const char* sgf, int sloppy) throw(SGFError);
    ~Cursor();

    int atStart;
    int atEnd;
    int height;
    int width;
    Node* root;
    Node* currentN;
    int posx;
    int posy;

    void parse(const char* s) throw(SGFError);
    void game(int n) throw(SGFError);
    void next(int n=0) throw(SGFError);
    void previous() throw(SGFError);
    Node* getRootNode(int n) throw(SGFError);
    // void updateRootNode(PyObject* data, int n) throw(SGFError);
    char* outputVar(Node* node);
    char* output();
    void add(char* st);
    void delVariation(Node* node);
    void setFlags();  

  protected:
    void delVar(Node* node);
    void deltree(Node* node);

};

std::string nodeToString(std::map<std::string, PropValue >& data) throw(SGFError);
// char* rootNodeToString(PyObject* data);

#endif

