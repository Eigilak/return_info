<?php
/**
 * Plugin Name:       Woocommerce return manager
 * Plugin URI:        eigilak.dk
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.0.0
 * Author:            Eigilak
 * Author URI:        EigilAK
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wrm
 * Domain Path:       /languages
 */


//Exit if accessed directly
if(!defined('ABSPATH')){
	return; 	
}

$WRM_version = 1.4;

define("WRM_PATH", plugin_dir_path(__FILE__));
define("WRM_URL", plugins_url('',__FILE__));
define("WRM_VERSION",1.4);


//Admin Settings
include_once WRM_PATH.'/admin/wrm-admin.php';

//Init plugin
function init_WRM(){
	global $WRM_atcem_value;
	
	//If mobile
	if(!$WRM_atcem_value){
		if(wp_is_mobile()){
			return;
		}
	}
	require_once WRM_PATH.'/includes/class-wrm-init.php';

	//Start the plugin
	woocommerce_return_manager_init::get_instance();
}



add_action('plugins_loaded', 'init_WRM');
