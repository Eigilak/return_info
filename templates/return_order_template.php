<div class="woocommerce_return_manager" xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="wrm_overlay wrm_app">
        <div class="content">
            <h3><?=  get_the_title() ?> - <?php _e('Return your order','wrm')  ?></h3>
            <form class="return_step_1" :class="[returnForm1 ? '' :'hide' ]"  v-if="returnForm1" action="" @submit.prevent="get_order_by_id_email" >
                    <div class="input">
                        <div>
                            <label for="email"><?php _e('Email','wrm'); ?></label>
                            <label for="ordre_id"><?php _e('Your order number','wrm'); ?></label>
                        </div>

                        <input id="email" placeholder="<?php _e('my@email.com','wrm') ?>" type="text"  name="email" v-model="find_orderForm.customer_email">
                        <input id="order_id" placeholder="1234" type="text"  name="email" v-model="find_orderForm.order_id">
                    </div>
                    <button type="submit"><?php _e('Find my order','wrm'); ?></button>
                </form>

            <transition name="fade">
                <form class="return_step_2" :class="[returnForm2 ? '' :'hide' ]" v-if="returnForm2" >
                    <p><?php _e('Order number') ?>: {{find_orderForm.order_id}}</p>
                    <div class="input">
                        <table class="order_item">
                            <thead>
                            <tr>
                                <th class="action_check"><?php _e('Choose','wrm') ?></th>
                                <th><?php _e('Product name','wrm')?></th>
                                <th><?php _e('Return Type','wrm') ?></th>
                              <!--  <th><?php /*_e('Return cause','wrm') */?></th>-->
                                <th><?php _e('Return action','wrm') ?></th>
                            </tr>
                            </thead>
                            <tbody v-for="order_product in order_products">
                            <tr>
                                <td class="action_checkbox">
                                    <div class="pretty p-svg p-curve">
                                        <input id="return_checkbox" type="checkbox" />
                                        <div class="state p-success">
                                            <svg class="svg svg-icon" viewBox="0 0 20 20">
                                                <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                                            </svg>
                                            <label></label>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <label for="return_checkbox-{{}}">
                                        {{order_product.product_name}}
                                    </label>
                                </td>
                                <td>
                                    <select name="" id="return_type">
                                        <option data-default=""><?php _e('Choose reason to return','wrm'); ?></option>
                                        <option value="<?php _e('Damaged','wrm') ?>"><?php _e('Damaged','wrm') ?></option>
                                        <option value="<?php _e('Wrong size','wrm') ?>"><?php _e('Wrong size','wrm') ?></option>
                                    </select>
                                </td>
                                    <select name="" id="return_type">
                                        <option data-default=""><?php _e('Choose action','wrm'); ?></option>
                                        <option value="<?php _e('Money back','wrm') ?>"><?php _e('Damaged','wrm') ?></option>
                                        <option value="<?php _e('New size','wrm') ?>"><?php _e('Wrong size','wrm') ?></option>
                                    </select>
                                <td>

                                </td>
                                <!--<td>
                                    <textarea placeholder="<?php /*_e('Explain why you want to return','wrm') */?>"></textarea>
                                </td>-->

                                <td>
                                    <textarea placeholder="<?php _e('New size, another color','wrm') ?>..."></textarea>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <button type="submit"><?php _e('Find my order','wrm'); ?></button>
                </form>
            </transition>

        </div>

        <button v-on:click="go_to_shipmondo()">asd</button>
    </div>
</div>
<script charset="UTF-8" src="https://plugins.pakkelabels.dk/returnportal.js" type="text/javascript"></script>
