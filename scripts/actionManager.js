// Create the stack to hold actions
var stack = new Array();


function undo(){
	// If actions exist in the stack
	if(stack.length > 0){
		// Get the next action from stack
		var action = stack.pop()

		// Execute the relevent action
		if (action.type == "transaction"){
			// Reverese transaction action with opposite amount
			modifyAccount(action.account, -(action.amount));

		} else if (action.type == "claimCommunity"){
			// Set community pool back to previous amount
			communityPool = Math.abs(action.amount);
			// Remove claimed money from player account
			modifyAccount(action.account, -(action.amount));

		} else if (action.type == "nextTurn"){
			// Go back 1 turn
			if (turn == 0){				// If player 0 turn, loop back to last player
				turn = numPlayers - 1;
			} else {
				turn--;					// Otherwise decrement turn counter
			}

			updateTurnChange();			// Update player turn and input displays

		} 

		// If action.next is true, its likely part of a transfer chain
		if (action.next == "true"){
			// Execute next part of transfer chain
			undo();
		}

		// Ensure display is updated with latest values
		updateDisplay();
		
	} else {
		console.log("Nothing left to undo!");
	}
}