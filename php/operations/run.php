<?php
  // $relative_path = $_COOKIE['_sandbox_path'];

  $_GET['path'] = str_replace('\\', '/', $_GET['path']);
  require('operation.php');
  require('../vendor/autoload.php');

  if (!file_exists($path))
    exit('File doesn\'t exist.');

  // setcookie('_sandbox_path', $relative_path);

  ob_start(function($buffer, $phase) {
    global $root;
    global $calls;

    if (++$calls == 1000)
      return 'Maximum output exceeded. Sorry!';
    else if ($calls > 1000)
      return '';

    $output = str_replace(
      array($root,
            '/php/vendor/corveda/php-sandbox/src/',
            '/php/vendor/nikic/php-parser/lib/',
            'PHPSandbox.php',
            ':/php/vendor'),
      array('',
            '',
            '',
            'PHPSandbox',
            ''),
      $buffer
    );

    return $output;
  }, 4096);

  $sandbox = new PHPSandbox\PHPSandbox;
  function allowed_name($is_whitelist, $name, $list) {
    $name = strtolower($name);
    
    foreach ($list as $item) {
      if (strtolower($item) === $name)
        return $is_whitelist;
    }
    
    return !$is_whitelist;
  }
  
  $sandbox->setFuncValidator(function($name) {
    global $phpsb_option;
    
    return allowed_name($phpsb_option->function_whitelist, $name, $phpsb_option->function_list);
  });
  
  $sandbox->setVarValidator(function($name) {
    global $phpsb_option;
    
    return allowed_name($phpsb_option->variable_whitelist, $name, $phpsb_option->variable_list);
  });
  
  $sandbox->setGlobalValidator(function($name) {
    global $phpsb_option;
    
    return allowed_name($phpsb_option->global_whitelist, $name, $phpsb_option->global_list);
  });
  
  $sandbox->setSuperglobalValidator(function($name) {
    global $phpsb_option;
    
    return allowed_name($phpsb_option->superglobal_whitelist, $name, $phpsb_option->superglobal_list);
  });
  
  $sandbox->setConstValidator(function($name) {
    global $phpsb_option;
    
    return allowed_name($phpsb_option->constants_whitelist, $name, $phpsb_option->constants_list);
  });
  
  $sandbox->setMagicConstValidator(function($name) {
    global $phpsb_option;
    
    return allowed_name($phpsb_option->magic_constants_whitelist, $name, $phpsb_option->magic_constants_list);
  });
  
  $sandbox->setNamespaceValidator(function($name) {
    global $phpsb_option;
    
    return allowed_name($phpsb_option->namespace_whitelist, $name, $phpsb_option->namespace_list);
  });
  
  $sandbox->setAliasValidator(function($name) {
    global $phpsb_option;
    
    return allowed_name($phpsb_option->alias_whitelist, $name, $phpsb_option->alias_list);
  });
  
  $sandbox->setUseValidator(function($name) {
    global $phpsb_option;
    
    return allowed_name($phpsb_option->use_whitelist, $name, $phpsb_option->use_list);
  });
  
  $sandbox->setClassValidator(function($name) {
    global $phpsb_option;
    
    return allowed_name($phpsb_option->class_whitelist, $name, $phpsb_option->class_list);
  });
  
  $sandbox->setInterfaceValidator(function($name) {
    global $phpsb_option;
    
    return allowed_name($phpsb_option->interface_whitelist, $name, $phpsb_option->interface_list);
  });
  
  $sandbox->setTraitValidator(function($name) {
    global $phpsb_option;
    
    return allowed_name($phpsb_option->trait_whitelist, $name, $phpsb_option->trait_list);
  });
  
  $sandbox->setKeywordValidator(function($name) {
    global $phpsb_option;
    
    return allowed_name($phpsb_option->keyword_whitelist, $name, $phpsb_option->keyword_list);
  });
  
  $sandbox->setOperatorValidator(function($name) {
    global $phpsb_option;
    
    return allowed_name($phpsb_option->operator_whitelist, $name, $phpsb_option->operator_list);
  });
  
  $sandbox->setPrimitiveValidator(function($name) {
    global $phpsb_option;
    
    return allowed_name($phpsb_option->primitive_whitelist, $name, $phpsb_option->primitive_list);
  });
  
  $sandbox->setTypeValidator(function($name) {
    global $phpsb_option;
    
    if (!allowed_name($phpsb_option->type_whitelist, $name, $phpsb_option->type_list))
     exit("$name access is disallowed.");
  });

  $sandbox->setValidationErrorHandler(function(PHPSandbox\Error $error){
    if($error->getCode() == PHPSandbox\Error::PARSER_ERROR) {
      exit($error->getPrevious()->getMessage());
    }

    $code = $error->getCode();
    $node = $error->getNode();
    if ($code === 100)
      exit((isset($node->name) & isset($node->name->parts) ? $node->name->parts[0] : 'Something in use') . " has been disabled.");

    exit($error->getMessage());
  });

  $sandbox->defineMagicConst('FILE', function($sandbox) {
    return $sandbox->getExecutingFile();
  });

  $sandbox->setOption('allow_escaping', true);
  $sandbox->setOption('allow_functions', true);
  $sandbox->setOption('allow_classes', true);
  $sandbox->setOption('allow_casting', true);
  $sandbox->setOption('allow_aliases', true);
  $sandbox->setOption('allow_interfaces', true);
  $sandbox->setOption('allow_namespaces', true);
  $sandbox->setOption('allow_constants', true);
  $sandbox->setOption('allow_globals', true);
  $sandbox->allow_includes = true;
  $sandbox->setOption('overwrite_superglobals', false);

  ini_set('display_errors', 1);
  ini_set('open_basedir', "$sandbox_path:$root/php/vendor");
  ini_set('max_execution_time', 5);
  chdir(dirname($path));

  unset($_COOKIE['PHPSESSID']);
  unset($_COOKIE['_sandbox_path']);
  unset($_GET['path']);
  try {
    $sandbox->execute('<??>' . file_get_contents($path), false, $path);
  } catch (Exception $x) {
    $msg = $x->getMessage();
    if ($x->getCode() === 12)
      $msg = 'Shell execution disabled.';
    else
      echo $x->getCode();

    exit($msg);
  }
