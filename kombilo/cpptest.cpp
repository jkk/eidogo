#include <fstream>
#include <string>
#include "boost/filesystem/operations.hpp"
#include "search.h"

using namespace std;
using boost::filesystem::directory_iterator;

int main(int argc, char** argv) {
  // ----------------- parse command line arguments ---------------------------------
  int algos = ALGO_FINALPOS | ALGO_MOVELIST | ALGO_HASH_FULL | ALGO_HASH_CORNER;
  bool process = false;
  for(int i=1; i<argc; i++) {
    if (!strcmp(argv[i], "-nh")) // disable hashing
      algos = ALGO_FINALPOS | ALGO_MOVELIST;
    if (!strcmp(argv[i], "-p")) process = true;
  }

  // ----------------- set up processing options -----------------------------------
  ProcessOptions* p_op = new ProcessOptions;
  p_op->algos = ALGO_FINALPOS | ALGO_MOVELIST;

  // ----------------- create GameList instance -----------------------------------
  GameList gl("t1.db", "id", "[[PW]] - [[PB]] ([[winner]]), [[filename.]], ", 0);
  delete p_op;

  // ---------------- process SGF games ---------------------------------------------
  if (process) { // process sgf's. must be first argument
    gl.start_processing();
    directory_iterator end_itr;
    // string path = "/home/ug/go/kombilo/06/tests1/libkombilo";
    // string path = "/home/ug/go/gtl/reviews";
    string path = "/home/ug/go/gogod06/1998";
    int counter = 0;
    for(directory_iterator it(path); it != end_itr; ++it) {
      string n = it->string();
      if (n.substr(n.size()-4) == ".sgf") {
        ifstream infile;
        // printf("%s\n", n.c_str());
        infile.open(it->native_file_string().c_str());

        string sgf;
        string line;
        while (!infile.eof()) {
          getline(infile, line);
          sgf += line + "\n";
        }
        infile.close();
        int flags = CHECK_FOR_DUPLICATES; // |OMIT_DUPLICATES;
        if (gl.process(sgf.c_str(), path.c_str(), n.c_str(), "", flags))
          if (gl.process_results() & IS_DUPLICATE) printf("is duplicate: %d\n", counter);
        counter++;
      }
    }
    gl.finalize_processing();
    printf("Now %d games in db.\n", gl.size());
  }
  printf("%d games.\n", gl.size());

  // ------------------- set up search pattern ----------------------------------------

  // Pattern p(CENTER_PATTERN, 19, 2, 2, ".XXO", "D..F");

  // Pattern p(CENTER_PATTERN, 19, 3, 3, ".X.XXXXOX", vector<MoveNC>());
  // Pattern p(2,2,4,4, 19, 3, 3, ".X.XXXXOX", vector<MoveNC>()); // "fixed anchor"

  // anchor varies only in small region of board: the first 4 entries 
  // (left, right, top, bottom) describe the rectangle which may contain the top left point of the pattern.
  // The coordinates range from 0 to boardsize-1
  // For example, CORNER_NW_PATTERN corresponds to (0,0,0,0)
  // Pattern p(2,3,4,6, 19, 3, 3, ".X.XXXXOX", vector<MoveNC>()); 
  
  // Pattern p(CORNER_NW_PATTERN,19,8,8,"...................X......X.......XO......OO....................");
  // Pattern p(CORNER_NW_PATTERN,19,7,7,".................X.....X......XO.....OO..........");
  // Pattern p(CORNER_NW_PATTERN,19,7,7,".......................X.........................");

  // gl.gisearch("pw = 'Hane Naoki'");
  Pattern p(CENTER_PATTERN, 19, 3, 5, ".X..OX.OX.OXOXO");
  // vector<MoveNC> contList;
  // contList.push_back(MoveNC(6,15,'X'));
  // contList.push_back(MoveNC(6,13,'O'));
  // contList.push_back(MoveNC(4,15,'X'));
  // Pattern p(FULLBOARD_PATTERN, 19, 19, 19, ".....................O.O........OX......XO......X.OXX.XX...X,.OOXXX..OOOX.O....X.OXOOXOO..OX.......XOXXOXXOOXXOO....OX.XXXOOOXO.O.O...OXX..XOX..XO.X.XO...O.......X.....XO..O.,X....,.....XOO................X......X............X....O...........................................O.O...........O.....,.....X...........X.O.X............................................", contList);
  // Pattern p(FULLBOARD_PATTERN, 19, 19, 19, "..O.O....X...XXXXX.OOXO....OXO.XXOOOXOXXXXOO.OOXO.OXO..O..X.X..OOX,X.XO.O.....XOOOXOXX..XO......X.XOXXX..XXXO........XOX..XXOOXO.OOO.....OOXOXOO.O...XX...X..OXXOO.XOX........O..OX.,..X..X.....X...OX...X..........O....XXXO...XO...X...OOOXOOXX...X....O..OX.O..OX..........OXX....OX..OO..O.OOOOX..O.OX..XX..OOXXXOX.XOOX..X....XXXXXOX...OX.......X.O.XO.............");

  // Pattern p(FULLBOARD_PATTERN,19,19,19,"........................................................................O......................................................................................................................................................................................................................X.........................................................................");

  // -------------------- set up search options ----------------------------------
  SearchOptions so;
  // so.trustHashFull = true;
  // SearchOptions so(0,0,50); // use move limit
  // so.searchInVariations = false;
  // so.nextMove = 2;
  
  // -------------------- do pattern search --------------------------------------
  gl.search(p, &so);

  // ------------------- print some information about current list of games ------------
  printf("num games: %d, num hits: %d\n", gl.size(), gl.numHits());
  // vector<string> res = gl.currentEntriesAsStrings();
  // for(vector<string>::iterator it = res.begin(); it != res.end(); it++)
  //   printf("%s\n", it->c_str());
  // for(int i=0; i<gl.size(); i++) printf("%s\n", gl.currentEntryAsString(i).c_str());

  // ------------------- print some statistics ------------------------------------------
  // printf("Search pattern:\n");
  // printf("%s\n", p.printPattern().c_str());
  // printf("Continuations:\n");
  // for(int y=0; y<p.sizeY; y++) {
  //   for(int x=0; x<p.sizeX; x++) {
  //     printf("%c", gl.lookupLabel(x,y));
  //   }
  //   printf("\n");
  // }
  // printf("\n");
  // printf("Statistics:\n"); 
  // printf("num hits: %d, num switched: %d, B wins: %d, W wins: %d\n", gl.num_hits, gl.num_switched, gl.Bwins, gl.Wwins);

  // printf("Continuation | Black      ( B wins / W wins ) | White      (B wins / W wins) |\n");
  // for(int y=0; y<p.sizeY; y++) {
  //   for(int x=0; x<p.sizeX; x++) {
  //     if (gl.lookupLabel(x,y) != '.') {
  //       Continuation cont = gl.lookupContinuation(x,y);
  //       printf("      %c      |   %3d[%3d] (    %3d /    %3d ) |   %3d[%3d] (   %3d /    %3d) | %1.1f /  %1.1f \n",
  //           gl.lookupLabel(x,y), cont.B, cont.tB, cont.wB, cont.lB, cont.W, cont.tW, cont.wW, cont.lW, 
  //           cont.wW*100.0/cont.W, cont.wB*100.0/cont.B);
  //     }
  //   }
  // }

  // ------------------- check for duplicates ---------------------------------
  // gl.reset();
  // int nd = gl.find_duplicates(19);
  // printf("duplicates:\n");
  // for(int i=0; i<nd; i++) {
  //   // 1st method: retrieve_duplicates_VI
  //   // vector<int> dupl_vector = gl.retrieve_duplicates_VI(i);
  //   // for(vector<int>::iterator it = dupl_vector.begin(); it != dupl_vector.end(); it++) {
  //   //   printf("%s%s\n", gl.currentEntryAsString(*it).c_str(), gl.getSignature(*it).c_str());
  //   // }
  //   
  //   // 2nd method: retrieve_duplicates_PI
  //   int * dupl_vector = gl.retrieve_duplicates_PI(i);
  //   int j = 0;
  //   while(dupl_vector[j] != -1) {
  //     printf("%s%s\n", gl.currentEntryAsString(dupl_vector[j]).c_str(), gl.getSignature(dupl_vector[j]).c_str());
  //     j++;
  //   }
  //   delete [] dupl_vector;

  //   printf("--------------------------------------------------- \n");
  // }

  // ------------------- snapshot ---------------------------------------------

  gl.delete_all_snapshots();
  int handle = gl.snapshot();
  printf("num games: %d, num hits: %d\n", gl.size(), gl.numHits());

  gl.reset();
  printf("num games: %d, num hits: %d\n", gl.size(), gl.numHits());

  gl.restore(handle, true);
  printf("num games: %d, num hits: %d\n", gl.size(), gl.numHits());

  // ------------------- resetFormat ------------------------------------------
  // printf("reset db\n");
  // gl.resetFormat("pb");
  // vector<string> res = gl.currentEntriesAsStrings(0, 40);
  // for(vector<string>::iterator it = res.begin(); it != res.end(); it++)
  //   printf("%s\n", it->c_str());
}
