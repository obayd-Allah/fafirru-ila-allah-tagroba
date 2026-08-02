import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    where
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig={

apiKey:"AIzaSyCI3KykpatQW82_O5LuRoajP8oWhhMw4Zg",

authDomain:"fafirru-ila-allah.firebaseapp.com",

projectId:"fafirru-ila-allah",

storageBucket:"fafirru-ila-allah.firebasestorage.app",

messagingSenderId:"564958663441",

appId:"1:564958663441:web:9e6e6a246ec0e2c48472b0"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const password =
document.getElementById("password");

const login =
document.getElementById("login");

const message =
document.getElementById("message");

const mosques =
document.getElementById("mosques");

const mosquesContainer =
document.getElementById("mosquesContainer");


async function loadMosques(){

    mosquesContainer.innerHTML="";

    const cache = localStorage.getItem("mosquesCache");
const cacheTime = Number(localStorage.getItem("mosquesCacheTime"));

let mosquesList = [];

if (cache && Date.now() - cacheTime < 10 * 60 * 1000) {

    mosquesList = JSON.parse(cache);

} else {

    const snapshot = await getDocs(
        collection(db, "Mosques")
    );

    snapshot.forEach(document => {

        mosquesList.push({
            firestoreId: document.id,
            ...document.data()
        });

    });

    localStorage.setItem(
        "mosquesCache",
        JSON.stringify(mosquesList)
    );

    localStorage.setItem(
        "mosquesCacheTime",
        Date.now()
    );

}
    /*const q = query(

        collection(db,"Mosques"),

        where("active","==",true)

    );

    const snapshot = await getDocs(q);*/


mosquesList.sort((a,b)=>
    a.name.localeCompare(b.name,"ar")
);

mosquesList.forEach(mosque=>{

    const button =
        document.createElement("button");

    button.className="student";

    button.style.marginTop="12px";

    button.textContent=mosque.name;

    button.onclick = async ()=>{

    const mosqueData = mosque;

    const enteredPassword = prompt(
        "أدخل كلمة مرور المسجد"
    );

    if(
        enteredPassword !==
        mosqueData.adminPassword
    ){
alert("كلمة المرور غير صحيحة");
        return;
    }

    sessionStorage.setItem(
        "currentMosqueId",
        mosque.id
    );

    location.href = "mosque_home.html";

};
    mosquesContainer.appendChild(button);

});


}

login.onclick = async ()=>{

    if(password.value !== "الرحمن"){

        message.style.color="red";

        message.textContent=
        "❌ كلمة المرور غير صحيحة";

        return;

    }

    message.textContent = "";

    password.style.display="none";

    login.style.display="none";

    mosques.classList.remove("hidden");

    await loadMosques();

};
