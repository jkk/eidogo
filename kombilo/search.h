// File: search.h
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

#ifndef _SEARCH_H_
#define _SEARCH_H_

#include <vector>
#include <utility>
#include <stack>
#include <sqlite3.h>
#include "abstractboard.h"
#include "sgfparser.h"
typedef char* char_p;

#if (defined(__BORLANDC__) || defined(_MSC_VER))
typedef __int64 hashtype;
const hashtype NOT_HASHABLE = 9223372036854775807i64;
#else
typedef long long hashtype;
const hashtype NOT_HASHABLE = 9223372036854775807LL;
#endif

const char NO_CONT = 255;

class SnapshotVector : public std::vector<unsigned char> {
  public:
    SnapshotVector();
    SnapshotVector(char* c, int size);

    void pb_int(int d);
    void pb_charp(char* c, int size);
    void pb_char(char c);
    void pb_string(std::string s);
    void pb_intp(int* p, int size);

    int retrieve_int();
    int* retrieve_intp();
    char retrieve_char();
    char* retrieve_charp();
    std::string retrieve_string();

    char* to_charp();

  private:
    SnapshotVector::iterator current;
};


class PatternError {
  public:
    PatternError();
};

class DBError {
  public:
    DBError();
};

class Symmetries {
  public:
    char* dataX;
    char* dataY;
    char* dataCS;
    char sizeX;
    char sizeY;
    Symmetries(char sX=0, char sY=0);
    ~Symmetries();
    Symmetries(const Symmetries& s);
    Symmetries& operator=(const Symmetries& s);
    void set(char i, char j, char k, char l, char cs) throw(PatternError);
    char getX(char i, char j) throw(PatternError);
    char getY(char i, char j) throw(PatternError);
    char getCS(char i, char j) throw(PatternError);
    char has_key(char i, char j) throw(PatternError);
};

const int CORNER_NW_PATTERN = 0;
const int CORNER_NE_PATTERN = 1;
const int CORNER_SW_PATTERN = 2;
const int CORNER_SE_PATTERN = 3;
const int SIDE_N_PATTERN = 4;
const int SIDE_W_PATTERN = 5;
const int SIDE_E_PATTERN = 6;
const int SIDE_S_PATTERN = 7;
const int CENTER_PATTERN = 8;
const int FULLBOARD_PATTERN = 9;

class Pattern {
  public:
    int left; // left, right, top, bottom "==" anchors
    int right;
    int bottom;
    int top;
    int boardsize;

    int sizeX;
    int sizeY;

    int flip;                  // used for elements of a patternList
    int colorSwitch;           // dito
    char* initialPos;
    char* finalPos;
    char* contLabels;
    std::vector<MoveNC> contList;

    // Pattern constructors
    //
    // the char* contLabels, if != 0, should have the same size as the pattern, and should 
    // contain pre-fixed label (which should be re-used when presenting the search results)
    // Positions without a given label should contain '.'
    //
    // Note: the char*'s iPos and CONTLABELS will NOT be free'ed by the Pattern class.

    Pattern();
    Pattern(int le, int ri, int to, int bo, int BOARDSIZE, int sX, int sY, char* iPos, const std::vector<MoveNC>& CONTLIST, char* CONTLABELS = 0) throw(PatternError);
    Pattern(int type, int BOARDSIZE, int sX, int sY, char* iPos, std::vector<MoveNC> CONTLIST, char* CONTLABELS = 0);
    Pattern(int type, int BOARDSIZE, int sX, int sY, char* iPos, char* CONTLABELS = 0);
    Pattern(const Pattern& p);
    Pattern(SnapshotVector& snv);
    ~Pattern();
    Pattern& operator=(const Pattern& p);
    Pattern& copy(const Pattern& p);

    char getInitial(int i, int j);
    char getFinal(int i, int j);

    char BW2XO(char c);
    int operator==(const Pattern& p);
    std::string printPattern();
    void to_snv(SnapshotVector& snv);

    static int flipsX(int i, int x, int y, int XX, int YY);
    static int flipsY(int i, int x, int y, int XX, int YY);
    static int PatternInvFlip(int i);
    static int compose_flips(int i, int j); // returns index of flip "first j, then i"
};

