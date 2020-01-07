function modalOverlay(B){
    var isModal = {
        'show':'none',
        'zIndex':0,
        'body' : 'scroll'
    };
    const tmp = isModal;
    if(B){
        isModal.zIndex	= 1000;
        isModal.show 	= 'block';
        isModal.body	= 'hidden';
    }else {
        isModal = tmp;
    }
    $('.modal-overlay').css({
        'display': isModal.show,
        'z-index': isModal.zIndex
    })
    $('body').css('overflow',isModal.body);
}
function showDetail(){
    $('.modalContent').css('display','block')
}
function hiddenDetail(){
    $('.modalContent').css('display','none')
}
function changeDetail(LR){
    if(LR === true){
        a = 1
        b = 2
    }else {
        a=2
        b=1
    }
    $('.modalContent form:nth-child('+a+')').css("display","none");
    $('.modalContent form:nth-child('+b+')').css("display","block");
}

if($("#nav>ul>li.userAuth a").hasClass( "unLogin" ) ){
    console.log('로그인 안됨');
    $('#navPanel .depth-0:nth-child(8)').attr('onclick','popUpAuthForm(true)')
}


function popUpAuthForm(s){
    if(s){
        modalOverlay(true);
        showDetail()
    }else {
        hiddenDetail()
        modalOverlay(false);
    }
    $("#titleBar .toggle:before").trigger("click");
}
