<?php
require 'config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['uuid'])) {
        $uuid = $_GET['uuid'];

        if (isset($_GET['action']) && $_GET['action'] === 'get_user') {
            $sql = "SELECT * FROM geo_games_usa_leaderboard WHERE uuid = '$uuid'";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $userData = $result->fetch_assoc();
                echo json_encode(["success" => true, "data" => $userData]);
            } else {
                echo json_encode(["success" => false, "error" => "No user found"]);
            }
        } else {
            $sql = "SELECT score1 FROM geo_games_usa_leaderboard WHERE uuid = '$uuid'";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                echo json_encode(["score1" => $row['score1']]);
            } else {
                echo json_encode(["error" => "User not found"]);
            }
        }
    } else {
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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'];
    $game = $data['game'];

    if ($action === 'register') {
        $name = $data['name'];
        $avatar = $data['avatar'];
        $score1 = $data['score'] ?? 0;
        $uuid = uniqid();

        // Validate username length
        /* if (strlen($name) > 10) {
             echo json_encode(["error" => "Username must be 10 characters or less"]);
             http_response_code(400);
             exit();
         }*/

        $sql = "INSERT INTO geo_games_usa_leaderboard (uuid, name, avatar, score1) VALUES ('$uuid', '$name', '$avatar', $score1)";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "uuid" => $uuid]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
    } elseif ($action === 'update') {
        $uuid = $data['uuid'];
        $score = $data['score'];

        if ($game === 'game1') {
            $sql = "SELECT score1 FROM geo_games_usa_leaderboard WHERE uuid = '$uuid'";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $currentscore = $row['score1'];

                if ($score > $currentscore) {
                    $sql = "UPDATE geo_games_usa_leaderboard SET score1 = $score WHERE uuid = '$uuid'";
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
        } elseif ($game === 'game2') {
            $sql = "SELECT score2 FROM geo_games_usa_leaderboard WHERE uuid = '$uuid'";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $currentscore = $row['score2'];

                if ($score > $currentscore) {
                    $sql = "UPDATE geo_games_usa_leaderboard SET score2 = $score WHERE uuid = '$uuid'";
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
        } elseif ($game === 'game3') {
            $sql = "UPDATE leaderboard SET score = score + $score WHERE uuid = '$uuid'";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["success" => false, "error" => $conn->error]);
            }
        }
    }
}

$conn->close();
?>