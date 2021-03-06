
document.addEventListener("deviceready",initFileSystem,false);

//初始化文件系统
function  initFileSystem() {
    writeDirectory();
}


function  writeDirectory(){
    var dirUri = cordova.file.externalRootDirectory;

    window.resolveLocalFileSystemURI(dirUri,function (entry) {
        entry.getDirectory("表型采集模版与数据", {
            create: true,
        },function (dirEntry) {
            dirEntry.getDirectory('template', { create: true }, function (subDirEntry) {
                //createFile(subDirEntry, "hangge.txt");
            }, onErrorGetDir);

            dirEntry.getDirectory('data', { create: true }, function (subDirEntry) {
                //createFile(subDirEntry, "hangge.txt");
            }, onErrorGetDir);
            dirEntry.getDirectory('photos', { create: true }, function (subDirEntry) {
                //createFile(subDirEntry, "hangge.txt");
            }, onErrorGetDir);
        },onErrorGetDir)
    },errorCallback)

}
//文件夹创建失败回调
function onErrorGetDir(error){
    console.log("文件夹创建失败！")
}

function errorCallback(e) {
    console.log(e.toString());
    alert(e.toString());
}
