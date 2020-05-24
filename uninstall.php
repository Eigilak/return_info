<?php
function delete_plugin_database_tables(){
    global $wpdb;
    $tableArray = [
        $wpdb->prefix . "woocommerce_return_manager_product",
        $wpdb->prefix . "woocommerce_return_manager_order"
    ];

    foreach ($tableArray as $tablename) {
        $wpdb->query("DROP TABLE IF EXISTS $tablename");
    }
}

register_uninstall_hook(__FILE__, 'delete_plugin_database_tables');