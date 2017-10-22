<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "scheduler";



$db_exists = file_exists("scheduler");

$db = new PDO("mysql:host=$servername;dbname=$database", $username, $password);

if (!$db_exists) {
    //create the database
    $db->exec("CREATE TABLE IF NOT EXISTS events (
                        id INTEGER PRIMARY KEY AUTO_INCREMENT, 
                        text TEXT, 
                        start DATETIME, 
                        end DATETIME)");
	$db->exec("CREATE TABLE IF NOT EXISTS agenda (
					id integer primary key auto_increment,
					day date)");					
						
	$db->exec("CREATE TABLE IF NOT EXISTS agenda_interval (
					id integer primary key auto_increment,
					agenda_id integer references scheduler.agenda(id),
					start datetime,
					end datetime)");					
	
	$db->exec("CREATE TABLE IF NOT EXISTS client (
					id integer primary key auto_increment,
					name character varying(200),
					document character varying(20),
					address_name character varying(200),
					address_number integer,
					address_complement character varying(50),
					zip_code character varying(20),
					phone character varying(20),
					email character varying(50),
					deleted integer DEFAULT 0,
					login character varying(20),
					password character varying(50),
					CONSTRAINT uk_client_login UNIQUE (login))");

	$db->exec("CREATE TABLE IF NOT EXISTS role (
					id integer primary key auto_increment,
					name character varying(50),
					description character varying(4000),
					deleted integer DEFAULT 0)");
	
	$db->exec("CREATE TABLE IF NOT EXISTS employee(
					id integer primary key auto_increment,
					name character varying(200),
					document character varying(20),
					phone character varying(20),
					email character varying(50),
					address_name character varying(200),
					address_number integer,
					address_complement character varying(20),
					login character varying(20),
					password character varying(50),
					deleted integer DEFAULT 0,
					access_level integer DEFAULT 0,
					zip_code character varying(20),
					role_id integer,
					boss_id integer,
					CONSTRAINT fk_employee_role FOREIGN KEY (role_id)
					REFERENCES role (id) MATCH SIMPLE
						ON UPDATE NO ACTION ON DELETE NO ACTION,
					CONSTRAINT uk_employee_login UNIQUE (login))");			
	
	$fh = fopen('scheduler', 'a');
	fclose($fh);					
    
}
?>

