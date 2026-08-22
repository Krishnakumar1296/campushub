<?php
require_once __DIR__ . "/lib/helpers.php";

$method = $_SERVER["REQUEST_METHOD"];
$db = pdo();

if ($method === "GET") {
    if (isset($_GET["id"])) {
        $st = $db->prepare("SELECT * FROM events WHERE id = ? LIMIT 1");
        $st->execute([(int) $_GET["id"]]);
        $row = $st->fetch();
        out($row ? ["ok" => true, "event" => map_event($row)] : ["ok" => false, "error" => "Event not found."], $row ? 200 : 404);
    }
    $rows = $db->query("SELECT * FROM events ORDER BY date ASC")->fetchAll();
    out(array_map("map_event", $rows));
}

$b = body();

if ($method === "POST") {
    $title = trim($b["title"] ?? "");
    if (!$title) out(["ok" => false, "error" => "Title is required."], 422);
    $st = $db->prepare(
        "INSERT INTO events (title, description, long_description, category, date, time, end_time, venue, department, image, registered, capacity, attended, registration_deadline, status, tags, created_at, organizer_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, CURDATE(), 'ORG-001')"
    );
    $st->execute([
        $title,
        trim($b["description"] ?? "") ?: $title,
        trim($b["longDescription"] ?? ""),
        $b["category"] ?? "Other",
        $b["date"],
        trim($b["time"] ?? ""),
        trim($b["endTime"] ?? ""),
        trim($b["venue"] ?? ""),
        trim($b["department"] ?? ""),
        trim($b["image"] ?? ""),
        (int) ($b["registered"] ?? 0),
        max(1, (int) ($b["capacity"] ?? 1)),
        $b["registrationDeadline"] ?: null,
        in_array($b["status"] ?? "", ["Upcoming", "Draft", "Completed", "Cancelled"]) ? $b["status"] : "Upcoming",
        implode(",", array_slice((array) ($b["tags"] ?? []), 0, 10)),
    ]);
    $id = (int) $db->lastInsertId();
    $st2 = $db->prepare("SELECT * FROM events WHERE id = ?");
    $st2->execute([$id]);
    out(["ok" => true, "event" => map_event($st2->fetch())], 201);
}

if ($method === "PUT") {
    $id = (int) ($_GET["id"] ?? 0);
    if (!$id) out(["ok" => false, "error" => "Event id required."], 422);
    $fields = [
        "title" => "title",
        "description" => "description",
        "longDescription" => "long_description",
        "category" => "category",
        "date" => "date",
        "time" => "time",
        "endTime" => "end_time",
        "venue" => "venue",
        "department" => "department",
        "image" => "image",
        "capacity" => "capacity",
        "registrationDeadline" => "registration_deadline",
        "status" => "status",
        "tags" => "tags",
    ];
    $sets = [];
    $vals = [];
    foreach ($fields as $key => $col) {
        if (!array_key_exists($key, $b)) continue;
        $val = $b[$key];
        if (in_array($key, ["tags"])) {
            $val = implode(",", (array) $val);
        }
        if (in_array($key, ["registrationDeadline"]) && !$val) {
            $val = null;
        }
        $sets[] = "$col = ?";
        $vals[] = $val;
    }
    if (!$sets) out(["ok" => false, "error" => "Nothing to update."], 422);
    $vals[] = $id;
    $st = $db->prepare("UPDATE events SET " . implode(", ", $sets) . " WHERE id = ?");
    $st->execute($vals);
    out(["ok" => true]);
}

if ($method === "DELETE") {
    $id = (int) ($_GET["id"] ?? 0);
    if (!$id) out(["ok" => false, "error" => "Event id required."], 422);
    $db->prepare("DELETE FROM events WHERE id = ?")->execute([$id]);
    out(["ok" => true]);
}

out(["ok" => false, "error" => "Method not allowed."], 405);
