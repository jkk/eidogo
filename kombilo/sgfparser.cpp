// File: sgfparser.cpp
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

using std::vector;
using std::stack;
using std::pair;
using std::map;
using std::string;

SGFError::SGFError() {}

ExtendedMoveNumber::ExtendedMoveNumber() {
  length = 0;
  data = 0;
}

ExtendedMoveNumber::ExtendedMoveNumber(int LENGTH, int* DATA) {
  length = LENGTH;
  if (length) data = new int[length];
  else data = 0;
  for(int i=0; i<length; i++) data[i] = DATA[i];
}

ExtendedMoveNumber::ExtendedMoveNumber(int D) {
  length = 1;
  data = new int[1];
  data[0] = D;
}

ExtendedMoveNumber::ExtendedMoveNumber(const ExtendedMoveNumber& emn) {
  length = emn.length;
  if (length) data = new int[length];
  else data = 0;
  for(int i=0; i<length; i++) data[i] = emn.data[i];
}

ExtendedMoveNumber::~ExtendedMoveNumber() {
  if (data) delete [] data;
}

ExtendedMoveNumber& ExtendedMoveNumber::operator=(const ExtendedMoveNumber& emn) {
  if (this != &emn) {
    length = emn.length;
    if (data) delete [] data;
    if (length) {
      data = new int[length];
      for(int i=0; i<length; i++) data[i] = emn.data[i];
    } else data = 0;
  }
  return *this;
}

void ExtendedMoveNumber::next() {
  data[length-1]++;
}

void ExtendedMoveNumber::down() throw(SGFError) {
  if (length==0) throw SGFError();
  else if (length==1) {
    int* newdata = new int[3];
    newdata[0] = data[0];
    newdata[1] = 1;
    newdata[2] = 0;
    length = 3;
    delete [] data;
    data = newdata;
  } else {
    if (data[length-1]) {
      int* newdata = new int[length+2];
      for(int i=0; i<length; i++) newdata[i] = data[i];
      newdata[length] = 1;
      newdata[length+1] = 0;
      length += 2;
      delete [] data;
      data = newdata;
    } else data[length-2]++;
  }
}

int ExtendedMoveNumber::total_move_num() {
  int result = 0;
  for(int i=0; i<(length+1)/2; i++) result += data[2*i];
  return result;
}

char* SGFescape(const char* s) {
  char* t = new char[2*strlen(s)+1];
  int j = 0;
  for(unsigned int i = 0; i<strlen(s); i++) {
    if (s[i] == '\\' || s[i] == ']') t[j++]='\\';
    t[j++] = s[i];
  }
           
  t[j++] = 0;

  char* result = new char[j];
  strcpy(result, t);
  delete t;
  return result;
}

