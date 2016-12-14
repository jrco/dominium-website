#!/usr/bin/perl

use warnings;
use strict;
use utf8;

use Data::Dumper;
$Data::Dumper::Terse = 1;

use JSON;

binmode(STDOUT,':encoding(UTF-8)');
binmode(STDERR,':encoding(UTF-8)');

sub getRandom{
	my $min = shift;
	my $max = shift;

	return $min+int(rand($max-$min+1));
}

sub getRandomRole{
	return ("Attacker","Defender","Support")[getRandom(0,2)];
}

sub getRandomTeam{
	return ("A","B")[getRandom(0,1)];
}

my $minLat = -85;
my $maxLat = 85;

my $minLng = -180;
my $maxLng = 180;

my $numUsers = 3;
my $numPoints = 3;

my %game = (
	"name_of_room" => "Room Teste",
	"location" => "Braga",
	"timeGame" => getRandom(0,50),
	"gameState" => []
);

my %teamA;
my %teamB;

for(my $i = 0; $i < $numUsers; $i++){
	$teamA{"UserA$i"} = getRandomRole();
	$teamB{"UserB$i"} = getRandomRole();
}

my %points;

for(my $i = 0; $i < $numPoints; $i++){
	$points{"Point$i"} = {
		"lat" => "".getRandom($minLat,$maxLat),
		"lng" => "".getRandom($minLng,$maxLng)
	};
}



my $numGamestates = 30;



for(my $i = 0; $i<$numGamestates; $i++){

	my %gamestate = ();

	my @playersA = ();
	foreach my $username (keys %teamA){
		push(@playersA,{
			"username" => $username,
			"lat" => "".getRandom($minLat,$maxLat),
			"lng" => "".getRandom($minLng,$maxLng),
			"energy" => getRandom(0,100),
			"role" => $teamA{$username}
		});
		
	}
	$gamestate{"teamA"}{"players"} = \@playersA;
	if($i == 0){
		$gamestate{"teamA"}{"points"} = 0;
	}
	else{
		$gamestate{"teamA"}{"points"} = $game{"gameState"}[$i-1]{"teamA"}{"points"}+getRandom(0,5);
	}

	my @playersB = ();
	foreach my $username (keys %teamB){
		push(@playersB,{
			"username" => $username,
			"lat" => "".getRandom($minLat,$maxLat),
			"lng" => "".getRandom($minLng,$maxLng),
			"energy" => getRandom(0,100),
			"role" => $teamB{$username}
		});
		
	}
	$gamestate{"teamB"}{"players"} = \@playersB;
	if($i == 0){
		$gamestate{"teamB"}{"points"} = 0;
	}
	else{
		$gamestate{"teamB"}{"points"} = $game{"gameState"}[$i-1]{"teamB"}{"points"}+getRandom(0,5);
	}


	my @capPoints = ();
	foreach my $name (keys %points){
		push(@capPoints,{
			"name" => $name,
			"lat" => "".$points{$name}{"lat"},
			"lng" => "".$points{$name}{"lng"},
			"energy" => getRandom(0,100),
			"teamOwner" => getRandomTeam()
		});
	}
	$gamestate{"capturePoints"} = \@capPoints;

	$gamestate{"timeStamp"} = "2016-12-14T10:05:01Z";

	push(@{$game{"gameState"}},\%gamestate);
}

print to_json(\%game)
