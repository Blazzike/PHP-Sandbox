<?php
  require('operation.php');

  if (!file_name_valid($basename))
    return error('Invalid file name.');

  if (!isset($_GET['newPath']))
    return error('Invalid value.');

  $new_basename = basename($_GET['newPath']);
  $new_path = validate($_GET['newPath']);
  if (!$new_path)
    return error('New path exiting sandbox.');

  if (!file_name_valid($new_basename))
    return error('Invalid new file name.');

  // $path = "$path/" . (is_dir("$path/$basename") ? '' : $basename);
  // $new_path = "$new_path/" . (is_dir("$new_path/$new_basename") ? '' : $new_basename);
  if (rename($path, $new_path) === false)
    return error('Failed to move/rename.');

  success();
