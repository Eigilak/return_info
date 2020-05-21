
<div class="wrm_admin">
    <div class="inner_wrm-app">
        <div class="controlPanel">
            <div class="returned-numbers">

            </div>
            <div class="search">
                <input type="text">
            </div>
        </div>

        <button @click="get_orders"> TEST KNAP</button>

        <table class="return-results wp-list-table widefat fixed striped posts">
            <tr class="header">
                <th> <?php _e('Order','wrm')?></th>
                <th> <?php _e('Name','wrm')?></th>
                <th> <?php _e('Email','wrm')?></th>
                <th> <?php _e('Products returned','wrm')?></th>
                <th> <?php _e('Show products','wrm')?></th>
            </tr>

            <tbody class="body">
                <tr class="orderItem">
                    <tr class="order_info">
                      <td>1</td>
                      <td>2</td>
                      <td>3</td>
                      <td>4</td>
                      <td>5</td>
                    </tr>
                    <tr class="order_produts"></tr>
                </tr>
            </tbody>


        </table>

    </div>
</div>
