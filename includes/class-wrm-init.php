<?php

if(!defined('ABSPATH'))
	return;


class woocommerce_return_manager_init{

	protected static $instance = null;

	//Get instance
	public static function get_instance(){
		if(self::$instance === null){
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function __construct(){
		//Front end
		include_once WRM_PATH.'/includes/class-wrm-public.php';
		WRM_Public::get_instance();

		//Core functions
		include_once WRM_PATH.'/includes/class-wrm-core.php';
		WRM_Core::get_instance();

		include_once WRM_PATH.'includes/class-wrm-db.php';
		WRM_databases::get_instance();
	}
}



?>
