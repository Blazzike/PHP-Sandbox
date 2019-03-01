<?php
  require('operation.php');

  function download_file($path, $name) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="'.$name.'"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($path));
    readfile($path);
  }

  if (!file_name_valid($basename))
    return error('Invalid file name.');

  if (($content = file_get_contents($path)) === FALSE)
    return error('File doesn\'t exist.');

  if (is_file($path)) {
    download_file($path, $basename);

    return;
  }

  $time = time();
  $zipFile = "../../download/$time.zip";
  $zip = new ZipArchive();

  if ($zip->open($zipFile, ZIPARCHIVE::CREATE | ZIPARCHIVE::OVERWRITE) !== true)
    return error('Archive creation failed.');

  /* Add all files */
  if (strlen($_GET['path']) === 0)
    $path = substr($path, 0, strlen($path) - 1);

  $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path), RecursiveIteratorIterator::LEAVES_ONLY);

  foreach ($files as $name => $file) {
    if (!$file->isDir()) {
      $filePath = $file->getRealPath();
      $relativePath = substr($filePath, strlen($path) + 1);

      $zip->addFile($filePath, $relativePath);
    }
  }
  /* End stolen code */

  if ($zip->status !== ZIPARCHIVE::ER_OK)
    return error('Failed to write files to archive.');

  $zip->close();

  download_file($zipFile, $basename . '.zip');
  unlink($zipFile);