class Continuation {
  public:
    int B ; // number of all black continuations
    int W ;
    int tB; // black tenuki
    int tW;
    int wB; // black wins (where cont. is B)
    int lB; // black loses (where cont. is B)
    int wW; // black wins (where cont. is W)
    int lW; // black loses (where cont. is W)
    Continuation();
    void from_snv(SnapshotVector& snv);
    void to_snv(SnapshotVector& snv);
};

class PatternList {
  public:
    Pattern pattern;
    int fixedColor;                      // allow switching colors
    int nextMove;                        // 1: next must be black, 2: next must be white
    std::vector<Pattern> data;
    std::vector<Symmetries> symmetries;
    Continuation* continuations;
    int* flipTable;
    int special;

    PatternList(Pattern& p, int fColor, int nMove) throw (PatternError);
    ~PatternList();

    char invertColor(char co);
    void patternList();
    Pattern get(int i);
    int size();
    char* updateContinuations(int orientation, int x, int y, char co, bool tenuki, char winner);
    char* sortContinuations(); // and give them names to be used as labels
};

class Candidate {
  public:
    char x;
    char y;
    char orientation; // == index in corresp patternList

    Candidate(char X, char Y, char ORIENTATION);
};

class Hit {
  public:
    ExtendedMoveNumber* pos;
    char* label; // this does not really contain the label, but rather the position of the continuation move
    Hit(ExtendedMoveNumber* POS, char* LABEL);
    Hit(SnapshotVector& snv); // takes a SnapshotVector and reads information produced by Hit::to_snv()
    ~Hit();
    static bool cmp_pts(Hit* a, Hit* b);
    void to_snv(SnapshotVector& snv);
};

class GameList;
class SearchOptions;

class Algorithm {
  public:
    Algorithm(int bsize);
    virtual ~Algorithm();

    virtual void initialize_process(sqlite3* DB);
    virtual void newgame_process(int game_id);
    virtual void AB_process(int x, int y);
    virtual void AW_process(int x, int y);
    virtual void AE_process(int x, int y, char removed);
    virtual void endOfNode_process();
    virtual void move_process(Move m);
    virtual void pass_process();
    virtual void branchpoint_process();
    virtual void endOfVariation_process();
    virtual void endgame_process(bool commit=true);
    virtual void finalize_process();
    virtual int readDB(sqlite3* DB);
    virtual int search(PatternList& patternList, GameList& gl, SearchOptions& options);

    int gid;
    int boardsize;
    sqlite3* db;
};

class Algo_signature : public Algorithm {
  public:
    Algo_signature(int bsize);
    ~Algo_signature();
    void initialize_process(sqlite3* DB) throw(DBError);
    void newgame_process(int game_id);
    void AB_process(int x, int y);
    void AW_process(int x, int y);
    void AE_process(int x, int y, char removed);
    void endOfNode_process();
    void move_process(Move m);
    void pass_process();
    void branchpoint_process();
    void endOfVariation_process();
    void endgame_process(bool commit=true) throw(DBError);
    void finalize_process();

    int counter;
    char* signature;
    char* get_current_signature();
    std::vector<int> search_signature(char* sig);
  private:
    bool main_variation;
};

class Algo_finalpos : public Algorithm {
  public:
    Algo_finalpos(int bsize);
    ~Algo_finalpos();
    void initialize_process(sqlite3* DB) throw(DBError);
    void newgame_process(int game_id);
    void AB_process(int x, int y);
    void AW_process(int x, int y);
    void AE_process(int x, int y, char removed);
    void endOfNode_process();
    void move_process(Move m);
    void pass_process();
    void branchpoint_process();
    void endOfVariation_process();
    void endgame_process(bool commit=true) throw(DBError);
    void finalize_process();

    char* fp;
    int fpIndex;
    std::map<int, char* > *data;
    int readDB(sqlite3* DB);
    int search(PatternList& patternList, GameList& gl, SearchOptions& options);

    bool equal(unsigned int id1, unsigned int id2); // id1, id2 refer to id's in the database!
    bool equals_current(unsigned int id1);
};

// in x-coord:
const int ENDOFNODE = 128;
const int BRANCHPOINT = 64;
const int ENDOFVARIATION = 32;

// in y-coord
const int REMOVE = 128;
const int BLACK = 64;
const int WHITE = 32;


