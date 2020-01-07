

var status=0;
function slideDown(){
    console.log("실행전 :" +status);
    if(status%2!=0){
        console.log("up")
        $(".collapsible-body").slideUp();
        status ++;
    }else{
        console.log("down")
        $(".collapsible-body").slideDown();
        status ++;
    }	
    if(status == 10){
        status = 0;
    }
    
    console.log("실행후 :" +status);
}