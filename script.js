import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
 getDoc,
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
let rewardSending = false;
import {
    getCurrentMosqueId
} from "./config.js";
import { DEFAULT_MOSQUE } from "./mosqueFallback.js";

const mosqueId = getCurrentMosqueId();
let mosqueData = null;
let CURRENT_MOSQUE = null;
/*====================================
        رسائل النجاح
====================================*/
const introMessages=[
"وفي ذلك فليتنافس المتنافسون",
"خيركم من تعلم القرآن وعلمه",
"أهل القرآن هم أهل الله وخاصته",
    "سابقوا إلى مغفرة من ربكم وجنة",
    "وسارعوا إلى مغفرة من ربكم وجنة", 
    "إن هذا القرآن يهدي للتي هي أقوم"
];
const boyMessages = [

"بارك الله فيك يا {nickname} يا عسل",
"تقبل الله منك يا {nickname}",
 "ما شاء الله اللهم بارك.. استمر يا سكر",
"وفقك الله لكل خير يا {name}",
"كمل كمل.. القرآن جميل",
"ممتاز يا جميل.. كمل", 
 "عايزينك تكسب المركز الأول يا {nickname}",
 "كمل يا {nickname} وجمع حسنات أكتر", 
"{name}؛ بقيت المركز الأول ولا لسا شويا..؟", 
"كل آية بتقربك من الجنة يا {nickname}", 
"مبارك يا {nickname}.. أيوة كدا 👍", 
 "هتختم القرآن كله يا {name} إن شاء الله صح؟", 
"جوائز ربنا أحسن من 1000جوهرة 💎.. صح يا {name}؟", 
"إحنا بنحبك يا {nickname} وعايزينك تختم القرآن كلللللله",
"أحسنت يا {nickname} 👍", 
"واو.. ما شاء الله.. يلا بقى يا {nickname} عايزينك تدخل الجنة"

];

const girlMessages = [
 
"بارك الله فيكِ",
"أحسنتِ، استمري", 
 "وفقكِ الله لكل خير يا {name}",
 "بارك الله فيكِ يا {nickname}", 
"شطورة يا {nickname}",
  "عايزينك تكسبي المركز الأول يا {nickname}",
  "كملي يا {nickname} وجمعي حسنات أكتر", 
"{name}؛ بقيتي المركز الأول ولا لسا شويا..؟", 
 "كل آية بتقربِك من الجنة يا {nickname}", 
 "مبارك يا {nickname}.. أيوة كدا 👍", 
 "هتختمي القرآن كله يا {name} إن شاء الله صح؟", 
"جوائز ربنا أحسن من 1000جوهرة 💎.. صح يا {name}؟", 

"أحسنت يا {nickname} 👍", 
"واو.. ما شاء الله.. يلا بقى يا {nickname} عايزينك تدخلي الجنة"

];


/*====================================
          الإيموجي
====================================*/

const rewardEmojis = [

"🌟",
"✨",
"🎉",
"🎊",
"🏆",
"☑️",
"✅",
"⭐",
"",
"🎁",
 "🎈",
 "🏅"

];


/*====================================
          ألوان الرسالة
====================================*/

const rewardColors = [

"#1abc9c", // فيروزي
"#2ecc71", // أخضر زمردي
"#27ae60", // أخضر داكن
"#00b894", // أخضر نعناعي
"#16a085", // أخضر تركواز

"#3498db", // أزرق
"#3f8cff", // أزرق فاتح
"#00a8ff", // سماوي
"#4dabf7", // أزرق سماوي
"#74b9ff", // أزرق ثلجي

"#6c5ce7", // بنفسجي
"#7d5fff", // بنفسجي فاتح
"#8e44ad", // بنفسجي ملكي
"#9b59b6", // بنفسجي متوسط
"#a55eea", // ليلكي

"#f39c12", // ذهبي
"#f1c40f", // أصفر ذهبي
"#ffb400", // كهرماني
 "#ff9f43", // برتقالي ذهبي
"#e67e22", // برتقالي

"#ff7675", // وردي محمر
"#fd79a8", // وردي
"#e84393", // زهري
"#ff6b81", // وردي فاتح

"#00cec9", // تركواز فاتح
"#55efc4", // نعناعي فاتح
"#81ecec", // سماوي باهت
"#48dbfb", // أزرق لامع

"#e17055", // مرجاني
"#ff8c42", // برتقالي مشرق
"#ffcc00", // أصفر احتفالي
"#5f27cd", // بنفسجي غامق
"#0984e3", // أزرق ملكي
"#10ac84", // أخضر احترافي

];
/*====================================
      Floating Reward System
====================================*/

