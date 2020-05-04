<div class="woocommerce_return_manager" xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="wrm_overlay wrm_app">
        <div class="content">
            <h3><?=  get_the_title() ?> - <?php _e('Return your order','wrm')  ?></h3>


            <?php include( WRM_PATH.'templates/forms/find_order.php') ?>

            <transition name="fade">
                <?php include( WRM_PATH.'templates/forms/store_return_order.php') ?>
            </transition>

        </div>

        <button v-on:click="confirm_cause()">asd</button>
    </div>

</div>


<script charset="UTF-8" src="https://plugins.pakkelabels.dk/returnportal.js" type="text/javascript"></script>
