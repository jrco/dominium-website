#!/bin/bash

mongo dominium --eval "db.games.drop()"
for i in {1..10}
do
	perl generateGame.pl | mongoimport -d dominium -c games
done