// مجموعات الاحتفال

const rewardSets=[

["💎"],
["🎁"],
["🎈"],
["⭐"],
["✨"],

["💎","🎁"],
["💎","🎈"],
["🎁","✨"],
["⭐","✨"],

["💎","🎈","🎁"]

];
// الاحتفال النادر

const rareRewardSets=[

["🏅"],

["🏆"],

["🎖️"],

["🍉","💎"],

["🏆","💎"],

["🍉","🏆","🎖️"]

];

// ألوان الشرارات

const rewardSparkColors={
"💎":"#37b8ff",

"🎁":"#ffb347",

"🎈":"#ff6b6b",

"⭐":"#ffd43b",

"✨":"#ffffff",

"🌟":"F58B27",

"🍉":"#ff5b45",

"🏆":"#ffd700",

"🎖️":"#d4af37"

};
const defaultSparkColor="#808080";

// العناصر الحالية

const floatingRewards=[];

// الأنيميشن

let rewardAnimation=null;
/*====================================
      إنشاء إيموجي
====================================*/

function createReward(icon,startX,startY){

    const el=document.createElement("div");

    el.className="floating-reward";

    el.textContent=icon;

    document.body.appendChild(el);

 el.style.left = "0px";
el.style.top = "0px";
    const reward={
element:el,

        icon,

        // الموقع
        x:startX,
        y:startY,

        // السرعة (فيزياء)
        vx:(Math.random()-0.5)*1.6,
        vy:-(1.2+Math.random()*0.5),

        // الدوران
        rotation:Math.random()*360,
        rotationSpeed:(Math.random()-0.5)*6,

        // الشفافية
        opacity:1,

        // السحب
        dragging:false,
pointerId:null,

        // للنقرة المزدوجة
        lastTap:0,

        // لحساب سرعة اليد
        lastX:0,
        lastY:0,
        lastTime:0

    };

    floatingRewards.push(reward);

enableRewardInteraction(reward);

return reward;

}
/*====================================
      السحب الفيزيائي
====================================*/

function enableRewardInteraction(reward){

    const el=reward.element;

    el.addEventListener("pointerdown",(e)=>{
// نبضة
el.classList.remove("tap");

void el.offsetWidth;

el.classList.add("tap");

setTimeout(()=>{

    el.classList.remove("tap");

},180);

// ضغطتان متتاليتان
const now=Date.now();

if(now-reward.lastTap<300){

    popReward(reward);

    return;

}

reward.lastTap=now;
        reward.dragging=true;

        reward.pointerId=e.pointerId;

        reward.lastX=e.clientX;

        reward.lastY=e.clientY;
reward.lastTime=performance.now();

        el.setPointerCapture(e.pointerId);

    });

    el.addEventListener("pointermove",(e)=>{

        if(
            !reward.dragging ||
            reward.pointerId!==e.pointerId
        ) return;

        const now=performance.now();

        const dt=Math.max(now-reward.lastTime,1);

        // سرعة اليد
reward.vx=(e.clientX-reward.lastX)/dt*2.5;
        reward.vy=(e.clientY-reward.lastY)/dt*2.5;

        reward.x=e.clientX;
        reward.y=e.clientY;

        reward.lastX=e.clientX;
        reward.lastY=e.clientY;
        reward.lastTime=now;

    });

    function release(e){

        if(reward.pointerId!==e.pointerId)
            return;

        reward.dragging=false;

        reward.pointerId=null;
el.releasePointerCapture(e.pointerId);

    }

    el.addEventListener("pointerup",release);

    el.addEventListener("pointercancel",release);

}
/*====================================
      تشغيل الاحتفال
====================================*/

