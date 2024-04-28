function login(){
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    const usr = username.value;
    const pwd = password.value;

    check_validity(usr,pwd);

}

function check_validity(username,password){
     // we are dealing with api here
    fetch(`/admin/admin.php?username=${username}&pwd=${password}`)
        // get the response status from the server
        .then(function (response){
            // if the api function was successfully then,
            if(response.status==200){
                    return response.text(); // we expect text response
            }else{
                throw new Error('failed!');
            }
        })
        
        // data is the one which was returned from .then(function(rensponse))   ==> return response.text()
        .then(function (data){
            // handles the response here
            if(data==='bad'){
                const invalid = document.getElementById('invalidData');
                invalid.style.display='flex';
                return;
            }
            
            // if user lands here it means he logged successfully

            // disable loggin form 
            const loginForm = document.getElementById('loginForm');
            loginForm.style.display = 'none';


            // enable upload form
            const uploadForm = document.getElementById('uploadForm');
            uploadForm.style.display='flex'; 
        })
        
        // if any errors from fetch(api) then do this,
        .catch(function(error){
                // just throw the error to the f12
                throw new Error('The user has not connected to the Internet!');
        });

}


function send_photos(){
    console.log('okay we are sending');
    
    var formData =new FormData();

    var imageFile = document.getElementById('photo').files[0];
    formData.append('photo',imageFile);

    var textData = document.getElementById('caption');
    var captionText = textData.value;

    formData.append('caption',captionText);

    fetch("/admin/admin.php", {
        method: 'POST',
        body: formData
    })
        .then(function (response){
            // if the api function was successfully then,
            if(response.status==200){
                    return response.text(); // we expect text response
            }else{
                throw new Error('failed!');
            }
        })
        
        // data is the one which was returned from .then(function(rensponse))   ==> return response.text()
        .then(function (data){
            // handles the response here
            const outcome = document.getElementById('uploadResult');
            outcome.style.display='flex';
            
             const res_ponse = document.getElementById('uploadResult');
            if(data==='bad'){
                res_ponse.textContent = 'could not upload the files';
                return;
            }else{
                res_ponse.textContent = 'Successfully uploaded the files';
                return;
            }
        })
        
        // if any errors from fetch(api) then do this,
        .catch(function(error){
                // just throw the error to the f12
                throw new Error('The user has not connected to the Internet!');
        });

}
