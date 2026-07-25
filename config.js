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
    APP_CONFIG.mosques[APP_CONFIG.mosqueId];
export function getCurrentMosqueId() {

    return (
        sessionStorage.getItem("currentMosqueId")
        ||
        APP_CONFIG.mosqueId
    );

}