function launchFloatingRewards(rewardValue){

    const sets=

    rewardValue>=30

    ?

    [...rewardSets,...rareRewardSets]

    :

    rewardSets;

    const icons=
sets[
        Math.floor(Math.random()*sets.length)
    ];

    let count=8;

    if(rewardValue>=20)
        count=9;

    if(rewardValue>=30)
        count=10;

    // مركز نافذة النجاح تقريبًا
    const startY = window.innerHeight + 20;

for (let i = 0; i < count; i++) {

    const startX =
        (window.innerWidth / (count + 1)) * (i + 1) +
        (Math.random() * 60 - 30);

    createReward(
        icons[Math.floor(Math.random() * icons.length)],
        startX,
        startY
    );

}

    if(!rewardAnimation){

        rewardAnimation=

        requestAnimationFrame(updateRewards);

    }

}
/*====================================
        محرك الفيزياء
====================================*/

function updateRewards(){

    for(let i=floatingRewards.length-1;i>=0;i--){

        const reward=floatingRewards[i];

        if(!reward.dragging){

            // الحركة
            reward.x+=reward.vx;
            reward.y+=reward.vy;

            // مقاومة الهواء
            reward.vx*=0.992;
            reward.vy*=0.998;
// قوة الرفع
            if(reward.vy>-1.8){
    reward.vy-=0.008;
}

            // التمايل
            reward.vx+=Math.sin(
                reward.rotation*Math.PI/180
            )*0.015;

            // الدوران
            reward.rotation+=reward.rotationSpeed;

        }
// الاختفاء تدريجياً

        if(reward.y<window.innerHeight*0.10){
    reward.opacity-=0.01;
}

        reward.element.style.opacity = reward.opacity;

reward.element.style.transform = `
translate(${reward.x}px, ${reward.y}px)
translate(-50%, -50%)
rotate(${reward.rotation}deg)
`;

        // حذف العنصر

        if(

            reward.opacity<=0 ||

            reward.y<-100 ||

            reward.x<-100 ||

            reward.x>window.innerWidth+100

        ){

            reward.element.remove();
floatingRewards.splice(i,1);

        }

    }

    if(floatingRewards.length){

        rewardAnimation=

        requestAnimationFrame(updateRewards);

    }

    else{

        rewardAnimation=null;

    }

}
/*====================================
        فرقعة الإيموجي
====================================*/

function popReward(reward){

    // منع تكرار الفرقعة
    if(reward.popped) return;

    reward.popped=true;

    const color=

        rewardSparkColors[reward.icon]

        ||

        defaultSparkColor;

    // إنشاء الشرارات
    for(let i=0;i<14;i++){
createSpark(

            reward.x,

            reward.y,

            color

        );

    }

    // إزالة العنصر

    reward.element.style.transition=
"transform .12s ease, opacity .12s ease";

reward.element.style.transform=
"translate(-50%,-50%) scale(1.45)";

reward.element.style.opacity="0";

setTimeout(()=>{

    reward.element.remove();

},120);

    const index=

        floatingRewards.indexOf(reward);

    if(index!==-1){
floatingRewards.splice(index,1);

    }

}
/*====================================
        إنشاء شرارة
====================================*/