class MovelistCand {
  public:
    int orientation;
    Pattern* p;
    char* dicts;
    ExtendedMoveNumber dictsF;
    bool dictsFound;
    ExtendedMoveNumber dictsFI;
    bool dictsFoundInitial;
    bool dictsDR;
    int dictsNO;
    std::vector<MoveNC> contList;
    int contListIndex;
    p_cc Xinterv;
    p_cc Yinterv;
    char mx;
    char my;

    MovelistCand(Pattern* P, int ORIENTATION, char* DICTS, int NO, char X, char Y);
    ~MovelistCand();
    char dictsget(char x, char y);
    void dictsset(char x, char y, char d);
    bool in_relevant_region(char x, char y);
};

class VecMC : public std::vector<MovelistCand* > {
  public:
    VecMC();
    ~VecMC();
    VecMC* deepcopy(ExtendedMoveNumber& COUNTER, int CANDSSIZE);
    ExtendedMoveNumber counter;
    int candssize;
};

class Algo_movelist : public Algorithm {
  public:
    Algo_movelist(int bsize);
    ~Algo_movelist();
    void initialize_process(sqlite3* DB) throw(DBError);
    void newgame_process(int game_id);
    void AB_process(int x, int y);
    void AW_process(int x, int y);
    void AE_process(int x, int y, char removed);
    void endOfNode_process();
    void move_process(Move m);
    void pass_process();
    void branchpoint_process();
    void endOfVariation_process();
    void endgame_process(bool commit=true) throw(DBError);
    void finalize_process();
    int readDB(sqlite3* DB);
    int search(PatternList& patternList, GameList& gl, SearchOptions& options);

    std::vector<char> movelist;
    char* fpC;
    std::map<int, char* > *data1;
    std::map<int, char* > *data2;
    std::map<int, int> *data1l;
};

class HashFEntry {
  public:
    hashtype hashCode;
    char* buf;
    int length;

    HashFEntry(hashtype HASHCODE, char* BUF, int LENGTH);
    HashFEntry(const HashFEntry& hfe);
    ~HashFEntry();
};

class HashhitF { // hashing hit for full board search
  public:
    int gameid;
    char orientation;
    MoveNC* cont;
    ExtendedMoveNumber* emn;

    HashhitF();
    HashhitF(int GAMEID, char ORIENTATION, char* blob);
    ~HashhitF();
};

class HashhitCS { // hasihing hit for corner/side pattern search
  public:
    int gameid;
    int position;
    bool cs;
    HashhitCS(int GAMEID, int POSITION, bool CS);
};

class HashVarInfo {
  public:
    hashtype chc;
    std::vector<std::pair<hashtype, ExtendedMoveNumber>* > * lfc;
    ExtendedMoveNumber* moveNumber;
    int numStones;

    HashVarInfo(hashtype CHC, std::vector<std::pair<hashtype, ExtendedMoveNumber>* > * LFC, ExtendedMoveNumber* MOVENUMBER, int NUMSTONES);
};

class Algo_hash_full : public Algorithm {
  public:
    Algo_hash_full(int bsize, int MAXNUMSTONES = 50);
    ~Algo_hash_full();
    void initialize_process(sqlite3* DB) throw(DBError);
    void newgame_process(int game_id);
    void AB_process(int x, int y);
    void AW_process(int x, int y);
    void AE_process(int x, int y, char removed);
    void endOfNode_process();
    void move_process(Move m) throw(DBError);
    void pass_process();
    void branchpoint_process();
    void endOfVariation_process() throw(DBError);
    void endgame_process(bool commit=true) throw(DBError);
    void finalize_process();
    int search(PatternList& patternList, GameList& gl, SearchOptions& options, sqlite3* db);

    hashtype compute_hashkey(Pattern& pattern);

    int maxNumStones;
    int numStones;
  private:
    hashtype currentHashCode;
    ExtendedMoveNumber* moveNumber;
    std::vector<std::pair<hashtype, ExtendedMoveNumber>* > *lfc; // hash code + move number, still looking for continuation
    std::stack<HashVarInfo>* branchpoints;
    int insert_hash(hashtype hashCode, ExtendedMoveNumber& mn, Move* continuation);
    int insert_all_hashes();
    std::vector<HashFEntry> hash_vector;
};

class HashInstance {
  // When processing sgf games, Algo_hash maintains a list of HashInstance's -
  // those are regions on the board for which hash codes are put into the
  // database

