<?php
require 'config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle OPTIONS request for CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Handle GET request to fetch geo_games_usa_leaderboard
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['uuid'])) {
        // Fetch score1 for a specific user
        $uuid = $_GET['uuid'];
        $sql = "SELECT score1 FROM geo_games_usa_leaderboard WHERE uuid = '$uuid'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo json_encode(["score1" => $row['score1']]);
        } else {
            echo json_encode(["error" => "User not found"]);
        }
    } else {
        // Fetch geo_games_usa_leaderboard
        $sql = "SELECT name, score1 FROM geo_games_usa_leaderboard ORDER BY score1 DESC";
        $result = $conn->query($sql);

        $leaderboard = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $leaderboard[] = $row;
            }
        }
        echo json_encode($leaderboard);
    }
}

// Handle POST request to register a new user or update score1
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'];

    if ($action === 'register') {
        $name = $data['name'];
        $score1 = $data['score1'] ?? 0;
        $uuid = uniqid();

        // Validate username length
       /* if (strlen($name) > 10) {
            echo json_encode(["error" => "Username must be 10 characters or less"]);
            http_response_code(400);
            exit();
        }*/

        $sql = "INSERT INTO geo_games_usa_leaderboard (uuid, name, score1) VALUES ('$uuid', '$name', $score1)";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "uuid" => $uuid]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
    } elseif ($action === 'update') {
        $uuid = $data['uuid'];
        $newscore1 = $data['score1'];

        // Fetch the current score
        $sql = "SELECT score1 FROM geo_games_usa_leaderboard WHERE uuid = '$uuid'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $currentscore1 = $row['score1'];

            // Update the score only if the new score is better
            if ($newscore1 > $currentscore1) {
                $sql = "UPDATE geo_games_usa_leaderboard SET score1 = $newscore1 WHERE uuid = '$uuid'";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(["success" => true]);
                } else {
                    echo json_encode(["success" => false, "error" => $conn->error]);
                }
            } else {
                echo json_encode(["success" => false, "error" => "New score is not better than the current score"]);
            }
        } else {
            echo json_encode(["success" => false, "error" => "User not found"]);
        }
    }
}

$conn->close();
?>