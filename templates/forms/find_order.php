<form class="return_step_1"action="" @submit.prevent="get_order_by_id_email" >
    <div class="input">
        <div>
            <label for="email"><?php _e('Email','wrm'); ?></label>
            <label for="ordre_id"><?php _e('Your order number','wrm'); ?></label>
        </div>

        <input id="email" placeholder="<?php _e('my@email.com','wrm') ?>" type="text"  name="email" v-model="find_orderForm.customer_email">
        <input id="order_id" placeholder="1234" type="number"  name="email" v-model="find_orderForm.order_id">
    </div>
    <button type="submit"><?php _e('Find my order','wrm'); ?></button>

</form>
