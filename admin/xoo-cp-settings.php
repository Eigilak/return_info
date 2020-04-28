<?php
//Exit if accessed directly
if(!defined('ABSPATH')){
	return;
}
?>
<?php settings_errors(); ?>
<div class="xoo-container">
	<div class="xoo-main">
		<form method="POST" action="options.php" class="xoo-cp-form">
			<?php settings_fields('xoo-cp-group'); ?>
			<?php do_settings_sections('woocommerce_return_manager_init'); ?>
			<?php submit_button(); ?>
		</form>
	</div>

	<div class="xoo-sidebar">
		<?php require_once WRM_PATH.'/admin/xoo-cp-sidebar.php'; ?>
	</div>
</div>

