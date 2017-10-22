<?php
require_once '../_db.php';

$json = file_get_contents('php://input');
$params = json_decode($json);

$stmt = $db->prepare("SELECT id, 
							name, 
							document, 
							phone, 
							email, 
							address_name, 
							address_number, 
							address_complement, 
							access_level, 
							zip_code,
							role_id,
                            boss_id							
					  FROM employee WHERE login = :login AND password = :password AND deleted = 0");
$stmt->bindParam(':login', $params->login);
$stmt->bindParam(':password', $params->password);
$stmt->execute();
$result = $stmt->fetch();

class Event {}

$e = new Event();
$e->id = $result['id'];
$e->name = $result['name'];
$e->document = $result['document'];
$e->phone = $result['phone'];
$e->email = $result['email'];
$e->address_name = $result['address_name'];
$e->address_number = $result['address_number'];
$e->address_complement = $result['address_complement'];
$e->access_level = $result['access_level'];
$e->zip_code = $result['zip_code'];
$e->role_id = $result['role_id'];
$e->boss_id = $result['boss_id'];

header('Content-Type: application/json');
echo json_encode($e);

?>
