import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    writeBatch,
    getDoc,
    query,
    where,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import {
    APP_CONFIG,
    getCurrentMosqueId
} from "./config.js";

const mosqueId = getCurrentMosqueId();

if (
    sessionStorage.getItem("codesAuthorized")
    !==
    "true"
) {
    location.href = "codes-login.html";
}

sessionStorage.removeItem("codesAuthorized");

const firebaseConfig = {

    apiKey: "AIzaSyCI3KykpatQW82_O5LuRoajP8oWhhMw4Zg",

    authDomain: "fafirru-ila-allah.firebaseapp.com",

    projectId: "fafirru-ila-allah",

    storageBucket: "fafirru-ila-allah.firebasestorage.app",

    messagingSenderId: "564958663441",

    appId: "1:564958663441:web:9e6e6a246ec0e2c48472b0"

};

const app =
    initializeApp(
        firebaseConfig
    );

const db =
    getFirestore(app);

let studentsList = [];

let currentMosque = null;

const status =
    document.getElementById("status");

const progressBar =
    document.getElementById("progressBar");

let csvFiles = [];


function randomCode() {

    return Math.floor(
        100000 +
        Math.random() * 900000
    ).toString();

}


async function readCsvCodes(files) {

    const codes = new Set();

    for (const file of files) {

        const text = await file.text();

        const lines =
            text.split(/\r?\n/);

        for (let line of lines) {

            line = line.trim();

            if (!line)
                continue;

            if (line.startsWith("الكود"))
                continue;

            const parts =
                line
                    .replace(/"/g, "")
                    .split(",");

            if (parts[0]) {

                codes.add(
                    parts[0].trim()
                );

            }

        }

    }

    return codes;

}


async function loadStudents() {

    studentsList = [];

    const q = query(
        collection(db, "Students"),
        where("mosqueId", "==", mosqueId)
    );

    const snapshot =
        await getDocs(q);

    snapshot.forEach(doc => {

        const data = doc.data();

        studentsList.push({

            id: doc.id,

            name:
                data.fullName ||
                data.name ||
                ""

        });

    });

}


async function loadMosque() {

    const q = query(
        collection(db, "Mosques"),
        where("id", "==", mosqueId)
    );

    const snapshot =
        await getDocs(q);

    if (snapshot.empty) {

        alert("المسجد غير موجود");

        return;

    }

    currentMosque =
        snapshot.docs[0].data();

}


function buildCardsTemplates() {

    const box =
        document.getElementById("templates");

    box.innerHTML = "";

    const values =
        currentMosque.cardValues || [];

    const folder =
        currentMosque.cardsFolder || "";

    values.forEach((value, index) => {

        box.innerHTML += `

<label class="cardOption">

<input
type="radio"
name="template"
value="${value}"
${index == 0 ? "checked" : ""}>

<img src="${folder}${value}.jpg">

</label>

`;

    });

}


async function loadExistingCodes() {

    const set =
        new Set();

    const q = query(
        collection(db, "Codes"),
        where("mosqueId", "==", mosqueId)
    );

    const snapshot =
        await getDocs(q);

    snapshot.forEach(doc => {

        const data =
            doc.data();

        if (data.mosqueId !== mosqueId)
            return;

        set.add(data.code);

    });

    return set;

}


async function createCard(code) {

    return new Promise((resolve) => {

        const template =
            document.querySelector(
                'input[name="template"]:checked'
            ).value;

        const img =
            new Image();

        img.src =
            `${currentMosque.cardsFolder}${template}.jpg`;

        img.onload = () => {

            const canvas =
                document.createElement(
                    "canvas"
                );

            canvas.width =
                img.width;

            canvas.height =
                img.height;

            const ctx =
                canvas.getContext(
                    "2d"
                );

            ctx.drawImage(
                img,
                0,
                0
            );

            const fontSize =
                Number(
                    document.getElementById(
                        "fontSize"
                    ).value
                );

            const fontFamily =
                document.getElementById(
                    "fontFamily"
                ).value;

            const textColor =
                document.getElementById(
                    "textColor"
                ).value;

            ctx.font =
                `bold ${fontSize}px "${fontFamily}"`;

            ctx.fillStyle =
                textColor;

            ctx.textAlign =
                "center";

            ctx.textBaseline =
                "middle";

            ctx.fillText(
                code.split("").join(" "),
                1535,
                880
            );

            canvas.toBlob(
                (blob) => {

                    resolve(blob);

                },
                "image/png"
            );

        };

    });

}


async function addCardToPdf(
    pdf,
    imageBlob,
    index
) {

    const imageUrl =
        URL.createObjectURL(
            imageBlob
        );

    const img =
        new Image();

    await new Promise(resolve => {

        img.onload =
            resolve;

        img.src =
            imageUrl;

    });

    const canvas =
        document.createElement(
            "canvas"
        );

    const scale =
        900 / img.width;

    canvas.width =
        900;

    canvas.height =
        Math.round(
            img.height * scale
        );

    const ctx =
        canvas.getContext(
            "2d"
        );

    ctx.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const imageData =
        canvas.toDataURL(
            "image/jpeg",
            0.8
        );

    const col =
        index % 3;

    const row =
        Math.floor(index / 3) % 7;

    const cardWidth =
        60;

    const cardHeight =
        cardWidth *
        img.height /
        img.width;

    const marginX =
        8;

    const marginY =
        8;

    const spaceX =
        6;

    const spaceY =
        4;

    const x =
        marginX +
        col *
        (cardWidth + spaceX);

    const y =
        marginY +
        row *
        (cardHeight + spaceY);

    pdf.addImage(
        imageData,
        "JPEG",
        x,
        y,
        cardWidth,
        cardHeight
    );

    URL.revokeObjectURL(
        imageUrl
    );

}


// ==========================
// لوحة إدارة الأكواد
// ==========================

let allCodes = [];


async function loadCodesTable() {

    status.innerHTML =
        "⏳ جار تحميل الأكواد...";

    const tbody =
        document.querySelector(
            "#codesTable tbody"
        );

    tbody.innerHTML = "";

    const q = query(
        collection(db, "Codes"),
        where("mosqueId", "==", mosqueId)
    );

    const snapshot =
        await getDocs(q);

    allCodes = [];

    snapshot.forEach(doc => {

        const data =
            doc.data();

        if (data.mosqueId !== mosqueId)
            return;

        allCodes.push({

            id: doc.id,

            ...data

        });

    });

    allCodes.sort((a, b) => {

        const ta =
            a.createdAt?.seconds || 0;

        const tb =
            b.createdAt?.seconds || 0;

        return tb - ta;

    });

    renderCodesTable();

    status.innerHTML = "";

}


function renderCodesTable() {

    const tbody =
        document.querySelector(
            "#codesTable tbody"
        );

    if (allCodes.length === 0) {

        tbody.innerHTML = `

<tr>

<td colspan="8">

اضغط زر "تحديث الجدول" لتحميل الأكواد.

</td>

</tr>

`;

        return;

    }

    tbody.innerHTML = "";

    const search =
        document
            .getElementById("searchCode")
            .value
            .trim()
            .toLowerCase();

    const filter =
        document
            .getElementById("filterUsed")
            .value;

    let total = 0;

    let used = 0;

    let unused = 0;

    allCodes.forEach(item => {

        total++;

        if (item.used)
            used++;
        else
            unused++;

        if (
            search &&
            !item.code
                .toLowerCase()
                .includes(search) &&
            !(item.student || "")
                .toLowerCase()
                .includes(search)
        ) {

            return;

        }

        if (
            filter != "all" &&
            String(item.used) != filter
        ) {

            return;

        }

        tbody.innerHTML += `

<tr>

<td>

<input
type="checkbox"
class="rowCheck"
data-id="${item.id}">

</td>

<td>${item.code}</td>

<td>${item.points}</td>

<td data-student-id="${item.studentId || ""}">

${item.student || "-"}

</td>

<td>

${item.used ? "✅" : "❌"}

</td>

<td>

${
    item.createdAt?.toDate
    ? item.createdAt.toDate()
        .toLocaleString("ar-EG")
    : "-"
}

</td>

<td>

${
    item.usedAt?.toDate
    ? item.usedAt.toDate()
        .toLocaleString("ar-EG")
    : "-"
}

</td>

<td>

<button
class="editBtn"
data-id="${item.id}">
تعديل
</button>

<button
class="deleteBtn"
data-id="${item.id}">
حذف
</button>

</td>

</tr>

`;

    });

    document.getElementById(
        "totalCodes"
    ).textContent = total;

    document.getElementById(
        "usedCodes"
    ).textContent = used;

    document.getElementById(
        "unusedCodes"
    ).textContent = unused;

    updateSelectedButton();

}


// =====================
// تحديد الأكواد
// =====================

function updateSelectedButton() {

    const checks =
        document.querySelectorAll(
            ".rowCheck:checked"
        );

    const btn =
        document.getElementById(
            "deleteSelected"
        );

    const count =
        document.getElementById(
            "selectedCount"
        );

    count.textContent =
        checks.length;

    btn.style.display =
        checks.length
            ? "block"
            : "none";

    const all =
        document.querySelectorAll(
            ".rowCheck"
        );

    const selectBtn =
        document.getElementById(
            "selectAll"
        );

    if (selectBtn) {

        selectBtn.textContent =
            (
                all.length > 0 &&
                checks.length === all.length
            )
            ? "إلغاء تحديد الكل"
            : "تحديد الكل";

    }

}


document.addEventListener(
    "change",
    (e) => {

        if (
            e.target.classList
                .contains("rowCheck")
        ) {

            updateSelectedButton();

        }

    }
);


document.addEventListener(
    "click",
    async (e) => {

        // =====================
        // حذف المحدد
        // =====================

        if (
            e.target.id ==
            "deleteSelected"
        ) {

            const ids = [];

            document
                .querySelectorAll(
                    ".rowCheck:checked"
                )
                .forEach(c => {

                    ids.push(
                        c.dataset.id
                    );

                });

            if (ids.length == 0)
                return;

            if (
                !confirm(
                    `حذف ${ids.length} كود؟`
                )
            )
                return;

            for (const id of ids) {

                await deleteDoc(
                    doc(
                        db,
                        "Codes",
                        id
                    )
                );

            }

            allCodes =
                allCodes.filter(
                    x =>
                        !ids.includes(x.id)
                );

            renderCodesTable();

            updateSelectedButton();

            return;

        }


        // =====================
        // حذف كود
        // =====================

        if (
            e.target.classList
                .contains("deleteBtn")
        ) {

            const id =
                e.target.dataset.id;

            if (
                !confirm(
                    "هل تريد حذف هذا الكود؟"
                )
            )
                return;

            await deleteDoc(
                doc(
                    db,
                    "Codes",
                    id
                )
            );

            allCodes =
                allCodes.filter(
                    x =>
                        x.id != id
                );

            renderCodesTable();

            return;

        }


        // =====================
        // تعديل كود
        // =====================

        if (
            e.target.classList
                .contains("editBtn")
        ) {

            const id =
                e.target.dataset.id;

            const item =
                allCodes.find(
                    x =>
                        x.id == id
                );

            if (!item)
                return;

            const newPoints =
                prompt(
                    "عدد الجواهر",
                    item.points
                );

            if (
                newPoints === null
            )
                return;

            const newStudent =
                prompt(
                    "اسم الطالب",
                    item.student || ""
                );

            const currentStudentId =
                item.studentId || "";

            if (
                newStudent === null
            )
                return;

            const usedAnswer =
                confirm(
                    "هل الكود مستخدم؟"
                );

            const updateData = {

                mosqueId:
                    item.mosqueId ||
                    mosqueId,

                points:
                    Number(newPoints),

                student:
                    newStudent,

                studentId:
                    item.studentId ||
                    "",

                used:
                    usedAnswer

            };

            if (
                usedAnswer &&
                !item.used
            ) {

                updateData.usedAt =
                    serverTimestamp();

            }

            if (!usedAnswer) {

                updateData.usedAt =
                    null;

                updateData.student =
                    "";

                updateData.studentId =
                    "";

            }

            await updateDoc(

                doc(
                    db,
                    "Codes",
                    id
                ),

                updateData

            );

            item.points =
                Number(newPoints);

            item.student =
                newStudent;

            item.studentId =
                updateData.studentId;

            item.used =
                usedAnswer;

            renderCodesTable();

        }

    }
);


if (
    document.getElementById(
        "searchCode"
    )
) {

    document.getElementById(
        "refreshTable"
    ).onclick =
        async () => {

            await loadCodesTable();

        };

    document.getElementById(
        "searchCode"
    ).oninput =
        renderCodesTable;

    document.getElementById(
        "filterUsed"
    ).onchange =
        renderCodesTable;

    window.addEventListener(
        "load",
        async () => {

            await loadMosque();

            await loadStudents();

            buildCardsTemplates();

            renderCodesTable();

        }
    );

}


document.getElementById(
    "selectAll"
).onclick = () => {

    const checks =
        document.querySelectorAll(
            ".rowCheck"
        );

    if (
        checks.length === 0
    )
        return;

    const checked =
        document.querySelectorAll(
            ".rowCheck:checked"
        );

    const selectAll =
        checked.length !==
        checks.length;

    checks.forEach(c => {

        c.checked =
            selectAll;

    });

    updateSelectedButton();

};
document.getElementById(
    "create"
).onclick =

async () => {

    const zip =
        new JSZip();

    const count =
        Number(
            document.getElementById(
                "count"
            ).value
        );

    const points =
        Number(
            document.getElementById(
                "points"
            ).value
        );

    if (
        count <= 0 ||
        points <= 0
    ) {

        alert(
            "أدخل قيماً صحيحة."
        );

        return;

    }

    progressBar.value = 0;

    progressBar.style.display =
        "block";

    status.innerHTML =
        "⏳ جارٍ إنشاء الأكواد...";

    const used =
        await loadExistingCodes();

    let csv =
        "الكود,الجواهر\n";

    const {
        jsPDF
    } = window.jspdf;

    const pdf =
        new jsPDF({

            orientation:
                "portrait",

            unit:
                "mm",

            format:
                "a4"

        });

    let created = 0;

    const batchId =
        Date.now();

    while (
        created < count
    ) {

        const code =
            randomCode();

        if (
            used.has(code)
        )
            continue;

        used.add(code);

        await addDoc(
            collection(
                db,
                "Codes"
            ),
            {

                code:
                    code,

                points:
                    points,

                student:
                    "",

                studentId:
                    "",

                mosqueId:
                    mosqueId,

                used:
                    false,

                createdAt:
                    serverTimestamp(),

                usedAt:
                    null,

                batchId:
                    batchId

            }
        );

        const card =
            await createCard(
                code
            );

        zip.file(
            `${code}.png`,
            card
        );

        await addCardToPdf(
            pdf,
            card,
            created
        );

        if (
            (created + 1) % 21 === 0 &&
            created + 1 < count
        ) {

            pdf.addPage();

        }

        csv +=
            `"${code}","${points}"\n`;

        created++;

        progressBar.value =
            (created / count) * 100;

        status.innerHTML =
            `⏳ تم إنشاء ${created} من ${count}`;

    }

    progressBar.value =
        100;

    const csvBlob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );

    const zipBlob =
        await zip.generateAsync({
            type:
                "blob"
        });

    window.csvBlob =
        csvBlob;

    window.zipBlob =
        zipBlob;

    window.pdf =
        pdf;

    window.points =
        points;

    document.getElementById(
        "downloadCsv"
    ).style.display =
        "block";

    document.getElementById(
        "downloadZip"
    ).style.display =
        "block";

    document.getElementById(
        "downloadPdf"
    ).style.display =
        "block";

    status.innerHTML =
        `✅ تم إنشاء ${count} كود بنجاح.`;

    alert(
        "تم إنشاء جميع الملفات بنجاح."
    );

};


