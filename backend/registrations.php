<?php
require_once __DIR__ . "/lib/helpers.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") out(["ok" => false, "error" => "Method not allowed."], 405);

$db = pdo();

if (!empty($_GET["studentId"])) {
    $st = $db->prepare("SELECT * FROM registrations WHERE student_id = ? ORDER BY registered_at DESC");
    $st->execute([$_GET["studentId"]]);
    out(array_map("map_reg", $st->fetchAll()));
}

$rows = $db->query("SELECT * FROM registrations ORDER BY registered_at DESC")->fetchAll();
out(array_map("map_reg", $rows));
