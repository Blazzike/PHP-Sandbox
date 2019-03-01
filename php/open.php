<?php
  require('functions.php');

  function handleFailure() {
    sleep(3);

    error('Sandbox doesn\'t exist or login is incorrect.');
    exit();
  }

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

  if (!$row = $stmt->get_result()->fetch_assoc())
    handleFailure();

  if ($row['algo'] === 'SHA512') {
    if ($row['password'] !== hash('sha512', strtolower($name) . $password))
      handleFailure();
  } else if (!password_verify($password, $row['password']))
    handleFailure();

  $name = $row['name'];

  $stmt->close();

  $sandbox_directory = '../sandboxes/' . strtolower($name);
  if (!file_exists($sandbox_directory))
    return error('Sandbox is missing.');

  success(array('name' => $name,
                'tree' => resolveDirectory($sandbox_directory)));

  session_start();
  $_SESSION['name'] = $name;

  $time = time();
  $stmt = $connection->prepare('UPDATE `sandboxes` SET `last_login`=? WHERE `name`=?');
  $stmt->bind_param('is', $time, $name);

  $stmt->execute();
  $stmt->close();
