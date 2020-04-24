<?php
/**
 * Woocommerce return management
 *
 * Plugin Name: Woocommerce return management
 * Plugin URI:  https://wordpress.org/plugins/woocommerce-return-mangement/
 * Description: Enables the WordPress classic editor and the old-style Edit Post screen with TinyMCE, Meta Boxes, etc. Supports the older plugins that extend this screen.
 * Version:     0.1b
 * Author:      WordPress Contributors
 * Author URI:  https://github.com/eigilak/
 * License:     GPLv2 or later
 * License URI: http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * Text Domain: wrm
 * Domain Path: /languages
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU
 * General Public License version 2, as published by the Free Software Foundation. You may NOT assume
 * that you can use any other version of the GPL.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */


if ( ! defined( 'ABSPATH' ) ) {
    die( 'Invalid request.' );
}

if(!class_exists('Woocommerce_return_management'));
class Woocommerce_return_management{
    private static $settings;

    private function __construct(){}

    public static function init_actions(){
        register_activation_hook( __FILE__, array( __CLASS__, 'activate' ) );
        register_uninstall_hook( __FILE__, array( __CLASS__, 'uninstall' ) );
    }

}
