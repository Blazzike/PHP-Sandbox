<?php
  if (isset($_GET['name']) && !empty($name = htmlspecialchars($_GET['name'])))
    exit("Hello {$name}!");
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Hello Example</title>
  </head>
  <body>
    <form method="get">
      <label for="name">What's your name?</label>
      <input name="name" placeholder="Response" />
      <button>Submit</button>
    </form>
  </body>
</html>
