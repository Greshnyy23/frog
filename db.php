<?php
$servername = "sql102.infinityfree.com"; // Укажите ваш сервер
$username = "if0_38269871"; // Ваше имя пользователя
$password = "Greshnyy23 "; // Ваш пароль
$dbname = "if0_38269871_XXX"; // Имя вашей базы данных

// Создание подключения
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверка соединения
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?>