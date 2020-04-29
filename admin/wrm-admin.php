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

// Enqueue Scripts & Stylesheet
function wrm_admin_enqueue($hook){

	if('toplevel_page_xoo_cp' != $hook){
		return;
	}
/*	wp_enqueue_style('xoo-cp-admin-css',XOO_CP_URL.'/admin/assets/css/xoo-cp-admin-css.css',null,XOO_CP_VERSION);
	wp_enqueue_style('wp-color-picker');
	wp_enqueue_script('xoo-cp-admin-js',XOO_CP_URL.'/admin/assets/js/xoo-cp-admin-js.js',array('jquery','wp-color-picker'),XOO_CP_VERSION,true);*/
}
add_action('admin_enqueue_scripts','xoo_cp_admin_enqueue');

//Settings page
function wrm_menu_settings(){
/*	add_menu_page( 'Added to cart popup', 'Added to cart popup', 'manage_options', 'xoo_cp', 'xoo_cp_settings_cb', 'dashicons-cart', 61 );
	add_action('admin_init','xoo_cp_settings');*/
}
add_action('admin_menu','xoo_cp_menu_settings');

//Settings callback function
function wrm_settings_cb(){
	include plugin_dir_path(__FILE__).'xoo-cp-settings.php';
}

//Custom settings
function wrm_settings(){

	//General options
 	register_setting(
		'xoo-cp-group',
	 	'xoo-cp-gl-atcem'
 	);

 	register_setting(
		'xoo-cp-group',
	 	'xoo-cp-gl-pden'
 	);

 	register_setting(
		'xoo-cp-group',
	 	'xoo-cp-gl-ibtne'
 	);

 	register_setting(
		'xoo-cp-group',
	 	'xoo-cp-gl-qtyen'
 	);

 	register_setting(
		'xoo-cp-group',
	 	'xoo-cp-gl-vcbtne'
 	);

 	register_setting(
		'xoo-cp-group',
	 	'xoo-cp-gl-chbtne'
 	);

 	register_setting(
		'xoo-cp-group',
	 	'xoo-cp-gl-spinen'
 	);

 	register_setting(
		'xoo-cp-group',
	 	'xoo-cp-gl-resetbtn'
 	);

 	register_setting(
		'xoo-cp-group',
	 	'xoo-cp-sy-pw'
 	);

 	register_setting(
		'xoo-cp-group',
	 	'xoo-cp-sy-imgw'
 	);

 	register_setting(
		'xoo-cp-group',
	 	'xoo-cp-sy-btnc'
 	);

 	register_setting(
		'xoo-cp-group',
	 	'xoo-cp-sy-btnbg'
 	);

 	register_setting(
		'xoo-cp-group',
	 	'xoo-cp-sy-btns'
 	);

 	register_setting(
		'xoo-cp-group',
	 	'xoo-cp-sy-btnbr'
 	);

 	register_setting(
		'xoo-cp-group',
	 	'xoo-cp-sy-tbs'
 	);

 	register_setting(
		'xoo-cp-group',
	 	'xoo-cp-sy-tbc'
 	);

 	/** Settings Section **/

	add_settings_section(
		'xoo-cp-gl',
		'',
        'wrm_settings_1',
        'woocommerce_return_manager_init'
	);

	add_settings_section(
		'xoo-cp-sy',
		'',
		'xoo_cp_sy_cb',
        'woocommerce_return_manager_init'
	);

	add_settings_section(
		'xoo-cp-begad',
		'',
		'xoo_cp_begad_cb',
        'woocommerce_return_manager_init'
	);

	add_settings_section(
		'xoo-cp-endad',
		'',
		'xoo_cp_endad_cb',
        'woocommerce_return_manager_init'
	);


	add_settings_field(
		'xoo-cp-gl-atcem',
		'Enable on Mobile',
		'xoo_cp_gl_atcem_cb',
        'woocommerce_return_manager_init',
		'xoo-cp-gl'
	);

	add_settings_field(
		'xoo-cp-gl-pden',
		'Show product details',
		'xoo_cp_gl_pden_cb',
        'woocommerce_return_manager_init',
		'xoo-cp-gl'
	);

	add_settings_field(
		'xoo-cp-gl-ibtne',
		'+/- Qty Button',
		'xoo_cp_gl_ibtne_cb',
        'woocommerce_return_manager_init',
		'xoo-cp-gl'
	);

	add_settings_field(
		'xoo-cp-gl-qtyen',
		'Update Quantity',
		'xoo_cp_gl_qtyen_cb',
        'woocommerce_return_manager_init',
		'xoo-cp-gl'
	);

	add_settings_field(
		'xoo-cp-gl-vcbtne',
		'View Cart Button',
		'xoo_cp_gl_vcbtne_cb',
        'woocommerce_return_manager_init',
		'xoo-cp-gl'
	);

	add_settings_field(
		'xoo-cp-gl-chbtne',
		'Checkout Button',
		'xoo_cp_gl_chbtne_cb',
        'woocommerce_return_manager_init',
		'xoo-cp-gl'
	);

	add_settings_field(
		'xoo-cp-gl-spinen',
		'Show spinner icon',
		'xoo_cp_gl_spinen_cb',
        'woocommerce_return_manager_init',
		'xoo-cp-gl'
	);

	add_settings_field(
		'xoo-cp-gl-resetbtn',
		'Reset cart form',
		'xoo_cp_gl_resetbtn_cb',
        'woocommerce_return_manager_init',
		'xoo-cp-gl'
	);

	add_settings_field(
		'xoo-cp-sy-pw',
		'PopUp Width',
		'xoo_cp_sy_pw_cb',
        'woocommerce_return_manager_init',
		'xoo-cp-sy'
	);

	add_settings_field(
		'xoo-cp-sy-imgw',
		'Image Width',
		'xoo_cp_sy_imgw_cb',
        'woocommerce_return_manager_init',
		'xoo-cp-sy'
	);

	add_settings_field(
		'xoo-cp-sy-btnbg',
		'Button Background Color',
		'xoo_cp_sy_btnbg_cb',
        'woocommerce_return_manager_init',
		'xoo-cp-sy'
	);

	add_settings_field(
		'xoo-cp-sy-btnc',
		'Button Text Color',
		'xoo_cp_sy_btnc_cb',
        'woocommerce_return_manager_init',
		'xoo-cp-sy'
	);

	add_settings_field(
		'xoo-cp-sy-btns',
		'Button Font Size',
		'xoo_cp_sy_btns_cb',
        'woocommerce_return_manager_init',
		'xoo-cp-sy'
	);

	add_settings_field(
		'xoo-cp-sy-btnbr',
		'Button Border Radius',
		'xoo_cp_sy_btnbr_cb',
        'woocommerce_return_manager_init',
		'xoo-cp-sy'
	);

	add_settings_field(
		'xoo-cp-sy-tbs',
		'Item Border Size',
		'xoo_cp_sy_tbs_cb',
        'woocommerce_return_manager_init',
		'xoo-cp-sy'
	);

	add_settings_field(
		'xoo-cp-sy-tbc',
		'Item Border Color',
		'xoo_cp_sy_tbc_cb',
        'woocommerce_return_manager_init',
		'xoo-cp-sy'
	);

}

//Settings Section Callback
function wrm_settings_1(){
	?>
	<?php 	/** Settings Tab **/ ?>
	<div class="xoo-tabs">
		<ul>
			<li class="tab-1 active-tab">Main</li>
			<li class="tab-2">Advanced</li>
		</ul>
	</div>

<?php 	/** Settings Tab **/ ?>

	<?php
	$tab = '<div class="main-settings settings-tab settings-tab-active" tab-class ="tab-1">';  //Begin Main settings
	echo $tab;
	echo '<h2>General Options</h2>';
}


//General Options Callback


?>
