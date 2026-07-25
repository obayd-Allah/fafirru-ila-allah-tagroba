import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {

getFirestore,

collection,

getDocs

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

});

}

window.onload=loadMosques;
