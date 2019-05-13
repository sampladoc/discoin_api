
<?php
require(dirname(__FILE__)."\library.php");
//Public Key Code found in public key file
//replace this test key with your public key
$keys = array(PUBLIC_KEY); 

if(isset($_POST["file_index"])){
   echo $keys[$_POST["file_index"]];
}

?>
