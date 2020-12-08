const boton_crear = document.getElementById("botonCrear");
const boton_login = document.getElementById("botonLogin");
const titulo = document.getElementById("titulo");
const inputUser = document.getElementById("username");
const inputPass = document.getElementById("password");
const consola = document.getElementById("consola");
const mainSection = document.getElementById("main_section");
const loginSection = document.getElementById("login_section");
const social_section = document.getElementById('social_section');
const edit_section = document.getElementById("edit_section");

const url = "https://login-mrklus-backend.herokuapp.com";
// https://login-mrklus-backend.herokuapp.com
// http://localhost:3000

// Variables globales
let User = {
  username: "",
  tokenAuth: "",
  refreshToken: "",
  pronoun: "",
  description: "",
  links: []
}


// Crear cuenta
boton_crear.addEventListener('click', () => {

    pass = inputPass.value;

    if(pass.length <= 5){
        consola.innerText = "La contraseña es muy corta";
        inputPass.value = "";
        return
    }

    let checkValue;
    if(document.getElementsByName("pronombre")[0].checked)
    {
      checkValue = "Él";
    }
    else if(document.getElementsByName("pronombre")[1].checked)
    {
      checkValue = "Ella";
    }
    else
    {
      checkValue = "Sin especificar";
    }
    let bodyCont = {
        "username": inputUser.value,
        "password": inputPass.value,
        "pronoun": checkValue
      }


    fetch(`${url}/users`, 
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
      }
    })  
});

// Login 
boton_login.addEventListener('click', login);

function login()
{
  let bodyCont = {
    "username": inputUser.value,
    "password": inputPass.value
  }

  fetch(`${url}/users/login`, 
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
      User.tokenAuth = res.accessToken;
      User.refreshToken = res.refreshedAccessToken;
      User.pronoun = res.pronoun;
      User.description = res.description;
      User.links = res.links;
      consola.innerText = res.msg;
      User.username = inputUser.value;
      inputPass.value = "";
      inputUser.value = "";
      let saveData = JSON.stringify(User);
      localStorage.setItem('user', saveData);

      if(res.sts)
      {
        mainSection.style.display = "flex";
        loginSection.style.display = "none";
        social_section.style.display = "flex";
        // Cargar usuario logeado
        refreshData(res);
      }
      getUsers();
  })
}


// Funcion agregar mas links
const plusClick = document.getElementById("inputPlus");
const minusClick = document.getElementById("inputMinus");
const editLinks = document.getElementById("editLinks");
let cantidadLinks = 1;
plusClick.addEventListener('click', () => {
    let inputLink = document.createElement("input");
    inputLink.setAttribute('class', 'editLinksInput');
    inputLink.setAttribute('id', 'editLinksInput');
    editLinks.appendChild(inputLink);
    cantidadLinks++;
});
minusClick.addEventListener('click', () => {
  if(cantidadLinks>1)
  {
    editLinks.removeChild(editLinks.lastChild);
    cantidadLinks--;
  }
});

// Funcion post Description y Links
const botonSaveDatos = document.getElementById("editSaveButton");
botonSaveDatos.addEventListener('click', update);
function update()
{
  // datos del dom que van a ser usados
  const inputDescripcion = document.getElementById("editDescriptionTA");
  const inputLinks = document.getElementsByClassName("editLinksInput");
  const inputImg = document.getElementById("inputImg");

  // objeto que va a ser enviado
  let bodyCont = {
    username: User.username
  }
  // check que datos estan siendo usados
  if(inputDescripcion.value)
  {
    bodyCont.description = inputDescripcion.value;
  }
  if(inputLinks["0"].value)
  {
    let linksArray = [];
    for(let i = 0; i<inputLinks.length; i++)
    {
      linksArray.push(inputLinks[i].value);
    }
    bodyCont.links = linksArray;
  }
  
  console.log(bodyCont);
  // Envia datos a la API
  fetch(`${url}/users/description`, 
  { 
      method: "POST", 
      body: JSON.stringify(bodyCont),
      headers: {
        Authorization: `Bearer ${User.tokenAuth}`,
        connection: 'keep-alive',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36',
        accept: '*/*',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        referer: 'https://login-mrklus-backend.herokuapp.com/users/description',
        'accept-language': 'es-US,es-419;q=0.9,es;q=0.8,en;q=0.7',
        'content-type': 'application/json',
        host: 'localhost:3000',
        'accept-encoding': 'gzip, deflate, br',
        'content-length': '84'
      }
  })
  .then(res => res.json())
  .then(async (res) => {
    if(res.msg == "TNV")
    {
      console.log('Your token expired, getting new token...');
      await getNewToken();
      update();
    }
    else{
      // Agregar algun tipo de aviso al usuario
      console.log(res);
    }
  }) 
}


// Despliegue de editor 
const botonEdit = document.getElementById("botonEdit");
let editClicks = 0;
botonEdit.addEventListener('click', () => {
  if(editClicks==0)
  {
    edit_section.style.display = "flex";
    editClicks++
  }
  else
  {
    edit_section.style.display = "none";
    editClicks--
  }
});

