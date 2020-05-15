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

	/*Get template for the return form*/
	function get_return_form(){
		ob_start();
			wc_get_template('return_order_template.php','','',WRM_PATH.'/templates/');
		return ob_get_clean();
	}

	function load_ajax_method(){
        if ( !is_user_logged_in() ){
            add_action( 'wp_ajax_nopriv_get_customer_by_id_and_email', array( &$this, 'get_customer_by_id_and_email' ) );
        } else{
            add_action( 'wp_ajax_get_customer_by_id_and_email',        array( &$this, 'get_customer_by_id_and_email' ) );
        }
    }

    public function error_404($msg){

		echo wp_json_encode(['errors'=>$msg]);

		status_header(400);

		die();
	}

    function get_customer_by_id_and_email(){

		$order_id = _sanitize_text_fields($_REQUEST['order_id']);
		$customer_email = sanitize_email($_REQUEST['customer_email']);

		/*If fields empty die */
		if(empty($order_id) || empty($customer_email)){
			$this->error_404(__('The field is requirerd','wrm'));
		}

		/*get order by id if not send error */
		try{
			$order = new WC_Order($order_id);
		} catch (Exception $e){
			$this->error_404(__('Sorry, we cannot find an order that matches that email','wrm'));
		}
		if($customer_email != $order->get_billing_email()){
			$this->error_404(__('Sorry, we cannot find an order that matches that email','wrm'));
		}



		/*Mit über loop hvor jeg kigger på produkterne kunde har købt*/
		foreach ($order->get_items() as $item_id => $item){
			/*Vi henter produkt*/
			$product_id = $item->get_product_id();
			$product = wc_get_product( $product_id );
			/*Vi resetter loop for attributter*/
			$attributeArray=[];
			/*Vi henter produktets attributter*/
			$attributes = $product->get_attributes();


			if ($product->is_type( 'variable' )){
				/*For hver attribut loop*/
				foreach ( $attributes as $attributeKey => $attributeValue ) {
					/*Nulstiller arrau*/
					$variationArray=[];
					/*Henter attributnavn fra attributarray*/
					$taxonomy = $attributeKey;
					/*Hvilket variationer har produktet*/

					$variations = $product->get_available_variations();

					foreach ($variations as $variation){

						$variation_id = $variation['variation_id'];
						$variation_obj = new WC_Product_Variation( $variation_id );

						$stock_status = $variation_obj->get_stock_quantity();


						/*Vi henter variationen ud fra attribut*/
						$meta = get_post_meta($variation['variation_id'], 'attribute_' . $taxonomy, true);
						$variationsVariable = get_term_by('slug', $meta, $taxonomy);
						$name = $variationsVariable->name;

						if($stock_status >= 5 ){
							$stock_status_text = __('In stock','wrm');
						}elseif($stock_status <= 5 && $stock_status !=0 ){
							$stock_status_text = __('Low in stock','wrm');
						}else{
							$stock_status_text = __('Out of stock','wrm');
						}

						/*Sætter det det i variationsarray*/
						$variationArray[]=$name.' '.$stock_status_text;
						$uniqieVariation =array_unique($variationArray);
					}
					$attributeArray[$taxonomy]=$uniqieVariation;
				}
				$order_products_array[] = array(
					'product_id' 	 => $item->get_product_id(),
					'product_name'	 => $item->get_name(),
					'attributes'	 => $attributeArray,
					'return_size'	=> 'choose size',
					'return_material'=>'Choose material'
				);
			}


		}

		wp_send_json_success($order_products_array);

		wp_die();
    }

    function create_return_request(){
		global $wpdb;
		$JSON_response='';
		$array_reponses='';

		$JSON_response = $_REQUEST['returned_products'];
		$array_reponses = json_decode(stripslashes($JSON_response),true);

		$table_order=$wpdb->prefix.'woocommerce_return_manager_order';
		$table_product="{$wpdb->prefix}woocommerce_return_manager_product";

		/*get order by id if not send error */
		$sanitizedOrderId = sanitize_text_field($array_reponses['return_order_id']);
		try{
			$order = new WC_Order($sanitizedOrderId);
		} catch (Exception $e){
			$error_msg = __('The order id cant be found','wrm');
			wp_die($error_msg) ;
		}

		/*Checkif product is checked*/
		$product_returned='';
		foreach ($array_reponses["order_products"] as $product){
			if($product['enableReturn'] && isset($product['return_action']) && isset($product['return_type']) ){
				$product_returned++;
			}
		}
		$data = array(
			'order_id' 					=> $array_reponses['return_order_id'],
			'firstname' 				=> $order->get_billing_first_name(),
			'amount_products_returned'	=> $product_returned);
		$format = array('%d','%s','%d');

		if($product_returned!=0 ){
			$wpdb->insert($table_order,$data,$format);
			$lastid = $wpdb->insert_id;
		}else{
			$this->error_404(__('No products is selected','wrm'));
		}

		foreach ($array_reponses["order_products"] as $product){
			if($product['enableReturn']){

				$data = array(
					'return_id' 		=> $lastid,
					'product_id' 		=> $product['product_id'],
					'product_name' 		=> $product['product_name'],
					'chosen_attribute' 	=> $product['return_size'],
					'return_type' 		=> $product['return_type'],
					'return_action' 	=> $product['return_action'],
					);
				$format = array('%d','%d','%s','%s','%s','%s');

				$wpdb->insert($table_product,$data,$format);
			}
		}
		$customerArray['customer'] = array(
			'name' 		=>$order->get_billing_first_name().' '.$order->get_billing_last_name(),
			'address' 	=>$order->get_billing_address_1(),
			'zipcode'	=>$order->get_billing_postcode(),
			'city'		=>$order->get_billing_city(),
			'email'		=>$order->get_billing_email()
		);

		wp_send_json_success($customerArray);
		wp_die();

	}
}

?>
