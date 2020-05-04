<?php

//Exit if accessed directly
if(!defined('ABSPATH')){
	return;
}

class WRM_Public{

	protected static $instance = null;

	public function __construct(){
		/*Brug shortcode til at få returform*/
		add_shortcode('wrm_shortcode',array($this,'get_return_form'));
		add_action('wp_enqueue_scripts',array($this,'enqueue_scripts'),40);
		add_action('init',array($this, 'load_ajax_method'));
		add_action('wp_ajax_nopriv_create_return_request', array($this,'create_return_request'));
		add_action('wp_ajax_create_return_request', array($this,'create_return_request'));
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
		/*scss*/
		wp_enqueue_style('wrm-style',WRM_URL.'/assets/scss/mainStyle.css',null,WRM_VERSION);

		wp_enqueue_script( 'jquery' );
		/*Scripts*/
		wp_enqueue_script('vue',WRM_URL.'/assets/js/frameworks/vue.js','',WRM_VERSION,false);
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
	/*Get template for the return form*/
	function get_return_form(){
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

		$order_id = $_REQUEST['order_id'];
		$customer_email = $_REQUEST['customer_email'];

		/*If fields empty die */
		if(empty($order_id) || empty($customer_email)){
			wp_send_json_error('felterne er påkrævet','400');
			wp_die( 'Felterne er påkrævet', 400 );
		}

		/*get order by id if not send error */
		try{
			$order = new WC_Order($order_id);
		} catch (Exception $e){
			$error_msg = __('The order id cant be found','wrm');
			wp_die($error_msg) ;
		}

		if($customer_email != $order->get_billing_email()){
			$error_msg = __('The email doesn\'t match the order id','wrm');
			wp_die($error_msg,'400');
		}

		/*Mit über loop hvor jeg kigger på produkterne kunde har købt*/
		foreach ($order->get_items() as $item_id => $item){
			/*Vi henter produkt*/
			$product = $item->get_product();
			/*Vi resetter loop for attributter*/
			$attributeArray=[];
			/*Vi henter produktets attributter*/
			$attributes = $product->get_attributes();

			/*For hver attribut loop*/
			foreach ( $attributes as $attribute ) {
				/*Nulstiller arrau*/
				$variationArray=[];
				/*Henter attributnavn fra attributarray*/
				$taxonomy = $attribute['name'];

				/*Hvilket variationer har produktet*/
				$variations = $product->get_available_variations();
				foreach ($variations as $variation){
					/*Vi henter variationen ud fra attribut*/
					$meta = get_post_meta($variation['variation_id'], 'attribute_' . $taxonomy, true);
					$variationsVariable = get_term_by('slug', $meta, $taxonomy);
					$name = $variationsVariable->name;;

					/*Sætter det det i variationsarray*/
					$variationArray[]=$name;
					$uniqieVariation =array_unique($variationArray);
				}
				$attributeArray[$taxonomy]=$uniqieVariation;
			}
			$order_products_array[] =array(
				'product_id' 	 => $item->get_product_id(),
				'product_name'	 => $item->get_name(),
				'attributes'	 => $attributeArray
			);
		}
		wp_send_json($order_products_array);
		die();
    }


    function create_return_request(){

		$JSON_response = $_REQUEST['returned_products'];
		$array_reponse = json_decode(stripslashes($JSON_response));





	}
}

?>
