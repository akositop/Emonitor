<?php

//http://stackoverflow.com/questions/18382740/cors-not-working-php
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////


require_once("Rest.inc.php");
//======================================
require_once 'dbHandler.php';

class API extends REST {
  
  /////////////////////////////////////////////////////////////////////
        const DB_SERVER = "localhost";
        const DB_USER = "root";
        const DB_PASSWORD = "";
        const DB = "emonitor_db";

        private $db = NULL;
        private $mysqli = NULL;
        public function __construct(){
            parent::__construct();              // Init parent contructor
            $this->dbConnect();                 // Initiate Database connection
        }
        
        /*
         *  Connect to Database
        */
        private function dbConnect(){
            $this->mysqli = new mysqli(self::DB_SERVER, self::DB_USER, self::DB_PASSWORD, self::DB);
        }


////////////////////////////////////////////////////////////////////


    
 public function processApi(){
            $func = strtolower(trim(str_replace("/","",$_REQUEST['x'])));
            if((int)method_exists($this,$func) > 0)
                $this->$func();
            else
                $this->response('',404); // If the method not exist with in this class "Page not found".
        }

///////LOGIN/////////////////////////////////////////////////////////////////////////////////////////
 private function login(){   
    //$this->response('gagaga',406);
    if($this->get_request_method() != "POST"){
        $this->response('',406);

    }
    $user1 = json_decode(file_get_contents("php://input"),true);
    // $user_name = $this->_request['username'];      
    // $password = $this->_request['password'];
    $user_name = $user1['username'];
    $password = $user1['password'];
    $response = array();
    $db = new DbHandler();
    $user = $db->getOneRecord("select user_id,user_fname,farms_id,user_lname,ua_username,ua_password,farms_desc,position_desc,user_img from view_login where ua_username = '$user_name' and ua_password = '$password'");//ilisan Q
    if ($user != NULL) {
        
        if($user['ua_password'] == $password){
        $response['status'] = "success";
        $response['message'] = 'Logged in successfully.';
        $response['user_name'] = $user['user_fname'];
        $response['user_id'] = $user['user_id'];
        $response['farms_desc'] = $user['farms_desc'];
        $response['farms_id'] = $user['farms_id'];
        $response['position_desc'] = $user['position_desc'];
        $response['ua_username'] = $user['ua_username'];
        $response['user_img'] = $user['user_img'];
        //$response['createdAt'] = $user['created'];
        
        if (!isset($_SESSION)) {
            session_start();
        }
        // if (session_status() == PHP_SESSION_NONE) {
        //     session_start();
        // }
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['ua_username'] = $user_name;
        $_SESSION['user_name'] = $user['user_fname'];
        $_SESSION['farms_desc'] = $user['farms_desc'];
        $_SESSION['farms_id'] = $user['farms_id'];
        $_SESSION['position_desc'] = $user['position_desc'];
        $_SESSION['user_name'] = $user['user_fname']." ".$user['user_lname'];
        $_SESSION['user_img'] = $user['user_img'];
        // $response['session id'] = $_SESSION['user_id'];
        // $response['session name'] = $_SESSION['user_name'];
        // $response['session username'] = $_SESSION['ua_username'];
        // $response['session farms_id'] = $_SESSION['farms_id'];
        // $response['session position_desc'] = $_SESSION['position_desc'];
        } else {
            $response['status'] = "error";
            $response['message'] = 'Login failed. Incorrect credentials';
        }
    } else {
            $response['status'] = "error";
            $response['message'] = 'No such user is registered';
        }
    //echoResponse(200, $response);============================================================================
    //return json_encode($response);

    $this->response($this->json($response), 200);
  

 
}//function sa login

private function session(){ 
            if($this->get_request_method() != "GET"){
                $this->response('',406);
            }
            
            $db = new DbHandler();
            $session = $db->getSession();
            $response["user_id"] = $session['user_id'];
            $response["farms_desc"] = $session['farms_desc'];
            $response["farms_id"] = $session['farms_id'];
            //$response["user_username"] = $session['user_username'];
            $response["user_name"] = $session['user_name'];
            $response["user_img"] = $session['user_img'];
            //echoResponse(200, $session);=====================================================================================
            $this->response($this->json($session), 200);
            
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Get Counter Compliance
private function getComplianceCounter(){

    if($this->get_request_method() != "GET"){
        $this->response('',406);

    }
    
    $query="SELECT * FROM view_compliance_counter";
    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

    if($r->num_rows > 0){
        $result = array();
        while($row = $r->fetch_assoc()){
            $result[] = $row;
        }
        $this->response($this->json($result), 200); // send user position description
    }
    $this->response('',204);    // If no records "No Content" status

 }//function sa getComplianceCounter


////////////////////////////////////////////////////////

//Get Rank..........
private function getRankTableOverall(){

    if($this->get_request_method() != "GET"){
        $this->response('',406);

    }
    
    $query="SELECT envi_id,farms_desc,SUM(envi_score) AS score,envi_rate,envi_weekno FROM view_rank WHERE envi_rate = 'Yes' GROUP BY farms_desc ORDER BY score DESC";
    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

    if($r->num_rows > 0){
        $result = array();
        while($row = $r->fetch_assoc()){
            $result[] = $row;
        }
        $this->response($this->json($result), 200); // send user position description
    }
    $this->response('',204);    // If no records "No Content" status

 }//function sa getPositionCB

 private function getRankTableWeek(){

    if($this->get_request_method() != "GET"){
        $this->response('',406);

    }
    $ddate = date("Y-m-d");
    $date = new DateTime($ddate);
    $week = intval(date('W'));
    if (date('w') == 0) {            // 0 = Sunday
        $week++;
    }
    //
    $query="SELECT envi_id,farms_desc,SUM(envi_score) AS score,envi_rate,envi_weekno FROM view_rank WHERE envi_rate = 'Yes' AND envi_weekno = '".$week."' GROUP BY farms_desc ORDER BY score DESC";
    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

    if($r->num_rows > 0){
        $result = array();
        while($row = $r->fetch_assoc()){
            $result[] = $row;
        }
        $this->response($this->json($result), 200); // send user position description
    }
    $this->response('',204);    // If no records "No Content" status

 }//function sa getPositionCB
/////////////////////////////


//////////////////Upload Pictures 
private function UploadReg(){


$response = array();
$target_path = "../uploads/";
 
$target_path = $target_path . basename( $_FILES['file']['name']);
 
if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
    echo "Upload and move successfully";
    $response[] = array("status" => "success", "message" => "Citizen record successfully updated.","filename" => basename( $_FILES['file']['name']));
} else{
echo $target_path;
    echo "There was an error uploading the file, please try again!";
}

$this->response($this->json($response), 200);



} //closing bracket sa UploadReg



///////////////////////////////
//////////GET COMBO VALUE//////////////////////////////////////////////////////////////////////////////////////
 private function getPositionCB(){

    if($this->get_request_method() != "GET"){
        $this->response('',406);

    }
    
    $query="SELECT position_id,position_desc FROM tbl_position";
    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

    if($r->num_rows > 0){
        $result = array();
        while($row = $r->fetch_assoc()){
            $result[] = $row;
        }
        $this->response($this->json($result), 200); // send user position description
    }
    $this->response('',204);    // If no records "No Content" status

 }//function sa getPositionCB

private function getFarmsCB(){

    if($this->get_request_method() != "GET"){
        $this->response('',406);

    }
    
    $query="SELECT farms_id,farms_desc FROM tbl_farms";
    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

    if($r->num_rows > 0){
        $result = array();
        while($row = $r->fetch_assoc()){
            $result[] = $row;
        }
        $this->response($this->json($result), 200); // send user details
    }
    $this->response('',204);    // If no records "No Content" status

 }//function sa getFarmsCB

