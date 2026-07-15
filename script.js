 import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    doc,
    runTransaction,
    limit,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyCI3KykpatQW82_O5LuRoajP8oWhhMw4Zg",
    authDomain: "fafirru-ila-allah.firebaseapp.com",
    projectId: "fafirru-ila-allah",
    storageBucket: "fafirru-ila-allah.firebasestorage.app",
    messagingSenderId: "564958663441",
    appId: "1:564958663441:web:9e6e6a246ec0e2c48472b0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let students = [];
let currentFilter = "boys";

const cards = document.getElementById("cards");
const search = document.getElementById("search");
const studentsCount = document.getElementById("studentsCount");
const pointsCount = document.getElementById("pointsCount");
const loading = document.getElementById("loading");

const rewardBtn = document.getElementById("rewardBtn");
const rewardModal = document.getElementById("rewardModal");
const studentSelect = document.getElementById("studentSelect");
const rewardCode = document.getElementById("rewardCode");
const rewardMessage = document.getElementById("rewardMessage");

const floatingRewardBtn =
document.getElementById("floatingRewardBtn");

async function loadStudents(){

    const snapshot =
    await getDocs(collection(db,"Students"));

    students = [];

    snapshot.forEach(doc=>{

        students.push({
            id:doc.id,
            ...doc.data()
        });

    });

    loading.style.display = "none";

    render();

}

loadStudents();

async function getCodeDocument(code){

    const q = query(
        collection(db,"Codes"),
        where("code","==",code),
        limit(1)
    );

    const snap = await getDocs(q);

    if(snap.empty)
        return null;

    return snap.docs[0];

}

document.querySelectorAll(".filter-btn").forEach(btn=>{

    btn.onclick=()=>{

        document
        .querySelectorAll(".filter-btn")
        .forEach(b=>b.classList.remove("active"));

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        render();

    };

});

search.oninput = render;

function isBoy(gender){

    gender=(gender||"").trim().toLowerCase();

    return[
        "ذكر",
        "ولد",
        "رجل",
        "male",
        "boy",
        "m",
        "زكر",
        "دكر"
    ].includes(gender);

}

function isGirl(gender){

    gender=(gender||"").trim().toLowerCase();

    return[
        "أنثى",
        "انثى",
        "أنثي",
        "انثي",
        "بنت",
        "امرأة",
        "امراه",
        "female",
        "girl",
        "f"
    ].includes(gender);

}
function render(){

    let boys = students.filter(s => isBoy(s.gender));
    let girls = students.filter(s => isGirl(s.gender));

    [boys, girls].forEach(group => {

        group.sort((a,b)=>b.points-a.points);

        let rank = 1;

group.forEach((s, i) => {

    if (i === 0) {
        s.rank = 1;
        return;
    }

    if (s.points === group[i - 1].points) {

        s.rank = rank;

    } else {

        rank++;
        s.rank = rank;

    }

});

    });

    let list = [...boys,...girls];

   
    if(currentFilter==="boys")
        list = list.filter(s=>isBoy(s.gender));

    if(currentFilter==="girls")
        list = list.filter(s=>isGirl(s.gender));

    const word = search.value.trim();

    if(word!==""){

        list = list.filter(s=>
            s.name.includes(word)
        );

    }

    studentsCount.textContent = list.length;

    pointsCount.textContent =
        list.reduce((sum,s)=>sum+Number(s.points||0),0);

    cards.innerHTML = "";

    list.forEach(s=>{

        const group =
            isBoy(s.gender)?boys:girls;

        const rank = s.rank;

        const repeated =
            group.filter(x=>x.points===s.points).length>1;

        let medal = "";

        let cardClass =
            isGirl(s.gender) ? "girl-card" : "";

        if(s.points>0){

            if(rank===1){

                medal="🥇";
                cardClass="gold";

            }

            else if(rank===2){

                medal="🥈";
                cardClass="silver";

            }

            else if(rank===3){

                medal="🥉";
                cardClass="bronze";

            }

        }

        cards.innerHTML += `

<div class="student-card ${cardClass}">

<div class="student-name">

${medal} ${s.name}

</div>

<div class="student-info">

<span>💎 الجواهر</span>

<span class="points">

${s.points}

</span>

</div>

<div class="student-info">

<span>النوع</span>

<span>

${
isBoy(s.gender)
?"👦 الأولاد"
:isGirl(s.gender)
?"👧 البنات"
:"❓ غير محدد"
}

</span>

</div>

${
s.points>0

?

`<div class="rank">

🏅 المركز ${rank}${repeated?" (مكرر)":""}

</div>`

:

`<div class="rank">

⏳ ${
isBoy(s.gender)
?
"سيبدأ في المنافسة قريبًا..."
:
"ستبدأ في المنافسة قريبًا..."
}

</div>`

}

</div>

`;

    });

}
rewardBtn.onclick = ()=>{

    studentSelect.innerHTML = "";

    students.forEach(s=>{

        studentSelect.innerHTML += `
<option value="${s.name}">
${s.name}
</option>
`;

    });

    rewardMessage.textContent = "";
    rewardCode.value = "";

    rewardModal.style.display = "flex";

};

floatingRewardBtn.onclick = ()=>{

    rewardBtn.click();

};

