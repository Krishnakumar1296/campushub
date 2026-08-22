<?php
require_once __DIR__ . "/lib/helpers.php";

$method = $_SERVER["REQUEST_METHOD"];
$db = pdo();

if ($method === "GET") {
    $id = trim($_GET["id"] ?? "");
    if (!$id) out(["ok" => false, "error" => "User id required."], 422);
    $st = $db->prepare("SELECT id, name, email, role, phone, department, year, bio FROM users WHERE id = ? LIMIT 1");
    $st->execute([$id]);
    $user = $st->fetch();
    out($user ? ["ok" => true, "profile" => $user] : ["ok" => false], $user ? 200 : 404);
}

if ($method === "PUT") {
    $b = body();
    $id = trim($b["id"] ?? "");
    if (!$id) out(["ok" => false, "error" => "User id required."], 422);
    $st = $db->prepare(
        "UPDATE users SET name = ?, email = ?, phone = ?, department = ?, year = ?, bio = ? WHERE id = ?"
    );
    $st->execute([
        trim($b["name"] ?? ""),
        trim($b["email"] ?? ""),
        trim($b["phone"] ?? ""),
        trim($b["department"] ?? ""),
        trim($b["year"] ?? ""),
        trim($b["bio"] ?? ""),
        $id,
    ]);
    out(["ok" => true]);
}

out(["ok" => false, "error" => "Method not allowed."], 405);