 private function getLocationCB(){

    if($this->get_request_method() != "GET"){
        $this->response('',406);

    }
    
    $query="SELECT location_id,location_desc FROM tbl_location";
    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

    if($r->num_rows > 0){
        $result = array();
        while($row = $r->fetch_assoc()){
            $result[] = $row;
        }
        $this->response($this->json($result), 200); // send user details
    }
    $this->response('',204);    // If no records "No Content" status

 }//function sa getLocationCB

  private function getOperationCB(){

    if($this->get_request_method() != "GET"){
        $this->response('',406);

    }
    
    $query="SELECT operations_id,operations_desc FROM tbl_operations";
    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

    if($r->num_rows > 0){
        $result = array();
        while($row = $r->fetch_assoc()){
            $result[] = $row;
        }
        $this->response($this->json($result), 200); // send user details
    }
    $this->response('',204);    // If no records "No Content" status

 }//function sa getLocationCB
 private function getCriteriaCB(){

    if($this->get_request_method() != "GET"){
        $this->response('',406);

    }
    
    $query="SELECT ecrit_id,ecrit_desc FROM tbl_envi_findings_criteria";
    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

    if($r->num_rows > 0){
        $result = array();
        while($row = $r->fetch_assoc()){
            $result[] = $row;
        }
        $this->response($this->json($result), 200); // send user position description
    }
    $this->response('',204);    // If no records "No Content" status

 }//function sa getCriteriaCB

