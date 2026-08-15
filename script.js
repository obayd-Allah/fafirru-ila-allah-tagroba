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
"واو.. ما شاء الله.. يلا بقى يا {nickname} عايزينك تدخل الجنة", 
    "تمام جدًا تمام جدًا 👍 ربنا يبارك فيك يا {name}", 
   "بتحب النبيﷺ يا {name}؟ النبيﷺ قال: (خيرُكُم مَن تعلَّمَ القرآنَ وعلَّمَهُ)", 
   "{nickname}؛ إياك تنسى إننا بنتسابق على الجنة.. مش عالجواهر💎 ", 
   

   

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
"واو.. ما شاء الله.. يلا بقى يا {nickname} عايزينك تدخلي الجنة", 

    "تمام جدًا تمام جدًا 👍 ربنا يبارك فيكِ يا {name}", 
   "بتحبي النبيﷺ يا {name}؟ النبيﷺ قال: (خيرُكُم مَن تعلَّمَ القرآنَ وعلَّمَهُ)", 
    "{nickname}؛ إياكِ تنسي إننا بنتسابق على الجنة.. مش عالجواهر💎 "
 

];

/* ====================================
   الرسائل الخاصة بالطلاب
==================================== */

const studentMessages = {

  // ============================================================
  // المسجد: mosque_001
  // ============================================================

  "mosque_001": {

    "rtQ7Z32wXs2TF7skJ5bw": [], // آدم أحمد عبد المنعم | mosque_001 | ولد

    "oUkLbfH6MRABDuFQ3yUL": [], // آدم عمرو | mosque_001 | ولد

    "xDaRawYamKZJIs9h7eO7": [], // آمن محمد أحمد صالح | mosque_001 | ولد

    "75kbeeXIR80x9SU6vdzg": [], // أبرار أشرف | mosque_001 | بنت

    "jNJA6r49bmsbgzAAtMMO": [], // إبراهيم إسلام أحمد | mosque_001 | ولد

    "ugwmFdHDM7CbrN8tUUtn": [], // إبراهيم عبد اللطيف أحمد | mosque_001 | ولد

    "UMz6oyvcGTP6nHpSrI3c": [], // أحمد محمد جابر | mosque_001 | ولد

    "fwOBmrCwFjfRfkVvOlXQ": [], // أدهم حسام الدين سالم | mosque_001 | ولد

    "jhA9vdWyu5BJ6CGI7zio": [], // أروى حافظ | mosque_001 | بنت

    "86BJwuNiyq64itdOPcxB": [], // ألين حافظ | mosque_001 | بنت

    "Kdfcdr07MduxzWrMkmSm": [], // أمير مصطفى شافعي | mosque_001 | ولد

    "LtxnG4AZq6oGa5tNu067": [], // أنس محمد خلف | mosque_001 | ولد

    "a2MyUvxLbuinhy55URH1": [], // إياد أحمد فتحي | mosque_001 | ولد

    "8znHpXevmBnCy59ViDkF": [], // أيسل حافظ | mosque_001 | بنت

    "ofzOvH61GFyNfVlzKc43": [], // أيسل محمد عثمان | mosque_001 | بنت

    "LEb7yltEtNRVNlwfTUh7": [], // بلال محمد عبد المنعم | mosque_001 | ولد

    "ht0MJkkCSMUsSlr27rMB": [], // تميم محمد جابر | mosque_001 | ولد

    "2QeM6bUTUqM6jklLUqiQ": [], // جنى صلاح محمد | mosque_001 | بنت

    "wuGtZeVNlTD8EkCjUNdJ": [], // حبيبة المعتز بالله | mosque_001 | بنت

    "Vyd8cu9Gn233eI5Y0GRJ": [], // حسن أيمن حسن | mosque_001 | ولد

    "RflsYHtuVFV9fDg4l8ay": [], // حمزة أحمد خلف | mosque_001 | ولد

    "Eb1NtE2rLxbmYubJu3ib": [], // حمزة أشرف رمضان | mosque_001 | ولد

    "yUzZktjMy7RB80zM2nOg": [], // حمزة حسن عبد الشافي | mosque_001 | ولد

    "8dN6AqI0AKWQ7YzVpSd6": [], // حمزة رامي سيد | mosque_001 | ولد

    "lD2a2sLqAhtFUuCJGgEh": [], // حمزة سعد محمد | mosque_001 | ولد

    "K293oUVjkEbk51wpmbfZ": [], // حنين رضا احمد | mosque_001 | بنت

    "xRfC9WEtp4GAjox41Y0G": [], // رهف صالح | mosque_001 | بنت

    "gTKbbridJxv6IUzIwK4Y": [], // ريتاج علي عبد الحميد | mosque_001 | بنت

    "QYiLzwX13keyFsCMqJRk": [], // ريتال أحمد موسى | mosque_001 | بنت

    "qVuDeN7472BKFKyrEILg": [], // زهرة يحيى | mosque_001 | بنت

    "PMEmBBnhMorr495jqq3r": [], // زياد أحمد فتحي | mosque_001 | ولد

    "U31OvDYfmSXAfn7QZyMM": [], // زيد إسلام أحمد | mosque_001 | ولد

    "aT45WPwzOM9ZCnlrcEPD": [], // سجدة علي عبد الحميد | mosque_001 | بنت

    "wSbj2yVjo4ttfYwjB71K": [], // سما عبد الرحيم محمد | mosque_001 | بنت

    "8X13ZP6SPg3wo2YJ68ix": [], // سما عبد القادر | mosque_001 | بنت

    "yfrHKBmiky04Nrt7TOoR": [], // سيف أحمد موسى | mosque_001 | ولد

    "bV4B7tbjp0Tws8BypXAm": [], // عادل رضا أحمد | mosque_001 | ولد

    "QOFKRhvFXiwEMekzsUxL": [], // عبد الله سعد محمد | mosque_001 | ولد

    "Um1rhYaFSxKqsBQzxYVX": [], // عبد الله محمود خلف | mosque_001 | ولد

    "reJJazJws05FFhl4RCFl": [], // علاء محمد محمد | mosque_001 | ولد

    "1T2OaGXn7kFYlL3BBomW": [], // علي علي عبد الحميد | mosque_001 | ولد

    "wBRzIAtkXIwcjFaGdZMD": [], // عمر أحمد لولي | mosque_001 | ولد

    "LZ2h96PuYKy3O223k0yg": [], // عمر أسامة أحمد | mosque_001 | ولد

    "8r4cbsx06PJKd58Jc0vL": [], // عمر إسلام علي | mosque_001 | ولد

    "7VfpFBFQhpD7U1eCbOEx": [], // عهد عبد الله فضل | mosque_001 | بنت

    "y6PgTAoWuYnryp8WYUlk": [], // كرمة صلاح محمد | mosque_001 | بنت

    "SI0BnQUq03HdB7srA4dm": [], // كرمة عاطف | mosque_001 | بنت

    "qScb4lS96MPFiQ2ofs3o": [], // كندا | mosque_001 | بنت

    "aqfhyYKegci6L6Sh5XpD": [], // ليلى عاطف | mosque_001 | بنت

    "ZQOYW3u4rshTAWkTdgfA": [], // مالك وليد محمود | mosque_001 | ولد

    "FrsKMrLqoRwnjNpgxT0h": [], // محمد أيمن حسن | mosque_001 | ولد

    "HlaCCH1ahr9NWu48HIMz": [], // محمد صلاح محمد | mosque_001 | ولد

    "2W8LHSefoV7i5DhFeyg7": [], // محمد علي ممدوح | mosque_001 | ولد

    "Y3WeQVSDFN8lGbPphDLN": [], // محمد عمر محمد | mosque_001 | ولد

    "oIJrDvp7P3NmgMBmbaSa": [], // محمود ياسر محمد | mosque_001 | ولد

    "BuZrRWI4s7IIfYemyOZC": [], // مروان نبيل مصطفى | mosque_001 | ولد

    "V30rytKiolz341LLH27K": [], // مريم عبد الله رمضان | mosque_001 | بنت

    "F2vyXpjkPvAfc8GrjXNp": [], // مصطفى عبد الرحيم محمد | mosque_001 | ولد

    "rgU0dd7cFciiW0Qb9LGt": [], // مصطفى نبيل مصطفى | mosque_001 | ولد

    "bzB5rx93E60bw6H1TGCi": [], // منة أحمد حمدان | mosque_001 | بنت

    "5qOowAGHYiDwH6eBdbCT": [], // ميان محمد عثمان | mosque_001 | بنت

    "JQ950nUxuyfVwWP5fUQD": [], // ميرال علاء | mosque_001 | بنت

    "bCuidIG4V9FrZkuYJQmm": [], // نور علي عبد الحميد | mosque_001 | بنت

    "7lXoSrKlBBPj2j7N7plh": [], // هبة خالد | mosque_001 | بنت

    "vvHF5glfINPWazboMgjI": [], // يامن علاء محمد | mosque_001 | ولد

    "qHQofwaTxbrHnbJ3PMI3": [], // يحيى عمر محمود | mosque_001 | ولد

    "1w6GcN4fyoZjEQ23sgjI": [], // يحيى محمد حامد | mosque_001 | ولد

    "qJSdGfvfUXBOBOxKEVmN": [], // يحيى محمود أحمد | mosque_001 | ولد

    "Zwb6sAOujCmqBarCB9vI": [], // يسٓ إبراهيم محمد | mosque_001 | ولد

    "hsebagwkB945v1oaMI5l": [], // يسٓ سيد ماهر | mosque_001 | ولد

    "f2y8jq7oPiSSwe6B2bEz": [], // يسٓ علي عبد الحميد | mosque_001 | ولد

    "jK4Awm85CMuEHry7fPv2": [], // يسٓ علي ممدوح | mosque_001 | ولد

    "YDKDFpD2KSjvj2ep2zXU": [], // يسٓ ماجد جمال | mosque_001 | ولد

    "4wW1nquzSdqZ6kxd0f5d": [], // يوسف عبد الرحيم محمد | mosque_001 | ولد

    "gKg2MWB2HIQZJoIXKjHI": [], // يوسف عبد الله حسين | mosque_001 | ولد

    "SXJAkMGHScaptchZIf7u": [], // يوسف عمرو حسن | mosque_001 | ولد

    "KmRl0Ws8Mq3RzqRJlnVi": [], // يوسف محمد | mosque_001 | ولد

    "V6u62RW4EHvfv19lMBpu": [] // يونس رامي سيد | mosque_001 | ولد
  },


  // ============================================================
  // المسجد: mosque_002
  // ============================================================

  "mosque_002": {

    "Yu3V9yzgIhzDsxYr19r1": [], // آدم محمود | mosque_002 | ولد

    "4lhts9Q94OM3hUGzfwNZ": [], // آيسل علاء | mosque_002 | بنت

    "KYXXibal1KTlIw5IqsKq": [], // إبراهيم سيد منير | mosque_002 | ولد

    "W2rxYxfoTm46725qy0Z9": [], // أحمد حسين | mosque_002 | ولد

    "etVBwzJkXXK7llYlmVgu": [], // أحمد سمير | mosque_002 | ولد

    "mBWTllAY6mccLw4930S4": [], // أحمد محمد علي | mosque_002 | ولد

    "1K2xNCREMtJAuHJrC2iS": [], // أدهم محمد عبد المحسن | mosque_002 | ولد

    "MLRvTj2odlj6MoG8Vrdn": [], // أمير عصام | mosque_002 | ولد

    "UoIFTV4yuEXVSG5IoZoe": [], // أنس أحمد | mosque_002 | ولد

    "P4F1MQY6NK11Aa0p63lg": [], // أنس حامد حامد | mosque_002 | ولد

    "QlFz2VagW9ouOoz5I4JJ": [], // أنس عمرو | mosque_002 | ولد

    "vA6R8tuaLEx8LqeXNfzk": [], // أنس محمد | mosque_002 | ولد

    "anu4ngQUyVcQiOOwmAQf": [], // براء رضا | mosque_002 | ولد

    "p3GIJwDfZeHZZmLYaUtw": [], // بلال هيثم | mosque_002 | ولد

    "NSRtuuti6BN8XTXlesuO": [], // تميم ضياء | mosque_002 | ولد

    "WB23bytiFs7PAj5nz9pJ": [], // تميم عامر | mosque_002 | ولد

    "zVDaMDZLsavHC8G2CpIj": [], // جنى شعبان | mosque_002 | بنت

    "2aphlwdEPEHDymIIjZ61": [], // حذيفة علي | mosque_002 | ولد

    "fCeVKLMVtsXacohDnwrI": [], // حسناء وائل | mosque_002 | بنت

    "dyJEcuqQdWujDCzGgdx7": [], // حمزة رضا | mosque_002 | ولد

    "dfUeFNLjiLcUAYgFf4Fw": [], // حمزة عبد الله | mosque_002 | ولد

    "QfRaNeQ99poiSCSoJ47K": [], // حمودة محمد | mosque_002 | ولد

    "1xJ0vqS86SjLooRrPxX8": [], // حور مصطفى | mosque_002 | بنت

    "VquqB7hlZinjZzdeRhG2": [], // خديجة سامح | mosque_002 | بنت

    "Yj0yqMk5CLPZPWcZbHOW": [], // خديجة سيد | mosque_002 | بنت

    "A3rB9YcLV9TzwP3IN2MZ": [], // خديجة عبد الفتاح | mosque_002 | بنت

    "oGqs1JfIqHO1wcQWOv6x": [], // خديجة محمد حمدي | mosque_002 | بنت

    "CcazIUt2YePLVlJG4b5k": [], // رجب عطية | mosque_002 | ولد

    "2fr0nb5bqwcixFSV7lBV": [], // رقية حامد حامد | mosque_002 | بنت

    "zjuYlJxFBkU4V6yKyux3": [], // روان أحمد محمد | mosque_002 | بنت

    "msAklUv0vHEciWzz6pmm": [], // زياد حمدي | mosque_002 | ولد

    "UodI0NWPaiAFOi258gbA": [], // سدرة صالح الرفاعي | mosque_002 | بنت

    "YGQPuta4aUb3I9pR8ryk": [], // سعد مصطفى سعد | mosque_002 | ولد

    "5WqobKk1XdWpJ6AY5JVc": [], // سلمى سامي | mosque_002 | بنت

    "cjwUcuyx5oD9feN2JZ3p": [], // سليم أحمد سعد | mosque_002 | ولد

    "VMrBkNWjHQkYM2fF2Kwz": [], // سليم منصور | mosque_002 | ولد

    "wGaFgvOPFBr7rvWgglvb": [], // سليم وجدي | mosque_002 | ولد

    "ijtptPbqkXlTNMKo0VPU": [], // عاصم منصور | mosque_002 | ولد

    "Paat0YSXFsQ5Eo3Cecjp": [], // عبد الرحمن أحمد | mosque_002 | ولد

    "GQbMVsdVXGtgOIdFoZX9": [], // عبد الرحمن جمال عبد القادر | mosque_002 | ولد

    "ase0IGxPbIzwOhHuSUQS": [], // عبد الرحمن ضياء | mosque_002 | ولد

    "xhj7gHxdMD8KXQYEoRKO": [], // عبد الرحمن عصام | mosque_002 | ولد

    "By5JZjPnoqdenUQqdpmh": [], // عبد الرحمن محمد | mosque_002 | ولد

    "ZJEuY4N4fLmhAvZ4J6dV": [], // عبد العزيز تامر | mosque_002 | ولد

    "7OeMQ1DbGYFzprzAtjAi": [], // عبد الله تامر | mosque_002 | ولد

    "KXoO8IynNss82nOtDneI": [], // عبد الله علي | mosque_002 | ولد

    "O6RZWcc3a3Z8QEuwWv0a": [], // عبد الله عمر كمال | mosque_002 | ولد

    "0ST5k0XacnZwkMslO1pb": [], // عبد المنعم مبروك | mosque_002 | ولد

    "5XWqdEm33lhELhe1F6bf": [], // علي محمد | mosque_002 | ولد

    "m05JttwRXRMGhb4G2M0X": [], // عمار عبد العاطي | mosque_002 | ولد

    "Z5JvdGFJoXLYOGjkw3uu": [], // عمر جمال عبد القادر | mosque_002 | ولد

    "V0k52gW8sJaNMgGyQtQT": [], // عمر سامح | mosque_002 | ولد

    "tb3gMAxqKS5JWbjvhMCA": [], // عمر محمد | mosque_002 | ولد

    "CLGSGsoJO037fQ5R6Z5Z": [], // عمرو خالد | mosque_002 | ولد

    "uO8WdXqPuGGFmSZG08b1": [], // فاطمة وجدي | mosque_002 | بنت

    "cLhImQVo96TiM65qehuc": [], // فريدة محمد حمدي | mosque_002 | بنت

    "nwwQby8qTvzblxoA43aG": [], // فريدة مصطفى | mosque_002 | بنت

    "d9Dgq3KqB4zEtGXrFDzf": [], // كارما تامر | mosque_002 | بنت

    "gHnOUfBxDKQIep4LvOJH": [], // كيان محمد مكرم | mosque_002 | بنت

    "lAHjl5THUsoWX5ajOuKh": [], // ليان أحمد أمين | mosque_002 | بنت

    "6SOHiIrOoxTBmknWQTZR": [], // مازن أبو بكر | mosque_002 | ولد

    "CvHNp8zsxuoTsTkBqWxF": [], // مازن هيثم | mosque_002 | ولد

    "YkpvfQB8gvhadkiTOkfG": [], // مالك | mosque_002 | ولد

    "xZk8xXsVdB6x1YGJEsWJ": [], // مؤمن سيد | mosque_002 | ولد

    "80OqFp5og8XZquxM85RH": [], // مؤيد خالد محمد | mosque_002 | ولد

    "soD6FrYHcZlWYmBcmcMS": [], // مجيب الرحمن خالد محمد | mosque_002 | ولد

    "P5GeEeET8klqqhs0y6pI": [], // محمد أبو بكر محمود | mosque_002 | ولد

    "VQr3iXKPzZaU3rfp3RTW": [], // محمد أحمد محمد | mosque_002 | ولد

    "yngX0VXEBRJyn0QQSlwg": [], // محمد حمدي | mosque_002 | ولد

    "39td15ttujTpOthZxqaC": [], // محمد خالد محمد | mosque_002 | ولد

    "KgFguyBDwbf6IlMmNKUE": [], // محمد سامي | mosque_002 | ولد

    "ncPXXKgvSnfAlmMXYUZt": [], // محمد عاطف سعد | mosque_002 | ولد

    "ZuYHpFqVzifQ2K3AgRvx": [], // محمود | mosque_002 | ولد

    "B3zNJ1em5RLeTj8Fdv1l": [], // محمود حمادة | mosque_002 | ولد

    "QGklfaaSWguFcWSXw7Z9": [], // مريم عبد الله | mosque_002 | بنت

    "f4NQpaTQdHmnJuwUy6TK": [], // مريم عبد الله رمضان | mosque_002 | بنت

    "ZFPIKypaVFe2KzCQnxQV": [], // مصطفى أحمد محمد | mosque_002 | ولد

    "yzZTAixrzhyDt17339wO": [], // معاذ حمدي | mosque_002 | ولد

    "9MTRYrQt7MxkPGlpDwI4": [], // معاذ رضا | mosque_002 | ولد

    "SR27Y8439Q6PYWziLozw": [], // معاذ رضا | mosque_002 | ولد

    "HIcwOOGZf3cvX3ajTUZn": [], // نادية أحمد سليمان | mosque_002 | بنت

    "r8fGOSQZJqCrj4YmC48n": [], // نور يحيى | mosque_002 | بنت

    "h5C0QkaLoVpKehld1gsE": [], // وردة أحمد سليمان | mosque_002 | بنت

    "k12jM6Nj94ZnN3mxBgvf": [], // وليد حمادة | mosque_002 | ولد

    "px0WmECWMBPIoC67zmvr": [], // ياسين كريم | mosque_002 | ولد

    "1Pf1dYSCf07YzmYmqQd3": [], // ياسين محمد عبد المحسن | mosque_002 | ولد

    "H0WENg9hA05jp4K7Kfqj": [], // ياسين ياسر | mosque_002 | ولد

    "CVOHkTpAHh7t46g4CbxG": [], // يمنى منصور | mosque_002 | بنت

    "IrgVkBw5fHKGFIFIg8AT": [], // يوسف محمود | mosque_002 | ولد

    "NDYKgFeK1XqFLdgCYpAq": [] // يونس أحمد | mosque_002 | ولد
  },


  // ============================================================
  // المسجد: mosque_003
  // ============================================================

  "mosque_003": {

    "9hEMtTPnFn44o2L0e8Ov": [], // آسيا | mosque_003 | بنت

    "XBG3draYdwdiLXEAuKbW": ["الله يسامحك بقيت فالمركز {rank}","{oldpoints} {addpoints} {allpoints}"], // أسامة | mosque_003 | ولد

    "DfmmccwMg9Af2W6JK2k2": [], // عائشة | mosque_003 | بنت

    "id68R3DZws6nUrOB1PpV": [], // عبد الرحمن | mosque_003 | ولد

    "whzQ5yufT04fCb8uTpFj": [], // عبد الله | mosque_003 | ولد

    "dyaF3aEyx04aJ6GmgVYf": [], // محمد | mosque_003 | ولد

    "iZneQqscFKWMfdtsSqBo": [], // مريم | mosque_003 | بنت

    "iJCi2XphhZIVtVU5cqkV": [], // خديجة | mosque_003 | بنت

    "rt2yZ7U2SSeMzfDfM0A7": [], // زينب | mosque_003 | بنت

    "X8YqfOPCxYyLu7ZUbTrl": [] // طارق | mosque_003 | ولد
  }

};
                
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

    showStudentsError();

    return;

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

    const names = Array.isArray(student.nicknames)
        ? student.nicknames.filter(Boolean)
        : [];

    // إذا لا توجد أسماء تدليل → الاسم الحقيقي
    if(names.length === 0){
        return student.firstName || student.name;
    }

    // اختيار اسم تدليل عشوائي
    return names[
        Math.floor(Math.random() * names.length)
    ];
}


