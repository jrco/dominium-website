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

	return $min+rand($max-$min);
}

sub getRandomRole{
	return ("Attacker","Defender","Support")[getRandomInt(0,2)];
}

sub getRandomTeam{
	return ("Corporation","Insurgents")[getRandomInt(0,1)];
}

###DEFS
my $maxLat = 41.560788;
my $minLat = 41.559331;
my $maxLng = -8.400355;
my $minLng = -8.398973;

my $numUsers = 5;
my $numPoints = 5;

my $numGamestates = 10;

###INITIALIZE
my %game = (
	"name_of_room" => "Room Teste",
	"location" => "Braga",
	"timeGame" => getRandomInt(0,50),
	"gameState" => []
);

my %corporation;
my %insurgents;

for(my $i = 0; $i < $numUsers; $i++){
	$corporation{"UserA$i"} = getRandomRole();
	$insurgents{"UserB$i"} = getRandomRole();
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
	foreach my $username (keys %corporation){
		push(@playersA,{
			"username" => $username,
			"lat" => "".getRandomFloat($minLat,$maxLat),
			"lng" => "".getRandomFloat($minLng,$maxLng),
			"energy" => getRandomInt(0,100),
			"role" => $corporation{$username}
		});
		
	}
	$gamestate{"corporation"}{"players"} = \@playersA;
	if($i == 0){
		$gamestate{"corporation"}{"points"} = 0;
	}
	else{
		$gamestate{"corporation"}{"points"} = $game{"gameState"}[$i-1]{"corporation"}{"points"}+getRandomInt(0,5);
	}

	my @playersB = ();
	foreach my $username (keys %insurgents){
		push(@playersB,{
			"username" => $username,
			"lat" => "".getRandomFloat($minLat,$maxLat),
			"lng" => "".getRandomFloat($minLng,$maxLng),
			"energy" => getRandomInt(0,100),
			"role" => $insurgents{$username}
		});
		
	}
	$gamestate{"insurgents"}{"players"} = \@playersB;
	if($i == 0){
		$gamestate{"insurgents"}{"points"} = 0;
	}
	else{
		$gamestate{"insurgents"}{"points"} = $game{"gameState"}[$i-1]{"insurgents"}{"points"}+getRandomInt(0,5);
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
