<?php	

	header("content-type:application/json");

	// Establish Database connection
    require 'dbcon.php';

    // Ensure saveData exists
    if(isset($_POST['saveData'])){

    	// Get save data from post data
    	$saveData = $_POST['saveData'];

    	// Get new or update action
    	$action = $_POST['action'];

    	if($action == "new"){
    		// Get password
    		$password = $_POST['password'];

	    	// Execute Query
			$result = $connection->query("INSERT INTO saveGames (gameData, password) VALUES ('$saveData', '$password')");

			// Check if query successful and set return value
			if(!$result){
				$error = $connection->error;
				$ret = array('result' => 'fail', 'error' => $error);
			} else {
				$saveId = $connection->insert_id;
				$ret = array('result' => 'success', 'saveId' => $saveId);
			}
		} else {
			// Get game id to update
			$id = $_POST['gameId'];

			$result = $connection->query("UPDATE saveGames SET gameData = '$saveData' WHERE id = '$id'");

			if($result){
				$ret = array('result' => 'success');
			} else {
				$ret = array('result' => 'fail');
			}
		}

		// Return result
    	echo json_encode($ret);

    	// Close database connection
    	mysqli_close($connection);
    }

?>