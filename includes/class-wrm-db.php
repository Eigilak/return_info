<?php


if(!defined('ABSPATH'))
    return;


class WRM_databases
{

    protected static $instance = null;

    //Get instance
    public static function get_instance()
    {
        if (self::$instance === null) {
            self::$instance = new self();}
        return self::$instance;
    }

    public function __construct(){
     /*   add_action('init',array($this, 'test_2'));*/
    }

      function create_return_orders_table(){


    }

    function test_2(){



    }

}

