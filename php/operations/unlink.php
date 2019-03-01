<?php
  require('operation.php');

  function rrmdir($path) {
       // Open the source directory to read in files
          $i = new DirectoryIterator($path);
          foreach($i as $f) {
              if($f->isFile()) {
                  unlink($f->getRealPath());
              } else if(!$f->isDot() && $f->isDir()) {
                  rrmdir($f->getRealPath());
              }
          }
          return rmdir($path);
  }

  if (!file_name_valid($basename))
    return error('Invalid file name.');

  if (strlen($path) < 2)
    return error("NOPE!");

  if (is_dir($path)) {
    if (rrmdir($path) === false)
      return error('Failed to unlink dir.');
  } else if (unlink($path) === false)
    return error('Failed to unlink.');

  success();
