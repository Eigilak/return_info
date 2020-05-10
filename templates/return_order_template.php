<div class="woocommerce_return_manager" xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="wrm_overlay wrm_app">
        <div class="content">
            <h3><?=  get_the_title() ?> - <?php _e('Return your order','wrm')  ?></h3>



            <div class="" v-if="!return_orderForm.order_products.length">
                <?php include( WRM_PATH.'templates/forms/find_order.php') ?>
            </div>

            <div class="hide" :class="{hide : return_orderForm.requestGot, show :return_orderForm.order_products.length}" v-if="return_orderForm.order_products.length">
                <transition name="fade">
                    <?php include( WRM_PATH.'templates/forms/store_return_order.php') ?>
                </transition>
            </div>

            <div :class="{hide : !return_orderForm.requestGot}">
                <div>
                    <p>
                        <?php _e('If the return link is not opened:') ?>
                        <br>
                        <?php _e('Please follow','wrm') ?>
                        <u>
                            <a @click="shipmondo_manual"  rel="noopener noreferrer">
                                <?php _e('this link','') ?>
                            </a>
                        </u>
                        <?php _e('to return your order') ?>
                    </p>
                </div>

            </div>



        </div>

    </div>

</div>


<script charset="UTF-8" src="https://plugins.pakkelabels.dk/returnportal.js" type="text/javascript"></script>
