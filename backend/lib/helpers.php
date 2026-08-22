<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

require_once __DIR__ . "/../config/db.php";

function pdo()
{
    static $pdo = null;
    if ($pdo === null) {
        $c = require __DIR__ . "/../config/db.php";
        $dsn = "mysql:host={$c["host"]};dbname={$c["name"]};charset={$c["charset"]}";
        $pdo = new PDO($dsn, $c["user"], $c["pass"], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }
    return $pdo;
}

function body()
{
    static $b = null;
    if ($b === null) {
        $raw = file_get_contents("php://input");
        $b = json_decode($raw, true) ?: [];
    }
    return $b;
}

function out($data, int $code = 200)
{
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function map_event(array $r): array
{
    return [
        "id" => (int) $r["id"],
        "title" => $r["title"],
        "description" => $r["description"],
        "longDescription" => $r["long_description"] ?: "",
        "category" => $r["category"],
        "date" => $r["date"],
        "time" => $r["time"],
        "endTime" => $r["end_time"],
        "venue" => $r["venue"],
        "department" => $r["department"],
        "image" => $r["image"],
        "registered" => (int) $r["registered"],
        "capacity" => (int) $r["capacity"],
        "attended" => (int) $r["attended"],
        "registrationDeadline" => $r["registration_deadline"],
        "status" => $r["status"],
        "tags" => array_values(array_filter(array_map("trim", explode(",", $r["tags"] ?? "")))),
        "createdAt" => $r["created_at"],
        "organizerId" => $r["organizer_id"],
    ];
}

function map_reg(array $r): array
{
    return [
        "regId" => $r["reg_id"],
        "eventId" => (int) $r["event_id"],
        "studentName" => $r["student_name"],
        "studentId" => $r["student_id"],
        "email" => $r["email"],
        "department" => $r["department"],
        "year" => $r["year"],
        "status" => $r["status"],
        "registeredAt" => date("c", strtotime($r["registered_at"])),
        "checkedInAt" => $r["checked_in_at"] ? date("c", strtotime($r["checked_in_at"])) : null,
    ];
}

function notify(?string $email, string $type, string $title, string $message)
{
    $st = pdo()->prepare(
        "INSERT INTO notifications (user_email, type, title, message, is_read, created_at) VALUES (?, ?, ?, ?, 0, NOW())"
    );
    $st->execute([$email, $type, $title, $message]);
}
