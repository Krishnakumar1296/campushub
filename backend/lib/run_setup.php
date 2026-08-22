<?php
header("Content-Type: application/json; charset=utf-8");

function run_setup()
{
    $sql = file_get_contents(__DIR__ . "/../setup.sql");
    $c = require __DIR__ . "/../config/db.php";
    $con = @new mysqli($c["host"], $c["user"], $c["pass"]);
    if ($con->connect_error) {
        echo json_encode(["ok" => false, "error" => "MySQL connection failed: " . $con->connect_error]);
        exit;
    }
    if (!$con->multi_query($sql)) {
        echo json_encode(["ok" => false, "error" => $con->error]);
        exit;
    }
    do {
        if ($res = $con->store_result()) {
            $res->free();
        }
    } while ($con->more_results() && $con->next_result());
    if ($con->errno) {
        echo json_encode(["ok" => false, "error" => $con->error]);
        exit;
    }
    $con->close();
    return true;
}
