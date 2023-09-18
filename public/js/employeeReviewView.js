function handleMsg(msg, isError) {
  const container = document.createElement("div");
  const msgCont = document.createElement("div");
  msgCont.textContent = msg;
  container.className = "msg";
  if (isError) container.className += " error";
  container.append(msgCont);
  document.body.append(container);
  setTimeout(() => {
    container.className += " fade-out";
  }, 1000);
  setTimeout(() => {
    document.body.getElementsByClassName("msg")[0].remove();
    location.reload()
  }, 3500);
}

const deleteReview = async (event) => {
    try {
        let reviewId = event.target.getAttribute("reviewId");
        let response = await deleteReviewApi(reviewId);
      
        if (response.status) {
           handleMsg(response.message,false);
           setTimeout(()=>{location.reload()},3500)
        }else {
            return handleMsg(response.err.message,true);
        }
    } catch (error) {
        handleMsg(error.message,true)
    }
};

let elements = document.getElementsByClassName("deleteReview");

for (let index = 0; index < elements.length; index++) {
  elements[index].addEventListener("click", deleteReview);
}

const deleteReviewApi = async (userId, jsonData) => {
    const response = await fetch(`/api/review/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  };
  