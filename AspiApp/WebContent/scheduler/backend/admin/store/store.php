<?php
require_once '../_db.php';
require_once '../_constants.php';

$json = file_get_contents('php://input');
$params = json_decode($json);

header('Content-Type: application/json');

if ($params->action == $CONSTANTS_ACTION_LOAD) {
	
	$stmt = $db->prepare("SELECT id, 
								 name, 
								 physical_store, 
								 document, 
								 address_name, 
								 address_number, 
								 address_complement,
								 zip_code, 
								 phone, 
								 email
						  FROM site WHERE deleted = 0");
	$stmt->execute();
	$result = $stmt->fetchAll();

	class Event {}
	$events = array();

	foreach($result as $row) {
		$e = new Event();
		$e->id = $row['id'];
		$e->name = $row['name'];
		$e->physical_store = $row['physical_store'];
		$e->document = $row['document'];
		$e->address_name = $row['address_name'];
		$e->address_number = $row['address_number'];
		$e->address_complement = $row['address_complement'];
		$e->zip_code = $row['zip_code'];
		$e->phone = $row['phone'];
		$e->email = $row['email'];
		
		$events[] = $e;
	}

	echo json_encode($events);
} elseif ($params->action == $CONSTANTS_ACTION_SELECT) {
		
	$stmt = $db->prepare("SELECT * FROM agenda_interval WHERE ID = :id ");
	$stmt->bindParam(':id', $params->id);
	$stmt->execute();
	$result = $stmt->fetch();

	class Event {}

	date_default_timezone_set("UTC");

	$e = new Event();
	$e->id = $result['id'];
	$e->text = 'deu certo!';
	$e->start = $result['start'];
	$e->end = $result['end'];

	echo json_encode($e);
}


?>
