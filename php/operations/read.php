<?php
  require('operation.php');

  if (!file_name_valid($basename))
    return error('Invalid file name.');

  if (!file_exists($path))
    return error('File doesn\'t exist.');

  $mime = finfo_file(finfo_open(FILEINFO_MIME), $path);
  if (substr($mime, 0, strlen('text')) !== 'text'
  && substr($mime, 0, strlen('inode/x-empty')) !== 'inode/x-empty'
  && substr(explode(' ', $mime)[1], 0, strlen('charset')) !== 'charset')
    return error('File isn\'t a text file');

  $content = file_get_contents($path);

  success(["content" => $content]);