  public:
    HashInstance(char X, char Y, char SIZEX, char SIZEY, int BOARDSIZE);
    ~HashInstance();
    bool inRelevantRegion(char X, char Y);

    char xx; // position on the board
    char yy;
    int pos;
    int boardsize;
    char sizeX; // size of the pattern
    char sizeY;
    bool changed;

    void initialize();
    void finalize();
    void addB(char x, char y);
    void removeB(char x, char y);
    void addW(char x, char y);
    void removeW(char x, char y);
    void bppush();
    void bppop();
    std::pair<hashtype,int> cHC();  // returns min(currentHashCode) and corresp. index
    hashtype* currentHashCode; // array of 8 hashtype values (to automatically symmetrize hash codes)
    std::stack<std::pair<hashtype*,int> >* branchpoints;
    int numStones;
};


class Algo_hash : public Algorithm {
  // This class should not be used by the "end-user" (see Algo_hash_corner and
  // Algo_hash_sides instead)

  public:
    Algo_hash(int bsize, const std::string& DBNAMEEXT, int MAXNUMSTONES);
    virtual ~Algo_hash();
    virtual void initialize_process(sqlite3* DB) throw(DBError);
    virtual void newgame_process(int game_id);
    virtual void AB_process(int x, int y);
    virtual void AW_process(int x, int y);
    virtual void AE_process(int x, int y, char removed);
    virtual void endOfNode_process();
    virtual void move_process(Move m) throw(DBError);
    virtual void pass_process();
    virtual void branchpoint_process();
    virtual void endOfVariation_process();
    virtual void endgame_process(bool commit=true);
    virtual void finalize_process();
    virtual int search(PatternList& patternList, GameList& gl, SearchOptions& options, sqlite3* db);

    virtual std::pair<hashtype,int> compute_hashkey(PatternList& pl, int CS);
    static const hashtype hashCodes[];
    std::string dbnameext;
    std::vector<HashInstance>* hi;
    int maxNumStones;
    std::vector<std::pair<hashtype, int> > hash_vector;
    virtual int insert_hash(hashtype hashCod, int pos);
    int insert_all_hashes();
};

class Algo_hash_corner : public Algo_hash {
  public:
    Algo_hash_corner(int bsize, int SIZE=7, int MAXNUMSTONES = 20);
    std::pair<hashtype,int> compute_hashkey(PatternList& pl, int CS);
    int size;
};

// class Algo_hash_side : public Algo_hash {
//   public:
//     Algo_hash_side(int bsize, int SIZEX=6, int SIZEY=4);
//     int sizeX;
//     int sizeY;
// };

// class UIntervals {
//  public:
//   UIntervals();
// 
//   int first();
//   void append(UIntervals interv);
//   void inters(UIntervals uinterv);
//   int isEmpty();
// 
//   std::vector<pair<int,int>> data;
// 
// };
// 
// 
// class Algo_intervals : public Algorithm {
//  public:
//   Algo_intervals(int bsize);
//   ~Algo_intervals();
// 
//   std::vector<long> movesArr;
//   std::vector<long> moveIntsArr;
// 
//   std::vector<vector<int>*> moves;
// 
//   int counter;
//   int ignore;
// };
// 
// const int MAXNOMOVES = 16777215;
// const int FLAG_POINTER = 16777216;
// const int FLAG_BLACK = 33554432;
// const int FLAG_WHITE = 67108864;

const int ALGO_FINALPOS = 1;
const int ALGO_MOVELIST = 2;
const int ALGO_HASH_FULL = 4;
const int ALGO_HASH_CORNER = 8;
const int ALGO_INTERVALS = 16;
const int ALGO_HASH_CENTER = 32;
const int ALGO_HASH_SIDE = 64;

const int algo_finalpos = 1;
const int algo_movelist = 2;
const int algo_hash_full = 3;
const int algo_hash_corner = 4;
const int algo_intervals = 5;
const int algo_hash_center = 6;
const int algo_hash_side = 7;

typedef Algorithm* algo_p;

class ProcessOptions {
  public:
    bool processVariations;
    bool sgfInDB;
    std::string rootNodeTags; // a comma-separated list of those SGF tags which should be written to the database
    int algos;           // algorithms to be used
    int algo_hash_full_maxNumStones;
    int algo_hash_corner_maxNumStones;

