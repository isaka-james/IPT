<?php

// make the headers, they are important for the browser
header("Access-Control-Allow-Origin: *"); // ACCESS FROM ANYWHERE

header("Access-Control-Allow-Methods: GET,OPTIONS"); // NO POST HERE

header("Access-Control-Allow-Headers: Content-Type"); // Allow specific headers


// filter the sql injections
function test_input($data){
    $data = trim($data);
    $data = stripcslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// accept the user when he only sent GET request (/api.php?search=*********)
if($_SERVER['REQUEST_METHOD'] == 'GET'){
     
    // check if the user has the GET for search (/api.php?search=*********)
    if(isset( $_GET['search'])){
        // save the GET the variable so we can easy use $data as $_GET['search']
        $data = $_GET['search'];
    }else{
        // when user has no GET request
        echo "Only GET method are allowed!";
        exit;
    }


    // return invalid request when no get post
    if($data == null){
        $error = array(
            'error' => 'incorrect method, use only GET!'
        );
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode($error);
        exit;
    }


    require('config.php');

    // when the server cannot connect to the database
    if (!$conn) {
        // echo 'Connection failed: ' . mysqli_connect_error();

        $error = array(
            'error' => 'server problem cannot connect to database!'
        );
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode($error);
        exit;
    }

    // filter sql injections
    $data = test_input($data);

    // executing the safe query
    $query = "select * from gallery where caption like '%$data%';";
    $result = mysqli_query($conn,$query);
    
    // initialize the array (in making json)
    $respond = array();

    // populate the array( containing results from the query) -- in making json
    while($row=mysqli_fetch_array($result)){
        $respond[]=$row;

    }

    // finally encoding to json
    $respond_json = json_encode($respond);

    // send the results to the client ---> (script.js)
    http_response_code(200);
    header('Content-Type: application/json');
    echo $respond_json;

    // closing the connections and freeup memory
    mysqli_free_result($result);
    mysqli_close($conn);
    exit;

}


?>
