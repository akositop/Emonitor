<?php
//include('../includes/config.php');
class DbHandler {

    private $conn;

    function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }
    /**
     * Fetching single record
     */
    public function getOneRecord($query) {
        $r = $this->conn->query($query.' LIMIT 1') or die($this->conn->error.__LINE__);
        return $result = $r->fetch_assoc();    
    }
    
    /**
     * Creating new record
     */
    public function insertIntoTable($obj, $column_names, $table_name) {
        
        $c = (array) $obj;
        $keys = array_keys($c);
        $columns = '';
        $values = '';
        foreach($column_names as $desired_key){ // Check the obj received. If blank insert blank into the array.
           if(!in_array($desired_key, $keys)) {
                $$desired_key = '';
            }else{
                $$desired_key = $c[$desired_key];
            }
            $columns = $columns.$desired_key.',';
            $values = $values."'".$$desired_key."',";
        }
        $query = "INSERT INTO ".$table_name."(".trim($columns,',').") VALUES(".trim($values,',').")";
        $r = $this->conn->query($query) or die($this->conn->error.__LINE__);

        if ($r) {
            $new_row_id = $this->conn->insert_id;
            return $new_row_id;
            } else {
            return NULL;
        }
    }
public function getSession(){
    if (!isset($_SESSION)) {
        session_start();
    }
    
    $sess = array();
    if(isset($_SESSION['user_id'])){

        $sess["user_id"] = $_SESSION['user_id'];
        $sess["farms_desc"] = $_SESSION['farms_desc'];
        $sess["farms_id"] = $_SESSION['farms_id'];
        $sess["position_desc"] = $_SESSION['position_desc'];
        $sess["ua_username"] = $_SESSION['ua_username'];
        $sess["user_name"] = $_SESSION['user_name'];
        $sess["user_img"] = $_SESSION['user_img'];
    }
    else
    {
        $sess["user_id"] = '';
        $sess["farms_desc"] = '';
        $sess["farms_id"] = '';
        $sess["position_desc"] = '';
        $sess["ua_username"] = 'Guest';
        $sess["user_name"] = 'Guest';
        $sess["user_img"] = '';
     }
    return $sess;
}
public function destroySession(){
    if (!isset($_SESSION)) {
    session_start();
    }
    if(isSet($_SESSION['user_id']))
    {
        unset($_SESSION['user_id']);
        unset($_SESSION['farms_desc']);
        unset($_SESSION['farms_id']);
        unset($_SESSION['position_desc']);
        unset($_SESSION['ua_username']);
        unset($_SESSION['user_name']);
        $info='info';
        if(isSet($_COOKIE[$info]))
        {
            setcookie ($info, '', time() - $cookie_time);
        }
        $msg="Logged Out Successfully...";
    }
    else
    {
        $msg = "Not logged in...";
    }
    return $msg;
}
 
}

?>
