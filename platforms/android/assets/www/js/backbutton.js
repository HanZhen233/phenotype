// 等待加载PhoneGap
document.addEventListener("deviceready",onDeviceReady,false);
function onDeviceReady() {
    document.addEventListener("backbutton",onBackKeyDown,false);
};
function onBackKeyDown() {

    navigator.app.exitApp();
}