function getAllNames(student){

    const realName =
        student.firstName ||
        student.name ||
        "";

    const nicknames = Array.isArray(student.nicknames)
        ? student.nicknames.filter(Boolean)
        : [];

    // لا توجد أسماء تدليل
    if(nicknames.length === 0){
        return realName;
    }

    // الاسم الحقيقي + أسماء التدليل
    const allNames = [
        realName,
        ...nicknames
    ];

    // اختيار عشوائي
    return allNames[
        Math.floor(Math.random() * allNames.length)
    ];
}
/* ====================================
   نظام الرسائل الخاصة بالطلاب
==================================== */

function getSpecialMessage(student, rewardValue = 0, oldPoints = 0){

    // لا يوجد طالب
    if(!student || !student.id){
        return null;
    }

    // البحث عن رسائل هذا المسجد
    const mosqueMessages =
        studentMessages[mosqueId];

    if(!mosqueMessages){
        return null;
    }

    // البحث عن رسائل هذا الطالب
    const messages =
        mosqueMessages[student.id];

    if(!Array.isArray(messages) || messages.length === 0){
        return null;
    }

    // مفتاح حفظ تقدم هذا الطالب
    const storageKey =
        `specialMessageIndex_${mosqueId}_${student.id}`;

    // الرسالة التي سيأتي دورها
    let index =
        Number(localStorage.getItem(storageKey) || 0);

    // إذا انتهت الرسائل الخاصة
    if(index >= messages.length){
        return null;
    }

    // أخذ الرسالة الحالية
    const message = messages[index];

    // الانتقال للرسالة التالية
    localStorage.setItem(
        storageKey,
        String(index + 1)
    );

    // تطبيق المتغيرات الموجودة عندك
    return parseMessage(
        message,
        student,
        rewardValue,
        oldPoints
    );
            }
