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

		/**/
		add_action('wp_enqueue_scripts',array($this,'enqueue_scripts'),40);
	}

	//enqueue stylesheets & scripts
	public function enqueue_scripts(){
		/*scss*/
		wp_enqueue_style('wrm-style',WRM_URL.'/assets/scss/mainStyle.css',null,WRM_VERSION);

		wp_enqueue_script( 'jquery' );
		/*Scripts*/
		/*development*/
		wp_enqueue_script('vue',WRM_URL.'/assets/js/frameworks/vue.js','',WRM_VERSION,false);
		/*production*/
/*		wp_enqueue_script('vue',WRM_URL.'/assets/js/frameworks/vue_production.min.js','',WRM_VERSION,false);*/


		wp_enqueue_script('axios',WRM_URL.'/assets/js/frameworks/axios.js','',WRM_VERSION,true);
		wp_enqueue_script('vueforms',WRM_URL.'/assets/js/frameworks/vue_forms.js','',WRM_VERSION,true);

		/*Hvis selectWoo ikke er enqued kør det*/
		if(wp_script_is('selectWoo')){
			wp_enqueue_script('selectWoo',WRM_URL.'/assets/js/frameworks/selectWoo.min.js','',WRM_VERSION,true);
		}


		wp_enqueue_script('wrm-js',WRM_URL.'/assets/js/wrm.js','',WRM_VERSION,true);
		wp_script_add_data( 'wrm-js', 'async', true );

		/*make ajax object available in JS*/
		wp_localize_script( 'wrm-js', 'ajax_object',
			array( 'ajax_url' => admin_url( 'admin-ajax.php' )));
	}
}



?>
