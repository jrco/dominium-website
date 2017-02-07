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
	my @roles = ("Attacker","Defender","Support");
	return $roles[getRandomInt(0,$#roles)];
}

sub getRandomTeam{
	my @teams = ("Corporation","Insurgents");
	return $teams[getRandomInt(0,$#teams)];
}

sub getRandomTeamColor{
	my @colors = (
		#"#7ba3eb",#Mate Blue
		#"#83ad7f",#Mate Green
		"#f2a925",#Orange
		"#af80af",#Mate Purple
		#"#bb7070",#Mate Red
		#"#f7f55a" #Yellow
	);
	return $colors[getRandomInt(0,$#colors)];
}

sub getColorName{
	my $hexColor = shift;
	my %colors = (
		"#7ba3eb" => "Blue",
		"#83ad7f" => "Green",
		"#f2a925" => "Orange",
		"#af80af" => "Purple",
		"#bb7070" => "Red",
		"#f7f55a" => "Yellow"
	);
	return $colors{$hexColor};
}
#p1 (41.543209,8.401852)
#p2 (41.542567,8.400425)
###DEFS
my $maxLat = 41.543209;
my $minLat = 41.542567;
my $maxLng = -8.401852;
my $minLng = -8.400425;

my $numUsers = 5;
my $numPoints = 3;

my $numGamestates = 5;

###INITIALIZE
my %game = (
	"name_of_room" => "Room Teste",
	"location" => "Braga",
	"timeGame" => getRandomInt(0,50),
	"gameState" => [],
	"isGameOver" => JSON::true
);

my %corporation;
my %insurgents;

my $corpColor = getRandomTeamColor();
my $insColor;
do{
	$insColor = getRandomTeamColor();
} while($corpColor eq $insColor);


for(my $i = 0; $i < $numUsers; $i++){

	my $corpRole = getRandomRole();
	my $insRole = getRandomRole();

	$corporation{"User A$i"} = {
		"role" => $corpRole#,
		#"skillName" => "$corpRole-Skill",
		#"skillCost" => getRandomInt(5,10)
	};
	$insurgents{"User B$i"} = {
		"role" => $insRole#,
		#"skillName" => "$insRole-Skill",
		#"skillCost" => getRandomInt(5,10)
	};
}

my %points;

for(my $i = 0; $i < $numPoints; $i++){
	$points{"Point $i"} = {
		"lat" => "".getRandomFloat($minLat,$maxLat),
		"lng" => "".getRandomFloat($minLng,$maxLng),
		"radius" => 15
	};
}

###GENERATE
for(my $i = 0; $i<$numGamestates; $i++){

	my %gamestate = ();


	foreach my $username (keys %corporation){
		push(@{$gamestate{"corporation"}{"players"}},{
			"username" => $username,
			"lat" => "".getRandomFloat($minLat,$maxLat),
			"lng" => "".getRandomFloat($minLng,$maxLng),
			"energy" => getRandomInt(0,100),
			"role" => $corporation{$username}{"role"}#,
			#"skill" => {
			#	"name" => $corporation{$username}{"skillName"},
			#	"cost" => $corporation{$username}{"skillCost"},
			#	"cooldown" => getRandomInt(0,50)
			#}
		});
		
	}
	if($i == 0){
		$gamestate{"corporation"}{"points"} = 0;
	}
	else{
		$gamestate{"corporation"}{"points"} = $game{"gameState"}[$i-1]{"corporation"}{"points"}+getRandomInt(0,5);
	}
	$gamestate{"corporation"}{"color"} = $corpColor;
	$gamestate{"corporation"}{"color_name"} = getColorName($corpColor);
	

	foreach my $username (keys %insurgents){
		push(@{$gamestate{"insurgents"}{"players"}},{
			"username" => $username,
			"lat" => "".getRandomFloat($minLat,$maxLat),
			"lng" => "".getRandomFloat($minLng,$maxLng),
			"energy" => getRandomInt(0,100),
			"role" => $insurgents{$username}{"role"}#,
			#"skill" => {
			#	"name" => $insurgents{$username}{"skillName"},
			#	"cost" => $insurgents{$username}{"skillCost"},
			#	"cooldown" => getRandomInt(0,50)
			#}
		});
		
	}
	if($i == 0){
		$gamestate{"insurgents"}{"points"} = 0;
	}
	else{
		$gamestate{"insurgents"}{"points"} = $game{"gameState"}[$i-1]{"insurgents"}{"points"}+getRandomInt(0,5);
	}
	$gamestate{"insurgents"}{"color"} = $insColor;
	$gamestate{"insurgents"}{"color_name"} = getColorName($insColor);


	foreach my $name (keys %points){
		push(@{$gamestate{"capturePoints"}},{
			"name" => $name,
			"lat" => "".$points{$name}{"lat"},
			"lng" => "".$points{$name}{"lng"},
			"radius" => $points{$name}{"radius"},
			"energy" => getRandomInt(0,100),
			"teamOwner" => getRandomTeam()
		});
	}

	$gamestate{"timeStamp"} = getRandomInt(0,28)." December";

	push(@{$game{"gameState"}},\%gamestate);
}

print to_json(\%game)
