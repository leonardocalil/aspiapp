<?php
require_once '_db.php';

$json = file_get_contents('php://input');
$params = json_decode($json);

$stmt = $db->prepare("SELECT * FROM events WHERE ID = :id ");
$stmt->bindParam(':id', $params->id);
$stmt->execute();
$result = $stmt->fetch();

class Event {}

date_default_timezone_set("UTC");

$e = new Event();
$e->id = $result['id'];
$e->text = $result['text'];
$e->start = $result['start'];
$e->end = $result['end'];

header('Content-Type: application/json');
echo json_encode($e);

?>
