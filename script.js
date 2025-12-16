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
let isLoading = false;
let perPageVal = +perPage.value;
let skipped = 0;
let gotoPageVal = 1;
let total = 208;
let noofPages = Math.ceil(total / perPageVal);
let users = [];
let currPage = 1;

// FUNCTIONS
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getUsers = async (limit = perPageVal, skip = skipped) => {
  // await delay(2000);

  try {
    const res = await fetch(
      `${URL}?limit=${limit}&skip=${skip}&select=firstName,email,gender`
    );

    if (!res.ok) throw new Error("res not okay");

    const data = await res.json();
    total = data.total;
    users = data.users;
    noofPages = Math.ceil(total / perPageVal);
  } catch (err) {
    console.log(err.message);
  }
  pageNums();
  await makeTable();
};

(load = async () => {
  await getUsers();
})();

const pageNums = () => {
  pageBtns.innerHTML = "";
  let i = 1;
  for (; i <= Math.min(5, noofPages); i++) {
    console.log(i);
    const pageBtn = document.createElement("button");
    pageBtn.innerText = i;
    pageBtn.classList.add("goto");
    pageBtn.value = i;
    if (+i === currPage) pageBtn.classList.add("activePage");

    pageBtn.addEventListener("click", () => {
      currPage = +pageBtn.value;
      skipped = (currPage - 1) * perPageVal;
      getUsers(perPageVal, skipped);
    });

    pageBtns.appendChild(pageBtn);
  }
};

const switchLoading = () => {
  isLoading = !isLoading;
};

const showSearchInpValue = () => {
  console.log(searchInp.value);
};

const updateShowPerPage = () => {
  perPageVal = perPage.value;
  console.log(perPageVal);
  currPage = 1;
  getUsers(perPageVal, 0);
};

const updateGotoPage = () => {
  console.log(gotoInp.value);
  gotoInp.value = "";
};

const updateStatus = (user) => {
  console.log(user.firstName);
};

const deleteUser = (user) => {
  console.log(user.firstName);
};

const updatePrvBtn = (prev) => {};

const updateNxtBtn = (next) => {};

const goPrevPage = async () => {};

const goNextPage = async () => {};

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

// load();
