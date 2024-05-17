<?php
// handles the login and accepting the post(save photos to the database) from the clients

// make the headers, they are important for the browser
header("Access-Control-Allow-Origin: *"); // ACCESS FROM ANYWHERE

header("Access-Control-Allow-Methods: GET,POST,OPTIONS"); // NO POST HERE

header("Access-Control-Allow-Headers: Content-Type"); // Allow specific headers


// filter the sql injections
function test_input($data){
    $data = trim($data);
    $data = stripcslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

require_once('../config.php');

// accept the user when he only sent GET request (/api.php?search=*********)
if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $photo_dir = __DIR__."/../images/";
    
    $capt = $_POST['caption'];

    $photo_file = $photo_dir.basename($_FILES['photo']['name']);
    $name_photo = $_FILES['photo']['name'];

    if(move_uploaded_file($_FILES['photo']['tmp_name'],$photo_file)){
        $today = date('Y-m-d h:i:s');
        $query = "INSERT INTO gallery(caption,imagePath,uploadedBy,timeUploaded) VALUES('$capt','$name_photo','1','$today');";
        $res = mysqli_query($conn,$query);
        if(isset($res)){
            echo 'good';
        }else{
            echo 'bad';
        }

    }else{
        echo 'bad';
        exit;
    }

    mysqli_close($conn);
    exit;

}else if($_SERVER['REQUEST_METHOD'] == 'GET'){
    $username =test_input( $_GET['username']);
    $pwd = test_input($_GET['pwd']);

    $query = "select password from admin where username = '$username';";
    $real_pwd = mysqli_query($conn,$query);

    if(mysqli_num_rows($real_pwd) > 0){
        $p_w_d = mysqli_fetch_array($real_pwd);
        $real_password = $p_w_d[0];
    }

    if($pwd==$real_password){
        echo 'good';
    }else{
        echo 'bad';
    }
        // closing the connections and freeup memory
    mysqli_free_result($real_pwd);
    mysqli_close($conn);
    exit;
}


?>