    std::string asString();
    void validate();
    std::vector<std::string>* SGFTagsAsStrings();

    ProcessOptions(); // sets default values which have to be overwritten
    ProcessOptions(std::string s);
};

class SearchOptions {
  public:
    int fixedColor;
    int nextMove; // 0 undetermined, 1 = next move must be black, 2 = next move must be white
    int moveLimit;
    bool trustHashFull;
    bool searchInVariations;
    int algos;

    SearchOptions();
    SearchOptions(int FIXEDCOLOR, int NEXTMOVE, int MOVELIMIT=10000);
    SearchOptions(SnapshotVector& snv);
    void to_snv(SnapshotVector& snv);
};

class GameListEntry {
  public:
    int id; // id within the concerning database
    std::string gameInfoStr;
    char winner;
    std::vector<Hit* > * hits; // used for hits
    std::vector<Candidate* > * candidates; // used for candidates

    GameListEntry(int ID, char WINNER, std::string GAMEINFOSTR);
    ~GameListEntry();

    void hits_from_snv(SnapshotVector& snv);
};

class VarInfo {
  public:
    Node* n;
    abstractBoard* b;
    int i;

    VarInfo(Node* N, abstractBoard* B, int I);
    VarInfo(const VarInfo& v);
    ~VarInfo();
};

// process flags (used to determine the behavior for individual games - in contrast to
// options which apply to the whole GameList and are given in ProcessOptions)
const int CHECK_FOR_DUPLICATES = 1; // check for duplicates using the signature
const int CHECK_FOR_DUPLICATES_STRICT = 2; // check for duplicates using the final position
                                           // (if ALGO_FINAPOS is available)
const int OMIT_DUPLICATES = 4;
const int OMIT_GAMES_WITH_SGF_ERRORS = 8; 

// process return values
// 0:   SGF error occurred when parsing the "tree structure" (i.e. before parsing the individual nodes)
//      database was not changed
// n>0: n games were processed, use process_results to access the individual results 

// flags used in process_results
const int UNACCEPTABLE_BOARDSIZE = 1; // (database not changed) 
const int SGF_ERROR = 2;
    // SGF error occurred when playing through the game 
    // (and the rest of the concerning variation was not used).
    // Depending on OMIT_GAMES_WITH_SGF_ERRORS, everything before this node (and other variations, 
    // if any) was inserted, or the database was not changed.
const int IS_DUPLICATE = 4;
const int NOT_INSERTED_INTO_DB = 8;
const int INDEX_OUT_OF_RANGE = 16;


class GameList {
  public:
    char* dbname;
    std::string orderby;
                    // constructor receives a FORMAT string; see trac wiki for the syntax to be used
    std::string format1; // extracted from FORMAT; the column list of the sql query to retrieve the games 
    std::string format2; // extracted from FORMAT, used as template when inserting the query results into the game list
    int numColumns;
    int processVariations;

    std::vector<int> boardsizes;
    std::vector<algo_p> algo_ps;
    std::vector<sqlite3*> algo_dbs;
    std::vector<GameListEntry* > * all;
    std::vector<std::pair<int,int> > * currentList; // pair of game id and position within all
                                                    // (usually sorted w.r.t. second component)
    std::vector<std::pair<int,int> > * oldList;
    int current;
    sqlite3* db;
    int readDBs;
    char* labels;
    Continuation* continuations;
    int num_hits;
    int num_switched;
    int Bwins;
    int Wwins;
    Pattern* mrs_pattern; // most recent search pattern
    SearchOptions* searchOptions;
    // ----------------------------------------------------------------------------
    // the following methods provide the user interface

    // ------- constructor --------------------------------------------------------
    // p_options will be copied by GameList, so the caller has to free the pointer
    GameList(char* DBNAME, std::string ORDERBY="", std::string FORMAT="", ProcessOptions* p_options=0, int cache=100) throw(DBError);

    // ------- processing SGF games (to populate the db) --------------------------
    void start_processing(int PROCESSVARIATIONS=-1) throw(DBError);
    int process(const char* sgf, const char* path, const char* fn,
                const char* DBTREE = 0, int flags=0) throw(SGFError,DBError);
    int process_results(unsigned int i=0); // result for i-th processed game in most recently processed SGF collection
    void finalize_processing() throw(DBError);
    
