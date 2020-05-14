<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js" integrity="sha384-NaWTHo/8YCBYJ59830LTz/P4aQZK1sS0SneOgAvhsIl3zBu8r9RevNg5lHCHAuQ/" crossorigin="anonymous"></script>
<div class="woocommerce_return_manager" xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="wrm_overlay wrm_app">
        <div class="header">
            <h3><?=  get_the_title() ?> - <?php _e('Return your order','wrm')  ?></h3>
        </div>
        <div class="content">
            <div class="steps">
                <div class="step1" :class="[step1 ? 'border-bottom' : '']"><h3><?php _e('Step','wrm') ?> 1</h3></div>
                <div class="step2" :class="[step2 ? 'border-bottom' : '']"><h3><?php _e('Step','wrm') ?> 2</h3></div>
                <div class="step3" :class="[step3 ? 'border-bottom' : '']"><h3><?php _e('Step','wrm') ?> 3</h3></div>
            </div>

            <div class="forms">
                <div class="" v-if="!return_orderForm.order_products.length">
                    <?php include( WRM_PATH.'templates/forms/find_order.php') ?>
                </div>

                <div :class="{hide : return_orderForm.requestGot}" v-if="return_orderForm.order_products.length">
                    <?php include( WRM_PATH.'templates/forms/store_return_order.php') ?>
                </div>

                <div :class="[ !return_orderForm.requestGot ? 'hide' : '']">
                    <?php if(true): ?>
                        <div>
                            <p>
                                <?php _e('If the return link is not opened:') ?>
                                <br>
                                <?php _e('Please follow','wrm') ?>
                                <u>
                                    <a style="cursor: pointer" @click="shipmondo_manual"  rel="noopener noreferrer">
                                        <?php _e('this link','') ?>
                                    </a>
                                </u>
                                <?php _e('to return your order') ?>
                            </p>
                        </div>
                    <?php else :?>
                        <div>
                            <p><?php _e('Thanks for requesting for a return','wrm') ?></p>
                            <p><?php _e('further actions will be done when we have the product(s) in our possesion','wrm')?></p>
                        </div>
                    <?php endif ?>
                </div>
            </div>

            <button class="test"></button>



        </div>

    </div>

</div>


<script charset="UTF-8" src="https://plugins.pakkelabels.dk/returnportal.js" type="text/javascript"></script>