document.getElementById(
    "downloadCsv"
).onclick = () => {

    const url =
        URL.createObjectURL(
            window.csvBlob
        );

    const a =
        document.createElement(
            "a"
        );

    a.href =
        url;

    a.download =
        `أكواد_${window.points}.csv`;

    a.click();

    URL.revokeObjectURL(
        url
    );

};


document.getElementById(
    "downloadZip"
).onclick = () => {

    saveAs(
        window.zipBlob,
        `بطاقات_${window.points}.zip`
    );

};


document.getElementById(
    "downloadPdf"
).onclick = () => {

    window.pdf.save(
        `بطاقات_${window.points}.pdf`
    );

};


document.getElementById(
    "deleteAll"
).onclick =

async () => {

    if (
        !confirm(
            "هل تريد حذف جميع الأكواد؟"
        )
    )
        return;

    progressBar.style.display =
        "block";

    progressBar.value =
        0;

    status.innerHTML =
        "⏳ جارٍ حذف الأكواد...";

    const q =
        query(
            collection(
                db,
                "Codes"
            ),
            where(
                "mosqueId",
                "==",
                mosqueId
            )
        );

    const snapshot =
        await getDocs(q);

    const total =
        snapshot.docs.length;

    let deleted = 0;

    for (
        const codeDoc
        of snapshot.docs
    ) {

        const data =
            codeDoc.data();

        if (
            data.mosqueId !==
            mosqueId
        )
            continue;

        await deleteDoc(
            codeDoc.ref
        );

        deleted++;

        if (
            total > 0
        ) {

            progressBar.value =
                (deleted / total) * 100;

        }

        status.innerHTML =
            `⏳ تم حذف ${deleted} من ${total}`;

    }

    progressBar.value =
        100;

    status.innerHTML =
        "✅ تم حذف جميع الأكواد بنجاح.";

    alert(
        "تم حذف جميع الأكواد."
    );

};


