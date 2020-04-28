
<?php

$order = wc_get_order(16950);


?>


<div class="woocommerce_return_manager">
    <div class="wrm_overlay wrm_app">
        <div class="content">
            <h3><?=  get_the_title() ?> - <?php _e('Return your order','wrm')  ?></h3>


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

            <form class="return_step_2 hide" action="" @submit.prevent="" >
                <p><?php _e('Order number') ?>: {{order_number}}</p>
                <div class="input">
                    <table class="order_item">
                        <!--Head-->
                        <thead>
                        <tr>
                            <th><?php _e('Choose product','wrm') ?></th>
                            <th><?php _e('Product name','wrm')?></th>
                            <th><?php _e('Return Type','wrm') ?></th>
                            <th><?php _e('Return cause','wrm') ?></th>
                            <th><?php _e('Return action','wrm') ?></th>
                        </tr>
                        </thead>
                        <tbody>
                            <?php foreach ( $order->get_items() as $item_id => $item ) : ?>
                                <?php
                                    /*Get all of the info for the order_item*/
                                    $product = $item->get_product();
                                    $product_id = $item->get_product_id();
                                    /*Hent billede*/
                                ?>

                                    <tr>
                                        <td>
                                            <input id="return_checkbox-<?= $item->get_product_id() ?>" type="checkbox" >
                                        </td>
                                        <td>
                                            <label for="return_checkbox-<?= $item->get_product_id() ?>">
                                                <?= $item->get_name() ?>
                                            </label>
                                        </td>
                                        <td>
                                            <select name="" id="">
                                                <option data-default=""><?php _e('Choose reason to return','wrm'); ?></option>
                                                <option value="<?php _e('Damaged','wrm') ?>"><?php _e('Damaged','wrm') ?></option>
                                                <option value="<?php _e('Wrong size','wrm') ?>"><?php _e('Wrong size','wrm') ?></option>
                                            </select>
                                        </td>
                                        <td>
                                            <textarea placeholder="<?php _e('Explain why you want to return','wrm') ?>"></textarea>
                                        </td>

                                        <td>
                                            <textarea id="text" placeholder="<?php _e('Explain why you want to return','wrm') ?>"></textarea>
                                        </td>
                                    </tr>
                            <?php endforeach ?>
                        </tbody>
                    </table>
                </div>
                <button type="submit"><?php _e('Find my order','wrm'); ?></button>
            </form>

        </div>

        <button v-on:click="go_to_shipmondo()">asd</button>
    </div>
</div>
<script charset="UTF-8" src="https://plugins.pakkelabels.dk/returnportal.js" type="text/javascript"></script>