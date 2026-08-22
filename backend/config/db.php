<?php
$env = function ($key, $default) {
    $value = getenv($key);
    return $value === false || $value === "" ? $default : $value;
};

return [
    "host" => $env("DB_HOST", "localhost"),
    "user" => $env("DB_USER", "root"),
    "pass" => $env("DB_PASS", ""),
    "name" => $env("DB_NAME", "campushub"),
    "charset" => "utf8mb4",
];
