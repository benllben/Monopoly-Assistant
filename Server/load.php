<?php	

	header("content-type:application/json");

	// Establish Database connection
    require 'dbcon.php';

    // Ensure saveData exists
    if(isset($_POST['gameId'])){

    	// Get save data from post data
    	$gameId = $_POST['gameId'];

    	// Create Query
    	$query = "SELECT * FROM saveGames WHERE id = '$gameId'";

    	// Execute Query
		$result = $connection->query($query);

		// Check if result exists
		if ($result->num_rows > 0){
			// If a result exists, fetch the first row
			$row = $result->fetch_assoc();
			// Get the gameData from the row
			$data = $row["gameData"];
			// Store data in return value
			$ret = array('result' => 'success', 'gameData' => $data);
		} else {
			// If no results, set return value
			$ret = array('result' => 'fail');
		}

		// Return result
    	echo json_encode($ret);

    	// Close database connection
    	mysqli_close($connection);
    }

?>