// Conseguir nueva Token -- Ejecutar cada vez que una token expiro
function getNewToken(callback)
{
  return new Promise(resolve => {


  let bodyCont = {
    username: User.username,
    token: User.refreshToken
  }
  fetch(`${url}/users/token`, 
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
        referer: 'https://login-mrklus-backend.herokuapp.com/users/token',
        'accept-language': 'es-US,es-419;q=0.9,es;q=0.8,en;q=0.7',
        'content-type': 'application/json',
        host: 'localhost:3000',
        'accept-encoding': 'gzip, deflate, br',
        'content-length': '84'
      }
  })
  .then(res => res.json())
  .then((res) => {
    User.tokenAuth = res.token;
    resolve('resolved');
  }); 
});
}

// Check si ya estas logeado
function loggedCheck()
{
  if(localStorage.user)
  {
    let loadTokens = JSON.parse(localStorage.getItem("user"));
    User = loadTokens;
    mainSection.style.display = "flex";
    loginSection.style.display = "none";
    social_section.style.display = "flex";
    getUsers();
    refreshData(User);
  }
}
loggedCheck();


// Funcion de logout -- Funciona
let botonLogout = document.getElementById('botonLogout');
botonLogout.addEventListener('click', logout);
function logout()
{
  localStorage.removeItem('user');
  loginSection.style.display = "flex";
  mainSection.style.display = "none";
  social_section.style.display = "none";
  edit_section.style.display = "none";
  let bodyCont = {
    username: User.username,
    tokenRef: User.refreshToken
  }
  fetch(`${url}/users/logout`, 
  { 
      method: "POST", 
      body: JSON.stringify(bodyCont),
      headers: {
        Authorization: `Bearer ${User.tokenAuth}`,
        connection: 'keep-alive',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36',
        accept: '*/*',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        referer: 'https://login-mrklus-backend.herokuapp.com/users/token',
        'accept-language': 'es-US,es-419;q=0.9,es;q=0.8,en;q=0.7',
        'content-type': 'application/json',
        host: 'localhost:3000',
        'accept-encoding': 'gzip, deflate, br',
        'content-length': '84'
      }
  })
  .then(res => res.json())
  .then(async (res) => {
    try
    {
      if(res.msg == "TNV")
      {
        await getNewToken();
        logout();
      }
      if(!res.sts)
      {
        console.log(res);
      }
      if(res.sts)
      {
        console.log("Logout Success");
        User = {
          username: "",
          tokenAuth: "",
          refreshToken: ""
        }
        social_section.innerHTML = `<h2>Other users</h2>`
      }
    }
    catch(err)
    {
      console.log(err);
    }
  })

}

// Funcion get users -- Funciona
function getUsers()
{
  fetch(`${url}/users`, 
  { 
      method: "GET",
      headers: {
        Authorization: `Bearer ${User.tokenAuth}`,
        connection: 'keep-alive',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36',
        accept: '*/*',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        referer: 'https://login-mrklus-backend.herokuapp.com/users/description',
        'accept-language': 'es-US,es-419;q=0.9,es;q=0.8,en;q=0.7',
        'content-type': 'application/json',
        host: 'localhost:3000',
        'accept-encoding': 'gzip, deflate, br',
        'content-length': '84'
      }
  })
  .then(res => res.json())
  .then(async (res) => {
    if(res.sts === false)
    {
      await getNewToken();
      getUsers();
    }
    let users = res;
    if(users.length == 0) return;
    for(let i = 0; i < users.length; i++)
    {
      if(users[i].username != User.username)
        {
          let userCard = document.createElement("div");
          userCard.setAttribute('class', 'socialCard');
          userCard.setAttribute('id', 'socialCard');
          userCard.innerHTML = 
          `<div class="profilePic" id="profilePic">
              <img class="profilePicImg" id="profilePicImg" src="./monke.png" alt="profile picture">
          </div>
          <div class="textContainer" id="textContainer">
              <div class="profileUsername" id="profileUsernameCard">
                  ${users[i].username}
              </div>
              <div class="profileGenre" id="profileGenreCard">
                  Pronombre: ${users[i].pronoun}
              </div>
              <div class="profileDescription" id="profileDescriptionCard">
                ${users[i].description}
              </div>
              <div class="profileLinks" id="${users[i].username}">

            </div>
          </div>`
          social_section.appendChild(userCard);
          let links = document.getElementById(`${users[i].username}`);
          if(users[i].links.length>0)
          {
            for(let e = 0; e<users[i].links.length; e++)
            {
              let anchor = document.createElement('a');
              anchor.setAttribute('href', users[i].links[e]);
              anchor.setAttribute('target', '_blank');
              anchor.innerText = users[i].links[e];
              links.appendChild(anchor);
            }
          }
        }
    }
  })
}

// Funcion actualizar datos 
function refreshData(res)
{
  const profileUsername = document.getElementById('profileUsername');
  profileUsername.innerHTML = `${User.username}`;
  const profileGenre = document.getElementById('profileGenre');
  profileGenre.innerHTML = `Pronombre: ${res.pronoun}`;
  const profileDescription = document.getElementById('profileDescription');
  profileDescription.innerHTML = `${res.description}`;
  const profileLinks = document.getElementById('profileLinks');
  profileLinks.innerHTML = '';
  console.log(res.links.length);
  if(res.links.length == 0)
  {
    profileLinks.innerHTML = `No hay links`
  }
  else
  {
    for(let i = 0; i<res.links.length; i++)
    {
      let anchor = document.createElement('a');
      anchor.setAttribute('href', res.links[i]);
      anchor.setAttribute('target', '_blank');
      anchor.innerText = res.links[i];
      profileLinks.appendChild(anchor);
    }
  }
}

