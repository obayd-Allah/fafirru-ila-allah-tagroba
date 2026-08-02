import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
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
let currentMosqueId = null;

const mosqueModal =
document.getElementById("mosqueModal");

const mosqueName =
document.getElementById("mosqueName");

const mosqueShortName =
document.getElementById("mosqueShortName");

const mosqueLogo =
document.getElementById("mosqueLogo");

const cardsFolder =
document.getElementById("cardsFolder");

const cardValues =
document.getElementById("cardValues");

const mosqueTheme =
document.getElementById("mosqueTheme");

cardValues.addEventListener("input", ()=>{

    const values =
    cardValues.value
    .split(",")
    .map(x=>Number(x.trim()))
    .filter(x=>!isNaN(x));

    renderCelebrationOptions(values);

});
const celebrationContainer =
document.getElementById("celebrationContainer");


const mosqueTitle =
document.getElementById("mosqueTitle");

const mosqueWhatsapp =
document.getElementById("mosqueWhatsapp");

const mosqueColor =
document.getElementById("mosqueColor");

const adminPassword =
document.getElementById("adminPassword");

const codesPassword =
document.getElementById("codesPassword");

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
data-id="${mosque.id}">

✏️ تعديل

</button>

<button
class="manageMosque"
data-id="${mosque.id}">

⚙️ الإدارة

</button>
<button
class="copyLink"
data-id="${mosque.id}">

🔗 رابط الطلاب نسخ

</button>
<button
class="openSite"
data-id="${mosque.id}">

🔗 رابط الموقع

</button>
<button
class="deleteMosque"
data-id="${mosque.id}">

🗑 حذف

</button>

</div>

