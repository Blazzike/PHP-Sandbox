<?php
  require('operation.php');

  if (!file_name_valid($basename))
    return error('Invalid file name.');

  if (!isset($_POST['value']) || strlen($_POST['value']) > 25000)
    return error('Invalid value, file too large?');

  $value = $_POST['value'];

  if (file_put_contents($path, $value) === false)
    return error('Failed to save.');

  success();
