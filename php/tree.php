<?php
  require('functions.php');

  session_start();
  if (!isset($_SESSION['name']))
    return error('No sandbox.');

  $name = $_SESSION['name'];

  $sandbox_directory = '../sandboxes/' . strtolower($name);
  if (!file_exists($sandbox_directory))
    return error('Sandbox is missing.');

  success(['tree' => resolveDirectory($sandbox_directory)]);
