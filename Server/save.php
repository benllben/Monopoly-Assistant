<?php	

	header("content-type:application/json");

	// Establish Database connection
    require 'dbcon.php';

    // Ensure saveData exists
    if(isset($_POST['saveData'])){

    	// Get save data from post data
    	$saveData = $_POST['saveData'];

    	// Execute Query
		$result = $connection->query("INSERT INTO saveGames (gameData) VALUES ('$saveData')");

		// Check if query successful and set return value
		if(!$result){
			$error = $connection->error;
			$ret = array('result' => 'fail', 'error' => $error);
		} else {
			$saveId = $connection->insert_id;
			$ret = array('result' => 'success', 'saveId' => $saveId);
		}

		// Return result
    	echo json_encode($ret);

    	// Close database connection
    	mysqli_close($connection);
    }

?>