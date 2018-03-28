	
	// Holds current community pool value
	var communityPool = 0;

	// Indicates players turn
	var turn = 0;

	// Get reference to select inputs
	adjustmentSelect = document.getElementById('adjustmentSelect');
	fromSelect = document.getElementById('fromSelect');
	toSelect = document.getElementById('toSelect');

	function startGame(){
		/* Function called at start of game to setup interface */

		/* For each player, add there name and array location to each select input */
		for (i = 0; i < players.length; i++){
			adjustmentSelect.options[adjustmentSelect.options.length] = new Option(players[i].name, i);
			fromSelect.options[fromSelect.options.length] = new Option(players[i].name, i);
			toSelect.options[toSelect.options.length] = new Option(players[i].name, i);
		}

		/* Add community chest as an option for Transfer to input */
		toSelect.options[toSelect.options.length] = new Option("Community Chest", 99);

		$("#play0").css("backgroundColor", "#224271")
		$("#player0 ").css("color", "#fcf7f7");

		// Ensure display is updated
		updateDisplay();
	}

	function updateDisplay(){
		/* Updates display regarding current player and community money */

		// Variables to hold values
		var player, text;

		// Loop through each player
		for (var i = 0; i < players.length; i++){

			// Create string with player id for jquery
			player = "player" + i.toString();

			// Generate display string with player name and money
			text = players[i].name + ": " + moneyFormat(players[i].money);

			// Add extra space to ID due to bug with jquery Append
			// Update paragraph with new text
			$("#" + player + " ").html(text);
		}

		// Update community chest paragraph with latest value
		$("#chestValue").html("Community Chest" + ": " + moneyFormat(communityPool));

		// Hide any previous error messages
		$('#adjustError').text("");
		$('#transferError').text("");
		$('#gameError').text("");
	}

	function updateTurnChange(){
		/* Updates display regarding player color formatting and select inputs */

		// Set all inputs to select current player by default
		adjustmentSelect.selectedIndex = turn;
		fromSelect.selectedIndex = turn;
		toSelect.selectedIndex = turn;

		// Holds string used for jquery update
		var background, text;

		// Set each players background color and text to default
		for(var i = 0; i < players.length; i++){
			background = "play" + i.toString();
			text = "player" + i.toString() + " ";
			$("#" + background).css("backgroundColor", "#6ba2c1")
			$("#" + text).css("color", "#224271");
		}

		// Create ID's to change
		background = "play" + turn.toString();
		text = "player" + turn.toString() + " ";

		// Set active players background color
		$("#" + background).css("backgroundColor", "#224271")
		$("#" + text).css("color", "#fcf7f7");
	}

	function nextTurn(){
		/* Set up the next turn */

		// Increase the turn counter, loop if necessary
		if (turn == players.length - 1)
			turn = 0;
		else turn++;

		// Push action to action stack
		stack.push(new action("nextTurn", null, null, "false"));

		// Ensure all displays are updated
		updateTurnChange();
		updateDisplay();
	}

	function modifyAccount(account, amount){
		/* Receives an account and amount of money then modifies the account */

		// If account is not community pool
		if (account != 99){
			// Change players account by amount
			players[account].money = parseInt(players[account].money) + parseInt(amount);
		} else {
			// Modify community pool value
			communityPool = parseInt(communityPool) + parseInt(amount);
		}

		// Display updated amounts
		updateDisplay();
	}

	function deductMoney(){
		/* Deducts money from players account with withdraw is clicked */

		// If amount field is filled out
		if(!$("#addAmount").val()){
			$('#adjustError').text("Error: Please enter amount!");	// Display error message if invalid input
		} else {
			// Get amount from input
			amount = returnAmount($('#addAmount').val());

			// Ensure input is a valid number
			if(isValidInput(amount)){
				// Get affected player from dropdown box
				player = adjustmentSelect.options[adjustmentSelect.selectedIndex].value;

				// If player has adequate money
				if (parseInt(players[player].money) + parseInt(-Math.abs(amount)) >= 0){
					// Remove money from players account
					modifyAccount(player, -Math.abs(amount));
					// Push action to action stack
					stack.push(new action("transaction", player, -Math.abs(amount), "false"));
				} else {
					// If player does not have enough money, inform user
					$('#adjustError').text("Error: Not enough funds to complete transaction!");
				}
			} else {
				$('#adjustError').text("Error: Input invalid!"); // Display error message if field empty
			}
		}
	}

	function addMoney(){
		/* Adds money to players account when deposit is clicked */

		// If amount field is filled out
		if(!$("#addAmount").val()){
			$('#adjustError').text("Error: Please enter amount!"); // Display error message if field empty
		} else {
			// Get amount from input
			amount = returnAmount($('#addAmount').val());

			// Ensure input is a valid number
			if(isValidInput(amount)){
				// Get affected player from dropdown box
				player = adjustmentSelect.options[adjustmentSelect.selectedIndex].value;
				// Add money to players account
				modifyAccount(player, amount);
				// Push action to action stack
				stack.push(new action("transaction", player, amount, "false"));
			} else {
				$('#adjustError').text("Error: Input invalid!"); // Display error message if invalid input
			}
		}
	}

	function sub10(){
		/* Increases money adjustment input field by set % for mortgage repayments */
		// TODO update to use inputed percantage update to jquery

		// If amount field is filled out
		if(!$("#addAmount").val()){
			$('#adjustError').text("Error: Please enter amount!"); // Display error message if field empty
		} else {

			// Get string with current amount
			string = $('#addAmount').val();

			if(isValidInput(string)){
				// Convert input to int and multiply by mortgage percent
				var amount = Math.round(returnAmount(string) * 1.1);

				// Convert new value to short form
				var displayAmount = moneyFormat(amount);

				// Update input box with new value
				document.getElementById('addAmount').value = displayAmount;
			} else {
				$('#adjustError').text("Error: Input invalid!"); // Display error message if invalid input
			}
		}
	}

	function transferMoney(){
		/* Transfers money between accounts */

		// If amount field is filled out
		if(!$("#transferAmount").val()){
			$("#transferError").text("Error: Please enter amount!"); // Display error message if field empty
		} else {
			// Get amount from input
			amount = returnAmount($('#transferAmount').val());

			if(isValidInput(amount)){
				// Get account money comes from
				from = fromSelect.options[fromSelect.selectedIndex].value;
				// Get account money goes to
				to = toSelect.options[toSelect.selectedIndex].value;

				// If player transfering has enough money
				if(parseInt(players[from].money) + parseInt(-Math.abs(amount)) >= 0){
					// Remove money from paying account
					modifyAccount(from, -Math.abs(amount));
					// Add money to receiving account
					modifyAccount(to, amount);
					// Add both actions to action stack
					stack.push(new action("transaction", from, -Math.abs(amount), "false"));
					stack.push(new action("transaction", to, amount, "true"));
				} else {
					// If player does not have enough money, inform user
					$('#transferError').text("Error: Not enough funds to complete transfer");
				}
			} else {
				// Display error message if invalid input
				$('#transferError').text("Error: Input invalid");
			}
		}
	}

	function claimCommunity(){
		/* Adds community chest money to active player when claimed */

		// Push action to action stack
		stack.push(new action("claimCommunity", turn, communityPool, "false"));

		// Add community money to active player account
		modifyAccount(turn, communityPool);
		// Reset community pool back to 0
		communityPool = 0;

		// Update display
		updateDisplay();
	}
	
	function passGo(){
		/* Adds pass go money to players account when clicked */

		// Add pass go money to players account
		players[turn].money = parseInt(players[turn].money) + parseInt(goAmount);

		// Push action onto action stack
		stack.push(new action("transaction", turn, goAmount, "false"));

		// Update display
		updateDisplay();
	}

	function isValidInput(input){
		/* Checks if variable is a valid number. Valid numbers include numbers
			with k or m appended, but nothing else */

		
		if (!isNaN(input)) {	// Check if its a number, if so then return true
			return 1;
		} else {
			/* Get last character of string */
			endChar = input.substring(input.length - 1, input.length -0);
			// Check if the last character is a valid multiplier
			if (endChar == "m" || endChar == "M" || endChar == "k" || endChar == "K"){
				// If its a valid multiplier, check if the substring is valid
				value = input.substring(0, input.length - 1);
				if (!isNaN(value)){
					return 1;
				}
			}
		}

		return 0;
	}

	function moneyFormat(num) {
		/* Assigns Thousand or Million quantifier to number for display purposes */

		if (num > 20000 && num < 1000000){			// 20,000 - 999,999
			return (num/1000).toFixed(2) + 'k';		// Displayed as Thousand
		} else if (num >= 1000000){					// 1,000,000 +
			return (num/1000000).toFixed(2) + 'M';	// Display as Million
		} else {
			return num;								// Return normal number under 20,000
		}
	}

	function returnAmount(string){
		/* Converts shortend form to int */

		/* Get last character of string */
		newStr = string.substring(string.length - 1, string.length -0);
		/* Get actual value of string */
		value = string.substring(0, string.length - 1);

		if (newStr == "m" || newStr == "M"){			/* If m was attached to string */
			return (value * 1000000);					/* Convert int to millions */
		} else if (newStr == "k" || newStr == "K"){		/* If k was attached to string */
			return (value * 1000);						/* Convert to thousands */
		}	else {										/* If no letter attached */
			return string;								/* Return original value */
		}
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
			url: 'model/boats.php',
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

