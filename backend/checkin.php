<?php
require_once __DIR__ . "/lib/helpers.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") out(["ok" => false, "error" => "Method not allowed."], 405);

$b = body();
$regId = trim($b["regId"] ?? "");
if (!$regId) out(["ok" => false, "error" => "Registration ID is required."], 422);

$db = pdo();
$st = $db->prepare("SELECT * FROM registrations WHERE reg_id = ? LIMIT 1");
$st->execute([$regId]);
$reg = $st->fetch();
if (!$reg) out(["ok" => false, "error" => "Registration not found."], 404);

if ($reg["status"] === "Checked-in") {
    out(["ok" => true, "already" => true, "registration" => map_reg($reg)]);
}

$db->prepare("UPDATE registrations SET status = 'Checked-in', checked_in_at = NOW() WHERE reg_id = ?")->execute([$regId]);
$db->prepare("UPDATE events SET attended = attended + 1 WHERE id = ?")->execute([(int) $reg["event_id"]]);

$ev = $db->prepare("SELECT title FROM events WHERE id = ?");
$ev->execute([(int) $reg["event_id"]]);
$title = $ev->fetchColumn();

notify(
    $reg["email"],
    "success",
    "Attendance recorded",
    "{$reg["student_name"]} was checked in at {$title}."
);

$st->execute([$regId]);
out(["ok" => true, "already" => false, "registration" => map_reg($st->fetch())]);
