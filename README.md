
# PHP-Sandbox
Modern React PHP Sandbox.

## Requirements
 - LAMP Stack
 - PHP 5.4 and above

## Recommendation
Install this software onto a virtual machine. There may be methods of circumventing the sandboxing. This software comes without liability or warranty, any data loss is on you.

## Installation
 1. Clone the repository into your public host.
 2. Create a new MySQL database.
 3. Run `php install.php` in the root of PHP-Sandbox/.

## Contributing
 1. Fork this repository.
 2. Follow "Installation" steps.
 3. Use `npm run dev` to start browser-sync and allow for simple modifications to the user interface. PHP requests by default are proxied to [PHP Sandbox](https://php-sandbox.ml/). This can be modified in `interface/webpack.dev.js`