    // int remove_game(int index); // TODO
    // int remove_all_current_games();

    // ------- pattern search -----------------------------------------------------
    // options is copied in the search method (if != 0), so the caller has to free the pointer
    void search(Pattern& pattern, SearchOptions* options = 0) throw(DBError);
    char lookupLabel(char x, char y);
    Continuation lookupContinuation(char x, char y);

    // ------- signature search ---------------------------------------------------
    // if boardsize != 0 in sigsearch, then the signature is "symmetrized" with respect
    // to boardsize
    void sigsearch(char* sig, int boardsize) throw(DBError);
    std::string getSignature(int i) throw(DBError);

    // ------- game info search ---------------------------------------------------
    void gisearch(char* sql, int complete=0) throw(DBError);

    // ------- tagging ------------------------------------------------------------
    void tagsearch(int tag) throw(DBError);
    void setTag(int tag, int start=0, int end=0) throw(DBError);
    void deleteTag(int tag, int i = -1) throw(DBError);
    std::vector<int> getTags(int i, int tag=0) throw(DBError); // note the order of arguments!

    // ------- duplicates ---------------------------------------------------------
    int find_duplicates(int bs, bool strict=false) throw(DBError); // return number of duplicate array
    std::vector<int> retrieve_duplicates_VI(unsigned int i);
    int* retrieve_duplicates_PI(unsigned int i); // same as above, but returns Pointer to Int 
                                                 // (an array terminated by -1)
                                                 // The caller must free the pointer himself
                                                 // (before calling find_duplicates again).

    // ------- snapshot, restore --------------------------------------------------

    int snapshot() throw(DBError);
    void restore(int handle, bool del) throw(DBError);
    void delete_snapshot(int handle) throw(DBError);
    void delete_all_snapshots() throw(DBError);

    // ------- misc ---------------------------------------------------------------
    void reset(); // reset currentList to all
    void resetFormat(std::string ORDERBY="", std::string FORMAT="");
    int size();
    int numHits();
    std::string resultsStr(GameListEntry* gle);
    std::string currentEntryAsString(int i);
    std::vector<std::string> currentEntriesAsStrings(int start=0, int end=0);
    std::string getSGF(int i) throw(DBError);
    std::string getCurrentProperty(int i, std::string tag) throw (DBError);

    // ------- list of all players -------------------------------------------------
    int plSize();
    std::string plEntry(int i);

    // -----------------------------------------------------------------------------
    // internal methods (called from the algorithm classes)
    ~GameList();
    int start();
    int next();
    int start_sorted();
    int end_sorted();
    char getCurrentWinner();
    std::vector<Candidate* > *getCurrentCandidateList();
    void makeCurrentCandidate(std::vector<Candidate* > *candidates);
    void makeCurrentHit(std::vector<Hit* > *hits);
    void makeIndexCandidate(int index, std::vector<Candidate* > *candidates);
    void makeIndexHit(int index, std::vector<Hit* > *hits);
    void setCurrentFromIndex(int index);
    int get_current_index(int id, int* start); // returns the index in oldList of the game with game id "id" 
                                               // (if available, otherwise returns -1),
                                               // use this between start_sorted and end_sorted
    int get_current_index_CL(int id, int start=0); // returns the index in currentList of the game with game id "id" 
                                                   // (if available, otherwise returns -1), requires currentList to
                                                   // be sorted wrt first component (see duplicates())

  private:
    void createGamesDB() throw(DBError);
    void readDB() throw(DBError);
    void addAlgos(int bs);
    int posDT; // used when parsing the DT, SZ, BR, WR, HA fields during processing
    int posSZ;
    int posBR;
    int posWR;
    int posHA;
    int SGFtagsSize;
    sqlite3* algo_db1;
    sqlite3* algo_db2;
    ProcessOptions* p_op;
    std::vector<std::string>* SGFtags;
    std::string sql_ins_rnp; // sql string to insert root node properties
    std::vector<std::string> pl; // list of all players
    void readPlayersList() throw(DBError);
    std::vector<std::vector<int> >* duplicates;
    void insert_duplicate(int i1, int i2, std::vector<std::vector<int> >* dupl);
    std::vector<int> process_results_vector;
};

const int HANDI_TAG = 1;
const int PROFESSIONAL_TAG = 2;

#endif

