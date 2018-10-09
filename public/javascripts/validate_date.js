function submits(){
    // var froms = $('#departure').val();
    // var to = $("#dreturn").val();
    var froms = document.getElementById("departure").value;
    var tos = document.getElementById("dreturn").value;
    
    if(Date.parse(froms) > Date.parse(tos)){
       alert("Invalid Date Range");
       console.log("Invalid Date Range");
       return false; 
    }
    else{  
       console.log("Valid date Range");
       return true;
    }
    }