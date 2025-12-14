// let users = [];

// const URL = `https://dummyjson.com/users`;
// const table = document.querySelector("table");

// const getUsers = async (limit = 5, skip = 10) => {
//   try {
//     const res = await fetch(
//       `${URL}?limit=${limit}&skip=${skip}&select=firstName,email,gender`
//     );

//     if (!res.ok) throw new Error("res not okay");

//     const data = await res.json();
//     users = data.users;
//   } catch (err) {
//     console.log(err.message);
//   }
// };

// const makeTable = async () => {
//   table.innerHTML = "";
//   for (let user of users) {
//     const newTr = document.createElement("tr");
//     let gender = user.gender.toLowerCase();
//     newTr.innerHTML = `<td>${user.id}</td>
//         <td>${user.firstName}</td>
//         <td>${user.email}</td>
//         <td>
//             <span class="status">
//                 <span class="pulse ${
//                   gender === "male" ? "active" : "inactive"
//                 }"></span>
//                 ${gender === "male" ? "Active" : "Inactive"}
//             </span>
//         </td>
//         <td>
//         <button id="dltBtn">Delete</button>
//               <button id="statusBtn">${
//                 gender === "male" ? "Deactivate" : "Activate"
//               }
//               </button>
              
//         </td>`;
//     table.appendChild(newTr);
//   }
// };

// const load = async () => {
//   await getUsers();
//   await makeTable();
// };
