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
	}

	public function error_404($msg){

		echo wp_json_encode(['errors'=>$msg]);

		status_header(400);

		die();
	}


}
?>
