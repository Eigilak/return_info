<?php
/**
 ========================
      ADMIN SETTINGS
 ========================
 */

//Exit if accessed directly
if(!defined('ABSPATH')){
	return;
}

class WRM_Admin{

    protected static $instance = null;

    public function __construct()
    {
       add_action('admin_menu',array($this,'wrm_add_admin_menu'));
       add_action('init',array($this, 'load_ajax_method'));
       add_action('admin_enqueue_scripts',array($this,'enqueue_scripts'),1);

    }

    //Get class instance
    public static function get_instance(){
        if(self::$instance === null){
            self::$instance = new self();
        }
        return self::$instance;
    }

    function wrm_add_admin_menu(){
        add_submenu_page('woocommerce', 'Woocommerce return manager', 'Return manager', 'manage_options', 'wrm_options_page',array($this,'list_return_page'));
    }

    function load_ajax_method(){
        if ( !is_user_logged_in() ){
            add_action( 'wp_ajax_nopriv_init_get_orders', array( &$this, 'init_get_orders' ) );
        } else{
            add_action( 'wp_ajax_init_get_orders',        array( &$this, 'init_get_orders' ) );
        }
    }

    function list_return_page(){
        wc_get_template('wrm-returned-orders.php','','',WRM_PATH.'/admin/templates/');
    }

    function enqueue_scripts(){
        /*Styles*/
              wp_enqueue_style('wrm-admin-style',WRM_URL.'/admin/assets/scss/mainStyle.css',null,WRM_VERSION);

        /*Scripts*/
        /*development*/
            wp_enqueue_script('vue',WRM_URL.'/admin/assets/js/frameworks/vue.js','',WRM_VERSION,false);
        /*production*/
/*         wp_enqueue_script('vue',WRM_URL.'/assets/js/frameworks/vue_production.min.js','',WRM_VERSION,false);*/

        wp_enqueue_script('wrm-forms',WRM_URL.'/admin/assets/js/frameworks/vue_forms.js','',WRM_VERSION,true);
        wp_enqueue_script('wrm-admin-js',WRM_URL.'/admin/assets/js/wrm-admin.js','',WRM_VERSION,true);

        wp_localize_script( 'wrm-admin-js', 'local',
            array(
                'ajax_url' 			=> 	admin_url( 'admin-ajax.php' ),
                'fc_nonce'			=> wp_create_nonce()
            ));

    }
    /*actions*/
    function init_get_orders(){

        global $wpdb;
        $returnedOrders=[];

        $orders = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}woocommerce_return_manager_order");

        foreach ($orders as $order ){

            $order_id = $order->id;
            $preparedStatement = $wpdb->prepare("SELECT * FROM {$wpdb->prefix}woocommerce_return_manager_product WHERE return_id=%d", $order_id);

            $products = $wpdb->get_results($preparedStatement);

            $returnedOrders[]= [
                'id'            =>$order->id,
                'order_id'      =>$order->order_id,
                'name'          =>$order->name,
                'email'         =>$order->email,
                'product_count' =>$order->amount_products_returned,
                'products'      =>$products,
                'created_at'    =>$order->created_at,
                'showProduct'   =>false
            ];

        }

        wp_send_json_success($returnedOrders);
        wp_die();
    }

}






