<?php
/**
 * Plugin Name:       Woocommerce return manager
 * Plugin URI:        eigilak.dk
 * Description:       Use [wrm_shortcode] to setup the plugin
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
define( 'WRM__FILE__', __FILE__ );



//Admin Settings
include_once WRM_PATH.'/admin/class-wrm-admin.php';

//Init plugin
function init_WRM(){

	global $WRM_atcem_value;
	require_once WRM_PATH.'/includes/class-wrm-init.php';
	//Start the plugin
	woocommerce_return_manager_init::get_instance();
}

register_activation_hook( __FILE__,function (){
    global $wpdb;
    $table_name = $wpdb->prefix .'woocommerce_return_manager_order';
    $charset_collate = $wpdb->get_charset_collate();
    $sql = "CREATE TABLE $table_name (
			id bigint NOT NULL AUTO_INCREMENT,
			order_id integer not NULL,
			name tinytext NOT NULL,
			email tinytext NOT NULL,
			comment MEDIUMTEXT,
			amount_products_returned int,
			created_at timestamp DEFAULT current_timestamp,
			PRIMARY KEY  (id)
		) $charset_collate";
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
});

register_activation_hook( __FILE__,function (){
    global $wpdb;
    $table_name = $wpdb->prefix.'woocommerce_return_manager_product';
    $referenceTable = $wpdb->prefix.'woocommerce_return_manager_order';
    $charset_collate = $wpdb->get_charset_collate();
    $sql = "CREATE TABLE $table_name (
			id bigint NOT NULL AUTO_INCREMENT,
			return_id bigint not NULL,
			product_name tinytext NOT NULL,
			product_id integer NOT NULL,
			chosen_attribute1 tinytext,
			chosen_attribute2 tinytext,
			return_action tinytext NOT NULL,
			return_type tinytext NOT NULL,
			created_at timestamp DEFAULT current_timestamp,
			PRIMARY KEY  (id),
			FOREIGN key (return_id) references $referenceTable(id)
 		) $charset_collate";
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
});


register_activation_hook( __FILE__,function (){
    global $wpdb;
    $table_name = $wpdb->prefix.'woocommerce_return_manager_settings';
    $charset_collate = $wpdb->get_charset_collate();
    $sql = "CREATE TABLE $table_name (
			id bigint NOT NULL AUTO_INCREMENT,
			pdf_image tinytext,
			enable_recaptcha boolean,
	
			return_id bigint not NULL,
			product_name tinytext NOT NULL,
			product_id integer NOT NULL,
			chosen_attribute1 tinytext,
			chosen_attribute2 tinytext,
			return_action tinytext NOT NULL,
			return_type tinytext NOT NULL,
			created_at timestamp DEFAULT current_timestamp,
			PRIMARY KEY  (id),
			FOREIGN key (return_id) references $referenceTable(id)
 		) $charset_collate";
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
});

add_filter( 'woocommerce_hide_invisible_variations', '__return_false', 10);





add_action('plugins_loaded', 'init_WRM');
