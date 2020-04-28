
<?php

$order = wc_get_order(17050);


?>


<div class="woocommerce_return_manager">
    <div class="wrm_overlay wrm_app">
        <div class="content">
            <h3><?php echo get_the_title() ?> </h3>
            <form class="return_step_1" action="" @submit.prevent="" >
                <div class="input">
                    <div>
                        <label for="email"><?php _e('Email','wrm'); ?></label>
                        <label for="ordre_id"><?php _e('Your order number','wrm'); ?></label>
                    </div>

                    <input id="email" placeholder="<?php _e('my@email.com','wrm') ?>" type="text" required name="email" v-model="return_email">
                    <input id="order_id" placeholder="1234" type="text" required name="email" v-model="return_order_id">
                </div>
                <button type="submit"><?php _e('Find my order','wrm'); ?></button>
            </form>

            <form class="return_step_2" action="" @submit.prevent="" >
                <div class="input">
                    <?php foreach ( $order->get_items() as $item_id => $item ) : ?>
                    <?php
                        /*Get all of the info for the order_item*/
                        $product = $item->get_product();
                        /*Hent billede*/
                    ?>
                    <table class="order_item">
                        <!--Head-->
                        <thead>
                            <tr>
                                <th><?php _e('Return','wrm') ?></th>
                                <th><?php _e('Product name','wrm')?></th>
                                <th><?php _e('Return Type','wrm') ?></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input id="return_checkBox" type="checkbox" >
                                </td>
                                <td>
                                    <?= $item->get_name() ?>
                                </td>
                                <td>
                                    <select name="" id="">
                                        <option data-default=""><?php _e('Choose reason to return','wrm'); ?></option>
                                        <option value="<?php _e('Damaged','wrm') ?>"><?php _e('Damaged','wrm') ?></option>
                                        <option value="<?php _e('Wrong size','wrm') ?>"><?php _e('Wrong size','wrm') ?></option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>



                    </table>

                    <?php endforeach ?>
                </div>
                <button type="submit"><?php _e('Find my order','wrm'); ?></button>
            </form>

        </div>
    </div>
</div>

