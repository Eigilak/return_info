<?php

//Exit if accessed directly
if(!defined('ABSPATH')){
	return; 	
}

class WRM_Public{

	protected static $instance = null;

	public function __construct(){
		add_action('wp_enqueue_scripts',array($this,'enqueue_scripts'));
		/*Brug shortcode til at få returform*/
		add_shortcode('wrm_shortcode',array($this,'get_return_form'));
		add_action('init',array($this, 'load_ajax_method'));
	}

	//Get class instance
	public static function get_instance(){
		if(self::$instance === null){
			self::$instance = new self();
		}	
		return self::$instance; 
	}

	//Inline styles from cart popup settings


	//enqueue stylesheets & scripts
	public function enqueue_scripts(){

		wp_enqueue_style('wrm-style',WRM_URL.'/assets/scss/mainStyle.css',null,WRM_VERSION);
		wp_enqueue_script('vue',WRM_URL.'/assets/js/frameworks/vue.js','',WRM_VERSION,false);
		wp_enqueue_script('vue',WRM_URL.'/assets/js/frameworks/axios.js','',WRM_VERSION,true);
		wp_enqueue_script('vueForms',WRM_URL.'/assets/js/frameworks/vue_forms.js','',WRM_VERSION,true);
        wp_enqueue_script('wrm-js',WRM_URL.'/assets/js/wrm.js','',WRM_VERSION,true);

	}
	//Get popup markup
	public function get_return_form(){
		wc_get_template('return_order_template.php','','',WRM_PATH.'/templates/');
	}

	function load_ajax_method(){
        if ( !is_user_logged_in() ){
            add_action( 'wp_ajax_nopriv_get_customer_by_id_and_email', array( &$this, 'get_customer_by_id_and_email' ) );
        } else{
            add_action( 'wp_ajax_get_customer_by_id_and_email',        array( &$this, 'get_customer_by_id_and_email' ) );
        }
    }

    function get_customer_by_id_and_email(){

	    return 'hejsa';
    }


}

?>