vector<string>* parseRootNode(Node* n, vector<string>* tags) throw(SGFError) {
  vector<string>* results = new vector<string>(tags->size());
  string s = n->SGFstring;
  int lSGFstring = s.size();
  int i = 0;

  while (i < lSGFstring && s[i] != ';' && (s[i]==' ' || s[i]=='\n' || s[i]=='\r' || s[i]=='\t')) 
    i++;

  if (i>=lSGFstring || s[i] != ';') throw SGFError();
  i++;

  while (i < lSGFstring) {
    while (i < lSGFstring && (s[i]==' ' || s[i]=='\n' || s[i]=='\r' || s[i]=='\t')) 
      i++;

    if (i >= lSGFstring) break;

    char ID[30];
    int IDindex = 0;

    while (i < lSGFstring && s[i] != '[' && IDindex < 30) {
      if (65 <= s[i] && s[i] <= 90) {
        ID[IDindex++] = s[i];
      } else if (!(97 <= s[i] && s[i] <= 122) && (!(s[i]==' ' || s[i]=='\n' || s[i]=='\r' || s[i]=='\t'))) {
        throw SGFError();
      }
      i++;
    }
    i++;

    if (i >= lSGFstring || IDindex >= 30 || !IDindex) {
      throw SGFError();
    }
    ID[IDindex] = 0;

    char* propValue = new char[lSGFstring+1];
    int propValueIndex = 0;

    while (i < lSGFstring) {

      while (s[i] != ']') {
        if (s[i] == '\t') {
          propValue[propValueIndex++] = ' ';
          i++;
          continue;
        }
        if (s[i] == '\\') {
          i++;
          if ((s[i]=='\n' && s[i+1]=='\r') || (s[i]=='\r' && s[i+1]=='\n')) {
            i += 2;
            continue;
          }
          else if (s[i]=='\n' || s[i]=='\r') {
            i++;
            continue;
          }
        }
        propValue[propValueIndex++] = s[i];
        i++;

        if (i >= lSGFstring) {
          throw SGFError();
        }
      }

      propValue[propValueIndex++] = ',';
      propValue[propValueIndex++] = ' ';

      i++;
      while (i < lSGFstring && (s[i]==' ' || s[i]=='\n' || s[i]=='\r' || s[i]=='\t')) 
        i++;
      if (i >= lSGFstring || s[i] != '[') {
        propValue[propValueIndex-2] = 0;
        string IDstring = ID;
        int ctr = 0;
        for(vector<string>::iterator it = tags->begin(); it != tags->end(); it++) {
          if (IDstring == *it) {
            (*results)[ctr] = propValue;
            break;
          }
          ctr++;
        }
        delete [] propValue;
        break;
      }
      else i++;
    }
  }
  return results;
}

PropValue::PropValue(std::string IDC, std::vector<std::string>* PV) {
  IDcomplete = IDC;
  pv = PV;
}

PropValue::~PropValue() {
  if (pv) delete pv;
}


Node::Node(Node* prev, char* SGFst, int lvl=0) throw(SGFError) {
  next = NULL;
  previous = prev;
  up = NULL;
  down = NULL;
  numChildren = 0;
  level = lvl;
  parsed = 0;

  if (SGFst) {
    SGFstring = SGFst;
    // parseNode();
  } else SGFstring = "";
  posyD = 0;
}
        
Node::~Node() {
}

string remove_lowercase(string s) throw(SGFError) {
  char ID[s.size()+1];
  int IDindex = 0;
  for(unsigned int i=0; i<s.size(); i++) {
    if (65 <= s[i] && s[i] <= 90) ID[IDindex++] = s[i];
    else if (!(97 <= s[i] && s[i] <= 122)) {
      throw SGFError();
    }
  }
  ID[IDindex] = 0;
  return string(ID);
}

vector<string> Node::gpv(const string& prop) {
  vector<string>* result = get_property_value(prop);
  if (result) return *result;
  else return vector<string>();
}

vector<string>* Node::get_property_value(const string& prop) {
  if (!parsed) {
    parseNode();
  }
  map<string, PropValue >::iterator result = data.find(remove_lowercase(prop));
  if (result == data.end()) return 0;
  else return result->second.pv;
}

ExtendedMoveNumber Node::get_move_number() {
  vector<int> l;
  Node* n = this;
  l.push_back(0);

  while (n->previous) {
    if (n->level) l.push_back(n->level);
    else l[l.size()-1]++;
    n = n->previous;
  }        

  int* result = new int[l.size()];
  for(int i = l.size()-1; i >= 0; i--) {
    result[l.size()-i-1] = l[i];
  }
  ExtendedMoveNumber emn(l.size(), result);
  delete [] result;
  return emn;
}


