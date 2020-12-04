const boton_send = document.getElementById("botonSend");
const boton_crear = document.getElementById("botonCrear");
const titulo = document.getElementById("titulo");
const inputUser = document.getElementById("username");
const inputPass = document.getElementById("password");
const consola = document.getElementById("consola");

boton_crear.addEventListener('click', () => {

    pass = inputPass.value;

    if(pass.length <= 5){
        consola.innerText = "La contraseña es muy corta";
        inputPass.value = "";
        return
    }




    let bodyCont = {
        "username": inputUser.value,
        "password": inputPass.value
      }

    fetch(`https://login-mrklus-backend.herokuapp.com/users`, 
    { 
        method: "POST", 
        body: JSON.stringify(bodyCont),
        headers: {
          connection: 'keep-alive',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36',
          accept: '*/*',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          referer: 'https://login-mrklus-backend.herokuapp.com/users',
          'accept-language': 'es-US,es-419;q=0.9,es;q=0.8,en;q=0.7',
          'content-type': 'application/json',
          host: 'localhost:3000',
          'accept-encoding': 'gzip, deflate, br',
          'content-length': '84'
        }
    })
    .then(res => res.json())
    .then((res) => {
      consola.innerText = res.msg;
      console.log(res.sts);
      if(res.sts){
        inputPass.value = "";
        inputUser.value = "";
        titulo.innerText = "Login";
        boton_crear.style.display = "none";
        boton_send.style.display = "flex";
      }
    })  
});

boton_send.addEventListener('click', () => {


    let bodyCont = {
        "username": inputUser.value,
        "password": inputPass.value
      }

    fetch(`https://login-mrklus-backend.herokuapp.com/users/login`, 
    { 
        method: "POST", 
        body: JSON.stringify(bodyCont),
        headers: {
          connection: 'keep-alive',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36',
          accept: '*/*',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          referer: 'https://login-mrklus-backend.herokuapp.com/users',
          'accept-language': 'es-US,es-419;q=0.9,es;q=0.8,en;q=0.7',
          'content-type': 'application/json',
          host: 'localhost:3000',
          'accept-encoding': 'gzip, deflate, br',
          'content-length': '84'
        }
    })
    .then(res => res.json())
    .then(res => consola.innerText = res.msg)
    .then(() =>{
        inputPass.value = "";
        inputUser.value = "";
    })
})
