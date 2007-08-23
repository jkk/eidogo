cpptest: search.o sgfparser.o abstractboard.o cpptest.o
	g++ -o cpptest -lsqlite3 -lboost_filesystem cpptest.o search.o sgfparser.o abstractboard.o

cpptest.o: cpptest.cpp search.h abstractboard.h sgfparser.h
	g++ -c cpptest.cpp

search.o: search.cpp search.h abstractboard.h sgfparser.h
	g++ -c search.cpp

sgfparser.o: sgfparser.cpp sgfparser.h
	g++ -c sgfparser.cpp

abstractboard.o: abstractboard.cpp abstractboard.h
	g++ -c abstractboard.cpp

debug:
	g++ -Wall -g -O0 -o cpptest -lsqlite3 -lboost_filesystem cpptest.cpp search.cpp sgfparser.cpp abstractboard.cpp

fast:
	g++ -O3 -o cpptest -lsqlite3 -lboost_filesystem cpptest.cpp search.cpp sgfparser.cpp abstractboard.cpp

clean:
	rm search.o abstractboard.o sgfparser.o cpptest

