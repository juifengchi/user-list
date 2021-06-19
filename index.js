const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const USERS_PER_PAGE = 12

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator")
const dataHeader = document.querySelector("#data-header")

const users = [];
let filteredUsers = [];

axios.get(INDEX_URL).then((response) => {
  users.push(...response.data.results);
  displayUserCard(getUsersByPage(1));
  displayPaginator(users.length)
});

// 監聽器
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-user-info")) {
    showUserModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id))
  }
});

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  if (!keyword) return alert("Empty!")
  filteredUsers = users.filter(user => user.name.toLowerCase().includes(keyword))
  if (filteredUsers.length === 0) return alert(`No user found with "${keyword}"!`)
  dataHeader.innerHTML = `Results for "${keyword}":`
  displayUserCard(getUsersByPage(1))
  displayPaginator(filteredUsers.length)
})

paginator.addEventListener("click", function onPaginatorClicked(event) {
  const page = Number(event.target.dataset.page)
  displayUserCard(getUsersByPage(page))
})

// 函式
function displayPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  let htmlContent = ""
  for (let page = 1; page <= numberOfPages; page++) {
    htmlContent += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = htmlContent
}

function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * USERS_PER_PAGE
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteUsers")) || []
  const user = users.find(user => user.id === id)
  if (list.some(user => user.id === id)) return alert("Already existed in Favorite!")
  list.push(user)
  localStorage.setItem("favoriteUsers", JSON.stringify(list))
  alert("Add to Favorite")
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
            <button class="btn btn-info btn-add-favorite" data-id="${datum.id}">+</button>
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