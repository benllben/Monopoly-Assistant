// 1 if game has been created
var isSetup = 0;

function displayLoad(){
	$("#gamePanel").hide();
	$("#loadPanel").show();
	$("#setupValues").hide();
	$(".setupName").hide();
}


function displaySave(){
	// Ensure we have a game to save
	if(isSetup == 1){
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
}

function hideLoad(){
	
	$("#loadPanel").hide();

	if(isSetup == 0){
		$(".setupName").show();
		$("#setupValues").show();
	} else {
		$("#gamePanel").show();
	}
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

	// Hold new or update action
	var action;

	// Hold password
	var password = "";

	if(gameId == 0){
		action = "new";							// Create a new save if no save exists
		password = $('#savePassword').val();	// Get password from input
	} else {
		action = "update";	// Update save if one exists
	}

	// Attempt to save to server
	$.ajax({
		url: 'server/save.php',
		type: 'POST',
		data: {
			saveData: saveString,
			action: action,
			gameId: gameId,
			password: password
		},
		success: function(json){
			// If new save, get saveId
			if(gameId == 0)
				gameId = json.saveId;

			// Display saveID
			$('#gameIdDisplay').text("GameID: " + gameId);

			$('#gameError').show().text("Game Saved!").fadeOut(6000);

			// Restore view
			hideSave();
		},
		error: function(xhr, desc, err){
			console.log(xhr + "\n" + err);
		}
	});

}

function loadGame(){
	// Get gameID and password to load
	var gameIdLoad = $('#loadId').val();
	var password = $('#loadPassword').val();

	// Attempt to load game from server
	$.ajax({
		url: 'server/load.php',
		type: 'POST',
		data: {
			gameId: gameIdLoad,
			pass: password
		},
		success: function(json){
			if(json.result == "success"){
				setupLoadedGame(json.gameData);
				gameId = gameIdLoad;
				hideLoad();
				isSetup = 1;
				// Display saveID
				$('#gameIdDisplay').text("GameID: " + gameId);
				$("#loadError").text("");
			} else {
				console.log("NoSave");
				$("#loadError").text("Incorrect GameID or Password!");
			}
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