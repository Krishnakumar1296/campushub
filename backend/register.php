<?php
require_once __DIR__ . "/lib/helpers.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") out(["ok" => false, "error" => "Method not allowed."], 405);

$b = body();
$eventId = (int) ($b["eventId"] ?? 0);
$student = $b["student"] ?? null;

if (!$eventId || !$student || empty($student["id"])) {
    out(["ok" => false, "error" => "Event and student details are required."], 422);
}

$db = pdo();

$st = $db->prepare("SELECT * FROM events WHERE id = ? LIMIT 1");
$st->execute([$eventId]);
$event = $st->fetch();
if (!$event) out(["ok" => false, "error" => "Event not found."], 404);

$dup = $db->prepare("SELECT reg_id FROM registrations WHERE event_id = ? AND student_id = ? LIMIT 1");
$dup->execute([$eventId, $student["id"]]);
if ($dup->fetch()) {
    out(["ok" => false, "duplicate" => true, "error" => "You are already registered for {$event["title"]}."]);
}

if ((int) $event["registered"] >= (int) $event["capacity"]) {
    out(["ok" => false, "error" => "{$event["title"]} is full."]);
}

$row = $db->query(
    "SELECT COALESCE(MAX(CAST(SUBSTRING_INDEX(reg_id, '-', -1) AS UNSIGNED)), 1026) + 1 AS next FROM registrations"
)->fetch();
$regId = "REG-2026-" . str_pad((string) max(1027, (int) $row["next"]), 4, "0", STR_PAD_LEFT);

$ins = $db->prepare(
    "INSERT INTO registrations (reg_id, event_id, student_id, student_name, email, department, year, status, registered_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'Registered', NOW())"
);
$ins->execute([
    $regId,
    $eventId,
    $student["id"],
    $student["name"],
    $student["email"] ?? null,
    $student["department"] ?? null,
    $student["year"] ?? null,
]);

$db->prepare("UPDATE events SET registered = registered + 1 WHERE id = ?")->execute([$eventId]);

notify(
    $student["email"] ?? null,
    "success",
    "Registration successful",
    "Your ticket for {$event["title"]} ({$regId}) has been generated."
);

out(["ok" => true, "regId" => $regId]);