document.getElementById(
    "keepCsvOnly"
).onclick =

async () => {

    const files =
        csvFiles;

    if (
        files.length == 0
    ) {

        alert(
            "اختر ملفات CSV أولاً"
        );

        return;

    }

    if (
        !confirm(
            "سيتم حذف جميع الأكواد غير الموجودة داخل ملفات CSV. هل أنت متأكد؟"
        )
    ) {

        return;

    }

    status.innerHTML =
        "📄 جار قراءة ملفات CSV...";

    const keepCodes =
        await readCsvCodes(
            files
        );

    status.innerHTML =
        "☁️ جار مقارنة الأكواد...";

    const q =
        query(
            collection(
                db,
                "Codes"
            ),
            where(
                "mosqueId",
                "==",
                mosqueId
            )
        );

    const snapshot =
        await getDocs(q);

    let deleted = 0;

    let total =
        snapshot.docs.length;

    progressBar.style.display =
        "block";

    progressBar.value =
        0;

    for (
        const d
        of snapshot.docs
    ) {

        const data =
            d.data();

        if (
            data.mosqueId !==
            mosqueId
        )
            continue;

        if (
            !keepCodes.has(
                data.code
            )
        ) {

            await deleteDoc(
                d.ref
            );

            deleted++;

        }

        progressBar.value++;

        progressBar.max =
            total;

        status.innerHTML =
            `تم فحص ${progressBar.value} من ${total}`;

    }

    progressBar.style.display =
        "none";

    alert(
        `تم حذف ${deleted} كود`
    );

    loadCodesTable();

};


