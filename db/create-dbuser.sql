-- Uuden käyttäjän tekeminen
CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON `MyHealth`.* TO 'user'@'localhost';
FLUSH PRIVILEGES;