void Node::parseNode() throw(SGFError) {
  // printf("Parse node, %s\n", SGFstring);
  if (!parsed) {
    string s = SGFstring;
    int lSGFstring = s.size();
    int i = 0;

    while (i < lSGFstring && s[i] != ';' && (s[i]==' ' || s[i]=='\n' || s[i]=='\r' || s[i]=='\t')) 
      i++;

    if (i>=lSGFstring || s[i] != ';')  throw SGFError();
    i++;

    while (i < lSGFstring) {
      while (i < lSGFstring && (s[i]==' ' || s[i]=='\n' || s[i]=='\r' || s[i]=='\t')) 
        i++;

      if (i >= lSGFstring) break;

      char ID[30];
      int IDindex = 0;
      char IDcomplete[100]; // store long property name here
      int IDcompleteIndex = 0;

      while (i < lSGFstring && s[i] != '[' && IDindex < 30 && IDcompleteIndex < 100) {
        if (65 <= s[i] && s[i] <= 90) {
          ID[IDindex++] = s[i];
          IDcomplete[IDcompleteIndex++] = s[i];
        } else if (97 <= s[i] && s[i] <= 122) {
          IDcomplete[IDcompleteIndex++] = s[i];
        } else if (!(s[i]==' ' || s[i]=='\n' || s[i]=='\r' || s[i]=='\t')) {
          throw SGFError();
        }
        i++;
      }
      i++;

      if (i >= lSGFstring || IDindex >= 30 || !IDindex || IDcompleteIndex >= 100) {
        throw SGFError();
      }
      ID[IDindex] = 0;
      IDcomplete[IDcompleteIndex] = 0;
      vector<string>* propValueList = new vector<string>;

      while (i < lSGFstring) {
        string propValue;

        while (s[i] != ']') {
          //printf("i, s[i]: %d, %c\n", i, s[i]);
          if (s[i] == '\t') {
            propValue += ' ';
            i++;
            continue;
          }
          if (s[i] == '\\') {
            i++;

            if ((s[i]=='\n' && s[i+1]=='\r') || (s[i]=='\r' && s[i+1]=='\n')) {
              i += 2;
              continue;
            }
            else if (s[i]=='\n' || s[i]=='\r') {
              i++;
              continue;
            }
          }
          if (Node::sloppy && (s[i] == '\n' || s[i] == '\r') && \
              (!strcmp(ID, "B") || !strcmp(ID, "W") || !strcmp(ID, "AW") || !strcmp(ID, "AB"))) {
              i++;
              continue;
          }

          propValue += s[i]; // building propValue in this way could be a performance problem
                             // maybe we should use reserve before. FIXME
          i++;

          if (i >= lSGFstring) throw SGFError();
        }
        if ((!strcmp(ID,"B") || !strcmp(ID,"W")) && !(propValue.size() == 2 || (propValue.size() == 0))) {
          throw SGFError();
        }

        propValueList->push_back(propValue);
        i++;

        while (i < lSGFstring && (s[i]==' ' || s[i]=='\n' || s[i]=='\r' || s[i]=='\t')) 
          i++;
        if (i >= lSGFstring || s[i] != '[') break;
        else i++;
      }
      data.insert(make_pair(string(ID), PropValue(string(IDcomplete), propValueList)));
    }
    parsed = 1;
  }
}    

void Node::set_property_value(string& IDcomplete, vector<string>* propValue) throw(SGFError) {
  string ID = remove_lowercase(IDcomplete);
  map<string, PropValue >::iterator it = data.find(ID);
  if (it == data.end()) data.insert(make_pair(ID, PropValue(IDcomplete, propValue)));
  else it->second.pv->insert(it->second.pv->end(), propValue->begin(), propValue->end());
  SGFstring = nodeToString(data);
  parsed = 1;
}
    

int Node::sloppy = 1;

Cursor::Cursor(const char* sgf, int sloppy) throw(SGFError) {
  Node::sloppy = sloppy;

  height = 0;
  width = 0;
  posx = 0;
  posy = 0;

  root = new Node(NULL, NULL, 0);
  parse(sgf);

  currentN = root->next;
  setFlags();       
}

Cursor::~Cursor() {
  deltree(root);
}

void Cursor::setFlags() {
  if (currentN->next) atEnd = 0;
  else atEnd = 1;
  if (currentN->previous) atStart = 0;
  else atStart = 1;
}