document.getElementById(
    "exportUsed"
).onclick =

async () => {

    status.innerHTML =
        "⏳ جار استخراج الأكواد المستخدمة...";

    const q =
        query(
            collection(
                db,
                "Codes"
            ),
            where(
                "mosqueId",
                "==",
                mosqueId
            )
        );

    const snapshot =
        await getDocs(q);

    let csv =
        "الكود,الجواهر,الطالب\n";

    let count = 0;

    snapshot.forEach(
        codeDoc => {

            const data =
                codeDoc.data();

            if (
                data.mosqueId ===
                mosqueId &&
                data.used
            ) {

                csv +=
                    `"${data.code}","${data.points}","${data.student || ""}"\n`;

                count++;

            }

        }
    );

    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const a =
        document.createElement(
            "a"
        );

    a.href =
        url;

    a.download =
        "الأكواد_المستخدمة.csv";

    a.click();

    URL.revokeObjectURL(
        url
    );

    status.innerHTML =
        `✅ تم حفظ ${count} كود مستخدم`;

};


document.getElementById(
    "csvFile"
).addEventListener(
    "change",
    (e) => {

        const file =
            e.target.files[0];

        if (!file)
            return;

        if (
            !csvFiles.find(
                f =>
                    f.name ===
                    file.name &&
                    f.size ===
                    file.size
            )
        ) {

            csvFiles.push(
                file
            );

        }

        document.getElementById(
            "csvFilesList"
        ).innerHTML =

            csvFiles
                .map(
                    f =>
                        "📄 " +
                        f.name
                )
                .join(
                    "<br>"
                );

        e.target.value =
            "";

    }
);


