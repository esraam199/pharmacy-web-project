
var db;

$(document).ready(function onDeviceReady() {
    db = window.openDatabase("Pharamcy", "1.0", "Cordova Demo", 200000);
    db.transaction(populateDB);
})

function populateDB(tx) {

    tx.executeSql('CREATE TABLE IF NOT EXISTS LOGIN ( username, password)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Items (id INTEGER PRIMARY KEY AUTOINCREMENT, itemName, quantity , picture)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Invoices (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, date, customerName, type)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS InvoiceItem (invoicesId , itemid )');

   
    tx.executeSql('INSERT INTO LOGIN ( username, password) VALUES ( "Admin", "Admin")');

}




function check_login() {
    var username = $("#UserName").val();
    var password = $("#inputPassword2").val();


    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM LOGIN WHERE username=? AND password=?', [username, password], function (tx, results) {
            if (username == "Admin" && password == "Admin") {
                window.location.href = "HomepageAdmin.html";
            }
            else if (results.rows.length == 1) {
                window.location.href = "HomepageUser.html";
            }
            else { alert("Invalid username or password"); }
        }, null);
    });
    return false;
}

//Add User Function

function add_user() {
    var username = $("#UserNamee").val();
    var password = $("#inputPassword22").val();


    db.transaction(function (tx) {
        tx.executeSql('insert into LOGIN   values(?,?)', [username, password], function (tx, results) {
            if (results.rowsAffected == 1) {
                console.log("Sucess");
            }
            else { alert("Invalid username or password"); }
        }, null);
    });
    return false;
}


// Add items with Buy buttonS

function add_item() {
    var itemName = $("#itemName").val();
    var quantity = $("#quantityNum").val();
    var picture = $("#printresult").val();

    if (itemName.length != 0 && quantity.length != 0) {
        
        db.transaction(function (tx) {
             console.log("ddddd")
            tx.executeSql('SELECT * FROM Items WHERE itemName=? ', [itemName], function (tx, results) {
                if (results.rows.length == 1) {
                        tx.executeSql('update Items set quantity=quantity+? where itemName =?', [quantity, itemName], function (tx, results) {
                        if (results.rowsAffected == 1) {
                            alert("Product added successfully");
                        }
                    }, null);
                }

             else{
                tx.executeSql('insert into Items(itemName,quantity,picture) values(?,?,?)', [itemName, quantity, picture], function (tx, results) {
                    if (results.rowsAffected == 1) {
                        alert("Product added successfully");
                    }
    
    
                }, null);

            }
                
            }, null);

           
        });
    }
    else {
        alert("Please, Enter Item Name and Quantity")
    }
    return false;
}

//  Sell function with sell function

function sell_item() {
    var itemName = $("#itemName").val();
    var quantity = $("#quantityNum").val();

    if (itemName.length != 0 && quantity.length != 0) {
        db.transaction(function (tx) {
            tx.executeSql('select quantity from  Items  where itemName=?  ', [itemName], function (tx, results) {
                if (quantity <= results.rows[0].quantity) {
                    db.transaction(function (tx) {

                        tx.executeSql('update Items set quantity=quantity-? where itemName =?', [quantity, itemName]);

                    });

                }
                else {
                    alert("quantity not exist");
                }


            }, null);
        });
    }
    else {
        alert("Please, Enter Item Name and Quantity")
    }
    return false;
}

// Make invoice function

function make_invoice() {
    var type = $("#selectOption").val();
    var itemName = $("#itemName").val();
    var quantity = $("#quantityNum").val();
    var customerName = $("#custName").val();
    var date = $("#incvoiceDate").val();
    


    if (itemName.length != 0 && quantity.length != 0) {
        db.transaction(function (tx) {
            tx.executeSql('insert into Invoices(type,itemName,quantity,customerName ,date) values(?,?,?,?,?)', [type, itemName, quantity, customerName, date], function (tx, results) {
                if (results.rowsAffected == 1) {
                    alert("Invoice is made");
                }


            }, null);
        });
    }
    else {
        alert("Please, Enter Item Name and Quantity")
    }

    return false;
}


//-----Hide button take pic when you choose buy

function hideButtonPic() {


    var selectedOption = document.getElementById("selectOption").value;
    var selectedOption1 = document.getElementById("Option1").value;
    var selectedOption2 = document.getElementById("Option2").value;



    $(function () {
        if (selectedOption == selectedOption1) //sell  buttonName  buyButton

        {
            $("#adminAddImg").hide();
            $("#buyButton").hide();
            $("#sellButton").show();
        }
        else if (selectedOption == selectedOption2) { //buy
            $("#adminAddImg").show();
            $("#buyButton").show();
            $("#sellButton").hide();
        }
    });

};

// code for canvace
var resultb64="";
function capture() {  
 var video = document.querySelector("#video");
 if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream;
        })
        .catch(function (err0r) {
          console.log("Something went wrong!");
        });
 }      
   var canvas = document.getElementById('canvas');     
   var video = document.getElementById('video');
   canvas.width = 200;
   canvas.height = 200;
   canvas.getContext('2d').drawImage(video, 0, 0, 200,200);  
   document.getElementById("printresult").innerHTML = canvas.toDataURL(); 
}
document.getElementById("printresult").innerHTML = resultb64;





