
<form  @submit.prevent="submit_return_order_form" >
    <p><?php _e('Your order number') ?>: {{find_orderForm.order_id}}</p>
    <div class="input">
        <table class="order_item">
            <thead>
            <tr>
                <th class="action_check"><?php _e('Choose','wrm') ?></th>
                <th><?php _e('Product name','wrm')?></th>
                <th><?php _e('Why do you wish to return','wrm') ?>?</th>
                <th><?php _e('Return action','wrm') ?></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(order_product, index) in return_orderForm.order_products" :key="order_product.product_id">
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
                    <select :required="order_product.enableReturn ? true : false" name="return_type" class="wrm-select" id="return_type" v-model="order_product.return_type" >
                        <option disabled :value="this.initVal" > <?php _e('Choose reason to return','wrm'); ?>               </option>
                        <option value="<?php _e('Damaged','wrm') ?>"><?php _e('Damaged','wrm') ?>               </option>
                        <option  value="<?php _e('Wrong size','wrm') ?>"><?php _e('Wrong size','wrm') ?>        </option>
                        <option value="<?php _e('Regret purchase','wrm') ?>"><?php _e('Regret purchase','wrm') ?>      </option>
                        <option value="<?php _e('Plating rubs off','wrm') ?>"><?php _e('Plating rubs off','wrm') ?>     </option>
                    </select>
                </td>
                <td>
                    <select :required="order_product.enableReturn ? true : false" name="return_action" class="wrm-select" id="return_action"
                            v-model="order_product.return_action"
                            @change="[
                            $event.target.selectedIndex == 2 ? order_product.ShowSize=true     : order_product.ShowSize=false,     order_product.return_size='' ,
                            $event.target.selectedIndex == 3 ? order_product.ShowMaterial=true : order_product.ShowMaterial=false, order_product.return_material='',


                            ]">
                        <option disabled :value="this.initVal" ><?php _e('Choose action','wrm'); ?>                              </option>
                        <option value="<?php _e('Money back','wrm') ?>"><?php _e('Money back','wrm') ?>             </option>
                        <option value="<?php _e('New size','wrm') ?>"><?php _e('New size','wrm') ?>                 </option>
                        <option value="<?php _e('Another material','wrm') ?>"><?php _e('Another material','wrm') ?> </option>
                    </select>

                    <select name="return_size" class="wrm-select " v-show="order_product.ShowSize" @change="order_product.return_size= $event.target.value">
                        <option   value="<?php _e('Choose Size','wrm')?>"> <?php _e('Choose size','wrm')?></option>
                        <option :value="product_size" v-for="(product_size, index) in order_product.attributes.pa_stoerrelse" :key="index">{{product_size}}</option>
                    </select>
                    <input type="text" hidden v-model="order_product.return_size" >

                    <select name="return_material" class="wrm-select" v-show="order_product.ShowMaterial"  @change="order_product.return_material = $event.target.value">
                        <option value="<?php _e('Choose Material','wrm')?>"> <?php _e('Choose Material','wrm')?></option>
                        <option value="<?php _e('White Gold','wrm') ?>"><?php _e('White Gold','wrm') ?>     </option>
                        <option value="<?php _e('Black Gold','wrm') ?>"><?php _e('Black Gold','wrm') ?>     </option>
                        <option value="<?php _e('Gold','wrm') ?>"><?php _e('Gold','wrm') ?>                 </option>
                    </select>
                    <input type="text" hidden v-model="order_product.return_material">

                </td>
            </tr>
            </tbody>
        </table>
    </div>


    <div class="printNote">

        <div class="checkBox">
            <div class="pretty p-svg p-curve">
                <input id="acceptPrint" required :value="false"  type="checkbox"/>
                <div class="state p-success">
                    <svg class="svg svg-icon" viewBox="0 0 20 20">
                        <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                    </svg>
                    <label></label>
                </div>
            </div>
        </div>

        <div class="checkboxTxt">
            <label for="acceptPrint">
                <?php _e('Remember to print the return-order-note to make your return proces faster','wrm') ?>
            </label>

        </div>



    </div>

    <button type="submit"><?php _e('Return order','wrm'); ?> </button>
</form>
