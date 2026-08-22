<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");
require_once __DIR__ . "/lib/run_setup.php";
run_setup();
echo json_encode(["ok" => true, "message" => "Demo data has been reset."]);
