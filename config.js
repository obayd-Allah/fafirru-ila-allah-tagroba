export const APP_CONFIG = {

    mosqueId: "mosque_001",

    mosques: {

        mosque_001: {

            id: "mosque_001",

            name: "ففروا إلى الله",

            shortName: "ففروا",

            logo: "new logo.png",

            slogan: "ففروا إلى الله",

            title: "title.png",

            whatsapp:
            "https://chat.whatsapp.com/ISuJUCU31U8DdjYEAITmye?s=cl&p=a&ilr=1",

            studentsPageTitle:
            "لوحة نقاط التلاميذ",

            primaryColor:
            "#1976d2"

        }
}

};

// بيانات المسجد الحالي
export const CURRENT_MOSQUE =
    APP_CONFIG.mosques[getCurrentMosqueId()];
export function getCurrentMosqueId() {

    const params = new URLSearchParams(window.location.search);

    const mosqueId = params.get("mosque");

    // إذا وُجد في الرابط
    if (mosqueId) {

        sessionStorage.setItem(
            "currentMosqueId",
            mosqueId
        );

        return mosqueId;
    }

    // إذا كانت الصفحة الرئيسية بدون أي بارامتر
    if (
        location.pathname.endsWith("/fafirru-ila-allah-tagroba/") ||
        location.pathname.endsWith("/fafirru-ila-allah-tagroba/index.html")
    ) {
        return "mosque_001";
    }

    // باقي الصفحات تعتمد على الجلسة فقط
    return sessionStorage.getItem("currentMosqueId");

}
