<?php

if(!defined('ABSPATH')){
	return;
}

class WRM_Core{

	protected static $instance = null;

	public $action = null;

	//Get instance
	public static function get_instance(){
		if(self::$instance === null){
			self::$instance = new self();
		}
		return self::$instance;
	}


	public function __construct(){
		register_activation_hook( __FILE__, 'init_database' );

	}

	public function init_database(){
		global $wpdb;

		$table_name = 'liveshoutbox';

		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE $table_name (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
		name tinytext NOT NULL,
		text text NOT NULL,
		url varchar(55) DEFAULT '' NOT NULL,
		PRIMARY KEY  (id)
	) $charset_collate;";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql );

	}
}
?>
