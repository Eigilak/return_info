<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<div class="woocommerce_return_manager">
    <h3><?php echo get_the_title() ?> </h3>

    <div class="wrm_overlay wrm_app">
        <div class="content">
            <form class="return_step_1" action="" @submit.prevent="" >
                <div class="input">
                    <label for="email"><?php _e('Email','wrm'); ?></label>
                    <input id="email" placeholder="<?php _e('my@email.com','wrm') ?>" type="text" required name="email" v-model="return_email">

                    <label for="ordre_id"><?php _e('Your order number','wrm'); ?></label>
                    <input id="order_id" placeholder="1234" type="text" required name="email" v-model="return_order_id">
                </div>
                <button type="submit"><?php _e('Find my order','wrm'); ?></button>
            </form>
        </div>
    </div>
</div>

