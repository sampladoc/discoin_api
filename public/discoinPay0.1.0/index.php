<?php
require(dirname(__FILE__).'\factory.php');
/*
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
*/

$header = new Header();
$keys = new Keys();
$cart = new ShoppingCart();
$hd = $header->get_headers($_SERVER);

//*
if($cart->get_cart($hd)){
    $ret = [
        'result' => $cart->get_cart($hd),
    ];
}else
if(!$cart->get_cart($hd)){
    $ret = [
        'result' => 0,
    ];
}else
if($keys->get_secret_key($hd)){
    $ret = [
        'result' => $keys->get_secret_key($hd),
    ];
}else{
    $ret = [
        'result' => 1,
    ];
}
//*/
print json_encode($ret);

?>