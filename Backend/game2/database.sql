CREATE DATABASE geo_games_usa;

USE geo_games_usa;

CREATE TABLE IF NOT EXISTS geo_games_usa_leaderboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    score1 INT NOT NULL,
    score2 INT NOT NULL,
    score3 INT NOT NULL
);