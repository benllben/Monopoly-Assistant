
// Variables to hold options
var startAmount, goAmount, jailAmount, mortgagePercent;

// Number of current players
var numPlayers = 2;

// Store array of player objects
var players = new Array();

function onstart() {
	/* Executes on initial page load */

	// Hide all HTML Sections except for initial options
	$("#gamePanel").hide();
	$("#initial").hide();
	$("#playerNameDisplay").hide();
	$("#setupNames").hide();
}

function setupNew() {
	/* Hides the initial menu and prompts name input */

	$("#options").hide();		// Hide initial menu
	$("#setupNames").show();	// Show name inputs
}	

function validateOptionInput() {
	/* Function ensures all option and name inputs are filled in */

	// Check if all option inputs are filled in
	if((!$("#startMoney").val()) || (!$("#goAmount").val()) || (!$("#jailAmount").val())) {		
		// If any of above values are not set, return 1 (error)
		return 1;
	} else {
		// Check that all player names are filled in

		// Temporary variables
		var inputName, error;

		// Loop through each player input
		for(var i = 0; i < numPlayers; i++){
			// Construct input ID
			inputName = "player" + i.toString();
			// Check if the input with matching ID has value
			if(!$('#' + inputName).val()){
				error = 1;
			}
		}

		// Return 0 if no error found
		if (error != 1){
			return 0;
		} else {
			return 1;
		}
	}
}

function createGame() {
	/* Reads user inputs and starts up game manager */

	if(validateOptionInput() == 0) {

		startAmount = $("#startMoney").val();	// Sotre starting money value
		goAmount = $("#goAmount").val();		// Store "Past GO" amount
		jailAmount = $("#jailAmount").val();	// Store "Get out of jail" fee

		// Check each input and ensure number is valid
		var error = 0;
		if(!isValidInput(startAmount)){
			error = 1;
		} else if (!isValidInput(goAmount)){
			error = 1;
		} else if (!isValidInput(jailAmount)){
			error = 1;
		}

		// If all numbers are valid
		if(!error){
			// Store and convert mortgage rate to decimal
			//mortgagePercent = $("#mortgagePercent").val() * 0.01;

			$("#setupValues").hide();		// Hide setup menu
			$("#gamePanel").show();			// Show game manager
			$("#playerNameSetup").hide();	
			$("#playerNameDisplay").show();

			// Temporary variable for player name
			var name;

			// Loop through each player input
			for(var i = 0; i < numPlayers; i++){
				// Get name of player
				name = $("#player" + i.toString()).val();

				// Add player to array
				players.push(new player(name, startAmount));
			}

			// Check if randomized is selected
			if ($("#shuffle").is(':checked')){
				shufflePlayers();
			}

			// Add player names to display
			displayNames();

			// Start game manager
			startGame();
		} else {
			// We received an error, inform the user
			$("#optionsError").text("Error: One or more fields have invalid input");
		}

	} else {
		// We received an error, inform the user
		$("#optionsError").text("Error: One or more fields are empty!");
	}
}

function displayNames(){
	/* Add the html for player name displays */

	// Append each player to player display
	for (var i = 0; i < players.length; i++){
		$("#playerNameDisplay").append("" + generateNameDiv(i));
	}

	// Append community chest as player
	$("#playerNameDisplay").append('<div class="playerDisplay" id="communityChest"><p id="chestValue"></p>');
}

function generateNameDiv(playerNum){
	/* Generates the HTML to display given player number */

	// Construct return html
	var ret = '<div class="playerDisplay" id="play' + playerNum.toString();
	ret += '"> <p id="player' + playerNum.toString() + '"></p></div>';

	// Return HTML
	return ret;
}

function setupBack(){
	/* Traverse from game options to name input */

	$("#setupNames").show();	// Hide game option inputs
	$("#setupValues").hide();	// Show name inputs
}

function shufflePlayers(){
	/* Shuffles the starting order of players */

	// Temp variables for indexing
	var random, temp;

	// Loop through and swap each entry
	for(var i = players.length - 1; i--; i != 0){
		// Select index to go in current position
		random = Math.floor(Math.random() * Math.floor(players.length));

		// Store value in current position
		temp = players[i];

		// Swap current index with selected index
		players[i] = players[random];
		players[random] = temp;		
	}
}

function addPlayer(){
	/* Adds a player field to player name inputs */

	// Max 8 players
	if(numPlayers < 8){
		// Append input field with incremented player id
		$("#playerNameSetup").append('<div class="playerDisplay"><input type="text" class="form-control" id="player' + numPlayers.toString() + 
			'" class="form-control" placeholder="Player ' + (numPlayers + 1).toString() + ' name"></input></div>');
		
		// Increment player count
		numPlayers++;
	}
}

function removePlayer(){
	/* Removes a player field from player name inputs */

	// Ensure we maintain minimum 2 players
	if(numPlayers > 2){
		// Decerement number of current players
		numPlayers--;

		// Remove that players input field and parent div
		$('#player' + numPlayers.toString()).parent().remove();
	}
}