document.getElementById(
    "deleteLastBatch"
).onclick =

async () => {

    if (
        !confirm(
            "سيتم حذف آخر دفعة تم إنشاؤها، هل أنت متأكد؟"
        )
    )
        return;

    const q =
        query(
            collection(
                db,
                "Codes"
            ),
            where(
                "mosqueId",
                "==",
                mosqueId
            )
        );

    const snapshot =
        await getDocs(q);

    let lastBatch =
        null;

    snapshot.forEach(
        codeDoc => {

            const data =
                codeDoc.data();

            if (
                data.mosqueId !==
                mosqueId
            )
                return;

            if (
                data.batchId &&
                (
                    !lastBatch ||
                    data.batchId >
                    lastBatch
                )
            ) {

                lastBatch =
                    data.batchId;

            }

        }
    );

    if (!lastBatch) {

        alert(
            "لا توجد دفعات."
        );

        return;

    }

    let deleted = 0;

    for (
        const d
        of snapshot.docs
    ) {

        const data =
            d.data();

        if (
            data.mosqueId !==
            mosqueId
        )
            continue;

        if (
            data.batchId ==
            lastBatch
        ) {

            await deleteDoc(
                d.ref
            );

            deleted++;

        }

    }

    alert(
        `تم حذف ${deleted} كود من آخر دفعة.`
    );

    loadCodesTable();

};