void Cursor::parse(const char* s) throw(SGFError) {

  Node* curr = root;        
  int p = -1;           // start of the currently parsed node
  stack<Node* > c;       // stack of nodes from which variations started
  stack<int> c_width;
  stack<int> c_height;

  int height_previous = 0;
  int width_currentVar = 0;

  char last = ')';      // type of last parsed bracked ('(' or ')')
  bool inbrackets = false;   // are the currently parsed characters in []'s?

  int i = 0;  // current parser position
  int lSGFstring = strlen(s);

  int found_par = 0;
  while (i < lSGFstring) {
    if (s[i]=='(') {
      found_par = i+1;
      i++;
      continue;
    }
    if (found_par && s[i]==';') break;

    if (found_par && !(s[i]==' ' || s[i]=='\n' || s[i]=='\r' || s[i]=='\t'))
      found_par = 0;
    i++;
  }

  if (i >= lSGFstring) throw SGFError();

  i = found_par-1; // found beginning of SGF file

  while (i < lSGFstring) {
    while (i < lSGFstring && !(s[i]=='(' || s[i]==')' || s[i]=='[' || s[i]==']' || s[i]==';')) i++; 
    if (i >= lSGFstring) break;

    if (inbrackets) {
      if (s[i]==']') {
        int numberBackslashes = 0;
        int j = i-1;
        while (s[j] == '\\') {
          numberBackslashes++;
          j--;
        }
        if (!(numberBackslashes % 2))
          inbrackets = 0;
      }
      i++;
      continue;
    }

    if (s[i] == '[') inbrackets = 1;

    if (s[i] == '(') {
      if (last != ')' && p != -1) curr->SGFstring = string(s+p, i-p);

      Node* nn = new Node(0,0,0);
      nn->previous = curr;

      if (++width_currentVar > width) width = width_currentVar;
      if (curr->next) {
        Node* last = curr->next;
        while (last->down) last = last->down;
        nn->up = last;                                  
        last->down = nn;
        nn->level = last->level + 1;
        height++;
        nn->posyD = height - height_previous;
      }
      else {
        curr->next = nn;
        nn->posyD = 0;
        height_previous = height;
      }

      curr->numChildren++;

      c.push(curr);
      c_width.push(width_currentVar-1);
      c_height.push(height);

      curr = nn;

      p = -1;
      last = '(';
    }

    if (s[i] == ')') {
      if (last != ')' && p != -1) {
        curr->SGFstring = string(s+p, i-p);       
      }
      if (c.size()) { 
        curr = c.top();
        c.pop();
        width_currentVar = c_width.top();
        c_width.pop();
        height_previous = c_height.top();
        c_height.pop();
      }
      else throw SGFError();
      last = ')';
    }

    if (s[i] == ';') {
      if (p != -1) {
        curr->SGFstring = string(s+p, i-p);       

        Node* nn = new Node(0,0,0);
        nn->previous = curr;

        if (++width_currentVar > width) width = width_currentVar;
        nn->posyD = 0;
        curr->numChildren = 1;
        curr->next = nn;
        curr = nn;
      }
      p = i;
    }

    i++;
  }

  if (inbrackets || c.size()) throw SGFError();

  Node* n = curr->next;
  n->previous = NULL;
  n->up = NULL;

  while (n->down) {
    n = n->down;
    n->previous = NULL;
  }
}

void Cursor::game(int n) throw(SGFError) {
  if (n < root->numChildren) {
    posx = 0;
    posy = 0;
    currentN = root->next;
    for(int i=0; i<n; i++) currentN = currentN->down;
    setFlags();
  }
  else throw SGFError();
}

void Cursor::deltree(Node* node) {
  Node* n;
  if (node->next) {
    n = node->next;
    while (n->down) {
      n = n->down;
      deltree(n->up);
    }
    deltree(n);
  }
  delete node;
}

void Cursor::delVariation(Node* c) {
  if (c->previous) {
    delVar(c);
  }
  else {
    if (c->next) {
      Node* node = c->next;
      while (node->down) {
        node = node->down;
        delVar(node->up);
      }  
      delVar(node);
    }
    c->next = 0;
  }

  setFlags();
}

