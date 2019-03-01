<?php
  require('operation.php');

  if (!file_name_valid($basename))
    return error('Invalid file name.');

  if (mkdir($path) === false)
    return error('Failed to create directory.');

  success();
