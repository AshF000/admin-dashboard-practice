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
const showingPage = document.getElementById("showingPage");

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
  try {
    const res = await fetch(
      `${URL}?limit=${limit}&skip=${skip}&select=firstName,email,gender`
    );

    if (!res.ok) throw new Error("res not okay");

    const data = await res.json();
    total = data.total;
    users = data.users;
    users.forEach((u) => {
      u.status = u.gender.toLowerCase() === "male" ? "Active" : "Inactive";
    });
    noofPages = Math.ceil(total / perPageVal);
  } catch (err) {
    console.log(err.message);
  }
  pageNums();
  await makeTable();
};

(load = async () => {
  await getUsers();
  updatePrvBtn(currPage > 1);
  updateNxtBtn(currPage < noofPages);
})();

const pageNums = () => {
  pageBtns.innerHTML = "";
  let start = Math.max(1, Math.min(currPage - 4, noofPages - 8));
  let end = Math.min(noofPages, start + 8);

  for (let i = start; i <= end; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.innerText = i;
    pageBtn.classList.add("goto");
    pageBtn.value = i;
    if (+i === currPage) pageBtn.classList.add("activePage");

    pageBtn.addEventListener("click", () => {
      currPage = +pageBtn.value;
      skipped = (currPage - 1) * perPageVal;
      gotoPage(currPage);
    });

    pageBtns.appendChild(pageBtn);
  }

  showingPage.innerText = `Page ${currPage} of ${Math.ceil(
    total / perPageVal
  )}`;
};

const switchLoading = () => {
  isLoading = !isLoading;
};

const showSearchInpValue = () => {
  const val = searchInp.value.toLowerCase();
  const filteredUsers = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(val) ||
      u.email.toLowerCase().includes(val)
  );
  makeTable(filteredUsers);
};

const updateShowPerPage = () => {
  perPageVal = +perPage.value;
  currPage = 1;
  skipped = 0;
  gotoPage(currPage);
};

const updateGotoPageInp = () => {
  gotoPage(+gotoInp.value);
  gotoInp.value = "";
};

const updateStatus = async (active, user, tr) => {
  await delay(1000);
  if (active) {
    user.status = "Inactive";
  } else {
    user.status = "Active";
  }
  tr.innerHTML = `<span class="status">
                <span class="pulse ${user.status.toLowerCase()}"></span>
                ${user.status}
            </span>`;
};

const deleteUser = (user) => {
  console.log(user.firstName);
};

const updatePrvBtn = (prev) => {
  prvBtn.disabled = !prev;
};

const updateNxtBtn = (next) => {
  nxtBtn.disabled = !next;
};

const gotoPage = async (page) => {
  if (page < 1 || page > noofPages) return;

  isLoading = true;

  currPage = page;
  skipped = perPageVal * (currPage - 1);

  await getUsers(perPageVal, skipped);

  isLoading = false;
  updatePrvBtn(currPage > 1);
  updateNxtBtn(currPage < noofPages);
};

const goPrevPage = async () => {
  if (currPage === 1 || isLoading) return;
  await gotoPage(currPage - 1);
};

const goNextPage = async () => {
  if (currPage === noofPages || isLoading) return;
  await gotoPage(currPage + 1);
};

const makeTable = async (list = users) => {
  table.innerHTML = "";

  const trFragment = document.createDocumentFragment();
  const headTr = document.createElement("tr");

  headTr.innerHTML = `<th>Id</th>
        <th>Name</th>
        <th>Mail</th>
        <th>Status</th>
        <th>Action</th>`;

  trFragment.appendChild(headTr);

  for (let user of list) {
    const newTr = document.createElement("tr");

    newTr.innerHTML = `<td>${user.id}</td>
        <td>${user.firstName}</td>
        <td>${user.email}</td>
        <td>
            <span class="status">
                <span class="pulse ${
                  user.status === "Active" ? "active" : "inactive"
                }"></span>
                ${user.status}
            </span>
        </td>
        <td>
          <button class="dltBtn">Delete</button>
          <button class="statusBtn">${
            user.status === "Active" ? "Deactivate" : "Activate"
          }</button>
        </td>`;

    // Attach event listeners directly
    const statusBtn = newTr.querySelector(".statusBtn");
    const dltBtn = newTr.querySelector(".dltBtn");

    statusBtn.addEventListener("click", () =>
      updateStatus(
        user.status === "Active",
        user,
        newTr.parentNode.childNodes[user.id - perPageVal * (currPage - 1)]
          .childNodes[6]
      )
    );
    dltBtn.addEventListener("click", () => deleteUser(user));

    trFragment.appendChild(newTr);
  }
  table.appendChild(trFragment);
};

// FUNCTION VALUES
const debouncedSearchInp = debounce(showSearchInpValue, 500);

// EVENT LISTENERS
searchInp.addEventListener("input", debouncedSearchInp);

perPage.addEventListener("change", updateShowPerPage);

gotoBtn.addEventListener("click", updateGotoPageInp);

prvBtn.addEventListener("click", goPrevPage);
nxtBtn.addEventListener("click", goNextPage);
