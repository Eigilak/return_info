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
		add_action('wp_enqueue_scripts',array($this,'enqueue_scripts'),99);
	}

	//enqueue stylesheets & scripts
	public function enqueue_scripts(){
		global $post;
		/*If short code is present --> load scripts*/
		if( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'wrm_shortcode') ) {
			/*scss*/
			wp_enqueue_style('wrm-style',WRM_URL.'/assets/scss/mainStyle.css',null,WRM_VERSION);
			wp_enqueue_script( 'jquery' );
			/*Scripts*/
			/*development*/
			wp_enqueue_script('vue',WRM_URL.'/assets/js/frameworks/vue.js','',WRM_VERSION,false);
			/*production*/
			/*		wp_enqueue_script('vue',WRM_URL.'/assets/js/frameworks/vue_production.min.js','',WRM_VERSION,false);*/
			wp_enqueue_script('vueforms',WRM_URL.'/assets/js/frameworks/vue_forms.js','',WRM_VERSION,true);

			/*Hvis selectWoo ikke er enqued kør det*/
			if(wp_script_is('selectWoo')){
				wp_enqueue_script('selectWoo',WRM_URL.'/assets/js/frameworks/selectWoo.min.js','',WRM_VERSION,true);
			}
			wp_enqueue_script('wrm-js',WRM_URL.'/assets/js/wrm.js','',WRM_VERSION,true);

			/*make pdf variables available in js*/
			wp_localize_script( 'wrm-js', 'local',
				array(
					'ajax_url' 			=> 	admin_url( 'admin-ajax.php' ),
					'site_name' 		=> 	get_bloginfo( 'name' ),
					'pdf_name'			=>	__('Follow note for','wrm'),
					'package_message' 	=> 	__('This note should be placed in the package so we can carry out your order','wrm'),
					'order_number_txt' 	=>	__('Order number:','wrm'),
					'products_txt'		=>	__('Returned products','wrm'),
					'product_name_txt'	=>	__('Product name','wrm'),
					'no_products_txt'	=>	__('No products selected','wrm'),
					'name_txt'			=>	__('Customer','wrm'),
					'fc_nonce'			=> wp_create_nonce()
				));

		}

	}
}



?>
