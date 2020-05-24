<form :readonly="disabled" class="return_step_1" @submit.prevent="get_order_by_id_email" @keydown="find_orderForm.errors.clear('errors'), loading = false">
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

    <span v-if="loading">loading.... </span>
    <button :disabled="disabled" type="submit">
        <span v-if="disabled"> <?php _e('Too many attemtss','wrm') ?> </span>
        <span v-if="!disabled"> <?php _e('Find my order','wrm'); ?> </span>

    </button>
    <span style="color: red" v-text="find_orderForm.errors.get('errors')" v-if="find_orderForm.errors.any()"></span>

</form>