function parseMessage(message, student, rewardValue = 0, oldPoints = 0){
    return message
        .replaceAll(
            "{name}",
            student.firstName || student.name || ""
        )
        .replaceAll(
            "{nickname}",
            getNickname(student)
        )
        .replaceAll(
            "{allnames}",
            getAllNames(student)
        )
        .replaceAll(
            "{addpoints}",
            String(rewardValue)
        )
        .replaceAll(
            "{allpoints}",
            String(oldPoints + rewardValue)
        )
        .replaceAll(
            "{rank}",
            String(student.rank || "")
        )
        .replaceAll(
            "{oldpoints}",
            String(oldPoints)
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

    document.getElementById("closeReward").style.display = "";
    
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
let oldPoints = 0;
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
oldPoints = Number(studentData.points || 0);
            
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

// ====================================
// اختيار رسالة النجاح
// ====================================

// محاولة الحصول على رسالة خاصة بالطالب
const specialMessage =
    getSpecialMessage(
        student,
        rewardValue,
        oldPoints
    );

let randomMessage;

// إذا كانت هناك رسالة خاصة
if(specialMessage){

    randomMessage = specialMessage;

}

// إذا لم توجد رسالة خاصة
// نعود إلى الرسائل العادية العشوائية
else{

    const messages =
        isBoy(student.gender)
        ? boyMessages
        : girlMessages;

    randomMessage =
        parseMessage(
            messages[
                Math.floor(
                    Math.random() * messages.length
                )
            ],
            student,
            rewardValue,
            oldPoints
        );

}
        
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


function finishIntro(){

const loader=document.getElementById("introLoader");

if(!loader) return;


loader.classList.add("loader-hide");


setTimeout(()=>{

    loader.remove();

},1200);

}

function showStudentsError(){

    const cards = document.getElementById("cards");
    const loading = document.getElementById("loading");

    if (loading) {
        loading.style.display = "none";
    }

    cards.innerHTML = `
        <div style="
            width:min(92%,420px);
            margin:30px auto;
            padding:28px 20px;
            border-radius:28px;
            text-align:center;
            background:linear-gradient(180deg,#ffffff,#fff8e8);
            box-shadow:0 14px 35px rgba(0,0,0,.12);
            border:2px solid rgba(243,156,18,.18);
            font-family:Cairo,sans-serif;
            animation: kidsErrorPop .45s ease;
        ">
            <div style="
                font-size:72px;
                line-height:1;
                margin-bottom:12px;
                animation: kidsErrorFloat 2s ease-in-out infinite;
            ">🧭</div>

            <h2 style="
                margin:0 0 12px;
                color:#f39c12;
                font-size:clamp(22px,5vw,30px);
                font-weight:900;
                line-height:1.5;
            ">
                الرحلة تعطلت قليلًا! 💎
            </h2>

            <p style="
                margin:0 0 8px;
                color:#5b5b5b;
                font-size:clamp(16px,3.7vw,20px);
                line-height:1.8;
                font-weight:700;
            ">
                يبدو أن الطريق يحتاج اتصالاً بالإنترنت..
            </p>

            <p style="
                margin:0 0 18px;
                color:#7a7a7a;
                font-size:clamp(15px,3.4vw,18px);
                line-height:1.8;
            ">
              فَصَبْرٌ جَمِيلٌ.. وَاللَّهُ الْمُسْتَعَان.. ⏳
            </p>

            <button onclick="location.reload()" style="
                border:none;
                padding:14px 28px;
                border-radius:999px;
                background:linear-gradient(135deg,#4caf50,#2ecc71);
                color:#fff;
                font-size:18px;
                font-weight:800;
                font-family:Cairo,sans-serif;
                cursor:pointer;
                box-shadow:0 10px 22px rgba(46,204,113,.28);
            ">
                🔄 المحاولة مرة أخرى
            </button>
        </div>
    `;

    if (!document.getElementById("kidsErrorStyles")) {
        const style = document.createElement("style");
        style.id = "kidsErrorStyles";
        style.textContent = `
            @keyframes kidsErrorPop{
                from{transform:scale(.86);opacity:0}
                to{transform:scale(1);opacity:1}
            }
            @keyframes kidsErrorFloat{
                50%{transform:translateY(-10px) rotate(4deg)}
            }
        `;
        document.head.appendChild(style);
    }
}
/* =========================================================
   RANDOM INTRO SYSTEM
========================================================= */

function startIntro(){

    const loader =
        document.getElementById("introLoader");

    const circles = [
        document.querySelector(".c1"),
        document.querySelector(".c2"),
        document.querySelector(".c3"),
        document.querySelector(".c4")
    ];


    /* =====================================================
       🎨 الألوان
    ===================================================== */

    const colors = [

    "#FFE709", // أصفر
    "#FE3F09", // برتقالي أحمر
    "#08D2FE", // سماوي
    "#13DF37", // أخضر
    "#FF6BCE", // وردي
 

];


    /* =====================================================
       🔀 خلط
    ===================================================== */

    function shuffle(array){

        const result = [...array];

        for(let i = result.length - 1; i > 0; i--){

            const j =
                Math.floor(
                    Math.random() * (i + 1)
                );

            [
                result[i],
                result[j]
            ] = [
                result[j],
                result[i]
            ];

        }

        return result;
    }


    /* =====================================================
       🎨 اختيار 4 ألوان مختلفة
    ===================================================== */

    const selectedColors =
        shuffle(colors).slice(0,4);


    /* =====================================================
       🛡️ خلفية احتياطية
    ===================================================== */

    loader.style.background =
        selectedColors[
            Math.floor(
                Math.random() *
                selectedColors.length
            )
        ];


    /* =====================================================
       📐 الأنماط الخمسة
       
       كل نمط له توزيع مختلف للدوائر.
    ===================================================== */

    const patterns = [

        /* =========================
           النمط 1
           أربع زوايا
        ========================= */

        [

            {left:"-72vw", top:"-72vw"},
            {left:"42vw",  top:"-72vw"},
            {left:"-72vw", top:"42vh"},
            {left:"42vw",  top:"42vh"}

        ],


        /* =========================
           النمط 2
           متداخل
        ========================= */

        [

            {left:"-78vw", top:"-48vw"},
            {left:"28vw",  top:"-76vw"},
            {left:"-55vw", top:"28vh"},
            {left:"32vw",  top:"25vh"}

        ],


        /* =========================
           النمط 3
           قطري
        ========================= */

        [

            {left:"-78vw", top:"-78vw"},
            {left:"25vw",  top:"-52vw"},
            {left:"-52vw", top:"35vh"},
            {left:"40vw",  top:"30vh"}

        ],


        /* =========================
           النمط 4
           توزيع معكوس
        ========================= */

        [

            {left:"38vw",  top:"-75vw"},
            {left:"-75vw", top:"-35vw"},
            {left:"35vw",  top:"35vh"},
            {left:"-65vw", top:"32vh"}

        ],


        /* =========================
           النمط 5
           توزيع غير متماثل
        ========================= */

        [

            {left:"-80vw", top:"-60vw"},
            {left:"20vw",  top:"-80vw"},
            {left:"-75vw", top:"30vh"},
            {left:"28vw",  top:"20vh"}

        ]

    ];


    /* =====================================================
     اختيار نمط عشوائي
    ===================================================== */

    const pattern =
        patterns[
            Math.floor(
                Math.random() *
                patterns.length
            )
        ];


    /* =====================================================
       🔀 ترتيب الدوائر عشوائيًا
       
       هذا يعني أن:
       c1 ليست دائمًا أول دائرة.
    ===================================================== */

    const shuffledCircles =
        shuffle(circles);


    /* =====================================================
       🧱 Z-INDEX عشوائي
    ===================================================== */

    const zIndexes =
        shuffle([
            40,
            55,
            70,
            85
        ]);


    /* =====================================================
       🎯 إعداد كل دائرة
    ===================================================== */

    shuffledCircles.forEach(
        (circle,index)=>{

            const position =
                pattern[index];


            /* =========================
               اللون
            ========================= */

            circle.style.background =
                selectedColors[index];


            /* =========================
               الطبقة
            ========================= */

            circle.style.zIndex =
                zIndexes[index];


            /* =========================
               المكان
            ========================= */

            circle.style.left =
                position.left;

            circle.style.top =
                position.top;


            /* =========================
               الحجم العشوائي
               
               تغير بسيط حتى لا تكون
               كل الدوائر متطابقة.
            ========================= */

            const size =
                170 +
                Math.random() * 18;

            circle.style.width =
                size + "vw";

            circle.style.height =
                size + "vw";


            /* =========================
               سرعة الدخول
            ========================= */

            const enterDuration =
                0.80 +
                Math.random() * 0.35;

            circle.style.setProperty(
                "--enter-duration",
                enterDuration + "s"
            );


            /* =========================
               تأخير الدخول
            ========================= */

            const enterDelay =
                Math.random() * 0.30;

            circle.style.setProperty(
                "--enter-delay",
                enterDelay + "s"
            );


            /* =========================
               حركة الماء
            ========================= */

            const waterDuration =
                2.0 +
                Math.random() * 1.4;

            circle.style.setProperty(
                "--water-duration",
                waterDuration + "s"
            );


            /* =========================
               اندفاع الدخول
               
               اختلاف بسيط كل مرة.
            ========================= */

            circle.style.setProperty(
                "--start-x",
                (Math.random() * 26 - 13) + "vw"
            );

            circle.style.setProperty(
                "--start-y",
                (Math.random() * 26 - 13) + "vw"
            );


            /* =========================
               حركة X
            ========================= */

            circle.style.setProperty(
                "--move-x1",
                (Math.random() * 50 - 25) + "px"
            );

            circle.style.setProperty(
                "--move-x2",
                (Math.random() * 50 - 25) + "px"
            );

            circle.style.setProperty(
                "--move-x3",
                (Math.random() * 50 - 25) + "px"
            );


            /* =========================
               حركة Y
            ========================= */

            circle.style.setProperty(
                "--move-y1",
                (Math.random() * 50 - 25) + "px"
            );

            circle.style.setProperty(
                "--move-y2",
                (Math.random() * 50 - 25) + "px"
            );

            circle.style.setProperty(
                "--move-y3",
                (Math.random() * 50 - 25) + "px"
            );


            /* =========================
               Scale
            ========================= */

            circle.style.setProperty(
                "--scale1",
                0.985 + Math.random() * 0.055
            );

            circle.style.setProperty(
                "--scale2",
                0.975 + Math.random() * 0.065
            );

            circle.style.setProperty(
                "--scale3",
                0.985 + Math.random() * 0.055
            );

        }
    );


    /* =====================================================
       📝 العناوين
    ===================================================== */

    const titles = [

        "مسابقة القرآن",
        

    ];


    const subtitles = [

        "تنافس على الجنة 🏆",
        

    ];


    document.getElementById("introTitle")
        .textContent =
        titles[
            Math.floor(
                Math.random() *
                titles.length
            )
        ];


    document.getElementById("introSub")
        .textContent =
        subtitles[
            Math.floor(
                Math.random() *
                subtitles.length
            )
        ];


    /* =====================================================
       📖 رسالة من القرآن والسنة
    ===================================================== */

    document.getElementById("introMessage")
        .textContent =
        introMessages[
            Math.floor(
                Math.random() *
                introMessages.length
            )
        ];

        }
