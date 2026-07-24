export const APP_CONFIG = {

    mosqueId: "mosque_001",

    mosques: {

        mosque_001: {

            id: "mosque_001",

            name: "ففروا إلى الله",

            shortName: "ففروا",

            logo: "new logo.png",

            title: "title.png"

        }
}

};

// بيانات المسجد الحالي
export const CURRENT_MOSQUE =
    APP_CONFIG.mosques[APP_CONFIG.mosqueId];
