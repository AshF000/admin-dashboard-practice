// /** @type {HTMLInputElement} */

const URL = `https://dummyjson.com/users`;

// ELEMENTS
const searchInp = document.getElementById("searchInput");

const perPage = document.getElementById("perPage");

const gotoInp = document.getElementById("gotoInp");

const gotoBtn = document.getElementById("gotoBtn");

const prvBtn = document.getElementById("prvBtn");
const nxtBtn = document.getElementById("nxtBtn");
const pageBtns = document.getElementById("pageBtns");
const table = document.querySelector("table");

// VARIABLES
let perPageVal = perPage.value;
let gotoPageVal = 1;
let noofPages = 10;
let users = [];

// FUNCTIONS
const getUsers = async (limit = 5, skip = 10) => {
  try {
    const res = await fetch(
      `${URL}?limit=${limit}&skip=${skip}&select=firstName,email,gender`
    );

    if (!res.ok) throw new Error("res not okay");

    const data = await res.json();
    users = data.users;
  } catch (err) {
    console.log(err.message);
  }
};

const load = async () => {
  await getUsers();
  await makeTable();
};

for (let i = 1; i <= noofPages; i++) {
  const pageBtn = document.createElement("button");
  pageBtn.innerText = i;
  pageBtn.classList.add("goto");
  pageBtn.value = i;

  pageBtn.addEventListener("click", () => {
    const currentActive = pageBtns.querySelector(".activePage");
    if (currentActive) currentActive.classList.remove("activePage");

    pageBtn.classList.add("activePage");

    console.log(`Page ${pageBtn.value} clicked`);
  });

  pageBtns.appendChild(pageBtn);
}

const switchLoading = () => {
  isLoading = !isLoading;
};

const showSearchInpValue = () => {
  console.log(searchInp.value);
};

const updateShowPerPage = () => {
  perPageVal = perPage.value;
  console.log(perPageVal);
};

const updateGotoPage = () => {
  console.log(gotoInp.value);
  gotoInp.value = "";
};

const updateStatus = (user) => {
  console.log(user.firstName);
};

const deleteUser = (user) => {
  //   console.log(`${dltBtn.innerText}d`);
  console.log(user.firstName);
};

const goPrevPage = async () => {
  if (isLoading) return;
  isLoading = true;

  console.log("next page");

  isLoading = false;
};
const goNextPage = async () => {
  if (isLoading) return;
  isLoading = true;

  console.log("next page");

  isLoading = false;
};

const makeTable = async () => {
  table.innerHTML = "";

  for (let user of users) {
    const newTr = document.createElement("tr");
    let gender = user.gender.toLowerCase();

    newTr.innerHTML = `<td>${user.id}</td>
        <td>${user.firstName}</td>
        <td>${user.email}</td>
        <td>
            <span class="status">
                <span class="pulse ${
                  gender === "male" ? "active" : "inactive"
                }"></span>
                ${gender === "male" ? "Active" : "Inactive"}
            </span>
        </td>
        <td>
          <button class="dltBtn">Delete</button>
          <button class="statusBtn">${
            gender === "male" ? "Deactivate" : "Activate"
          }</button>
        </td>`;

    table.appendChild(newTr);

    // Attach event listeners directly
    const statusBtn = newTr.querySelector(".statusBtn");
    const dltBtn = newTr.querySelector(".dltBtn");

    statusBtn.addEventListener("click", () => updateStatus(user));
    dltBtn.addEventListener("click", () => deleteUser(user));
  }
};

// FUNCTION VALUES
const debouncedSearchInp = debounce(showSearchInpValue, 500);

// EVENT LISTENERS
searchInp.addEventListener("input", debouncedSearchInp);

perPage.addEventListener("change", updateShowPerPage);

gotoBtn.addEventListener("click", updateGotoPage);

prvBtn.addEventListener("click", goPrevPage);
nxtBtn.addEventListener("click", goNextPage);

load();
