<?php
  require('functions.php');

  if (!isset($_POST['password']) || !isset($_POST['name']))
    return error('Missing data.');

  $name = $_POST['name'];
  $password = $_POST['password'];

  if (strlen($password) < 8 || strlen($password) > 256)
    return error('Invalid password.');

  if (strlen($name) < 3 || strlen($name) > 15 || !preg_match('/^[A-Za-z0-9]+(?:[\' _-][A-Za-z0-9]+)*$/', $name))
    return error('Invalid name.');

  $connection = connect();

  $stmt = $connection->prepare('SELECT * FROM `sandboxes` WHERE `name`=?');
  $stmt->bind_param('s', $name);

  if (!$stmt->execute())
    return error('Something went wrong.');

  if ($stmt->get_result()->num_rows)
    return error('Name taken');

  $stmt->close();

  $sandbox_directory = '../sandboxes/' . strtolower($name);
  if (!file_exists($sandbox_directory)) {
    mkdir($sandbox_directory);
    copy('../resources/example.php', "{$sandbox_directory}/index.php");
  }

  $time = time();

  $password = password_hash($password, PASSWORD_DEFAULT);
  $stmt = $connection->prepare('INSERT INTO `sandboxes`(`name`, `password`, `last_login`, `timestamp`) VALUES (?, ?, ?, ?)');
  $stmt->bind_param('ssii', $name, $password, $time, $time);

  session_start();
  $_SESSION['name'] = $name;

  if ($stmt->execute())
    success(array('name'=> $name,
                  'tree' => array(array('name' => 'index.php',
                                        'type' => 'file'))));
  else
    error('Something went wrong.');

  $stmt->close();
