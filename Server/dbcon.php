<?php
	//Establish connection
	$connection = new mysqli('localhost', 'root', '', 'monopoly');
	if($connection->connect_error) {
	    echo "Failed to connect to MySQL" . $connection->connect_error;
	}
?>