document.getElementById(
    "fixCodes"
).onclick =

async () => {

    if (
        !confirm(
            "سيتم ربط جميع الأكواد القديمة بالمسجد الحالي. هل تريد المتابعة؟"
        )
    )
        return;

    const snapshot =
        await getDocs(
            collection(
                db,
                "Codes"
            )
        );

    let count = 0;

    for (
        const codeDoc
        of snapshot.docs
    ) {

        const data =
            codeDoc.data();

        if (
            !data.mosqueId
        ) {

            await updateDoc(
                doc(
                    db,
                    "Codes",
                    codeDoc.id
                ),
                {
                    mosqueId:
                        "mosque_001"
                }
            );

            count++;

        }

    }

    alert(
        `تم تحديث ${count} كود بنجاح`
    );

    loadCodesTable();

};


document.getElementById(
    "addMosqueId"
).onclick =

async () => {

    if (
        !confirm(
            "سيتم إضافة mosqueId لجميع الطلاب الذين لا يملكونه، هل أنت متأكد؟"
        )
    )
        return;

    const snapshot =
        await getDocs(
            collection(
                db,
                "Students"
            )
        );

    let updated = 0;

    for (
        const student
        of snapshot.docs
    ) {

        const data =
            student.data();

        if (
            data.mosqueId
        )
            continue;

        await updateDoc(
            student.ref,
            {
                mosqueId:
                    mosqueId
            }
        );

        updated++;

    }

    alert(
        `تم تحديث ${updated} طالب بنجاح.`
    );

};


