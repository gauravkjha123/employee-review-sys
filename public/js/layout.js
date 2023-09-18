function handleMsg(msg, isError){
    const container = document.createElement("div");
    const msgCont = document.createElement("div");
    msgCont.textContent = msg;
    container.className = "msg";
    if ( isError ) container.className += " error";
    container.append( msgCont );
    document.body.append( container );
    setTimeout( () => {
        container.className += " fade-out";
    }, 1000);
    setTimeout( () => {
        document.body.getElementsByClassName("msg")[0].remove()
    }, 3500);
}