void Cursor::delVar(Node* node) {

  if (node->up) node->up->down = node->down;
  else {
    node->previous->next = node->down;
  }
  if (node->down) {
    node->down->up = node->up;
    node->down->posyD = node->posyD;
    Node* n = node->down;
    while (n) { 
      n->level--;
      n = n->down;
    }
  }

  int h = 0;
  Node* n = node;
  while (n->next) {
    n = n->next;
    while (n->down) {
      n = n->down;
      h += n->posyD;
    }
  }

  if (node->up || node->down) h++;

  Node* p = node->previous;
  p->numChildren--;

  while (p) {
    if (p->down) p->down->posyD -= h;
    p = p->previous;
  }

  height -= h;

  // p = node->down;
  deltree(node);
  // node = 0;
}


void Cursor::add(char* st) {

  Node* node = new Node(currentN,st,0);

  node->down = 0;
  node->next = 0;
  node->numChildren = 0;

  if (!currentN->next) {
    // printf("new %s at %s\n", node->SGFstring, currentN->SGFstring);
    node->level = 0;
    node->posyD = 0;
    node->up = 0;

    currentN->next = node;
    currentN->numChildren = 1;
  }
  else {
    // printf("adding %s at %s\n", node->SGFstring, currentN->SGFstring);
    Node* n = currentN->next;
    while (n->down) {
      n = n->down;
      posy+=n->posyD;
    }

    n->down = node;
    node->up = n;
    node->level = n->level + 1;
    node->next= 0;
    currentN->numChildren++;

    node->posyD = 1;
    while (n->next) {
      n = n->next;
      while (n->down) {
        n = n->down;
        node->posyD += n->posyD;
      }
    }
    posy += node->posyD;

    height++;

    n = node;
    while (n->previous) {
      n = n->previous;
      if (n->down) n->down->posyD++;
    }

  }

  currentN = node;

  posx++;
  setFlags();

  if (posx > width) width++;
}


void Cursor::next(int n) throw(SGFError) {

  if (n >= currentN->numChildren) {
    throw SGFError();
  }
  posx++;
  currentN = currentN->next;
  for (int i=0; i<n; i++) {
    currentN = currentN->down;
    posy += currentN->posyD;
  }
  setFlags();
}
    
void Cursor::previous() throw(SGFError) {
  if (currentN->previous) {
    while (currentN->up) {
      posy -= currentN->posyD;
      currentN = currentN->up;
    }
    currentN = currentN->previous;
    posx--;
  }
  else throw SGFError();
  setFlags();
}

Node* Cursor::getRootNode(int n) throw(SGFError) {
  if (!root) return 0;

  if (n >= root->numChildren) throw SGFError();
  Node* nn = root->next;
  for(int i=0; i<n; i++) nn = nn->down;  
  
  if (!nn->parsed) nn->parseNode();
  return nn;
}


// void Cursor::updateRootNode(PyObject* data, int n) throw(SGFError) {
//   if (n >= root->numChildren) throw SGFError();
//   Node* nn = root->next;
//   for(int i=0; i<n; i++) nn = nn->down;
//   delete[] nn->SGFstring;
//   nn->SGFstring = rootNodeToString(data);
//   Py_DECREF(nn->data);
//   if (!(nn->data=PyDict_New())) throw SGFError();
//   nn->parsed = 0;
//   nn->parseNode();
// }


