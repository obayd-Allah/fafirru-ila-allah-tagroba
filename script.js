import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
  runTransaction,
  limit,
  increment
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";


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

let students = [];
let currentFilter = "boys";

const cards = document.getElementById("cards");
const search = document.getElementById("search");
const studentsCount = document.getElementById("studentsCount");
const pointsCount = document.getElementById("pointsCount");
const loading = document.getElementById("loading");
    
async function loadStudents(){

const snapshot=await getDocs(collection(db,"Students"));

students=[];

snapshot.forEach(doc=>{

students.push({
  id: doc.id,
  ...doc.data()
});

});

loading.style.display="none";

render();

}

loadStudents();
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        render();
    };
});
search.oninput = render;
function isBoy(gender){

    gender = (gender || "").trim().toLowerCase();

    return [
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

    gender = (gender || "").trim().toLowerCase();

    return [
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

let boys=students.filter(s=>isBoy(s.gender));
let girls=students.filter(s=>isGirl(s.gender));

[boys,girls].forEach(group=>{

group.sort((a,b)=>b.points-a.points);

group.forEach((s,i)=>{

let rank=1;

for(let j=0;j<i;j++)
if(group[j].points>s.points) rank++;

s.rank=rank;

});

});

let list=[...boys,...girls];

if(currentFilter==="boys") list=list.filter(s=>isBoy(s.gender));
if(currentFilter==="girls") list=list.filter(s=>isGirl(s.gender));

let word=search.value.trim();
if(word!=="") list=list.filter(s=>s.name.includes(word));

studentsCount.textContent=list.length;
pointsCount.textContent=list.reduce((sum,s)=>sum+s.points,0);

cards.innerHTML="";

list.forEach(s=>{

let rank=s.rank;
let group=isBoy(s.gender)?boys:girls;

let repeated=group.filter(x=>x.points===s.points).length>1;
let medal="";
let cardClass=isGirl(s.gender)?"girl-card":"";

if(s.points>0){
if(rank===1){medal="🥇";cardClass="gold";}
else if(rank===2){medal="🥈";cardClass="silver";}
else if(rank===3){medal="🥉";cardClass="bronze";}
}

cards.innerHTML+=`
<div class="student-card ${cardClass}">
<div class="student-name">${medal} ${s.name}</div>

<div class="student-info">
<span>💎 النقاط</span>
<span class="points">${s.points}</span>
</div>

<div class="student-info">
<span>النوع</span>
<span>${isBoy(s.gender)?"👦 الأولاد":isGirl(s.gender)?"👧 البنات":"❓ غير محدد"}</span>
</div>

${s.points>0?`
<div class="rank">
🏅 المركز ${rank}${repeated?" (مكرر)":""}
</div>
`:`
<div class="rank">
⏳ ${isBoy(s.gender)?"سيبدأ في المنافسة قريبًا...":"ستبدأ في المنافسة قريبًا..."}
</div>
`}

</div>`;
});
   } 
const rewardBtn=document.getElementById("rewardBtn");
const rewardModal=document.getElementById("rewardModal");
const studentSelect=document.getElementById("studentSelect");
const rewardCode=document.getElementById("rewardCode");
const rewardMessage=document.getElementById("rewardMessage");

rewardBtn.onclick=()=>{

studentSelect.innerHTML="";

students.forEach(s=>{

studentSelect.innerHTML+=`
<option value="${s.name}">
${s.name}
</option>
`;

});
        
rewardMessage.textContent="";
rewardCode.value="";

rewardModal.style.display="flex";

};
document.getElementById("closeReward").onclick=()=>{
rewardModal.style.display="none";
};

document.getElementById("sendReward").onclick=()=>{

alert("تم الضغط");

if(rewardCode.value.trim()===""){
rewardMessage.style.color="red";
rewardMessage.textContent="اكتب الكود أولاً.";
return;
}

rewardMessage.style.color="#555";
rewardMessage.textContent="⏳ جارٍ التحقق...";

fetch(`https://script.google.com/macros/s/AKfycbyg6PCfjT7aompHFw38IWK8vUMi3zVydjSPLdgZ3R_ZdHRkmaDgL9T0nfZZzuEwFTt0cQ/exec?name=${encodeURIComponent(studentSelect.value)}&code=${encodeURIComponent(rewardCode.value.trim())}`)
.then(r=>r.json())
.then(res=>{

rewardMessage.style.color=res.success?"green":"red";
rewardMessage.textContent=res.message;

if(res.success){

setTimeout(()=>{

rewardModal.style.display="none";
rewardCode.value="";
location.reload();

},1500);

}

});

};
