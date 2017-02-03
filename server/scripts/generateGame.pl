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
	my @roles = ("ATTACKER","DEFENDER","SUPPORT");
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
#p1 (41.543209,8.401852)
#p2 (41.542567,8.400425)
###DEFS
my $maxLat = 41.543209;
my $minLat = 41.542567;
my $maxLng = -8.401852;
my $minLng = -8.400425;

my $numUsers = 2;
my $numPoints = 3;

my $numGamestates = 2000;

###INITIALIZE
my %game = (
	"name_of_room" => "Room Teste",
	"location" => "Braga",
	"timeGame" => getRandomInt(0,50),
	"gameState" => []
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

	$corporation{"UserA$i"} = {
		"role" => $corpRole#,
		#"skillName" => "$corpRole-Skill",
		#"skillCost" => getRandomInt(5,10)
	};
	$insurgents{"UserB$i"} = {
		"role" => $insRole#,
		#"skillName" => "$insRole-Skill",
		#"skillCost" => getRandomInt(5,10)
	};
}

my %points;

for(my $i = 0; $i < $numPoints; $i++){
	$points{"Point$i"} = {
		"lat" => "".getRandomFloat($minLat,$maxLat),
		"lng" => "".getRandomFloat($minLng,$maxLng),
		"radius" => getRandomInt(5,30)
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

	if ($corpColor eq "#7ba3eb") {
		$gamestate{"corporation"}{"color_name"} = "Blue";
	}
	if ($corpColor eq "#83ad7f") {
		$gamestate{"corporation"}{"color_name"} = "Green";
	}
	if ($corpColor eq "#f2a925") {
		$gamestate{"corporation"}{"color_name"} = "Orange";
	}
	if ($corpColor eq "#af80af") {
		$gamestate{"corporation"}{"color_name"} = "Purple";
	}
	if ($corpColor eq "#bb7070") {
		$gamestate{"corporation"}{"color_name"} = "Red";
	}
	if ($corpColor eq "#f7f55a") {
		$gamestate{"corporation"}{"color_name"} = "Yellow";
	}
	

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

	if ($insColor eq "#7ba3eb") {
		$gamestate{"insurgents"}{"color_name"} = "Blue";
	}
	if ($insColor eq "#83ad7f") {
		$gamestate{"insurgents"}{"color_name"} = "Green";
	} 
	if ($insColor eq "#f2a925") {
		$gamestate{"insurgents"}{"color_name"} = "Orange";
	}
	if ($insColor eq "#af80af") {
		$gamestate{"insurgents"}{"color_name"} = "Purple";
	}
	if ($insColor eq "#bb7070") {
		$gamestate{"insurgents"}{"color_name"} = "Red";
	}
	if ($insColor eq "#f7f55a") {
		$gamestate{"insurgents"}{"color_name"} = "Yellow";
	}


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
