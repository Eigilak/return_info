


<?php if(get_option('wrm_options_enable_recaptcha'))  : ?>
    <?php $sitekey = get_option('wrm_options_recaptcha') ?>
    <script
            src="https://www.google.com/recaptcha/api.js?render=<?=$sitekey?>"
    ></script>
<?php endif ?>
<!--6LeCKvgUAAAAANrj6FzsYqF9j6vpGCjmDgZJ6hGE -->

<div class="woocommerce_return_manager">
    <div class="wrm_app">
        <div class="header">
            <h3> <?php _e('Return your order','wrm')  ?></h3>
        </div>
        <div class="content">
            <div class="steps">
                <div class="step1" :class="[step1 ? 'border-bottom' : '']"><h3><?php _e('Step','wrm') ?> 1</h3></div>
                <div class="step2" :class="[step2 ? 'border-bottom' : '']"><h3><?php _e('Step','wrm') ?> 2</h3></div>
                <div class="step3" :class="[step3 ? 'border-bottom' : '']"><h3><?php _e('Step','wrm') ?> 3</h3></div>
            </div>


            <div class="forms" >
                <div class="" v-if="step1">
                    <?php include( WRM_PATH.'templates/forms/find_order.php') ?>
                </div>

                <div class="hide" :class="[step2 ? 'show' : '']" v-if="step2==true">
                    <?php include( WRM_PATH.'templates/forms/store_return_order.php') ?>
                </div>

                <div class="hide" :class="[step3 ? 'show' : '']" v-if="step3" >
                        <p>
                            <?php _e('If the return link is not opened:') ?>
                            <br>
                            <?php _e('Please follow','wrm') ?>
                                <a style="cursor: pointer; text-decoration: underline" @click="shipmondo_manual"  rel="noopener noreferrer">
                                    <?php _e('this link','') ?>
                                </a>
                            <?php _e('to return your order') ?>
                        </p> <br><br>
                        <p><?php _e('Thanks for requesting for a return','wrm') ?>.</p>
                        <p><?php _e('Further actions will be done when we have the product(s) in our possesion','wrm')?>.</p>
                </div>
            </div>



        </div>

        <div v-show="check_order_date.claim_return_days || check_order_date.free_return_days"
             class="order_notice" v-cloak>
            <div class="inner_order_notice">
                <div class="content">
                    <h3><?php _e('Return policy notice','wrm') ?></h3>

                    <div class="text" style="text-decoration: underline">
                        <p>
                            <span v-if="check_order_date.claim_return_days">
                                <?php
                                _e('Your request exceed our right of complaint periode','wrm');
                                echo '('.get_option('wrm_options_claim_period').__('years','wrm').')'
                                ?>
                            </span>
                                    <span v-if="check_order_date.free_return_days">
                                <?php
                                _e('Your request exceed our right of cancellation periode','wrm');
                                echo "( ";
                                echo get_option('wrm_options_free_return_period');
                                _e('days','wrm');
                                echo " )";
                                ?>
                            </span>
                        </p>


                    </div>

                    <div class="policy">
                        <p>
                            <?php _e('Please read more at our terms and conditions if needed','wrm'); echo ':'?>
                            <br>
                            <strong>
                                <?php
                                $terms_page_id   = wc_terms_and_conditions_page_id();
                                echo '<a href="' . esc_url( get_permalink( $terms_page_id ) ) . '" class="woocommerce-terms-and-conditions-link" target="_blank">' . __( 'terms and conditions', 'woocommerce' ) . '</a>'
                                ?>
                            </strong>

                        </p>

                    </div>

                    <div class=" proceed button action" @click="close_policy_notice">
                        <p>
                            <?php _e('I understand','wrm') ?>
                        </p>

                    </div>
                </div>

            </div>
        </div>

    </div>

</div>


