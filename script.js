let students = [];
let currentFilter = "boys";

const cards = document.getElementById("cards");
const search = document.getElementById("search");
const studentsCount = document.getElementById("studentsCount");
const pointsCount = document.getElementById("pointsCount");
const loading = document.getElementById("loading");
    
fetch("https://script.google.com/macros/s/AKfycbyg6PCfjT7aompHFw38IWK8vUMi3zVydjSPLdgZ3R_ZdHRkmaDgL9T0nfZZzuEwFTt0cQ/exec")
.then(r => r.json())
.then(data => {
    students = data;
    loading.style.display = "none";
    render();
});
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

let allStudents=[...students];

allStudents.sort((a,b)=>b.points-a.points);

allStudents.forEach((s,i)=>{
let rank=1;
for(let j=0;j<i;j++) if(allStudents[j].points>s.points) rank++;
s.rank=rank;
});

let list=[...allStudents];

if(currentFilter==="boys") list=list.filter(s=>isBoy(s.gender));
if(currentFilter==="girls") list=list.filter(s=>isGirl(s.gender));

let word=search.value.trim();
if(word!=="") list=list.filter(s=>s.name.includes(word));

studentsCount.textContent=list.length;
pointsCount.textContent=list.reduce((sum,s)=>sum+s.points,0);

cards.innerHTML="";

list.forEach(s=>{

let rank=s.rank;
let repeated=allStudents.filter(x=>x.points===s.points).length>1;

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
