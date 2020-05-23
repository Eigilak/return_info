
<div class="wrm_admin">
    <div class="inner_wrm-app">
        <h1><?php _e('Woocommerce return manager') ?></h1>
        <div class="controlPanel">
            <div class="returned-numbers">
                <p>{{orders.length}} <?php _e('returned orderes') ?></p>
            </div>
            <div class="search hide" :class="[loaded ? 'show' :'']">
                <input v-model="search_keys" type="text" placeholder="<?php _e('Search by name or Order number','wrm') ?>">
            </div>
        </div>

        <table class="return-results wp-list-table widefat fixed striped pages hide" :class="[loaded ? 'show' :'']">
            <thead>
                <tr class="header">
                    <th> <?php _e('Order','wrm')?></th>
                    <th> <?php _e('Name','wrm')?></th>
                    <th class="mobileHide"> <?php _e('Email','wrm')?></th>
                    <th class="mobileHide"> <?php _e('Products returned','wrm')?></th>
                    <th class="mobileHide"> <?php _e('Created at','wrm')?></th>
                    <th> <?php _e('Show products','wrm')?></th>
                </tr>
            </thead>
            <tbody class="body">
                <tr class="orderItem" v-for="(order,index) in filtered_orders" :key="order.id">
                    <td><a target="_blank" :href="'<?= get_site_url() ?>/wp-admin/post.php?post='+order.order_id+'&action=edit'"> {{order.order_id}}</a></td>
                    <td><p> {{order.name}}</p></td>
                    <td class="mobileHide"><a target="_blank" :href="'mailto:' + order.email"> {{order.email}}</a></td>
                    <td class="mobileHide"><p> {{order.product_count}}</p></td>
                    <td class="mobileHide"><p> {{order.created_at}}</p></td>
                    <td>
                        <button class="button action"
                                @click="[ order.showProduct  ? order.showProduct=false : order.showProduct=true ]">
                            <span v-show="!order.showProduct"><?php _e('Show products','wrm') ?></span>
                            <span v-show="order.showProduct" ><?php _e('Hide products','wrm') ?></span>
                        </button>
                        <input type="text" v-model="order.showProduct" value="false" hidden>
                        <table class="products" v-if="order.showProduct">
                            <tr>
                                <th><?php _e('Product name','wrm')?></th>
                                <th><?php _e('Return reason','wrm')?></th>
                                <th><?php _e('Return Action','wrm')?></th>
                                <th><?php _e('New size','wrm')?></th>
                                <th><?php _e('New Material','wrm')?></th>
                            </tr>
                            <tr v-for="(product,index) in order.products">
                                <td>{{product.product_name}}</td>
                                <td>{{product.return_type}}</td>
                                <td>{{product.return_action}}</td>
                                <td  :class="[!product.chosen_attribute1 ? 'emptyField' : '']">{{product.chosen_attribute1}}</td>
                                <td :class="[!product.chosen_attribute2 ? 'emptyField' : '']">{{product.chosen_attribute2}}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>

        <nav aria-label="Page navigation " v-if="loaded_pagination" >
            <ul class="pagination">
                <li class="page-item">
                    <button type="button" class="page-link button action" :disabled="page === 1" @click="page--"> <?php _e('Previous','wrm') ?></button>
                </li>
                <li class="page-item">
                    <button type="button" class="page-link button action pag_button" v-for="pageNumber in pages" @click="page = pageNumber"> {{pageNumber}} </button>
                </li>
                <li class="page-item">
                    <button type="button" class="page-link button action" :disabled="page > pages.length - 1" @click="page++" > <?php _e('Next','wrm') ?> </button>
                </li>
            </ul>
        </nav>

    </div>
</div>