`;

mosquesContainer.appendChild(card);

});
await loadStatistics();
}

window.onload=loadMosques;





async function generateMosqueId(){

    const snapshot =
    await getDocs(collection(db,"Mosques"));

    let max = 0;

    snapshot.forEach(document=>{

        const id =
        document.data().id || "";

        const match =
        id.match(/^mosque_(\d+)$/);

        if(match){

            const number =
            Number(match[1]);

            if(number>max)
max=number;

        }

    });

    return "mosque_" +
    String(max+1).padStart(3,"0");

}
document.getElementById("saveMosque").onclick = async ()=>{

    const name = mosqueName.value.trim();

    const shortName = mosqueShortName.value.trim();

    if(name===""){

        alert("اكتب اسم المسجد");

        return;

    }
const values =
cardValues.value
.split(",")
.map(x=>Number(x.trim()))
.filter(x=>!isNaN(x));
    

const celebrationLevels = {};

celebrationContainer
.querySelectorAll("select")
.forEach(select=>{

    celebrationLevels[
        Number(select.dataset.card)
    ] = select.value;

});
    try{
if(editingMosque===null){

            const mosqueId =
            await generateMosqueId();

            await addDoc(

                collection(db,"Mosques"),

                {
    id: mosqueId,

    name: name,

    shortName: shortName || name,

    logo: mosqueLogo.value.trim(),

    title: mosqueTitle.value.trim(),

    whatsapp: mosqueWhatsapp.value.trim(),

    studentsPageTitle: "لوحة نقاط التلاميذ",

    primaryColor: mosqueColor.value,

    // ========= بيانات الدخول =========

    adminPassword:
adminPassword.value.trim() || "admin",

codesPassword:
codesPassword.value.trim() || "codes",

    // ========= الثيم =========

    theme:
mosqueTheme.value.trim() || "theme1",

    // ========= الكروت =========

    cardsFolder:
cardsFolder.value.trim(),

cardValues:
values,

celebrationLevels:
celebrationLevels,

    createdAt: serverTimestamp()
}
);

        }

        else{

            await updateDoc(

    doc(
        db,
        "Mosques",
        editingMosque
    ),

    {

        name: name,

        shortName: shortName,

        logo: mosqueLogo.value.trim(),

        title: mosqueTitle.value.trim(),

        whatsapp: mosqueWhatsapp.value.trim(),

        primaryColor: mosqueColor.value,

        adminPassword:
adminPassword.value.trim() || "admin",

codesPassword:
codesPassword.value.trim() || "codes",

        theme:
mosqueTheme.value.trim() || "theme1",

        cardsFolder:
cardsFolder.value.trim(),

cardValues:
values,

celebrationLevels:
celebrationLevels

    }

);

        }
mosqueModal.style.display = "none";

        mosquesContainer.innerHTML = "";

        await loadMosques();

    }

    catch(error){
        console.error(error);

        alert("حدث خطأ أثناء حفظ المسجد");

    }

};
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
    adminPassword.value = "الرحمن";

codesPassword.value = "الرحمن";
    cardsFolder.value =
"cards/ebad-alrahman/";
mosqueTheme.value = "theme1";
cardValues.value =
"5,10,15,20";

renderCelebrationOptions(
    [5,10,15,20],
    {
        5:"small",
        10:"small",
        15:"medium",
        20:"large"
    }
);
mosqueModal.style.display = "flex";

};
document.getElementById("cancelMosque").onclick = ()=>{

mosqueModal.style.display = "none";

};

async function loadStatistics(){

    const studentsCount = {};
    const codesCount = {};

    // تحميل جميع الطلاب مرة واحدة
    const studentsSnapshot =
    await getDocs(
        collection(db,"Students")
    );

    studentsSnapshot.forEach(doc=>{

        const data = doc.data();

        if(!data.mosqueId)
            return;

        studentsCount[data.mosqueId] =
            (studentsCount[data.mosqueId] || 0) + 1;

    });

    // تحميل جميع الأكواد مرة واحدة
    const codesSnapshot =
    await getDocs(
        collection(db,"Codes")
    );

    codesSnapshot.forEach(doc=>{

        const data = doc.data();

        if(!data.mosqueId)
            return;

        codesCount[data.mosqueId] =
            (codesCount[data.mosqueId] || 0) + 1;

    });

    // تعبئة الإحصائيات
    Object.keys(studentsCount).forEach(id=>{

        const element =
        document.getElementById(`students_${id}`);

        if(element){

            element.textContent =
            studentsCount[id];

        }

    });

    Object.keys(codesCount).forEach(id=>{

        const element =
        document.getElementById(`codes_${id}`);

        if(element){

            element.textContent =
            codesCount[id];

        }

    });

}
document.addEventListener("click", async (e)=>{

    // إدارة المسجد
    if(e.target.classList.contains("manageMosque")){

        const mosqueId = e.target.dataset.id;

        window.location.href =
    `mosque_home.html?mosque=${mosqueId}`;
        return;

    }
if(e.target.classList.contains("copyLink")){

    const mosqueId = e.target.dataset.id;

    const link =
        location.origin +
        location.pathname.replace(
            "mosques.html",
            "index.html"
        ) +
        "?mosque=" +
        mosqueId;

    await navigator.clipboard.writeText(link);

    alert("تم نسخ رابط الطلاب.");

    return;

}
    // تعديل المسجد
if(e.target.classList.contains("editMosque")){

        const mosqueDoc = await getDocs(
            query(
                collection(db,"Mosques"),
                where("id","==",e.target.dataset.id)
            )
        );

        if(mosqueDoc.empty)
            return;

        const documentData = mosqueDoc.docs[0];

        const mosque = documentData.data();

        editingMosque = documentData.id;

        modalTitle.textContent = "✏️ تعديل المسجد";
mosqueName.value =
            mosque.name || "";

        mosqueShortName.value =
            mosque.shortName || "";

        mosqueLogo.value =
            mosque.logo || "";

        mosqueTitle.value =
            mosque.title || "";

        mosqueWhatsapp.value =
            mosque.whatsapp || "";

        mosqueColor.value =
            mosque.primaryColor || "#1976d2";
    mosqueTheme.value =
mosque.theme || "theme1";
    
    adminPassword.value =
mosque.adminPassword || "admin";

codesPassword.value =
mosque.codesPassword || "codes";
    cardsFolder.value =
mosque.cardsFolder || "";

cardValues.value =
(mosque.cardValues || [])
.join(",");

renderCelebrationOptions(
    mosque.cardValues || [],
    mosque.celebrationLevels || {}
);
    
mosqueModal.style.display = "flex";

    
        return;

    }
    // فتح موقع الطلاب
if(e.target.classList.contains("openSite")){

    const mosqueId = e.target.dataset.id;

    window.open(
        `index.html?mosque=${mosqueId}`,
        "_blank"
    );

    return;

}
// حذف المسجد
if(e.target.classList.contains("deleteMosque")){

    const mosqueId = e.target.dataset.id;

    await deleteMosque(mosqueId);

    return;

}
});

async function deleteMosque(mosqueId){

    const ok = confirm(
        "هل تريد حذف هذا المسجد؟"
    );

    if(!ok)
        return;

    // البحث عن المسجد
    const mosqueQuery = query(
        collection(db,"Mosques"),
        where("id","==",mosqueId)
    );

    const mosqueSnapshot =
        await getDocs(mosqueQuery);

    if(mosqueSnapshot.empty){
alert("المسجد غير موجود");

        return;

    }

    // هل يوجد طلاب؟
    const studentsSnapshot =
        await getDocs(
            query(
                collection(db,"Students"),
                where("mosqueId","==",mosqueId)
            )
        );

    if(!studentsSnapshot.empty){

        alert(
            "لا يمكن حذف المسجد لأنه يحتوي على طلاب."
        );
return;

    }

    // هل توجد أكواد؟
    const codesSnapshot =
        await getDocs(
            query(
                collection(db,"Codes"),
                where("mosqueId","==",mosqueId)
            )
        );

    if(!codesSnapshot.empty){

        alert(
            "لا يمكن حذف المسجد لأنه يحتوي على أكواد."
        );

        return;
}

    await deleteDoc(
        mosqueSnapshot.docs[0].ref
    );

    alert("تم حذف المسجد.");

    mosquesContainer.innerHTML = "";

    await loadMosques();

}
function renderCelebrationOptions(values, oldLevels = {}){

    celebrationContainer.innerHTML = "";

    values.forEach(value=>{

        const row = document.createElement("div");

        row.style.margin = "10px 0";

        row.innerHTML = `
            <label>
            الكارت ${value}
            </label>
<select data-card="${value}">

                <option value="small">صغير</option>

                <option value="medium">متوسط</option>

                <option value="large">كبير</option>

            </select>
        `;

        const select =
        row.querySelector("select");

        select.value =
        oldLevels[value] || "small";

        celebrationContainer.appendChild(row);

    });
}