function createSpark(x,y,color){

    const spark=document.createElement("div");

    spark.className="reward-spark";

    spark.style.left=x+"px";

    spark.style.top=y+"px";

    spark.style.background=color;

    const angle=Math.random()*Math.PI*2;

    const distance=25+Math.random()*40;

    spark.style.setProperty(
"--dx",

        Math.cos(angle)*distance+"px"

    );

    spark.style.setProperty(

        "--dy",

        Math.sin(angle)*distance+"px"

    );

    document.body.appendChild(spark);

    setTimeout(()=>{

        spark.remove();

    },500);
}
const cards = document.getElementById("cards");
const search = document.getElementById("search");
const studentsCount = document.getElementById("studentsCount");
const pointsCount = document.getElementById("pointsCount");
const loading = document.getElementById("loading");

const rewardBtn = document.getElementById("rewardBtn");
const rewardModal = document.getElementById("rewardModal");
const studentSelect = document.getElementById("studentSelect");
const rewardMessage = document.getElementById("rewardMessage");
const codeInputs =
document.querySelectorAll(".code-digit");

const rewardCodeBox =
document.getElementById("rewardCodeBox");

const floatingRewardBtn =
document.getElementById("floatingRewardBtn");

async function loadStudents() {

    const cache = localStorage.getItem(`studentsCache_${mosqueId}`);
const cacheTime = Number(localStorage.getItem(`studentsCacheTime_${mosqueId}`));
    if (
        cache &&
        Date.now() - cacheTime < 3 * 60 * 1000
    ) {

        students = JSON.parse(cache);

        loading.style.display = "none";

        render();

        return;

    }

    try {

    const mosqueStudentsDoc = await getDoc(
    doc(db, "MosqueStudents", mosqueId)
);

if (!mosqueStudentsDoc.exists()) {
    throw new Error("لم يتم العثور على بيانات الطلاب.");
}

students = mosqueStudentsDoc.data().students || [];

    localStorage.setItem(
        `studentsCache_${mosqueId}`,
        JSON.stringify(students)
    );

    localStorage.setItem(
        `studentsCacheTime_${mosqueId}`,
        Date.now()
    );

} catch (error) {

    const msg = String(error.message || "").toLowerCase();

    if (
        cache &&
        (
            msg.includes("quota") ||
            msg.includes("resource-exhausted") ||
            msg.includes("429")
        )
    ) {

        students = JSON.parse(cache);

    } else {

        throw error;

    }

}

loading.style.display = "none";
render();

}

(async()=>{

startIntro();

const introMinimumTime = new Promise(resolve=>{
    setTimeout(resolve,6000);
});

try{

    const dataLoading = (async()=>{

        await loadMosqueConfig();

        await loadStudents();

        await new Promise(r=>setTimeout(r,300));

    })();


    await Promise.all([
        introMinimumTime,
        dataLoading
    ]);

}
catch(error){

    console.error("Intro loading error:", error);

}
finally{

    finishIntro();

}

})();

