let students = [];
let currentFilter = "all";

const cards = document.getElementById("cards");
const search = document.getElementById("search");
const studentsCount = document.getElementById("studentsCount");
const pointsCount = document.getElementById("pointsCount");

// أزرار الفلترة
document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {

        document.querySelectorAll(".filter-btn").forEach(b => {
            b.classList.remove("active");
        });

        button.classList.add("active");
        currentFilter = button.dataset.filter;

        renderStudents();
    });
});
// البحث
if (search) {
    search.addEventListener("input", renderStudents);
}

// تحميل البيانات
fetch("students.json")
    .then(response => response.json())
    .then(data => {
        students = data;
        renderStudents();
    })
    .catch(error => {
        console.error("خطأ في قراءة students.json", error);
    });
function renderStudents() {

    let filtered = [...students];

    if (currentFilter === "boys") {
        filtered = filtered.filter(s => s.gender === "ذكر");
    }

    if (currentFilter === "girls") {
        filtered = filtered.filter(s => s.gender === "أنثى");
    }
  const text = search ? search.value.trim() : "";

    if (text !== "") {
        filtered = filtered.filter(s => s.name.includes(text));
    }

    filtered.sort((a, b) => b.points - a.points);

    if (studentsCount)
        studentsCount.textContent = filtered.length;

    if (pointsCount)
 pointsCount.textContent = filtered.reduce((sum, s) => sum + s.points, 0);

    cards.innerHTML = "";

    filtered.forEach((student, index) => {

        let medal = "";
        let cardClass = "";
      if (index === 0) {
            medal = "🥇";
            cardClass = "gold";
        } else if (index === 1) {
            medal = "🥈";
            cardClass = "silver";
        } else if (index === 2) {
            medal = "🥉";
            cardClass = "bronze";
      }
      cards.innerHTML += `
        <div class="student-card ${cardClass}">
            <div class="student-name">
                ${medal} ${student.name}
            </div>

            <div class="student-info">
                <span>💎 النقاط</span>
                <span class="points">${student.points}</span>
            </div>
            <div class="student-info">
                <span>النوع</span>
                <span>${student.gender === "ذكر" ? "👦 ذكر" : "👧 أنثى"}</span>
            </div>

            <div class="rank">
                🏅 المركز ${index + 1}
            </div>
        </div>
        `;
    });
}
