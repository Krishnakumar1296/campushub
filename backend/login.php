<?php
require_once __DIR__ . "/lib/helpers.php";

$b = body();
$email = strtolower(trim($b["email"] ?? ""));
$password = $b["password"] ?? "";
$role = $b["role"] ?? null;

if (!$email || !$password) {
    out(["ok" => false, "error" => "Email and password are required."], 422);
}

$st = pdo()->prepare("SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1");
$st->execute([$email]);
$user = $st->fetch();

if (!$user || !password_verify($password, $user["password"])) {
    out(["ok" => false, "error" => "Incorrect email or password."], 401);
}

if ($role && $user["role"] !== $role) {
    out(["ok" => false, "error" => "This account is not a {$role} account."], 403);
}

unset($user["password"]);
out(["ok" => true, "user" => $user]);