async function getCodeDocument(code){

    const q = query(
collection(db,"Codes"),
where("code","==",code),
where("mosqueId","==",mosqueId),
limit(1)
);

    const snap = await getDocs(q);

    if(snap.empty)
        return null;

    return snap.docs[0];

}
codeInputs.forEach((input,index)=>{

input.addEventListener("input",()=>{

    // السماح بالأرقام فقط
    input.value =
    input.value.replace(/\D/g,"");

    if(input.value){

        input.classList.add("filled");

        if(index<
        codeInputs.length-1){

            codeInputs[index+1].focus();

        }

    }else{
input.classList.remove("filled");

    }

    updateCodeState();

});

input.addEventListener("keydown",(e)=>{

    if(
        e.key==="Backspace" &&
        input.value==="" &&
        index>0
    ){

        codeInputs[index-1].focus();

    }

});

});
rewardCodeBox.addEventListener("paste",(e)=>{

e.preventDefault();

const text=
(e.clipboardData||window.clipboardData)
.getData("text")
.replace(/\D/g,"")
.slice(0,6);

text.split("").forEach((char,i)=>{

if(codeInputs[i]){

codeInputs[i].value=char;

codeInputs[i].classList.add("filled");

}

});

updateCodeState();

});
function updateCodeState(){

const complete=
[...codeInputs]
.every(x=>x.value!=="");

codeInputs.forEach(x=>{

x.classList.toggle(
"complete",
complete
);

});

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

function getFullName(student){

    return (
        student.fullName ||
        student.name ||
        (
            (student.firstName || "") +
            " " +
            (student.familyName || "")
        ).trim()
    );

}

function getNickname(student){

    const names =
    student.nicknames || [];

    if(names.length>0){

        return names[
            Math.floor(
                Math.random()*names.length
            )
        ];

    }

    return student.firstName || student.name;

}

function parseMessage(message,student){

    return message

    .replaceAll(
        "{name}",
        student.firstName || student.name
    )

    .replaceAll(
        "{nickname}",
        getNickname(student)
    );

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
            getFullName(s)
.toLowerCase()
.includes(word.toLowerCase())
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

${medal} ${getFullName(s)}

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

    const defaultOption = document.createElement("option");

defaultOption.value = "choose";

defaultOption.textContent = "⬇️ اختر اسم الطالب أولاً";

defaultOption.disabled = true;

defaultOption.selected = true;

studentSelect.appendChild(defaultOption);

studentSelect.value = "choose";
    // اختيار الطلاب حسب الفلتر الحالي
    let list =
        currentFilter === "boys"
        ? students.filter(s => isBoy(s.gender))
        : students.filter(s => isGirl(s.gender));

    // ترتيب الأسماء أبجدياً
    list.sort((a,b)=>
        getFullName(a)
.localeCompare(
getFullName(b),
"ar"
)
    );

// إنشاء القائمة
    list.forEach(s=>{

        const option = document.createElement("option");
option.value = s.id;
option.textContent = getFullName(s);
studentSelect.appendChild(option);

    });

    rewardMessage.textContent = "";
    const rewardCode = document.getElementById("rewardCode");

    rewardModal.style.display = "flex";

};

floatingRewardBtn.onclick = ()=>{

    rewardBtn.click();

};

document.getElementById("closeReward").onclick = ()=>{

    if(rewardSending) return;

    rewardModal.style.display = "none";

};
function launchConfetti(){

const canvas=document.createElement("canvas");

canvas.style.position="fixed";

canvas.style.inset="0";

canvas.style.width="100%";

canvas.style.height="100%";

canvas.style.zIndex="1000000";

canvas.style.pointerEvents="none";

document.body.appendChild(canvas);


const myConfetti = confetti.create(
    canvas,
    {
        resize:true,
useWorker:true
    }
);


myConfetti({

    particleCount:180,

    spread:90,

    origin:{
        y:.7
    }

});


setTimeout(()=>{

    canvas.remove();

},3000);
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
if (rewardSending) return;
rewardSending = true;
 
    const code =
[...codeInputs]
.map(x=>x.value)
.join("")
.trim();  
 
    if(code===""){
rewardSending = false;
        rewardMessage.style.color="red";
        rewardMessage.textContent="اكتب الكود أولاً";

        return;

    }

    rewardMessage.style.color="#555";
    rewardMessage.textContent="⏳ جارٍ التحقق...";
if(
    !studentSelect.value ||
    studentSelect.value === "choose"
){

    rewardSending = false;

    rewardMessage.style.color="red";

    rewardMessage.textContent =
    "اختر اسم الطالب أولاً";

    return;
}
    const student = students.find(
    s=>s.id===studentSelect.value
);
    if(!student){

    rewardSending = false;

    rewardMessage.style.color="red";

    rewardMessage.textContent =
    "اختر طالبًا صحيحًا من القائمة.";

    return;
    }
if (!student || student.mosqueId !== mosqueId) {

    rewardSending = false;

    rewardMessage.style.color = "red";
    rewardMessage.textContent = "الطالب غير موجود";

    document.getElementById("sendReward").style.display = "";
rewardCodeBox.style.display = "";
 studentSelect.style.display = "";

    document.querySelector('label[for="rewardCode"]')?.style.removeProperty("display");
    document.querySelector('label[for="studentSelect"]')?.style.removeProperty("display");

    document.querySelector(".modal-box h3").style.display = "";
    document.getElementById("closeReward").style.display = "";

    return;
}
    
// منع الضغط المتكرر وإخفاء عناصر الإدخال
document.getElementById("sendReward").style.display = "none";
rewardCodeBox.style.display = "none";
studentSelect.style.display = "none";

// إخفاء عنوان الكود
document.querySelector('label[for="rewardCode"]')?.style.setProperty("display","none");

// إخفاء عنوان اختيار الطالب
document.querySelector('label[for="studentSelect"]')?.style.setProperty("display","none");

// إخفاء عنوان النافذة
document.querySelector(".modal-box h3").style.display = "none";

// إخفاء زر الإغلاق
document.getElementById("closeReward").style.display = "none";
 const codeDoc = await getCodeDocument(code);

    if(codeDoc===null){


     document.getElementById("sendReward").style.display = "";
rewardCodeBox.style.display = "";
studentSelect.style.display = "";

document.querySelector('label[for="rewardCode"]')?.style.removeProperty("display");
document.querySelector('label[for="studentSelect"]')?.style.removeProperty("display");
rewardSending = false;
        rewardMessage.style.color="red";
        rewardMessage.textContent="الكود غير موجود";
document.querySelector(".modal-box h3").style.display = "";
document.getElementById("closeReward").style.display = "";
        return;

    }

    const codeRef = codeDoc.ref;
    const mosqueStudentsRef = doc(
    db,
    "MosqueStudents",
    mosqueId
);
 let rewardValue = 0;
let totalPoints = 0;
    try{

        await runTransaction(db,async(transaction)=>{

            const mosqueStudentsSnap =
await transaction.get(mosqueStudentsRef);

            const rewardSnap =
            await transaction.get(codeRef);

            if(!mosqueStudentsSnap.exists()){

    throw new Error("بيانات الطلاب غير موجودة");

}

            if(!rewardSnap.exists()){

                throw new Error("الكود غير صحيح");

            }

            const rewardData = rewardSnap.data();

if (rewardData.mosqueId !== mosqueId) {
    throw new Error("الكود غير موجود");
}

rewardValue = Number(rewardData.points || 0);
            if(rewardData.used===true){

                throw new Error("تم استخدام هذا الكود من قبل");

            }

            const mosqueStudentsData =
mosqueStudentsSnap.data();

const studentsArray =
mosqueStudentsData.students || [];

const studentIndex =
studentsArray.findIndex(
s => s.id === student.id
);

if(studentIndex === -1){

    throw new Error("الطالب غير موجود");

}

const studentData =
studentsArray[studentIndex];

if (studentData.mosqueId !== mosqueId) {
    throw new Error("الطالب غير موجود");
}
const newPoints =
    Number(studentData.points || 0) + rewardValue;

totalPoints = newPoints;

// تحديث الطالب داخل المصفوفة
studentsArray[studentIndex].points = newPoints;

// حفظ المصفوفة كاملة
transaction.update(
    mosqueStudentsRef,
    {
        students: studentsArray,
        updatedAt: serverTimestamp()
    }
);

            transaction.update(codeRef,{
    used: true,
    student: getFullName(studentData),
    studentId: student.id,
    usedAt: serverTimestamp()
});
        });

        

// تكبير النافذة
document.querySelector(".modal-box")
.classList.add("success");

// اهتزاز خفيف (إذا كان الجهاز يدعمه)
if ("vibrate" in navigator) {
    navigator.vibrate(40);
}

// كونفيتي
launchConfetti();

// جواهر متطايرة
launchGems();

 launchFloatingRewards(rewardValue);

// رسالة النجاح
// اختيار الرسائل حسب الجنس
const messages =
isBoy(student.gender)
? boyMessages
: girlMessages;
rewardCodeBox.classList.add("success");
// اختيار رسالة عشوائية
const randomMessage =
parseMessage(

messages[
Math.floor(
Math.random()*messages.length
)],

student

);
     
// اختيار إيموجي عشوائي
const randomEmoji =
rewardEmojis[Math.floor(Math.random() * rewardEmojis.length)];

// اختيار لون عشوائي
const randomColor =
rewardColors[Math.floor(Math.random() * rewardColors.length)];

const len = randomMessage.length;

const messageSize =
len > 40 ? "24px" :
len > 28 ? "25px" :
"26px";
     
rewardMessage.innerHTML = `
<div
style="
font-size:${messageSize};
font-weight:900;
color:${randomColor};
text-shadow:0 2px 8px rgba(0,0,0,.12);
">

${randomEmoji} ${randomMessage}

</div>

<div
style="
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
const closeBtn = document.getElementById("closeReward");
closeBtn.style.display = "";
closeBtn.disabled = false;

closeBtn.onclick = () => {

    document.querySelector(".modal-box")
        .classList.remove("success");

    rewardModal.style.display = "none";

    rewardCodeBox.style.display = "";

    codeInputs.forEach(input => {
        input.value = "";
        input.classList.remove("filled", "complete");
    });

    rewardCodeBox.classList.remove("success");

    codeInputs[0].focus();
document.getElementById("sendReward").style.display = "";
studentSelect.style.display = "";

document.querySelector('label[for="rewardCode"]')?.style.removeProperty("display");
document.querySelector('label[for="studentSelect"]')?.style.removeProperty("display");

document.querySelector(".modal-box h3").style.display = "";

closeBtn.style.display = "none";
    rewardSending = false;
};
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
rewardCodeBox.style.display = "";
 
rewardModal.style.display="none";

codeInputs.forEach(input => {
    input.value = "";
    input.classList.remove("filled","complete");
});

codeInputs[0].focus();

student.points = totalPoints;

render();

 const cache = JSON.parse(
    localStorage.getItem(`studentsCache_${mosqueId}`) || "[]"
);
const index = cache.findIndex(s => s.id === student.id);

if (index !== -1) {
    cache[index].points = totalPoints;
}

localStorage.setItem(
    `studentsCache_${mosqueId}`,
    JSON.stringify(cache)
);

localStorage.setItem(
    `studentsCacheTime_${mosqueId}`,
    Date.now()
);
 document.getElementById("sendReward").style.display = "";
studentSelect.style.display = "";

document.querySelector('label[for="rewardCode"]')?.style.removeProperty("display");
document.querySelector('label[for="studentSelect"]')?.style.removeProperty("display");

document.querySelector(".modal-box h3").style.display = "";

document.getElementById("closeReward").style.display = "none";
rewardSending = false;

},9000);

    }

    catch(error){

    rewardCodeBox.classList.add("shake");

    setTimeout(()=>{
        rewardCodeBox.classList.remove("shake");
    },350);

    const msg = String(error.message || "").toLowerCase();

    if (
    msg.includes("resource-exhausted") ||
    msg.includes("resource exhausted") ||
    msg.includes("quota") ||
    msg.includes("quota exceeded") ||
    msg.includes("429")
) {
        rewardMessage.style.color = "#14BA1A";
        rewardMessage.textContent =
             "احتفظ بالكود وحاول مرة أخرى غدًا.";
    }else{
        rewardMessage.style.color = "red";
        rewardMessage.textContent =
            error.message || "حدث خطأ أثناء استلام الجواهر.";
    }

    rewardSending = false;

    document.getElementById("sendReward").style.display = "";
rewardCodeBox.style.display = "";
studentSelect.style.display = "";

    document.querySelector('label[for="rewardCode"]')?.style.removeProperty("display");
    document.querySelector('label[for="studentSelect"]')?.style.removeProperty("display");
    document.querySelector(".modal-box h3").style.display = "";
    document.getElementById("closeReward").style.display = "";

}
};



// زر Enter داخل مربع الكود
codeInputs.forEach(input => {

    input.addEventListener("keydown",(e)=>{

        if(e.key==="Enter"){
            document.getElementById("sendReward").click();
        }

    });

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

async function loadMosqueConfig(){
const cacheKey = `mosqueConfig_${mosqueId}`;

    try{ 
    const q = query(
        collection(db,"Mosques"),
        where("id","==",mosqueId),
        limit(1)
    );

    const snap = await getDocs(q);

    if(snap.empty){
    throw new Error("mosque-not-found");
}

    CURRENT_MOSQUE = snap.docs[0].data();
    localStorage.setItem(
    cacheKey,
    JSON.stringify(CURRENT_MOSQUE)
);
 mosqueData = CURRENT_MOSQUE;

const whatsapp = document.getElementById("whatsappLink");
if (whatsapp) whatsapp.href = mosqueData.whatsapp || "";

const subtitle = document.getElementById("pageSubtitle");
if (subtitle)
    subtitle.textContent =
        mosqueData.studentsPageTitle || "لوحة نقاط التلاميذ";

const footer = document.getElementById("footerText");
if (footer)
    footer.textContent = "© " + mosqueData.name;

const logo = document.querySelector(".logo");
if (logo) {
    logo.src = mosqueData.logo;
    logo.alt = mosqueData.name;
}

const favicon = document.getElementById("favicon");
if (favicon) {
    favicon.href = mosqueData.logo + "?v=" + Date.now();
}

const title = document.querySelector(".hero-title");
if (title) {
    title.src = mosqueData.title;
    title.alt = mosqueData.name;
}

document.title = mosqueData.name;
const themeLink = document.getElementById("themeStyle");

if (themeLink) {
    themeLink.href =
        "themes/" +
        (CURRENT_MOSQUE.theme || "theme1") +
        ".css";
}

// منع سحب الصور
//document.addEventListener("dragstart",e=>{
 // e.preventDefault();
//});
   } catch(error){

    const cache = localStorage.getItem(cacheKey);

    if(cache){

        CURRENT_MOSQUE = JSON.parse(cache);

    }else{

        CURRENT_MOSQUE = DEFAULT_MOSQUE;

    }

    mosqueData = CURRENT_MOSQUE;

    // إعادة تطبيق البيانات على الصفحة

    const whatsapp = document.getElementById("whatsappLink");
    if (whatsapp) whatsapp.href = mosqueData.whatsapp || "";

    const subtitle = document.getElementById("pageSubtitle");
    if (subtitle)
        subtitle.textContent =
            mosqueData.studentsPageTitle || "لوحة نقاط التلاميذ";

    const footer = document.getElementById("footerText");
    if (footer)
        footer.textContent = "© " + mosqueData.name;

    const logo = document.querySelector(".logo");
    if (logo){
        logo.src = mosqueData.logo;
        logo.alt = mosqueData.name;
    }

    const favicon = document.getElementById("favicon");
    if (favicon){
        favicon.href = mosqueData.logo;
    }

    const title = document.querySelector(".hero-title");
    if (title){
        title.src = mosqueData.title;
        title.alt = mosqueData.name;
    }

    document.title = mosqueData.name;

    const themeLink = document.getElementById("themeStyle");
    if(themeLink){
        themeLink.href =
            "themes/" +
            (CURRENT_MOSQUE.theme || "theme1") +
            ".css";
    }
    }
}
function startIntro(){

const msg=document.getElementById("introMessage");

msg.textContent =
introMessages[
Math.floor(Math.random()*introMessages.length)
];

}


function finishIntro(){

const loader=document.getElementById("introLoader");

if(!loader) return;


loader.classList.add("loader-hide");


setTimeout(()=>{

    loader.remove();

},1200);

}
