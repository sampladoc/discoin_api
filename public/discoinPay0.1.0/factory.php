<?php
require(dirname(__FILE__)."\library.php");

    class Helper{
        public static function random_generator($COMP){
            function doit($COMP){
                $S = '';
                if(is_numeric($COMP)){
                    $L = $COMP;
                }else{
                    $L = strlen($COMP);
                }
                function char($s,$comp){
                    if($comp != $s){
                        $n = rand(0,62);
                        if(strlen($s) > 1){
                            if($n < 10) return $n; //1-10
                            if($n < 36) return chr($n + 55); //A-Z
                            if($n < 62) return chr($n + 61); //a-z				   
                        }else{
                            if($n < 26) return chr($n + 65); //A-Z
                            if($n < 32) return chr($n + 59); //a-z	
                            if($n < 58) return $n; //a-z		
                        }
                    }else{
                        $s = "";
                        char($s,$comp);
                    }
                }
                while(strlen($S) < $L){
                        $S .= char($S,$COMP);
                }
                if(strstr($S,"undefined") == NULL){									  
                    return $S;
                }else{
                    return false;	
                }
            }
            $S = doit($COMP);
            while($S == false){
                $S = doit($COMP);   
            }
            return $S;
        }
    }

    class Keys {
        private $secret_key = SECRET_KEY;
        private $public_key = PUBLIC_KEY;

        public function get_secret_key($array){
            $key = $array["Publickey"];
            if($key == $this->public_key){
                return $this->secret_key;
            }else{
                return false;
            }
        }
    }

    class Header {
        private $headers = array();
        public function get_headers($server){
            foreach ($server as $key => $value) {
                if (strpos($key, 'HTTP_') === 0) {
                    $headers[str_replace(' ', '', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))))] = $value;
                }
            }
            return $headers;
        }

    }

    class ShoppingCart extends Helper {
        private $shoppingCartId = "";
        private $shoppingCart = array();
        public function create($products){
            $total = 0;
            $this->shoppingCartId = "kid_".parent::random_generator(16);
            foreach ($products as $value) {
                $total = $total + $value['amount'];
            }
            
            $shoppingCart[$this->shoppingCartId] = $products;
            $shoppingCart['total'] = $total;
            $shoppingCart['id'] = $this->shoppingCartId;
            $jsonFile = $this->shoppingCartId.".json";
            $shoppingCartJSON = json_encode($shoppingCart);
            
            if(file_exists(SHOPPING_CARTS_DIR."\\".$jsonFile)){
                return false;
            }else{                
                $JSONfile = fopen(SHOPPING_CARTS_DIR."\\".$jsonFile, "w") or die("Unable to open file!");
                $json = $shoppingCartJSON."\n";
                fwrite($JSONfile, $json);
                fclose($JSONfile);
                return $this->shoppingCartId;
            } 
        }

        public function get_cart($headers){
            $cartId = $headers['Cartid'];
            if($cartId){
                $jsonFile = $cartId.".json";
                if(file_exists(SHOPPING_CARTS_DIR."\\".$jsonFile)){
                    $fh = fopen(SHOPPING_CARTS_DIR."\\".$jsonFile, 'r');
                    $JSONData = fread($fh, filesize(SHOPPING_CARTS_DIR."\\".$jsonFile));
                    $obj = json_decode($JSONData);
                    return json_decode($JSONData);
                    fclose($fh);
                }else{                
                    return false;
                } 
            }else{
                return false;
            }
            
        }
    }

?>