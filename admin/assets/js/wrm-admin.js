
var checkVueAdmin = document.getElementsByClassName('wrm_admin');


if(checkVueAdmin.length > 0){

    var adminApp =
        new Vue({
            el:'.wrm_admin',
            data:{
                returned_orders:{},
                search:''
            },
            methods:{
                get_orders(){

                    var data = {
                        actiom:'init_get_order'
                    }
                    var params = new URLSearchParams();
                    params.append('action', 'init_get_order');
                    axios.get('/wp-admin/admin-ajax.php?action=init_get_orders')
                        .then(
                            (
                                response=>(
                                 this.returned_orders = response.data
                                )
                            )
                        )

                }
            },
            computed:{

            },
            mounted(){

            }




        })

}
