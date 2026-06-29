let students = [];
let currentFilter = "all";

const cards = document.getElementById("cards");
const search = document.getElementById("search");
const studentsCount = document.getElementById("studentsCount");
const pointsCount = document.getElementById("pointsCount");

fetch("students.json")
.then(r => r.json())
.then(data => {
    students = data;
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

function render() {

    let list = [...students];

    if(currentFilter === "boys"){
        list = list.filter(s => s.gender === "ذكر");
    }

    if(currentFilter === "girls"){
        list = list.filter(s => s.gender === "أنثى");
    }
let word = search.value.trim();

    if(word !== ""){
        list = list.filter(s => s.name.includes(word));
    }

    list.sort((a,b)=>b.points-a.points);

    studentsCount.textContent = list.length;

    pointsCount.textContent =
        list.reduce((sum,s)=>sum+s.points,0);
cards.innerHTML = "";

    list.forEach((s,i)=>{

    let medal = "";
    let cardClass = "";

    if(i === 0){
        medal = "🥇";
        cardClass = "gold";
    }
    else if(i === 1){
        medal = "🥈";
        cardClass = "silver";
    }
    else if(i === 2){
        medal = "🥉";
        cardClass = "bronze";
    }

    cards.innerHTML += `
    <div class="student-card ${cardClass}">

        <div class="student-name">
            ${medal} ${s.name}
        </div>

        <div class="student-info">
            <span>💎 النقاط</span>
            <span class="points">${s.points}</span>
        </div>
        <div class="student-info">
            <span>النوع</span>
            <span>${s.gender === "ذكر" ? "👦 الأولاد" : "👧 البنات"}</span>
        </div>

        <div class="rank">
            🏅 المركز ${i + 1}
        </div>

    </div>
    `;

});

}
