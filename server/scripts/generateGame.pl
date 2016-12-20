#!/usr/bin/perl

use warnings;
use strict;
use utf8;

use Data::Dumper;
$Data::Dumper::Terse = 1;

use JSON;

binmode(STDOUT,':encoding(UTF-8)');
binmode(STDERR,':encoding(UTF-8)');

###SUBROUTINES
sub getRandomInt{
	my $min = shift;
	my $max = shift;

	return $min+int(rand($max-$min+1));
}

sub getRandomFloat{
	my $min = shift;
	my $max = shift;

	return $min+rand($max-$min+1);
}

sub getRandomRole{
	return ("Attacker","Defender","Support")[getRandomInt(0,2)];
}

sub getRandomTeam{
	return ("A","B")[getRandomInt(0,1)];
}

###DEFS

#Portugal bounds

#my $minLat = 36.5;
#my $maxLat = 41;
#my $minLng = -8.5;
#my $maxLng = -7;


my $minLat = 41.5574;
my $maxLat = 41.5574;
my $minLng = -8.3978;
my $maxLng = -8.3978;

my $numUsers = 3;
my $numPoints = 3;

my $numGamestates = 30;

##INITIALIZ
my %game = (
	"name_of_room" => "Room Teste",
	"location" => "Braga",
	"timeGame" => getRandomInt(0,50),
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
		"lat" => "".getRandomFloat($minLat,$maxLat),
		"lng" => "".getRandomFloat($minLng,$maxLng)
	};
}

###GENERATE

for(my $i = 0; $i<$numGamestates; $i++){

	my %gamestate = ();

	my @playersA = ();
	foreach my $username (keys %teamA){
		push(@playersA,{
			"username" => $username,
			"lat" => "".getRandomFloat($minLat,$maxLat),
			"lng" => "".getRandomFloat($minLng,$maxLng),
			"energy" => getRandomInt(0,100),
			"role" => $teamA{$username}
		});
		
	}
	$gamestate{"teamA"}{"players"} = \@playersA;
	if($i == 0){
		$gamestate{"teamA"}{"points"} = 0;
	}
	else{
		$gamestate{"teamA"}{"points"} = $game{"gameState"}[$i-1]{"teamA"}{"points"}+getRandomInt(0,5);
	}

	my @playersB = ();
	foreach my $username (keys %teamB){
		push(@playersB,{
			"username" => $username,
			"lat" => "".getRandomFloat($minLat,$maxLat),
			"lng" => "".getRandomFloat($minLng,$maxLng),
			"energy" => getRandomInt(0,100),
			"role" => $teamB{$username}
		});
		
	}
	$gamestate{"teamB"}{"players"} = \@playersB;
	if($i == 0){
		$gamestate{"teamB"}{"points"} = 0;
	}
	else{
		$gamestate{"teamB"}{"points"} = $game{"gameState"}[$i-1]{"teamB"}{"points"}+getRandomInt(0,5);
	}


	my @capPoints = ();
	foreach my $name (keys %points){
		push(@capPoints,{
			"name" => $name,
			"lat" => "".$points{$name}{"lat"},
			"lng" => "".$points{$name}{"lng"},
			"energy" => getRandomInt(0,100),
			"teamOwner" => getRandomTeam()
		});
	}
	$gamestate{"capturePoints"} = \@capPoints;

	$gamestate{"timeStamp"} = "2016-12-14T10:05:01Z";

	push(@{$game{"gameState"}},\%gamestate);
}

print to_json(\%game)