document.getElementById(
    "migrateStudents"
).onclick =

async () => {

    if (
        !confirm(
            "سيتم ترحيل جميع طلاب المسجد الحالي إلى MosqueStudents، هل تريد المتابعة؟"
        )
    )
        return;

    const studentsQuery =
        query(
            collection(
                db,
                "Students"
            ),
            where(
                "mosqueId",
                "==",
                mosqueId
            )
        );

    const snapshot =
        await getDocs(
            studentsQuery
        );

    if (
        snapshot.empty
    ) {

        alert(
            "لا يوجد طلاب."
        );

        return;

    }

    const batch =
        writeBatch(db);

    const mosqueDoc =
        doc(
            db,
            "MosqueStudents",
            mosqueId
        );

    const students = [];

    snapshot.forEach(
        student => {

            const data =
                student.data();

            students.push({

                id:
                    student.id,

                ...data

            });

        }
    );

    batch.set(
        mosqueDoc,
        {

            students:
                students,

            updatedAt:
                serverTimestamp()

        }
    );

    await batch.commit();

    alert(
        `تم ترحيل ${students.length} طالب بنجاح.`
    );

};
// ====================================
// نسخ معرفات الطلاب للمساعدة في إعداد
// الرسائل الخاصة
// ====================================

document.getElementById(
    "copyStudentsIds"
).onclick = async () => {

    const button =
        document.getElementById(
            "copyStudentsIds"
        );

    try {

        button.disabled = true;

        button.textContent =
            "⏳ جارٍ القراءة...";

        /*
         * قراءة Students مرة واحدة فقط
         * للمسجد الحالي
         */

        const q = query(
            collection(db, "Students"),
            where(
                "mosqueId",
                "==",
                mosqueId
            )
        );

        const snapshot =
            await getDocs(q);

        if (snapshot.empty) {

            alert(
                "لا يوجد طلاب لهذا المسجد."
            );

            return;

        }

        /*
         * تجهيز البيانات
         */

        const students = [];

        snapshot.forEach(
            studentDoc => {

                const data =
                    studentDoc.data();

                students.push({

                    id:
                        studentDoc.id,

                    name:
                        data.fullName ||
                        data.name ||
                        data.firstName ||
                        "",

                    mosqueId:
                        data.mosqueId ||
                        mosqueId

                });

            }
        );

        /*
         * ترتيب الطلاب أبجديًا
         */

        students.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name,
                    "ar"
                )
        );

        /*
         * تحويل البيانات إلى نص
         * سهل النسخ واللصق
         */

        let text =
            `المسجد: ${mosqueId}\n\n`;

        text +=
            `عدد الطلاب: ${students.length}\n\n`;

        students.forEach(
            (student, index) => {

                text +=
                    `${index + 1}. ${student.name}\n`;

                text +=
                    `studentId: ${student.id}\n`;

                text +=
                    `mosqueId: ${student.mosqueId}\n\n`;

            }
        );

        /*
         * النسخ إلى الحافظة
         */

        await navigator.clipboard.writeText(
            text
        );

        alert(
            `✅ تم نسخ بيانات ${students.length} طالب إلى الحافظة.`
        );

    }

    catch(error) {

        console.error(error);

        alert(
            "❌ تعذر نسخ البيانات. تأكد من السماح للمتصفح بالوصول إلى الحافظة."
        );

    }

    finally {

        button.disabled = false;

        button.textContent =
            "📋 نسخ معرفات الطلاب";

    }

};