document.getElementById("closeReward").onclick = ()=>{

    rewardModal.style.display = "none";

};
function launchConfetti(){

confetti({

particleCount:180,

spread:90,

origin:{y:.7}

});

}

function launchGems(){

for(let i=0;i<24;i++){

const gem=document.createElement("div");

gem.className="flying-gem";

gem.textContent="💎";

gem.style.left=(window.innerWidth/2)+"px";

gem.style.top=(window.innerHeight/2)+"px";

gem.style.setProperty(
"--x",
(Math.random()*500-250)+"px"
);

gem.style.setProperty(
"--y",
(-Math.random()*400-100)+"px"
);

document.body.appendChild(gem);

setTimeout(()=>{

gem.remove();

},1400);

}

}

function animateNumber(element,start,end,duration){

let startTime=null;

function step(time){

if(!startTime)
startTime=time;

const progress=Math.min(
(time-startTime)/duration,
1
);

const value=Math.floor(

start+(end-start)*progress

);

element.textContent=value+" 💎";

if(progress<1){

requestAnimationFrame(step);

}

}

requestAnimationFrame(step);

}
document.getElementById("sendReward").onclick = async ()=>{

    const code = rewardCode.value.trim();

    if(code===""){

        rewardMessage.style.color="red";
        rewardMessage.textContent="اكتب الكود أولاً.";

        return;

    }

    rewardMessage.style.color="#555";
    rewardMessage.textContent="⏳ جارٍ التحقق...";

    const student = students.find(
        s=>s.name===studentSelect.value
    );

    if(!student){

        rewardMessage.style.color="red";
        rewardMessage.textContent="الطالب غير موجود.";

        return;

    }

    const codeDoc = await getCodeDocument(code);

    if(codeDoc===null){

        rewardMessage.style.color="red";
        rewardMessage.textContent="الكود غير موجود.";

        return;

    }

    const codeRef = codeDoc.ref;
    const studentRef = doc(db,"Students",student.id);
let rewardValue = 0;
let totalPoints = 0;
    try{

        await runTransaction(db,async(transaction)=>{

            const studentSnap =
            await transaction.get(studentRef);

            const rewardSnap =
            await transaction.get(codeRef);

            if(!studentSnap.exists()){

                throw new Error("الطالب غير موجود");

            }

            if(!rewardSnap.exists()){

                throw new Error("الكود غير صحيح");

            }

            const rewardData = rewardSnap.data();

rewardValue = Number(rewardData.points || 0);
         
            if(rewardData.used===true){

                throw new Error("تم استخدام هذا الكود من قبل");

            }

            const studentData = studentSnap.data();

            const newPoints =
Number(studentData.points || 0) +
rewardValue;

totalPoints = newPoints;

            transaction.update(studentRef,{
                points:newPoints
            });

            transaction.update(codeRef,{
    used: true,
    student: studentData.name,
    usedAt: serverTimestamp()
});

        });

        

// تكبير النافذة
document.querySelector(".modal-box")
.classList.add("success");

// كونفيتي
launchConfetti();

// جواهر متطايرة
launchGems();

// رسالة النجاح
rewardMessage.style.color = "#18a84c";

rewardMessage.innerHTML = `
<div style="font-size:26px;font-weight:900;">
🎉 بارك الله فيك
</div>

<div style="
margin-top:15px;
font-size:28px;
font-weight:900;
color:#00a0ff;
">
💎 +${rewardValue}
</div>

<div class="reward-total">
0 💎
</div>
`;

// تشغيل العداد بعد نصف ثانية
setTimeout(()=>{

const totalElement =
rewardMessage.querySelector(".reward-total");

animateNumber(

totalElement,

totalPoints - rewardValue,

totalPoints,

900

);

},500);

// إغلاق النافذة
setTimeout(()=>{

document.querySelector(".modal-box")
.classList.remove("success");

rewardModal.style.display="none";

rewardCode.value="";

location.reload();

},3200);

    }

    catch(error){

        rewardMessage.style.color="red";

        rewardMessage.textContent =
            error.message ||
            "حدث خطأ أثناء استلام الجواهر.";

    }

};
// إغلاق النافذة عند الضغط خارجها
window.onclick = (e) => {

    if (e.target === rewardModal) {

        rewardModal.style.display = "none";

    }

};

// زر Enter داخل مربع الكود
rewardCode.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        document.getElementById("sendReward").click();

    }

});
/*=========================
    الزر العائم
=========================*/

const statistics = document.querySelector(".statistics");

floatingRewardBtn.onclick = () => {
    rewardBtn.click();
};

window.addEventListener("scroll", () => {

    // لا يظهر إلا بعد تجاوز الإحصائيات
    if (window.scrollY < statistics.offsetTop + statistics.offsetHeight) {
        floatingRewardBtn.classList.remove("show");
        return;
    }

    // هل الزر الكبير ظاهر؟
    const rect = rewardBtn.getBoundingClientRect();

    const rewardVisible =
        rect.top < window.innerHeight &&
        rect.bottom > 0;

    if (rewardVisible) {
        floatingRewardBtn.classList.remove("show");
    } else {
        floatingRewardBtn.classList.add("show");
    }

});
