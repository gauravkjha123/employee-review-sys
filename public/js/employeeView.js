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
const changeRole = async (event) => {
    try {
        let currentRole = event.target.value;
        let nextRole = (currentRole == 1) ? 0 : 1;
        let userId = event.target.getAttribute("userId");
        let data = JSON.stringify({ role: nextRole });
        let response = await changeRoleApi(userId, data);
      
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

const deleteUser = async (event) => {
    try {
        let userId = event.target.getAttribute("userId");
        let response = await deleteUserApi(userId);
      
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

let elements = document.getElementsByClassName("userUpdate");
let elements2 = document.getElementsByClassName("deleteUser");

for (let index = 0; index < elements.length; index++) {
  elements[index].addEventListener("click", changeRole);
}
for (let index = 0; index < elements2.length; index++) {
    elements2[index].addEventListener("click", deleteUser);
}

const changeRoleApi = async (userId, jsonData) => {
  const response = await fetch(`/api/user/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonData,
  });
  return await response.json();
};


const deleteUserApi = async (userId, jsonData) => {
    const response = await fetch(`/api/user/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  };
  