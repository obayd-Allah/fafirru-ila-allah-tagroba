import { initializeApp }
from
"https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {

getFirestore,

collection,

getDocs,

addDoc,

updateDoc,

deleteDoc,

doc,

serverTimestamp

}

from

"https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

/*==================================
            Firebase
==================================*/

const firebaseConfig={

apiKey:"AIzaSyCI3KykpatQW82_O5LuRoajP8oWhhMw4Zg",

authDomain:"fafirru-ila-allah.firebaseapp.com",

projectId:"fafirru-ila-allah",

storageBucket:"fafirru-ila-allah.firebasestorage.app",

messagingSenderId:"564958663441",

appId:"1:564958663441:web:9e6e6a246ec0e2c48472b0"

};

const app=
initializeApp(firebaseConfig);

const db=
getFirestore(app);

/*==================================
          المتغيرات العامة
==================================*/

let students=[];

let currentStudent=null;

let confirmAction=null;

let currentFilter = "all";

/*==================================
          عناصر الصفحة
==================================*/

const boysContainer=
document.getElementById("boysContainer");

const girlsContainer=
document.getElementById("girlsContainer");

const searchInput=
document.getElementById("searchStudent");

document.querySelectorAll(".filterBtn").forEach(btn=>{

btn.onclick = ()=>{

document
.querySelectorAll(".filterBtn")
.forEach(b=>b.classList.remove("active"));


btn.classList.add("active");


currentFilter = btn.dataset.filter;


renderStudents();

};

});

const totalStudents=
document.getElementById("totalStudents");

const boysCount=
document.getElementById("boysCount");

const girlsCount=
document.getElementById("girlsCount");

const totalPoints=
document.getElementById("totalPoints");

const loading=
document.getElementById("loading");

const status=
document.getElementById("status");

/* النوافذ */

const studentModal=
document.getElementById("studentModal");

const confirmModal=
document.getElementById("confirmModal");

const messageModal=
document.getElementById("messageModal");

/* عناصر نافذة الطالب */

const modalTitle=
document.getElementById("modalTitle");

const studentName=
document.getElementById("studentName");

const studentPoints=
document.getElementById("studentPoints");

const studentGender=
document.getElementById("studentGender");

const studentFamily =
document.getElementById("studentFamily");

const nicknamesContainer =
document.getElementById("nicknamesContainer");

const addNickname =
document.getElementById("addNickname");
/*==================================
          دوال المساعدة
==================================*/
addNickname.onclick = ()=>{

const input =
document.createElement("input");

input.type = "text";

input.className = "nicknameInput";

input.placeholder = "اسم تدليل";

nicknamesContainer.appendChild(input);

};
function showLoading(text){

loading.style.display="block";

loading.textContent=text;

}

function hideLoading(){

loading.style.display="none";

}

function setStatus(text,color="#2e7d32"){

status.textContent=text;

status.style.color=color;

}

function clearStatus(){

status.textContent="";

}

/*==================================
          تحميل الطلاب
==================================*/

async function loadStudents(){

try{

showLoading("⏳ جار تحميل بيانات الطلاب...");

clearStatus();

students=[];

const snapshot=

await getDocs(

collection(db,"Students")

);

snapshot.forEach(document=>{

students.push({

id:document.id,

...document.data()

});

});

hideLoading();

renderStudents();

}

catch(error){

hideLoading();

setStatus(

"❌ حدث خطأ أثناء تحميل الطلاب.",

"#d32f2f"

);

console.error(error);

}

}

/*==================================
         بداية الصفحة
==================================*/

window.addEventListener(

"load",

loadStudents

);
/*==================================
        تحديد نوع الطالب
==================================*/

function isBoy(gender){

gender=(gender||"")
.trim()
.toLowerCase();

return [

"boy",
"male",
"ولد",
"ذكر",
"m"

].includes(gender);

}


