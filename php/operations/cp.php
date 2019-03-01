<?php
  require('operation.php');

  function recurse_copy($src,$dst) {
      $dir = opendir($src);
      @mkdir($dst);
      while(false !== ( $file = readdir($dir)) ) {
          if (( $file != '.' ) && ( $file != '..' )) {
              if ( is_dir($src . '/' . $file) ) {
                  recurse_copy($src . '/' . $file,$dst . '/' . $file);
              }
              else {
                  copy($src . '/' . $file,$dst . '/' . $file);
              }
          }
      }
      closedir($dir);
  }

  if (!file_name_valid($basename))
    return error('Invalid file name.');

  if (!isset($_GET['newPath']))
    return error('Invalid value.');

  $new_basename = basename($_GET['newPath']);
  $new_path = validate($_GET['newPath'], true);
  if (!$new_path)
    return error('New path exiting sandbox.');

  if (!file_name_valid($new_basename))
    return error('Invalid new file name.');

  if (is_dir($path))
    recurse_copy($path, $new_path);
  else if (copy($path, $new_path) === false)
    return error('Copying file failed');

  success();
