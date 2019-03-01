<?php
  require('operation.php');

  if (!file_name_valid($basename))
    return error('Invalid file name.');

  if (sizeof($_FILES) == 0) return error("No uploaded file provided.");
  if (is_null($_FILES['file'])) return error("File expected not found.");

  $file = $_FILES['file'];
  if ($file['size'] > 5000000 || $file['size'] === 0) return error("File larger than 5MBs.");

  $type = strtolower($file['type']);
  if ($type !== 'application/x-sqlite3' && $type !== 'application/octet-stream' && strpos($type, 'text/') !== 0) return error("Uploaded file type not supported. {$type}");

  // Move.
  if (move_uploaded_file($file['tmp_name'], $path))
    success(['tree' => resolveDirectory($sandbox_path)]);
  else
    error($_FILES['file']['error']['msg']);
