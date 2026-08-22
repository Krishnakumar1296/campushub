<?php
require_once __DIR__ . "/lib/helpers.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") out(["ok" => false, "error" => "Method not allowed."], 405);

$b = body();
$name = trim($b["name"] ?? "");
$email = strtolower(trim($b["email"] ?? ""));
$password = $b["password"] ?? "";
$role = $b["role"] ?? "";

if (mb_strlen($name) < 3) out(["ok" => false, "error" => "Please enter your full name."], 422);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) out(["ok" => false, "error" => "Please enter a valid email address."], 422);
if (strlen($password) < 6) out(["ok" => false, "error" => "Password must be at least 6 characters."], 422);
if (!in_array($role, ["student", "organizer"])) out(["ok" => false, "error" => "Invalid account type."], 422);

$db = pdo();

$st = $db->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
$st->execute([$email]);
if ($st->fetch()) {
    out(["ok" => false, "error" => "An account with this email already exists. Try signing in instead."], 409);
}

$prefix = $role === "organizer" ? "ORG" : "STU";
$row = $db->query(
    "SELECT COALESCE(MAX(CAST(SUBSTRING_INDEX(id, '-', -1) AS UNSIGNED)), 1000) + 1 AS next
     FROM users WHERE id LIKE '{$prefix}-%'"
)->fetch();
$id = $prefix . "-" . str_pad((string) $row["next"], 4, "0", STR_PAD_LEFT);

$ins = $db->prepare(
    "INSERT INTO users (id, name, email, password, role, phone, department, year, bio)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL)"
);
$ins->execute([
    $id,
    $name,
    $email,
    password_hash($password, PASSWORD_DEFAULT),
    $role,
    trim($b["phone"] ?? ""),
    trim($b["department"] ?? ""),
    trim($b["year"] ?? ""),
]);

notify(
    $email,
    "success",
    "Welcome to CampusHub",
    "Your {$role} account ({$id}) has been created successfully."
);

out(["ok" => true, "user" => ["id" => $id, "name" => $name, "email" => $email, "role" => $role]], 201);
