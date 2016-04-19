<?php /* Template Name: Web Service  */ ?>
<?php
header('Access-Control-Allow-Origin: *');

// login
function login(){
	global $wpdb;
	$prefix = $wpdb->prefix;
	$username=$_REQUEST['username'];
	$password=$_REQUEST['password'];
	if(!empty($username) && !empty($password)){
		$user = get_user_by( 'login', $username );
		if($user && wp_check_password($password, $user->data->user_pass, $user->ID)){
			
			$data=array(
				'ID'=>$user->ID,
				
			);
			$msg="User Details";
			$posts[] = array('status'=>'Y','msg'=>$msg,'result'=>$data);
			echo json($posts);
		}else{
			$msg="Invalid Login Details !";	
			$posts[] = array('status'=>'N','msg'=>$msg,'result'=>array());
			echo json($posts);
		}
	}else{
		$msg="Invalid Required Details !";
		$posts[] = array('status'=>'N','msg'=>$msg,'result'=>array());
		echo json($posts);
	}
}

//Forget Password
function forget_password(){ 
	global $wpdb;
	$prefix = $wpdb->prefix;
	$userEmail=$_REQUEST['userEmail'];
	if(!empty($userEmail)){
		
		$user = get_user_by( 'email',$userEmail);
		if($user){
			//create password
			$pass=rand(1000000,100000000);
			//change password
			wp_set_password($pass, $user->ID);
			//email 
			$to = $userEmail;
			$subject = 'Password Change';
			$body = ' Hello  '.$user->data->display_name.'<br> Password Change Successfully. Your New Password = '.$pass;
			$headers = array('Content-Type: text/html; charset=UTF-8');
			wp_mail( $to, $subject, $body, $headers);
			
			//msg
			$msg="Password Change Successfully";
			$posts[] = array('success'=>'1','msg'=>$msg,'result'=>array());
			echo json($posts);
		}else{
			$msg="Invalid Email Details !";	
			$posts[] = array('success'=>'0','msg'=>$msg,'result'=>array());
			echo json($posts);
		}
	}else{
		$msg="Invalid Required Details !";
		$posts[] = array('success'=>'0','msg'=>$msg,'result'=>array());
		echo json($posts);
	}
}


function json($text){
	return json_encode($text);
}


$method = $_REQUEST['action'];

switch($method){	
	case 'login':
		login();
		break;
	case 'forget_password':
		forget_password();
		break;
	
} 

?>
