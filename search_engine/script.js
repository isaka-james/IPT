// create the variable to edit DOM element for div id="show"
const resultPage = document.getElementById('show');


// this function gets executed when user clicks "search" button
function search_this(){
    // creating the DOM for the inputSearch (input field)
    const inputOfUser = document.getElementById('inputSearch');
    // put the values of the input field to searchText variable
    const searchText = inputOfUser.value;

    // delete all htmls on the div id='show' 
    resultPage.innerHTML='';

    // if the user typed nothing to the input field 
    if(searchText===''){
        // show that the input is empty
        error_response('Empty Search Field !');
        return;
    }

    // when user gets here it means he has something in the search field

    // this function sends the data to the server and accept the results to be displayed and display them accordingly
    send_to_server(searchText);

}



// this function sends data to the server and display the results to the html accordingly
function send_to_server(message){

    // we need to encode the search input in url format
    message = encodeURIComponent(message);



    // we are dealing with api here
    fetch(`/api.php?search=${message}`)

        // get the response status from the server
        .then(function (response){
            // if the api function was successfully then,
            if(response.status==200){
                    return response.json(); // we expect json answers from the server
            }else{
                throw new Error('failed!');
            }
        })
        
        // data is the one which was returned from .then(function(rensponse))   ==> return response.json()
        .then(function (data){
            // remember data is in json format it contains the results of the user input

            // this forEach is used to iterate the json
            data.forEach(function(item){
                var resultElement = document.createElement('div');
                resultElement.innerHTML = `<div class="singleResult"><img src="images/${item.imagePath}" alt="${item.caption}" height="350" width="350"><p style="text-align:center;font-size: 20px;color:#4169E1;font-weight: 600;" id="image-descr" onClick="see_this('${item.imageID}','${item.caption}','${item.timeUploaded}','${item.uploadedBy}','images/${item.imagePath}')">${item.caption}</p></div>`;

                resultPage.appendChild(resultElement);
            });

            // When the server says no results ( meaning the json is empty )
            if(Object.keys(data).length === 0){
                resultPage.innerHTML = `<div class="singleResult"><img src="/images/no-search.png" alt="photo" height="350" width="350"><p style="text-align:center;font-size: 20px;color:#8ea0bc;font-weight: 600;"> No Result Found !</p></div>`;
                return;
            }

            // when all the answers are displayed successfully then exit
           return;
        })
        
        // if any errors from fetch(api) then do this,
        .catch(function(error){
                // just throw the error to the f12
                throw new Error('The user has not connected to the Internet!');
        });
    
}

// This executed when the user typed nothing it will show 'empty search field!'
function error_response(error){
    resultPage.innerHTML=`<div class="singleResult"><p style="text-align:center;font-size: 20px;color:#FF6347;font-weight: 600;opacity: 80%;"> ${error}</p></div>`;
}


function see_this(id,name,time,uploader,src){
    resultPage.innerHTML = `<div class="singleResult"><p style="text-align:center;font-size: 25px;color:#2F4F4F;font-weight: 600;" id="image-descr">${name}</p><img src="${src}" alt="photo" height="350" width="350"><p style="text-align:center;font-size: 20px;color:#4169E1;font-weight: 600;" id="image-descr">${time}</p><p style="text-align:center;font-size: 18px;color:#4169E1;font-weight: 600;" id="image-descr">uploaded by : ${uploader}</p><p style="text-align:center;font-size: 18px;color:#3E57A0;font-weight: 600; float: left !important;" id="image-descr"><a href="${src}" download="${name}.jpg" style="text-decoration: none;">Download</a></p></div>`;
    return;
}

// send request to the server based on userinput

// get response from the server

// determine and show results to the home page