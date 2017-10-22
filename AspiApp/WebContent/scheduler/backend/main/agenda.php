<?php
require_once '../_db.php';
require_once '../_constants.php';

$json = file_get_contents('php://input');
$params = json_decode($json);

header('Content-Type: application/json');

if ($params->action == $CONSTANTS_ACTION_LOAD) {
	
	$stmt = $db->prepare("SELECT * FROM agenda_interval WHERE NOT ((end <= :start) OR (start >= :end))");
	$stmt->bindParam(':start', $params->start);
	$stmt->bindParam(':end', $params->end);
	$stmt->execute();
	$result = $stmt->fetchAll();


	class Event {}
	$events = array();

	date_default_timezone_set("UTC");
	$now = new DateTime("now");
	$today = $now->setTime(0, 0, 0);


	foreach($result as $row) {
		$e = new Event();
		$e->id = $row['id'];
		$e->text = '';
		$e->start = $row['start'];
		$e->end = $row['end'];
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