// char* Cursor::rootNodeToString(PyObject* data) {
//   char result[10000]; // FIXME check whether this is exceeded, on the way
//   result[0] = 0;
//   strcat(result, ";");
//   
//   PyObject* item;
//   if ((item=PyDict_GetItem(data, PyString_FromString("GM")))) {
//     strcat(result, "GM[");
//     char* t = SGFescape(PyString_AsString(PyList_GetItem(item, 0)));
//     strcat(result, t);
//     delete[] t;
//     strcat(result, "]\n");
//   }
//   if ((item=PyDict_GetItem(data, PyString_FromString("FF")))) {
//     strcat(result, "FF[");
//     char* t = SGFescape(PyString_AsString(PyList_GetItem(item, 0)));
//     strcat(result, t);
//     delete[] t;
//     strcat(result, "]\n");
//   }
//   if ((item=PyDict_GetItem(data, PyString_FromString("SZ")))) {
//     strcat(result, "SZ[");
//     char* t = SGFescape(PyString_AsString(PyList_GetItem(item, 0)));
//     strcat(result, t);
//     delete[] t;
//     strcat(result, "]\n");
//   }
//   if ((item=PyDict_GetItem(data, PyString_FromString("PW")))) {
//     strcat(result, "PW[");
//     char* t = SGFescape(PyString_AsString(PyList_GetItem(item, 0)));
//     strcat(result, t);
//     delete[] t;
//     strcat(result, "]\n");
//   }
//   if ((item=PyDict_GetItem(data, PyString_FromString("WR")))) {
//     strcat(result, "WR[");
//     char* t = SGFescape(PyString_AsString(PyList_GetItem(item, 0)));
//     strcat(result, t);
//     delete[] t;
//     strcat(result, "]\n");
//   }
//   if ((item=PyDict_GetItem(data, PyString_FromString("PB")))) {
//     strcat(result, "PB[");
//     char* t = SGFescape(PyString_AsString(PyList_GetItem(item, 0)));
//     strcat(result, t);
//     delete[] t;
//     strcat(result, "]\n");
//   }
//   if ((item=PyDict_GetItem(data, PyString_FromString("BR")))) {
//     strcat(result, "BR[");
//     char* t = SGFescape(PyString_AsString(PyList_GetItem(item, 0)));
//     strcat(result, t);
//     delete[] t;
//     strcat(result, "]\n");
//   }
//   if ((item=PyDict_GetItem(data, PyString_FromString("EV")))) {
//     strcat(result, "EV[");
//     char* t = SGFescape(PyString_AsString(PyList_GetItem(item, 0)));
//     strcat(result, t);
//     delete[] t;
//     strcat(result, "]\n");
//   }
//   if ((item=PyDict_GetItem(data, PyString_FromString("RO")))) {
//     strcat(result, "RO[");
//     char* t = SGFescape(PyString_AsString(PyList_GetItem(item, 0)));
//     strcat(result, t);
//     delete[] t;
//     strcat(result, "]\n");
//   }
//   if ((item=PyDict_GetItem(data, PyString_FromString("DT")))) {
//     strcat(result, "DT[");
//     char* t = SGFescape(PyString_AsString(PyList_GetItem(item, 0)));
//     strcat(result, t);
//     delete[] t;
//     strcat(result, "]\n");
//   }
//   if ((item=PyDict_GetItem(data, PyString_FromString("PC")))) {
//     strcat(result, "PC[");
//     char* t = SGFescape(PyString_AsString(PyList_GetItem(item, 0)));
//     strcat(result, t);
//     delete[] t;
//     strcat(result, "]\n");
//   }
//   if ((item=PyDict_GetItem(data, PyString_FromString("KM")))) {
//     strcat(result, "KM[");
//     char* t = SGFescape(PyString_AsString(PyList_GetItem(item, 0)));
//     strcat(result, t);
//     delete[] t;
//     strcat(result, "]\n");
//   }
//   if ((item=PyDict_GetItem(data, PyString_FromString("RE")))) {
//     strcat(result, "RE[");
//     char* t = SGFescape(PyString_AsString(PyList_GetItem(item, 0)));
//     strcat(result, t);
//     delete[] t;
//     strcat(result, "]\n");
//   }
//   if ((item=PyDict_GetItem(data, PyString_FromString("US")))) {
//     strcat(result, "US[");
//     char* t = SGFescape(PyString_AsString(PyList_GetItem(item, 0)));
//     strcat(result, t);
//     delete[] t;
//     strcat(result, "]\n");
//   }
//   if ((item=PyDict_GetItem(data, PyString_FromString("GC")))) {
//     strcat(result, "GC[");
//     char* t = SGFescape(PyString_AsString(PyList_GetItem(item, 0)));
//     strcat(result, t);
//     delete[] t;
//     strcat(result, "]\n");
//   }
// 
//   int l = 0;
// 
//   PyObject *key, *value;
//   int pos = 0;
// 
//   while (PyDict_Next(data, &pos, &key, &value)) {
//     char* s = PyString_AsString(key);
//     if (strcmp(s, "GM") && strcmp(s, "FF") && strcmp(s, "SZ") && strcmp(s, "PW") && strcmp(s, "WR") &&
//   strcmp(s, "PB") && strcmp(s, "BR") && strcmp(s, "EV") && strcmp(s, "RO") && strcmp(s, "DT") &&
//   strcmp(s, "PC") && strcmp(s, "KM") && strcmp(s, "RE") && strcmp(s, "US") && strcmp(s, "GC")) {
//       
//       strcat(result, s);
// 
//       for(int k = 0; k < PyList_Size(value); k++) {
//   PyObject* item = PyList_GetItem(value, k);
//   char* t = SGFescape(PyString_AsString(item));
//   strcat(result, "[");
//   strcat(result, t);
//   strcat(result, "]");
//   l += strlen(t) + 2;
//   delete[] t;
//   if (l>72) {
//     strcat(result, "\n");
//     l = 0;
//   }
//       }
//     }
//   }
//   strcat(result, "\n");
//   char* t = new char[strlen(result)+1];
//   strcpy(t, result);
//   return t;
// }
 
