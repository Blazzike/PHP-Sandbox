<?php
  if (php_sapi_name() !== "cli")
    exit('Command line-only PHP file.');

  error_reporting(0);
  set_time_limit(0);
  ini_set('memory_limit', '1.5G');
  require('php/options.php');
  ignore_user_abort(true);
  
  function get_input($msg = '', $default = null) {
    do {
      echo isset($default) ? "$msg [$default]: " : "$msg: ";
      
      $response = trim(fgets(STDIN));
      if (strlen($response) < 1 && isset($default))
        return $default;
    } while (strlen($response) < 1);
    
    return $response;
  }
  
  $response = (function() {
    global $option;
    global $argv;
    
    $response = [
                  'errors' => [],
                  'warnings' => [],
                  'output' => ''
                ];

    // Page testing for requirements:
    // npm
    if (!`npm`) array_push($response['errors'], 'NodeJS\' NPM is required for installation.');

    // php 7+
    if (PHP_MAJOR_VERSION < 5 && PHP_MINOR_VERSION < 4) array_push($response['warnings'], 'PHP 5.4 and above recommended and may be required.');
    
    // required modules: mysqli, Phar, json, fileinfo
    $required_modules = ['mysqli', 'Phar', 'json', 'fileinfo'];
    foreach ($required_modules as $module)
      if (!extension_loaded($module))
        array_push($response['errors'], "Module {$module} required.");
    
    // write/read access
    $writables = ['.', 'php/options.php', 'index.html'];
    foreach ($writables as $writable)
      if (file_exists($writable) && !is_writable($writable)) array_push($response['errors'], "$writable must be writable.");

    if (sizeof($response['errors']) > 0)
      return $response;

    // Get command args.
    parse_str(implode('&', array_slice($argv, 1)), $args);
    
    // Database options.
    $option->db->host = isset($args['db-host']) ? $args['db-host'] : get_input('Database Hostname', 'localhost');
    $option->db->user = isset($args['db-user']) ? $args['db-user'] : get_input('Database Username');
    $option->db->passwd = get_input('Database Password');
    $option->db->name = isset($args['db-name']) ? $args['db-name'] : get_input('Database Name');
    
    $connection = new mysqli($option->db->host, $option->db->user, $option->db->passwd, $option->db->name);
    
    // Check connection.
    if ($connection->connect_error) {
      array_push($response['errors'], "Database connection failed: {$connection->connect_error}");
      
      return $response;
    }

    // Create sandboxes table.
    $connection->query("CREATE TABLE IF NOT EXISTS `sandboxes` (
      `name` varchar(15) NOT NULL,
      `password` varchar(128) NOT NULL,
      `algo` enum('BCRYPT') NOT NULL DEFAULT 'BCRYPT',
      `last_login` int(10) NOT NULL,
      `timestamp` int(10) NOT NULL,
      PRIMARY KEY (`name`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;");

    // Create directories.
    echo 'Creating required directories...' . PHP_EOL;
    
    $dir = 'sandboxes';
    if (!file_exists($dir))
      mkdir($dir);
    
    $dir = 'download';
    if (!file_exists($dir))
      mkdir($dir);

    // PHP install.
    chdir('php');
    
    // Download composer
    echo 'Downloading composer...' . PHP_EOL;
    if (!file_exists('composer.phar'))
      copy('http://getcomposer.org/composer.phar', 'composer.phar');
   
    // Run composer install
    echo 'Running composer install...' . PHP_EOL;
    require_once 'phar://composer.phar/src/bootstrap.php';

    putenv('COMPOSER_HOME=' . getcwd());
    //putenv("OSTYPE=OS400");
    $app = new \Composer\Console\Application();

    $factory = new \Composer\Factory();
    $output = $factory->createOutput();

    $input = new \Symfony\Component\Console\Input\ArrayInput(array(
      'command' => 'install',
    ));
    
    $input->setInteractive(false);
    $app->doRun($input, $output);
    if (file_exists('.htaccess'))
      unlink('.htaccess');
    
    // Interface install.
    chdir('../interface');
    
    // Run npm run build
    echo 'Downloading from NPM (this may take a while)...' . PHP_EOL;
    `npm install`;
    
    echo 'Compiling interface (this will take a while)...' . PHP_EOL;
    `npm run build`;

    // "Set options".
    chdir('../');
    file_put_contents('php/options.php', <<<EOT
<?php
  \$phpsb_option = (object) [];
  
  // Please do not touch this option.
  \$phpsb_option->config_version = 1;

  // MySQL database login information.
  \$phpsb_option->db = (object) [];
  \$phpsb_option->db->host = '{$option->db->host}';
  \$phpsb_option->db->name = '{$option->db->name}';
  \$phpsb_option->db->user = '{$option->db->user}';
  \$phpsb_option->db->passwd = '{$option->db->passwd}';
  
  // Functions.
  \$phpsb_option->function_whitelist = false;
  \$phpsb_option->function_list = [
    'passthru',
    'shell_exec',
    'system',
    'pcntl_exec',
    'proc_open',
    'popen',
    'create_function',
    'curl_exec',
    'curl_multi_exec',
    'parse_ini_file',
    'show_source',
    'apache_child_terminate',
    'apache_setenv',
    'define_syslog_variables',
    'escapeshellarg',
    'escapeshellcmd',
    'exec',
    'fp',
    'fput',
    'highlight_file',
    'ini_alter',
    'ini_get',
    'get_loaded_extensions',
    'ini_get_all',
    'ini_restore',
    'assert',
    'assert_options',
    'inject_code',
    'mysql_pconnect',
    'openlog',
    'php_uname',
    'phpAds_remoteInfo',
    'phpAds_XmlRpc',
    'phpAds_xmlrpcDecode',
    'phpAds_xmlrpcEncode',
    'proc_close',
    'proc_get_status',
    'proc_nice',
    'proc_terminate',
    'syslog',
    'xmlrpc_entity_decode',
    'phpinfo',
    'getenv',
    'get_current_user',
    'proc_get_status',
    'get_cfg_var',
    'disk_free_space',
    'disk_total_space',
    'diskfreespace',
    'getlastmo',
    'getmygid',
    'getmyinode',
    'getmypid',
    'getmyuid',
    'ini_set',
    'set_time_limit',
    'ignore_user_abort',
    'sleep',
    'usleep',
    'mail',
    'get_defined_functions',
    'connect',
    'ip',
    'resolveDirectory'
  ];
  
  // Variables.
  \$phpsb_option->variable_whitelist = false;
  \$phpsb_option->variable_list = [
    'option'
  ];
  
  // Globals.
  \$phpsb_option->global_whitelist = false;
  \$phpsb_option->global_list = [
    
  ];
  
  // Superglobals.
  \$phpsb_option->superglobal_whitelist = true;
  \$phpsb_option->superglobal_list = [
    'GET',
    'POST',
    'COOKIE',
    'FILES'
  ];
  
  // Constants.
  \$phpsb_option->constants_whitelist = false;
  \$phpsb_option->constants_list = [
    
  ];
  
  // Magic constants.
  \$phpsb_option->magic_constants_whitelist = false;
  \$phpsb_option->magic_constants_list = [
    
  ];
  
  // Namespaces.
  \$phpsb_option->namespace_whitelist = false;
  \$phpsb_option->namespace_list = [
    
  ];
  
  // Aliases.
  \$phpsb_option->alias_whitelist = false;
  \$phpsb_option->alias_list = [
    
  ];
  
  // Uses.
  \$phpsb_option->use_whitelist = false;
  \$phpsb_option->use_list = [
    
  ];
  
  // Classes.
  \$phpsb_option->class_whitelist = false;
  \$phpsb_option->class_list = [
    
  ];
  
  // Interfaces.
  \$phpsb_option->interface_whitelist = false;
  \$phpsb_option->interface_list = [
    
  ];
  
  // Traits.
  \$phpsb_option->trait_whitelist = false;
  \$phpsb_option->trait_list = [
    
  ];
  
  // Keywords.
  \$phpsb_option->keyword_whitelist = false;
  \$phpsb_option->keyword_list = [
    'eval',
    '__halt_compiler'
  ];
  
  // Operators.
  \$phpsb_option->operator_whitelist = false;
  \$phpsb_option->operator_list = [
    
  ];
  
  // Primitives.
  \$phpsb_option->primitive_whitelist = false;
  \$phpsb_option->primitive_list = [
    
  ];
  
  // Types.
  \$phpsb_option->type_whitelist = false;
  \$phpsb_option->type_list = [
    'mysqli',
    'reflectionextension'
  ];
EOT
);
    
    // Success.
    echo <<<EOT
Minimal install completed.

Please disable the following extensions:
 - pdo_mysql
 - posix
 - sockets
 - wddx

EOT;

    return $response;
  })();
  
  foreach ($response['errors'] as $error)
    echo "Error: $error" . PHP_EOL;
  
  foreach ($response['warnings'] as $warning)
    echo "Warning: $warning" . PHP_EOL;
?>