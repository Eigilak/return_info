<script src="https://www.google.com/recaptcha/api.js?render=6LeCKvgUAAAAANrj6FzsYqF9j6vpGCjmDgZJ6hGE"></script>


<div class="woocommerce_return_manager">
    <div class="wrm_app" :class="[loading ? 'loading' :'']">
        <div class="header">
            <h3><?=  get_the_title() ?> - <?php _e('Return your order','wrm')  ?></h3>
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

    </div>

</div>


