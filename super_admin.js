import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {

getFirestore,

collection,

getDocs,

query,

where,
addDoc,
    updateDoc,
    doc
}

from

"https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig={

apiKey:"AIzaSyCI3KykpatQW82_O5LuRoajP8oWhhMw4Zg",

authDomain:"fafirru-ila-allah.firebaseapp.com",

projectId:"fafirru-ila-allah",

storageBucket:"fafirru-ila-allah.firebasestorage.app",

messagingSenderId:"564958663441",

appId:"1:564958663441:web:9e6e6a246ec0e2c48472b0"

};

const app=initializeApp(firebaseConfig);

const db=getFirestore(app);

const mosquesContainer=document.getElementById("mosquesContainer");

const mosqueModal =
document.getElementById("mosqueModal");

const mosqueName =
document.getElementById("mosqueName");

const mosqueShortName =
document.getElementById("mosqueShortName");

const mosqueLogo =
document.getElementById("mosqueLogo");

const mosqueTitle =
document.getElementById("mosqueTitle");

const mosqueWhatsapp =
document.getElementById("mosqueWhatsapp");

const mosqueColor =
document.getElementById("mosqueColor");

const modalTitle =
document.getElementById("modalTitle");

let editingMosque = null;

async function loadMosques(){

const snapshot=await getDocs(

collection(db,"Mosques")
  );

snapshot.forEach(doc=>{

const mosque=doc.data();

const card=document.createElement("div");

  
card.style.background="#f8fbff";

card.style.borderRadius="15px";

card.style.padding="18px";

card.style.boxShadow="0 2px 8px rgba(0,0,0,.08)";

card.innerHTML = `

<div style="text-align:center">

<img
src="${mosque.logo}"
style="
width:90px;
height:90px;
object-fit:contain;
margin-bottom:10px;
">

<h2 style="margin:8px 0">

${mosque.name}

</h2>

<div style="color:#666">

${mosque.shortName}

</div>

<hr>

<div class="stats">

<div>

👨‍🎓

<br>

<span id="students_${doc.id}">

...

</span>
</div>

<div>

🎁

<br>

<span id="codes_${doc.id}">

...

</span>

</div>

</div>

<hr>
<button
class="editMosque"
data-id="${doc.id}">

✏️ تعديل

</button>

<button
class="manageMosque"
data-id="${doc.id}">

⚙️ الإدارة

</button>

<button
class="deleteMosque"
data-id="${doc.id}">

🗑 حذف

</button>

</div>

`;

mosquesContainer.appendChild(card);
loadStatistics(doc.id);
});

}

window.onload=loadMosques;
document.getElementById("addMosque").onclick = ()=>{

editingMosque = null;

modalTitle.textContent =
"➕ إضافة مسجد";

mosqueName.value = "";

mosqueShortName.value = "";

mosqueLogo.value = "";

mosqueTitle.value = "";

mosqueWhatsapp.value = "";

mosqueColor.value = "#1976d2";
mosqueModal.style.display = "flex";

};
document.getElementById("cancelMosque").onclick = ()=>{

mosqueModal.style.display = "none";

};

async function loadStatistics(mosqueId){

const studentsQuery = query(

collection(db,"Students"),

where("mosqueId","==",mosqueId)

);

const studentsSnapshot = await getDocs(

studentsQuery

);

const codesQuery = query(
collection(db,"Codes"),

where("mosqueId","==",mosqueId)

);

const codesSnapshot = await getDocs(

codesQuery

);

const studentsElement =

document.getElementById(

`students_${mosqueId}`

);

const codesElement =
document.getElementById(

`codes_${mosqueId}`

);

if(studentsElement){

studentsElement.textContent =

studentsSnapshot.size;

}

if(codesElement){

codesElement.textContent =

codesSnapshot.size;

}
}
document.addEventListener("click",(e)=>{

    if(!e.target.classList.contains("manageMosque"))
        return;

    const mosqueId = e.target.dataset.id;

    sessionStorage.setItem(
        "currentMosqueId",
        mosqueId
    );

    window.location.href =
        "admin.html";

});
