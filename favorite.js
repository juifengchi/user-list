const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

const users = JSON.parse(localStorage.getItem("favoriteUsers")) || [];

displayUserCard(users)

// 監聽器
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-user-info")) {
    showUserModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
});

// 函式
function removeFromFavorite(id) {
  const userIndex = users.findIndex(user => user.id === id)
  users.splice(userIndex, 1)
  localStorage.setItem("favoriteUsers", JSON.stringify(users))
  displayUserCard(users)
}

function displayUserCard(data) {
  let htmlContent = "";

  data.forEach((datum) => {
    htmlContent += `
      <div class="col-sm-3">
        <div class="card m-1">
          <img class="card-img-top" src="${datum.avatar}" alt="Avatar">
          <div class="card-body">
            <h5 class="card-title">${datum.name}</h5>
          </div>
          <div class="card-footer">
            <button type="button" class="btn btn-primary btn-user-info" data-toggle="modal" data-target="#modal-user" data-id="${datum.id}">Info</button>
            <button class="btn btn-danger btn-remove-favorite" data-id="${datum.id}">-</button>
          </div>
        </div>
      </div>
    `;
  });

  dataPanel.innerHTML = htmlContent;
}

function showUserModal(id) {
  const userName = document.querySelector("#modal-user-name");
  const userAvatar = document.querySelector("#modal-user-avatar");
  const userEmail = document.querySelector("#modal-user-email");
  const userGender = document.querySelector("#modal-user-gender");
  const userAge = document.querySelector("#modal-user-age");
  const userRegion = document.querySelector("#modal-user-region");
  const userBirthday = document.querySelector("#modal-user-birthday");

  axios.get(INDEX_URL + id).then((response) => {
    userName.innerHTML = `${response.data.name} ${response.data.surname}`;
    userAvatar.innerHTML = `<img src="${response.data.avatar}" alt="Modal Avatar" class="img-fluid">`;
    userEmail.innerHTML = `Email: ${response.data.email}`;
    userGender.innerHTML = `Gender: ${response.data.gender}`;
    userAge.innerHTML = `Age: ${response.data.age}`;
    userRegion.innerHTML = `Region: ${response.data.region}`;
    userBirthday.innerHTML = `Birthday: ${response.data.birthday}`;
  });
}