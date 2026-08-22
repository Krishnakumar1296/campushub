<?php
require_once __DIR__ . "/lib/helpers.php";

$method = $_SERVER["REQUEST_METHOD"];
$db = pdo();

if ($method === "GET") {
    $email = trim($_GET["email"] ?? "");
    if (!$email) out([]);
    $st = $db->prepare(
        "SELECT * FROM notifications WHERE user_email = ? OR user_email IS NULL ORDER BY created_at DESC, id DESC LIMIT 50"
    );
    $st->execute([$email]);
    out(array_map(function ($r) {
        return [
            "id" => (int) $r["id"],
            "type" => $r["type"],
            "title" => $r["title"],
            "message" => $r["message"],
            "time" => (int) (strtotime($r["created_at"]) * 1000),
            "read" => (bool) $r["is_read"],
        ];
    }, $st->fetchAll()));
}

$b = body();

if ($method === "POST") {
    notify(
        trim($b["userEmail"] ?? "") ?: null,
        in_array($b["type"] ?? "", ["success", "error", "info", "warning"]) ? $b["type"] : "info",
        trim($b["title"] ?? ""),
        trim($b["message"] ?? "")
    );
    out(["ok" => true]);
}

if ($method === "PATCH") {
    $email = trim($b["email"] ?? "");
    if (!$email) out(["ok" => false, "error" => "Email required."], 422);
    if (!empty($b["all"])) {
        $st = $db->prepare("UPDATE notifications SET is_read = 1 WHERE user_email = ? OR user_email IS NULL");
        $st->execute([$email]);
    } elseif (!empty($b["id"])) {
        $st = $db->prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND (user_email = ? OR user_email IS NULL)");
        $st->execute([(int) $b["id"], $email]);
    }
    out(["ok" => true]);
}

out(["ok" => false, "error" => "Method not allowed."], 405);
