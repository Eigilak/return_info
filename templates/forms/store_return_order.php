
<form class="return_step_2" :class="[returnForm2 ? 'show' :'' ]" v-if="returnForm2" @submit.prevent="submit_return_order_form" >
    <p><?php _e('Your order number') ?>: {{find_orderForm.order_id}}</p>
    <div class="input">
        <table class="order_item">
            <thead>
            <tr>
                <th class="action_check"><?php _e('Choose','wrm') ?></th>
                <th><?php _e('Product name','wrm')?></th>
                <th><?php _e('Return Type','wrm') ?></th>
                <th><?php _e('Return action','wrm') ?></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="order_product in return_orderForm.order_products" :key="order_product.product_id">
                <td class="action_checkbox">
                    <div class="pretty p-svg p-curve">
                        <input :id="order_product.product_name" :value="false" v-model="order_product.enableReturn" type="checkbox"/>
                        <div class="state p-success">
                            <svg class="svg svg-icon" viewBox="0 0 20 20">
                                <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                            </svg>
                            <label></label>
                        </div>
                    </div>
                </td>
                <td>
                    <label :for="order_product.product_name">
                        {{order_product.product_name}}
                    </label>
                </td>
                <td>
                    <select name="return_type" class="wrm-select" id="return_type" v-model="order_product.return_type">
                        <option disabled :value="this.initVal" > <?php _e('Choose reason to return','wrm'); ?></option>
                        <option value="<?php _e('Damaged','wrm') ?>"><?php _e('Damaged','wrm') ?></option>
                        <option  value="<?php _e('Wrong size','wrm') ?>"><?php _e('Wrong size','wrm') ?></option>
                    </select>
                </td>
                <td>
                    <select name="return_action" class="wrm-select" id="return_action" v-model="order_product.return_action">
                        <option disabled :value="this.initVal" ><?php _e('Choose action','wrm'); ?></option>
                        <option selected value="<?php _e('Money back','wrm') ?>"><?php _e('Money back','wrm') ?></option>
                        <option value="<?php _e('New size','wrm') ?>"><?php _e('New size','wrm') ?></option>
                    </select>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    <button type="submit"><?php _e('Find my order','wrm'); ?></button>
</form>
