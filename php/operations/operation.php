<?php
  require('../functions.php');

  $root = dirname(dirname(__DIR__));
  if (isset($_GET['newPath']))
    $_GET['newPath'] = trim($_GET['newPath']);

  function validate($relative_path) {
    global $root;

    $sandbox = $_SESSION['name'];

    $sandbox_path = "$root/sandboxes/" . strtolower($sandbox);
    $path = "$sandbox_path/$relative_path";

    $test_path = realpath(!is_dir($path) ? dirname($path) : $path);
    if ((strlen($test_path) != 0 && strpos($test_path, $sandbox_path) !== 0) || !$test_path)
      return false;

    return $path;
  }

  function file_name_valid($name) {
    $fileRegex = '/^([a-zA-Z0-9\s_\\.\-\(\)\[\]:])+$/';

    return preg_match($fileRegex, $name);
  }

  if (!isset($_GET['path']) && !isset($relative_path))
    exit(error('Path required.'));

  if (isset($_GET['path']))
    $relative_path = trim($_GET['path']);

  session_start();
  if (!isset($_SESSION['name']))
    exit(error('No sandbox.'));

  $sandbox = $_SESSION['name'];

  $sandbox_path = "$root/sandboxes/" . strtolower($sandbox);
  $path = "$sandbox_path/$relative_path";
  $basename = basename($path);

  $test_path = realpath(!is_dir($path) ? dirname($path) : $path);
  if ((strlen($test_path) != 0 && strpos($test_path, $sandbox_path) !== 0) || !$test_path)
    exit(error('Exiting sandbox.'));