string nodeToString(map<string, PropValue >& data) throw(SGFError) {
  string result = ";";
  int l = 0;
  for(map<string, PropValue >::iterator kv = data.begin(); kv != data.end(); kv++) {
    if (!kv->second.pv || !kv->second.pv->size()) continue;

    result += kv->second.IDcomplete;
    for(vector<string>::iterator it = kv->second.pv->begin(); it != kv->second.pv->end(); it++) {
      char* t = SGFescape(it->c_str());
      result += "[";
      result += t;
      result += "]";
      l += strlen(t) + 2;
      delete [] t;
      if (l>72) {
        result += '\n';
        l = 0;
      }
    }
  }
  result += '\n';
  return result;
}


char* Cursor::outputVar(Node* node) {
  int s = 1000;
  char* result = new char[s];
  result[0] = 0;

  if ((int)(node->SGFstring.size() + strlen(result)) >= s-5) {
    s += 1000 + node->SGFstring.size();
    char* res = new char[s];
    strcpy(res, result);
    delete [] result;
    result = res;
  }

  strcat(result, node->SGFstring.c_str());
  // printf("%s\n", node->SGFstring);

  while (node->next) {
    node = node->next;
    if (node->down) {
      strcat(result, "(");

      char* r = outputVar(node);

      if ((int)(strlen(r) + strlen(result)) >= s-5) {
        s += 1000 + strlen(r);
        char* res = new char[s];
        strcpy(res, result);
        delete [] result;
        result = res;
      }

      strcat(result, r);
      delete [] r;

      while(node->down) {
        node = node->down;
        strcat(result, ")(");

        char* r = outputVar(node);

        if ((int)(strlen(r) + strlen(result)) >= s-5) {
          s += 1000 + strlen(r);
          char* res = new char[s];
          strcpy(res, result);
          delete [] result;
          result = res;
        }

        strcat(result, r);
        delete [] r;
      }
      strcat(result, ")");
      break;
    }
    else {
      if ((int)(node->SGFstring.size() + strlen(result)) >= s) {
        s += 1000 + node->SGFstring.size();
        char* res = new char[s];
        strcpy(res, result);
        delete [] result;
        result = res;
      }
      strcat(result, node->SGFstring.c_str());
      // printf("%s\n", node->SGFstring);
    }
  }

  // printf("r: %d \n", strlen(result));

  char* t = new char[strlen(result)+1];
  strcpy(t, result);

  delete [] result;
  return t;
}


char* Cursor::output() {

  int s = 2000;
  char* result = new char[s];
  result[0] = 0;

  Node* n = root->next;

  while (n) {
    char* t = outputVar(n);

    if ((int)(strlen(t) + strlen(result)) >= s-5) {
      s += 2000 + strlen(t);
      char* res = new char[s];
      strcpy(res, result);
      delete [] result;
      result = res;
    }

    strcat(result, "(");
    strcat(result, t);
    strcat(result, ")\n");
    delete [] t;    
    n = n->down;
  }  

  char* t = new char[strlen(result)+1];
  strcpy(t, result);
  delete [] result;
  return t;
}