function isGirl(gender){

gender=(gender||"")
.trim()
.toLowerCase();

return [

"girl",
"female",
"بنت",
"أنثى",
"انثى",
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
/*==================================
        إنشاء بطاقة طالب
==================================*/

function createStudentCard(student){

const card =
document.createElement("div");

card.className =
"studentCard";


if(isGirl(student.gender)){

card.classList.add("girl");

}


/* الاسم */

const name =
document.createElement("div");

name.className =
"studentName";

const fullName = getFullName(student);

name.textContent =
(isBoy(student.gender) ? "👦 " : "👧 ")
+
fullName;



/* الجواهر */

const points =
document.createElement("div");

points.className =
"studentPoints";

points.textContent =
`💎 ${student.points || 0}`;



/* صف أزرار الجواهر */

const gemsButtons =
document.createElement("div");

gemsButtons.className =
"buttonsRow";


const minus =
document.createElement("button");

minus.className =
"minusBtn";

minus.textContent =
"➖ 10";


minus.dataset.id =
student.id;


const plus =
document.createElement("button");

plus.className =
"plusBtn";

plus.textContent =
"➕ 10";


plus.dataset.id =
student.id;



gemsButtons.append(
minus,
plus
);



/* صف أزرار الإدارة */

const adminButtons =
document.createElement("div");

adminButtons.className =
"buttonsRow";


const edit =
document.createElement("button");

edit.className =
"editBtn";

edit.textContent =
"✏️ تعديل";

edit.dataset.id =
student.id;



const remove =
document.createElement("button");

remove.className =
"deleteBtn";

remove.textContent =
"🗑 حذف";

remove.dataset.id =
student.id;



adminButtons.append(
edit,
remove
);



card.append(
name,
points,
gemsButtons,
adminButtons
);


return card;

}



/*==================================
        عرض الطلاب
==================================*/

function renderStudents(){


boysContainer.innerHTML="";

girlsContainer.innerHTML="";


let boys =
students.filter(
student=>isBoy(student.gender)
);


let girls =
students.filter(
student=>isGirl(student.gender)
);

if(currentFilter==="boys"){

girls=[];

}


if(currentFilter==="girls"){

boys=[];

}

const searchValue =
searchInput.value
.trim()
.toLowerCase();



if(searchValue){

boys = boys.filter(student =>

getFullName(student)
.toLowerCase()
.includes(searchValue)

);

girls = girls.filter(student =>

getFullName(student)
.toLowerCase()
.includes(searchValue)

);

}



/* ترتيب */

boys.sort((a,b)=>

Number(b.points||0)
-
Number(a.points||0)

);


girls.sort((a,b)=>

Number(b.points||0)
-
Number(a.points||0)

);



/* الإحصائيات */

totalStudents.textContent =
students.length;


boysCount.textContent =
students.filter(
s=>isBoy(s.gender)
).length;


girlsCount.textContent =
students.filter(
s=>isGirl(s.gender)
).length;



totalPoints.textContent =
students.reduce(
(sum,s)=>
sum + Number(s.points||0),
0
);



/* إضافة البطاقات */

if(boys.length===0){

boysContainer.append(
createEmptyMessage(
"لا يوجد أولاد"
)
);

}

else{

boys.forEach(student=>{

boysContainer.append(

createStudentCard(student)

);

});

}



if(girls.length===0){

girlsContainer.append(

createEmptyMessage(
"لا توجد بنات"
)

);

}

else{

girls.forEach(student=>{

girlsContainer.append(

createStudentCard(student)

);

});

}


}



/*==================================
        رسالة عدم وجود طلاب
==================================*/

function createEmptyMessage(text){

const div =
document.createElement("div");

div.className =
"emptyMessage";

div.textContent =
text;

return div;

}



/*==================================
        البحث
==================================*/

searchInput.addEventListener(

"input",

renderStudents

);
/*==================================
        فتح نافذة الطالب
==================================*/

function openStudentModal(mode,student=null){

studentModal.style.display="flex";


if(mode==="add"){

modalTitle.textContent=
"➕ إضافة طالب جديد";


studentName.value="";

studentFamily.value="";

nicknamesContainer.innerHTML=`
<input
class="nicknameInput"
type="text"
placeholder="اسم تدليل">
`;

studentPoints.value=0;

studentGender.value="ذكر";


currentStudent=null;


}

else{


modalTitle.textContent=
"✏️ تعديل بيانات الطالب";


studentName.value =
student.firstName || student.name || "";

studentFamily.value =
student.familyName || "";

nicknamesContainer.innerHTML="";

const names =
student.nicknames || [];

if(names.length===0){

const input =
document.createElement("input");

input.type="text";

input.className="nicknameInput";

input.placeholder="اسم تدليل";
nicknamesContainer.appendChild(input);

}else{

names.forEach(n=>{

const input =
document.createElement("input");

input.type="text";

input.className="nicknameInput";

input.placeholder="اسم تدليل";

input.value=n;

nicknamesContainer.appendChild(input);

});
}

studentPoints.value =
student.points || 0;

studentGender.value =
student.gender || "ذكر";


currentStudent=
student.id;


}

}



/*==================================
        إغلاق نافذة الطالب
==================================*/

function closeStudentModal(){

studentModal.style.display="none";

currentStudent=null;

}



/*==================================
        زر فتح الإضافة
==================================*/

document
.getElementById("addStudent")
.onclick=()=>{

openStudentModal("add");

};



/*==================================
        إلغاء النافذة
==================================*/

document
.getElementById("cancelStudent")
.onclick=()=>{

closeStudentModal();

};



/*==================================
        حفظ الطالب
==================================*/

document
.getElementById("saveStudent")
.onclick=async()=>{


const firstName =
studentName.value.trim();

const familyName =
studentFamily.value.trim();

const fullName =
(firstName + " " + familyName).trim();

const nicknames =
[
...document.querySelectorAll(".nicknameInput")
]
.map(input=>input.value.trim())
.filter(name=>name!=="");

const points =
Number(studentPoints.value || 0);

const gender =
studentGender.value;


if(firstName===""){

showMessage(

"❌ اكتب اسم الطالب أولاً",

"error"

);

return;

}



try{


showLoading(
"⏳ جار حفظ البيانات..."
);



if(currentStudent===null){


/* إضافة */

await addDoc(

collection(db,"Students"),

{
firstName:firstName,

familyName:familyName,

fullName:fullName,

name:fullName,

nicknames:nicknames,

points:points,

gender:gender,

createdAt:
serverTimestamp()
}

);



}

else{


/* تعديل */

await updateDoc(

doc(
db,
"Students",
currentStudent
),

{
firstName:firstName,

familyName:familyName,

fullName:fullName,

name:fullName,

nicknames:nicknames,

points:points,

gender:gender
}

);


}



closeStudentModal();



await loadStudents();



hideLoading();



showMessage(

"✅ تمت العملية بنجاح",

"success"

);



}


catch(error){


hideLoading();


showMessage(

"❌ حدث خطأ أثناء حفظ البيانات",

"error"

);


console.error(error);


}



};
/*==================================
        نافذة التأكيد
==================================*/

function askConfirm(message,action){

const text =
document.getElementById("confirmText");

text.textContent =
message;

confirmAction =
action;

confirmModal.style.display =
"flex";

}



/* إلغاء التأكيد */

document
.getElementById("confirmNo")
.onclick=()=>{

confirmAction=null;

confirmModal.style.display="none";

};



/* تنفيذ التأكيد */

document
.getElementById("confirmYes")
.onclick=async()=>{


confirmModal.style.display="none";


if(confirmAction){

await confirmAction();

confirmAction=null;

}


};



/*==================================
        تغيير الجواهر
==================================*/

async function changePoints(id,value){


const student =
students.find(
s=>s.id===id
);


if(!student)
return;



askConfirm(

`${value>0 ? "إضافة" : "خصم"} ${Math.abs(value)} جواهر للطالب ${student.fullName || student.name}؟`,

async()=>{


try{


showLoading(
"⏳ جار تحديث الجواهر..."
);



let newPoints =
Number(student.points||0)
+
value;



if(newPoints<0){

newPoints=0;

}



await updateDoc(

doc(
db,
"Students",
id
),

{

points:newPoints

}

);



await loadStudents();



hideLoading();



showMessage(

"✅ تم تحديث الجواهر بنجاح",

"success"

);



}

catch(error){


hideLoading();



showMessage(

"❌ حدث خطأ أثناء تحديث الجواهر",

"error"

);



console.error(error);


}



}


);


}



/*==================================
        حذف الطالب
==================================*/

async function deleteStudent(id){


const student =
students.find(
s=>s.id===id
);


if(!student)
return;



askConfirm(
            
`هل تريد حذف الطالب ${student.fullName || student.name} نهائياً؟`,
            
async()=>{


try{


showLoading(
"⏳ جار حذف الطالب..."
);



await deleteDoc(

doc(
db,
"Students",
id
)

);



await loadStudents();



hideLoading();



showMessage(

"✅ تم حذف الطالب بنجاح",

"success"

);



}

catch(error){


hideLoading();


showMessage(

"❌ حدث خطأ أثناء الحذف",

"error"

);



console.error(error);


}


}


);


}



/*==================================
        أزرار البطاقات
==================================*/


document.addEventListener(

"click",

(e)=>{


const id =
e.target.dataset.id;



if(!id)
return;



if(
e.target.classList.contains("plusBtn")
){

changePoints(
id,
10
);

}



if(
e.target.classList.contains("minusBtn")
){

changePoints(
id,
-10
);

}



if(
e.target.classList.contains("deleteBtn")
){

deleteStudent(id);

}



if(
e.target.classList.contains("editBtn")
){


const student =
students.find(
s=>s.id===id
);


if(student){

openStudentModal(
"edit",
student
);

}


}


}

);
/*==================================
        رسائل النظام
==================================*/

function showMessage(text,type){


const messageText =
document.getElementById("messageText");


messageText.textContent =
text;



const messageIcon =
document.getElementById("messageIcon");



if(type==="success"){

messageIcon.textContent="✅";

}

else{

messageIcon.textContent="❌";

}



messageModal.style.display="flex";


}



/*==================================
        إغلاق رسالة النظام
==================================*/


document
.getElementById("closeMessage")
.onclick=()=>{


messageModal.style.display="none";


};



/*==================================
        إغلاق النوافذ عند الضغط خارجها
==================================*/


window.addEventListener(

"click",

(e)=>{


if(e.target===studentModal){

closeStudentModal();

}



if(e.target===confirmModal){

confirmModal.style.display="none";

confirmAction=null;

}



if(e.target===messageModal){

messageModal.style.display="none";

}



}

);



/*==================================
        منع إدخال قيم سالبة
==================================*/


studentPoints.addEventListener(

"input",

()=>{


if(Number(studentPoints.value)<0){

studentPoints.value=0;

}


}

);



/*==================================
        معالجة الأخطاء العامة
==================================*/


window.addEventListener(

"unhandledrejection",

(event)=>{


console.error(
event.reason
);


showMessage(

"❌ حدث خطأ غير متوقع، حاول مرة أخرى",

"error"

);


}

);
