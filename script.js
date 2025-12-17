const URL = `https://dummyjson.com/users`;

// ELEMENTS
const modalCross = document.getElementById("modalCross");
const modal = document.getElementById("modal");
const searchInp = document.getElementById("searchInput");
const srchInpCrss = document.getElementById("srchInpCrss");

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

const getUsers = async (limit = perPageVal, skip = skipped, search = "") => {
  try {
    const base = search ? `${URL}/search?q=${search}&` : `${URL}?`;

    const res = await fetch(
      `${base}limit=${limit}&skip=${skip}&select=firstName,lastName,email,gender`
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
  await makeTable();
  pageNums();
};

(load = async () => {
  await getUsers();
  updatePrvBtn(currPage > 1);
  updateNxtBtn(currPage < noofPages);
})();

const closeModal = () => {
  modal.style.display = "none";
};

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

const clearSearchInp = () => {
  searchInp.value = "";
  srchInpCrss.style.display = "none";
  currPage = 1;
  skipped = 0;
  getUsers();
};

const showSearchInpValue = async () => {
  const val = searchInp.value.toLowerCase();
  srchInpCrss.style.display = val ? "inline-block" : "none";
  currPage = 1;
  skipped = 0;
  await getUsers(perPageVal, skipped, val);
  updatePrvBtn(currPage > 1);
  updateNxtBtn(noofPages > 1);
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

const updateStatus = async (user, tdStatus, statusBtn) => {
  await delay(500);

  const statusSpan = tdStatus.querySelector(".status");
  const pulse = statusSpan.querySelector(".pulse");
  const statusText = statusSpan.querySelector(".status-text");

  if (user.status === "Active") {
    user.status = "Inactive";
    pulse.classList.remove("active");
    pulse.classList.add("inactive");
  } else {
    user.status = "Active";
    pulse.classList.remove("inactive");
    pulse.classList.add("active");
  }

  // update status text
  statusText.innerText = user.status;

  // update button text
  statusBtn.innerText = user.status === "Active" ? "Deactivate" : "Activate";

  // update button color
  statusBtn.style.backgroundColor = user.status === "Active" ? "red" : "green";
};

const deleteUser = async (user, tr) => {
  try {
    const res = await fetch(`https://dummyjson.com/users/${user.id}`, {
      method: `DELETE`,
    });
    const data = await res.json();
    if (data.isDeleted) {
      tr.remove();
      users = users.filter((u) => u.id !== user.id);
      pageNums();
    } else {
      alert(`Unable to delete ${user.firstName}`);
    }
  } catch (err) {
    console.log(err.message);
  }
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

  await getUsers(perPageVal, skipped, searchInp.value.toLowerCase());

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

  if (!list || list.length === 0) {
    const trMsg = document.createElement("tr");
    const tdMsg = document.createElement("td");
    tdMsg.innerText = "No users to show";
    tdMsg.colSpan = 5;
    tdMsg.style.textAlign = "center";
    trMsg.append(tdMsg);
    table.appendChild(trMsg);
    updatePrvBtn(false);
    updateNxtBtn(false);
    pageNums();
    return;
  }

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
    const tdId = document.createElement("td");
    const tdFName = document.createElement("td");
    const tdMail = document.createElement("td");
    const tdStatus = document.createElement("td");
    const statusSpan = document.createElement("span");
    const statusPulse = document.createElement("span");
    const tdAction = document.createElement("td");
    const statusBtn = document.createElement("button");
    const dltBtn = document.createElement("button");
    tdId.innerText = user.id;
    tdFName.innerText = user.firstName + " " + user.lastName;
    tdMail.innerText = user.email;

    statusSpan.classList.add("status");
    statusPulse.classList.add("pulse");
    statusPulse.classList.add(user.status === "Active" ? "active" : "inactive");
    const statusText = document.createElement("span");
    statusText.classList.add("status-text");
    statusText.innerText = user.status;

    statusSpan.append(statusPulse, statusText);
    tdStatus.append(statusSpan);

    dltBtn.classList.add("dltBtn");
    dltBtn.innerText = "Delete";
    statusBtn.classList.add("statusBtn");
    statusBtn.classList.add(
      user.status === "Active" ? "deactivate" : "activate"
    );

    statusBtn.innerText = `${
      user.status === "Active" ? "Deactivate" : "Activate"
    }`;

    statusBtn.style.backgroundColor =
      statusBtn.innerText === "Activate" ? "green" : "red";
    tdAction.append(dltBtn, statusBtn);

    newTr.append(tdId, tdFName, tdMail, tdStatus, tdAction);

    statusBtn.addEventListener("click", () =>
      updateStatus(user, tdStatus, statusBtn)
    );
    dltBtn.addEventListener("click", () => deleteUser(user, newTr));

    trFragment.appendChild(newTr);
  }
  table.appendChild(trFragment);
};

// FUNCTION VALUES
const debouncedSearchInp = debounce(showSearchInpValue, 500);

// EVENT LISTENERS

modalCross.addEventListener("click", closeModal);

searchInp.addEventListener("input", debouncedSearchInp);
srchInpCrss.addEventListener("click", clearSearchInp);

perPage.addEventListener("change", updateShowPerPage);

gotoBtn.addEventListener("click", updateGotoPageInp);

prvBtn.addEventListener("click", goPrevPage);
nxtBtn.addEventListener("click", goNextPage);
