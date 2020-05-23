<form class="return_step_1"action="" @submit.prevent="get_order_by_id_email" @keydown="find_orderForm.errors.clear('errors')">
    <div class="input">
        <div>
            <label for="email"><?php _e('Email','wrm'); ?></label>
            <input :class="[find_orderForm.errors.any() ? 'errorInput' : '' ]" id="email" placeholder="<?php _e('my@email.com','wrm') ?>" type="text"  name="email" v-model="find_orderForm.customer_email">
        </div>

        <div>
            <label for="ordre_id"><?php _e('Your order number','wrm'); ?></label>
            <input :class="[find_orderForm.errors.any() ? 'errorInput' : '' ]" id="order_id" placeholder="1234" type="number"  name="email" v-model="find_orderForm.order_id">
        </div>

    </div>

    <input type="text" class="realEmail" v-model="find_orderForm.email2">

    <input type="text" hidden name="find_customer_nonce"  v-model="find_orderForm.nonce">

    <button type="submit"><?php _e('Find my order','wrm'); ?></button>
    <span style="color: red" v-text="find_orderForm.errors.get('errors')" v-if="find_orderForm.errors.any()"></span>

</form>
