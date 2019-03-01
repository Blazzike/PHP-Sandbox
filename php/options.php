<?php
  $phpsb_option = (object) [];
  
  // Please do not touch this option.
  $phpsb_option->config_version = 1;

  // MySQL database login information.
  $phpsb_option->db = (object) [];
  $phpsb_option->db->host = '';
  $phpsb_option->db->name = '';
  $phpsb_option->db->user = '';
  $phpsb_option->db->passwd = '';
  
  // Functions.
  $phpsb_option->function_whitelist = false;
  $phpsb_option->function_list = [
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
  $phpsb_option->variable_whitelist = false;
  $phpsb_option->variable_list = [
    'option'
  ];
  
  // Globals.
  $phpsb_option->global_whitelist = false;
  $phpsb_option->global_list = [
    
  ];
  
  // Superglobals.
  $phpsb_option->superglobal_whitelist = true;
  $phpsb_option->superglobal_list = [
    'GET',
    'POST',
    'COOKIE',
    'FILES'
  ];
  
  // Constants.
  $phpsb_option->constants_whitelist = false;
  $phpsb_option->constants_list = [
    
  ];
  
  // Magic constants.
  $phpsb_option->magic_constants_whitelist = false;
  $phpsb_option->magic_constants_list = [
    
  ];
  
  // Namespaces.
  $phpsb_option->namespace_whitelist = false;
  $phpsb_option->namespace_list = [
    
  ];
  
  // Aliases.
  $phpsb_option->alias_whitelist = false;
  $phpsb_option->alias_list = [
    
  ];
  
  // Uses.
  $phpsb_option->use_whitelist = false;
  $phpsb_option->use_list = [
    
  ];
  
  // Classes.
  $phpsb_option->class_whitelist = false;
  $phpsb_option->class_list = [
    
  ];
  
  // Interfaces.
  $phpsb_option->interface_whitelist = false;
  $phpsb_option->interface_list = [
    
  ];
  
  // Traits.
  $phpsb_option->trait_whitelist = false;
  $phpsb_option->trait_list = [
    
  ];
  
  // Keywords.
  $phpsb_option->keyword_whitelist = false;
  $phpsb_option->keyword_list = [
    'eval',
    '__halt_compiler'
  ];
  
  // Operators.
  $phpsb_option->operator_whitelist = false;
  $phpsb_option->operator_list = [
    
  ];
  
  // Primitives.
  $phpsb_option->primitive_whitelist = false;
  $phpsb_option->primitive_list = [
    
  ];
  
  // Types.
  $phpsb_option->type_whitelist = false;
  $phpsb_option->type_list = [
    'mysqli',
    'reflectionextension'
  ];