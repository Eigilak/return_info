
var checkVueAdmin = document.getElementsByClassName('wrm_admin');


if(checkVueAdmin.length > 0){

    var adminApp =
        new Vue({
            el:'.wrm_admin',
            data:{
                hans:false,
                search_keys:'',
                orders:{},
                orginalOrders:{}
            },
            methods:{
                search_order(){

                }

            },
            computed:{

            },
            mounted(){
                var data = {
                    actiom:'init_get_order'
                }
                var params = new URLSearchParams();
                params.append('action', 'init_get_order');
                axios.get('/wp-admin/admin-ajax.php?action=init_get_orders')
                    .then(
                        (
                            response=>(
                                this.orders = response.data.data.reverse(),
                                this.orginalOrders = response.data.data.reverse()
                            )
                        )
                    )
            }




        })

}