 private function getPTICB(){

    if($this->get_request_method() != "GET"){
        $this->response('',406);

    }
    
    $query="SELECT PTI_id,PTI_desc FROM tbl_pti";
    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

    if($r->num_rows > 0){
        $result = array();
        while($row = $r->fetch_assoc()){
            $result[] = $row;
        }
        $this->response($this->json($result), 200); // send user position description
    }
    $this->response('',204);    // If no records "No Content" status

 }//function sa getPTICB


 private function getStatus(){

    if($this->get_request_method() != "GET"){
        $this->response('',406);

    }
    
    $query="SELECT stat_id,stat_desc FROM tbl_hands_status_desc";
    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

    if($r->num_rows > 0){
        $result = array();
        while($row = $r->fetch_assoc()){
            $result[] = $row;
        }
        $this->response($this->json($result), 200); // send user position description
    }
    $this->response('',204);    // If no records "No Content" status

 }//function sa getPositionCB

//////////////////////////CARDS////////////////////////////////////
 
//////////////////////////CARDS////////////////////////////////////
  private function getEnviReportCard(){

    if($this->get_request_method() != "GET"){
        $this->response('',406);

    }

    $rated = $_GET["mode"];

    $query="SELECT * FROM view_envireport WHERE envi_rate = '{$rated}' ORDER BY envi_subdate DESC";
    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
    if($r->num_rows > 0){
        $result = array();
        while($row = $r->fetch_assoc()){
            $result[] = $row;
        }
        $this->response($this->json($result), 200); // send user details
    }
    $this->response('',204);    // If no records "No Content" status

 }//function sa getReportCard


private function getEnviReportCards(){    
            if($this->get_request_method() != "GET"){
                $this->response('',406);
            }
            $id = (int)$this->_request['id'];
            if($id > 0){    
                $query="SELECT * FROM view_envireport where u.envi_id=$id";
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                if($r->num_rows > 0) {
                    $result = $r->fetch_assoc();    
                    $this->response($this->json($result), 200); // send user details
                }
            }
            $this->response('',204);    // If no records "No Content" status
        }//function sa getReportCards


private function getHandsReportCard(){

    if($this->get_request_method() != "GET"){
        $this->response('',406);

    }
    $validate = $_GET["mode"];
    $query="SELECT * FROM view_handsreport WHERE hands_status_validate = '{$validate}'  ORDER BY hands_date DESC";
    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
    if($r->num_rows > 0){
        $result = array();
        while($row = $r->fetch_assoc()){
            $result[] = $row;
        }
        $this->response($this->json($result), 200); // send user details
    }
    $this->response('',204);    // If no records "No Content" status

 }//function sa getReportCard


private function getHandsReportCards(){    
            if($this->get_request_method() != "GET"){
                $this->response('',406);
            }
            $id = (int)$this->_request['id'];
            if($id > 0){    
                $query="SELECT * FROM view_handsreport where u.hands_id=$id";
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                if($r->num_rows > 0) {
                    $result = $r->fetch_assoc();    
                    $this->response($this->json($result), 200); // send user details
                }
            }
            $this->response('',204);    // If no records "No Content" status
        }//function sa getReportCards


private function getStaffReport(){    

        
    if($this->get_request_method() != "GET"){
        $this->response('',406);

    }

    $ddate = date("Y-m-d");
    $date = new DateTime($ddate);
    $week = intval(date('W'));
    if (date('w') == 0) {            // 0 = Sunday
        $week++;
    }

    if (!isset($_SESSION)) {
                session_start();
    }

    $query="SELECT * FROM view_handsreport WHERE user_id = '".$_SESSION['user_id']."' AND hands_weekno = '".$week."'";
    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
    if($r->num_rows > 0){
        $result = array();
        while($row = $r->fetch_assoc()){
            $result[] = $row;
        }
        $this->response($this->json($result), 200); // send user details
         
    }
    $this->response('',204);    // If no records "No Content" status

        }//function sa getStaffReport
/////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////ELEMENT///////////////////////////////////////
private function getPies(){    
            
    if($this->get_request_method() != "GET"){
        $this->response('',406);

    }

    $query="SELECT ecrit_desc AS 'key',freq AS 'y' FROM view_criteria_frequency ORDER BY freq DESC LIMIT 5";
    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
    if($r->num_rows > 0){
        $result = array();
        while($row = $r->fetch_assoc()){
            $result[] = $row;
        }
    $this->response($this->json($result), 200); // send user details
            }
    $this->response('',204);    // If no records "No Content" status
        }//function sa getPie

private function getHorizontalMonitoring(){    
            
    if($this->get_request_method() != "GET"){
        $this->response('',406);

    }
     
    // initialize the values
    $cont = array(
        array("label" => 'Jan', "value" => 0, "totcount" => 0),
        array("label" => 'Feb', "value" => 0, "totcount" => 0),
        array("label" => 'Mar', "value" => 0, "totcount" => 0),
        array("label" => 'Apr', "value" => 0, "totcount" => 0),
        array("label" => 'May', "value" => 0, "totcount" => 0),
        array("label" => 'Jun', "value" => 0, "totcount" => 0),
        array("label" => 'Jul', "value" => 0, "totcount" => 0),
        array("label" => 'Aug', "value" => 0, "totcount" => 0),
        array("label" => 'Sep', "value" => 0, "totcount" => 0),
        array("label" => 'Oct', "value" => 0, "totcount" => 0),
        array("label" => 'Nov', "value" => 0, "totcount" => 0),
        array("label" => 'Dec', "value" => 0, "totcount" => 0)
    );

    $query="SELECT hands_id, hands_date, stat_desc FROM view_handsreport WHERE YEAR(hands_date) = YEAR(CURDATE())";

    //$query="SELECT operations_desc as 'label',freq as 'value' FROM view_operation_frequency";
    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
        
    $values = array();
    $result=$r->fetch_all(MYSQLI_ASSOC);
    for($row = 0; $row < count($result); $row++)
    {

        //fetch each result per month
        $time = strtotime($result[$row]["hands_date"]);
        $month= date("n", $time);
        $month= intval($month);

        if ($result[$row]["stat_desc"] == "Closed") {
            $cont[$month - 1]["value"] += 1;
        }
        else if ($result[$row]["stat_desc"] == "New Findings") {
            continue;
        }

        $cont[$month - 1]["totcount"] += 1;
    }

    

    // change raw value to equivalent percentage
    for($i = 0; $i < count($cont); $i++) {
        if ($cont[$i]["value"] != 0 && $cont[$i]["totcount"] != 0)
            $cont[$i]["value"] = $cont[$i]["value"] / $cont[$i]["totcount"];
    }


    // compatibility layer with the chart plugin
    $res[] = array("values" => $cont);

    $this->response($this->json($res), 200); // send user details
        
       //}
    $this->response('',204);    // If no records "No Content" status
}//function sa getHorizontalBarMonitoring

private function getHorizontalBar(){    
            
    if($this->get_request_method() != "GET"){
        $this->response('',406);

    }
      
    $query="SELECT operations_desc as 'label',freq as 'value' FROM view_operation_frequency";
    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
        
        $values = array();
        $result=$r->fetch_all(MYSQLI_ASSOC);
        for($row = 0; $row < count($r); $row++)
        {
            $values[] = array('values' => $result);

        }
        $to_encode = array(
                        array( 
                              'values' => $values
                              )
                        );

    $this->response($this->json($values), 200); // send user details
        
       //}
    $this->response('',204);    // If no records "No Content" status
}//function sa getHorizontalBar

private function getVerticalBar(){    
            
    if($this->get_request_method() != "GET"){
        $this->response('',406);

    }
      
    $query="SELECT PTI_desc as 'label' ,freq as 'value' FROM view_pti_frequency ORDER BY freq DESC LIMIT 2";
    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
        
        $values = array();
        $result=$r->fetch_all(MYSQLI_ASSOC);
        for($row = 0; $row < count($r); $row++)
        {
            $values[] = array('values' => $result);

        }
        $to_encode = array(
                        array( 
                              'values' => $values
                              )
                        );

    $this->response($this->json($values), 200); // send user details
        
       //}
    $this->response('',204);    // If no records "No Content" status
}//function sa getVerticalBar


private function getDonut(){    
            
    if($this->get_request_method() != "GET"){
        $this->response('',406);

    }

    $query="SELECT PTI_desc as 'key', freq as 'y' FROM `view_pti_frequency`";
    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
    if($r->num_rows > 0){
        $result = array();
        while($row = $r->fetch_assoc()){
            $result[] = $row;
        }
    $this->response($this->json($result), 200); // send user details
            }
    $this->response('',204);    // If no records "No Content" status
        }//function sa getDonut

private function getPies1(){    
            
    if($this->get_request_method() != "GET"){
        $this->response('',406);

    }

    $query="SELECT CASE stat_desc WHEN 'On-Going' Then 'Failed' WHEN 'Closed' THEN 'Passed' END AS 'key', y as 'y' FROM view_percentage WHERE NOT stat_desc = 'New Findings'";
    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
    if($r->num_rows > 0){
        $result = array();
        while($row = $r->fetch_assoc()){
            $result[] = $row;
        }
    $this->response($this->json($result), 200); // send user details
            }
    $this->response('',204);    // If no records "No Content" status
        }//function sa getPie
/////////////////////////////////////////////////////////////////////////////////

///////INSERTS///////////////////////////////////////////////////////////////////

private function insertUser(){
            if($this->get_request_method() != "POST"){
                $this->response('',406);
            }
            
            $user = json_decode(file_get_contents("php://input"),true);
            $column_names = array('user_fname','user_lname','farms_id','position_id','user_img');
            $keys = array_keys($user);
            $columns = '';
            $values = '';
            foreach($column_names as $desired_key){ // Check the user received. If blank insert blank into the array.
               if(!in_array($desired_key, $keys)) {
                    $$desired_key = '';
                }else{
                    $$desired_key = $user[$desired_key];
                }
                $columns = $columns.$desired_key.',';
                $values = $values."'".$$desired_key."',";
            }

            $query = "INSERT INTO tbl_user(".trim($columns,',').") VALUES(".trim($values,',').")";
                 if(!empty($user)){
                    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                    $last_ids = $this->mysqli->insert_id;
                    $column_names1 = array('ua_username','ua_password');
                    $keys1 = array_keys($user);
                    $columns1 = '';
                    $values1 = '';
                    
                    foreach($column_names1 as $desired_key1){ // Check the user received. If blank insert blank into the array.
                        if(!in_array($desired_key1, $keys1)) {
                             $$desired_key = '';
                         }else{
                             $$desired_key = $user[$desired_key1];
                         }
                         $columns1 = $columns1.$desired_key1.',';
                         $values1 = $values1."'".$$desired_key."',";
                    }
                    $query1 = "INSERT INTO tbl_user_account(user_id,".trim($columns1,',').") VALUES('".$last_ids."',".trim($values1,',').")";
                    
                    if(!empty($user)){
                         $r1 = $this->mysqli->query($query1) or die($this->mysqli->error.__LINE__);
                    }
                    $success = array('status' => "User Added Successfully!", "msg" => "User Created Successfully.", "data" => $user);
                    $this->response($this->json($success),200);
                }else
                    $this->response('',204);    //"No Content" status
                   
        
        }//function sa insertUser

private function insertEnvi(){
            if($this->get_request_method() != "POST"){
                $this->response('',406);
            }
            
            // return $hey;
            $ddate = date("Y-m-d");
            $date = new DateTime($ddate);
            $week = intval(date('W'));
            if (date('w') == 0) {            // 0 = Sunday
                $week++;
            }
            $user = json_decode(file_get_contents("php://input"),true);
            $column_names = array('location_id','operations_id','envi_findings','envi_img');
            $keys = array_keys($user);
            $columns = '';
            $values = '';
            foreach($column_names as $desired_key){ // Check the user received. If blank insert blank into the array.
               if(!in_array($desired_key, $keys)) {
                    $$desired_key = '';
                }else{
                    $$desired_key = $user[$desired_key];
                }
                $columns = $columns.$desired_key.',';
                $values = $values."'".$$desired_key."',";
            }
             if (!isset($_SESSION)) {
                session_start();
            }
            $query = "INSERT INTO tbl_envi(envi_subdate,envi_weekno,user_id,farms_id,".trim($columns,',').") VALUES('".$ddate."','".$week."','".$_SESSION['user_id']."','".$_SESSION['farms_id']."',".trim($values,',').")";
            
            if(!empty($user)){
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                $envi_last_id = $this->mysqli->insert_id;
                $score = 0;
                $criteria = 0;
                $rate = "No";
                $query1 = "INSERT INTO tbl_envi_scoring(envi_id,envi_score,ecrit_id ,envi_rate) VALUES('".$envi_last_id."','".$score."','".$criteria."','".$rate."')";
                
                if(!empty($user)){
                     $r1 = $this->mysqli->query($query1) or die($this->mysqli->error.__LINE__);
                }
                $success = array('status' => "Environment Report Sent Successfully!", "msg" => "Envi Report Success", "data" => $user,"week" => $week,"date " => $ddate);
                $this->response($this->json($success),200);

            }else
                $this->response('',204);    //"No Content" status
                
        
        }//function sa insertUser
//editon
private function insertHands(){
            if($this->get_request_method() != "POST"){
                $this->response('',406);
            }
            // return $hey;
            $ddate = date("Y-m-d");
            $date = new DateTime($ddate);
            $week = intval(date('W'));
            if (date('w') == 0) {            // 0 = Sunday
                $week++;
            }
            $user = json_decode(file_get_contents("php://input"),true);
            $column_names = array('PTI_id','hands_req_of','hands_time_frame','hands_findings','hands_action_plan','hands_img');
            $keys = array_keys($user);
            $columns = '';
            $values = '';
            foreach($column_names as $desired_key){ // Check the user received. If blank insert blank into the array.
               if(!in_array($desired_key, $keys)) {
                    $$desired_key = '';
                }else{
                    $$desired_key = $user[$desired_key];
                }
                $columns = $columns.$desired_key.',';
                $values = $values."'".$$desired_key."',";
            }

            if (!isset($_SESSION)) {
                session_start();
            }

            $query = "INSERT INTO tbl_hands(hands_date,hands_weekno,user_id,farms_id,".trim($columns,',').") VALUES('".$ddate."','".$week."','".$_SESSION['user_id']."','".$_SESSION['farms_id']."',".trim($values,',').")";

            if(!empty($user)){
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                $hands_last_id = $this->mysqli->insert_id;

                $column_names1 = array('stat_id');
                    $keys1 = array_keys($user);
                    $columns1 = '';
                    $values1 = '';
                $validate = "No";
                foreach($column_names1 as $desired_key1){ // Check the user received. If blank insert blank into the array.
                        if(!in_array($desired_key1, $keys1)) {
                             $$desired_key = '';
                         }else{
                             $$desired_key = $user[$desired_key1];
                         }
                         $columns1 = $columns1.$desired_key1.',';
                         $values1 = $values1."'".$$desired_key."',";
                }
                $query1 = "INSERT INTO tbl_hands_status_update(hands_id,hands_status_validate,".trim($columns1,',').") VALUES('".$hands_last_id."','".$validate."',".trim($values1,',').")";
                
                if(!empty($user)){
                     $r1 = $this->mysqli->query($query1) or die($this->mysqli->error.__LINE__);
                }
                $success = array('status' => "Report Successfully Sent!", "msg" => "Envi Report Class", "data" => $user,"week" => $week,"date " => $ddate);
                $this->response($this->json($success),200);

            }else
                $this->response('',204);    //"No Content" status
                
        
        }//function sa insertUser

private function user(){    
            if($this->get_request_method() != "GET"){
                $this->response('',406);
            }
            $id = (int)$this->_request['id'];
            if($id > 0){    
                $query="SELECT distinct u.user_fname,u.user_lname,u.farms_id,u.position_id FROM tbl_user u where u.user_id=$id";
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                if($r->num_rows > 0) {
                    $result = $r->fetch_assoc();    
                    $this->response($this->json($result), 200); // send user details
                }
            }
            $this->response('',204);    // If no records "No Content" status
        }//function sa user


private function envi(){    
            if($this->get_request_method() != "GET"){
                $this->response('',406);
            }
            $id = (int)$this->_request['id'];
            if($id > 0){    
                $query="SELECT distinct u.farms_id,u.location_id,u.operations_id,u.envi_findings FROM tbl_envi u where u.envi_id=$id";
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                if($r->num_rows > 0) {
                    $result = $r->fetch_assoc();    
                    $this->response($this->json($result), 200); // send user details
                }
            }
            $this->response('',204);    // If no records "No Content" status
        }//function sa user

private function envis(){   
            if($this->get_request_method() != "GET"){
                $this->response('',406);
            }
            $query="SELECT distinct u.farms_id,u.location_id,u.operations_id,u.envi_findings FROM tbl_envi u";
            $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

            if($r->num_rows > 0){
                $result = array();
                while($row = $r->fetch_assoc()){
                    $result[] = $row;
                }
                $this->response($this->json($result), 200); // send user details
            }
            $this->response('',204);    // If no records "No Content" status
        }
        //
private function hands(){    
            if($this->get_request_method() != "GET"){
                $this->response('',406);
            }
            $id = (int)$this->_request['id'];
            if($id > 0){    
                $query="SELECT distinct u.hands_id,u.hands_date,u.hands_weekno,u.user_id,u.farms_id,u.PTI_id,u.hands_req_of,u.hands_time_frame,u.hands_findings,u.hands_action_plan FROM tbl_hands u where u.hands_id=$id";
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                if($r->num_rows > 0) {
                    $result = $r->fetch_assoc();    
                    $this->response($this->json($result), 200); // send user details
                }
            }
            $this->response('',204);    // If no records "No Content" status
        }//function sa user

private function handss(){   
            if($this->get_request_method() != "GET"){
                $this->response('',406);
            }
            $query="SELECT distinct u.hands_id,u.hands_date,u.hands_weekno,u.user_id,u.farms_id,u.PTI_id,u.hands_req_of,u.hands_time_frame,u.hands_findings,u.hands_action_plan FROM tbl_hands u";
            $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

            if($r->num_rows > 0){
                $result = array();
                while($row = $r->fetch_assoc()){
                    $result[] = $row;
                }
                $this->response($this->json($result), 200); // send user details
            }
            $this->response('',204);    // If no records "No Content" status
        }
///////////////////////UPDATES////////////////////////////////////////////////////
private function updateCriteria(){
        if($this->get_request_method() != "POST"){
            $this->response('',406);
        }
        $envi = json_decode(file_get_contents("php://input"),true);
        $id = (int)$envi['id'];
        $column_names = array('envi_findings');
        $keys = array_keys($envi['envi']);
        $columns = '';
        $values = '';
        foreach($column_names as $desired_key){ // Check the customer received. If key does not exist, insert blank into the array.
           if(!in_array($desired_key, $keys)) {
                $$desired_key = '';
            }else{
                $$desired_key = $envi['envi'][$desired_key];
            }
            $columns = $columns.$desired_key."='".$$desired_key."',";
        }
        $query = "UPDATE tbl_envi SET ".trim($columns,',')." WHERE envi_id=$id";


        if(!empty($envi)){
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                $id1 = (int)$envi['id'];
                $column_names1 = array('ecrit_id','envi_score');
                $keys1 = array_keys($envi['envi']);
                $columns1 = '';
                $values1 = '';
                foreach($column_names1 as $desired_key1){ // Check the customer received. If key does not exist, insert blank into the array.
                   if(!in_array($desired_key1, $keys1)) {
                        $$desired_key = '';
                    }else{
                        $$desired_key = $envi['envi'][$desired_key1];
                    }
                    $columns1 = $columns1.$desired_key1."='".$$desired_key."',";
                }
                $rate = "Yes";
                $query1 = "UPDATE tbl_envi_scoring SET envi_rate='".$rate."',".trim($columns1,',')." WHERE envi_id=$id";
                if(!empty($envi)){
                     $r1 = $this->mysqli->query($query1) or die($this->mysqli->error.__LINE__);
                     $success = array('status' => "Success", "msg" => "Report ".$id." Rated Successfully.", "data" => $envi);
                    $this->response($this->json($success),200);
                }
            
        }else
            $this->response('',204);    // "No Content" status
}


private function updateHands(){
        if($this->get_request_method() != "POST"){
            $this->response('',406);
        }
        $hands = json_decode(file_get_contents("php://input"),true);
        $id = (int)$hands['id'];
        $column_names = array('stat_id');
        $keys = array_keys($hands['hands']);
        $columns = '';
        $values = '';
        $validate = "Yes";
        foreach($column_names as $desired_key){ // Check the customer received. If key does not exist, insert blank into the array.
           if(!in_array($desired_key, $keys)) {
                $$desired_key = '';
            }else{
                $$desired_key = $hands['hands'][$desired_key];
            }
            $columns = $columns.$desired_key."='".$$desired_key."',";
        }
        $query = "UPDATE tbl_hands_status_update SET ".trim($columns,',').",hands_status_validate='".$validate."' WHERE hands_id=$id";

        if(!empty($hands)){
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                   $success = array('status' => "Success", "msg" => "Health and Safety Form No. ".$id." validated Successfully.", "data" => $hands);
                   $this->response($this->json($success),200);
        }   
}





///////////////LOG OUT/////////////////////////////////////////////////
        private function logout(){  
            if($this->get_request_method() != "GET"){
                $this->response('',406);
            }
            
            $db = new DbHandler();
            $session = $db->destroySession();
            $response["status"] = "info";
            $response["message"] = "Logged out successfully";
            //echoResponse(200, $response);===================================================================================
            $this->response($this->json($response), 200);
        
        }































 private function json($data){
            if(is_array($data)){
                return json_encode($data);
            }
    }

}// closing tag  sa class
 
    // Initiiate Library
    $api = new API;
    $api->processApi();



   ?>