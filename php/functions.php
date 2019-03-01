<?php
  require('options.php');

  function error($msg, $response = 200) {
    http_response_code($response);
    header('Content-Type: application/json');

    print(json_encode([
      'success' => false,
      'error' => [
        'msg' => $msg
      ]
    ], isset($_GET["pretty"]) ? JSON_PRETTY_PRINT : null));
  }

  function success($body = []) {
    print(json_encode(array_merge(["success" => true], $body), isset($_GET["pretty"]) ? JSON_PRETTY_PRINT : null));
  }
  
  function connect() {
    global $phpsb_option;

    $connection = new mysqli($phpsb_option->db->host, $phpsb_option->db->user, $phpsb_option->db->passwd, $phpsb_option->db->name);

    $error = $connection->connect_error;
    if ($connection->connect_error) {
      die("Database connection failed: {$connection->connect_error}");
    }

    return $connection;
  }
  
  function resolveDirectory($path) {
    $contents = scandir($path, 1);

    array_splice($contents, count($contents) - 2);

    $response = [];
    foreach ($contents as $item) {
      $itemPath = "{$path}/{$item}";
      if (is_dir($itemPath))
        array_push($response, array('name' => $item,
                                    'type' => 'directory',
                                    'contents' => resolveDirectory($itemPath)));
      else
        array_push($response, array('name' => $item,
                                    'type' => 'file'));
    }

    return $response;
  }
