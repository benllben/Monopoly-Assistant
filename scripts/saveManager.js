function displayLoad(){
	$("#gamePanel").hide();
	$("#loadPanel").show();
}


function displaySave(){

	// If game has not been saved before
	if (gameId == 0){
		// Show save dialouge
		$("#gamePanel").hide();
		$("#savePanel").show();
	} else {
		// If game has previously saved, update save
		saveGame();
	}

}

function hideLoad(){
	$("#gamePanel").show();
	$("#loadPanel").hide();
}

function hideSave(){
	$("#gamePanel").show();
	$("#savePanel").hide();
}

function saveGame(){

		// Create variable with all variables to save
		var save = {
			numPlayers: 	numPlayers,
			startAmount: 	startAmount,
			goAmount: 		goAmount,
			jailAmount: 	jailAmount,
			turn: 			turn,
			communityPool: 	communityPool,
			players: 		players
		}

		// Convert object to string for database
		var saveString = JSON.stringify(save);

		// Attempt to save to server
		$.ajax({
			url: 'server/save.php',
			type: 'POST',
			data: {
				saveData: saveString
			},
			success: function(json){
				console.log("success " + json.saveId);
			},
			error: function(xhr, desc, err){
				console.log(xhr + "\n" + err);
			}
		});

	}

	function loadGame(){
		// Testing game id
		var gameId = 4;

		// Attempt to load game from server
		$.ajax({
			url: 'server/load.php',
			type: 'POST',
			data: {
				gameId: gameId
			},
			success: function(json){
				setupLoadedGame(json.gameData);
			},
			error: function(xhr, desc, err){
				console.log(xhr + "\n" + err);
			}
		});
	}


	function setupLoadedGame(data){
		// Convert string to object
		var gameData = JSON.parse(data);

		// Restore game variables
		numPlayers = 	gameData.numPlayers;
		startAmount =	gameData.startAmount;
		goAmount =		gameData.goAmount;
		jailAmount =	gameData.jailAmount;
		turn =			gameData.turn;
		communityPool =	gameData.communityPool;
		players =		gameData.players;

		$("#setupValues").hide();		// Hide setup menu
		$("#gamePanel").show();			// Show game manager
		$("#playerNameSetup").hide();	
		$("#playerNameDisplay").show();

		// Add player names to display
		displayNames();

		// Start game manager
		startGame();

		// Setup display for active players turn
		updateTurnChange();

	}