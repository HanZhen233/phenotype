var wb;//读取完成的数据
var str={};
var ke;
function importTemplate(obj) {//导入
    if(!obj.files) {
        return;
    }
// alert(obj.files[0].name);
    var f = obj.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
        var data = e.target.result;
            wb = XLSX.read(data, {
                type: 'binary'
            });

        //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        //wb.Sheets[Sheet名]获取第一个Sheet的数据
        // XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])

        var sheet0=wb.Sheets[wb.SheetNames[0]];
        var n,t;
        var i=0;
       for(z in sheet0) {
           i++;
           if (i<20){
           if(sheet0[z].v=="性状名称")
              n=z[0];
           if(sheet0[z].v=="数据类型")
               t=z[0];

       }
    };

        for(z in sheet0) {
        if (z[0]==n&&sheet0[z].v!="性状名称"&&sheet0[z].v!="数据类型")
            ke=sheet0[z].v ;
        if(z[0]==t&&sheet0[z].v!="性状名称"&&sheet0[z].v!="数据类型")
            str[ke]=sheet0[z].v;
        }

        var templates=new Array();
        var str1=obj.files[0].name;
        templates=str1.split(".");
         localStorage.setItem(templates[0],JSON.stringify(str));
        alert("模版导入成功！");
        $("#selectTemplate").empty();
        loadTemplates();
    }
    reader.readAsBinaryString(f);

}
//加载模版名称供选择
function loadTemplates(){
    for(var i=0;i<window.localStorage.length;i++){
        $("#selectTemplate").append("<option value="+window.localStorage.key(i)+">"+window.localStorage.key(i)+"</option>")
    }
}
// 导入数据
function importData(obj) {
    var getTemplate = document.getElementById("selectTemplate");
    getTemplate.options.selected =true ;
     var tempName=getTemplate.value;
     var dataName=obj.files[0].name;
     var temp=new Array();
     temp=dataName.split('.');
     dataName=temp[0];

   if(tempName=="null") {
       alert("请先选择模版");
       obj.files.name=null;
       return;
   }

//    导入数据
    if (!obj.files) {
        return;
    }
    var f = obj.files[0];

    var reader= new FileReader();

    reader.onload = function (e) {

        var data = e.target.result;
        wb = XLSX.read(data, {
            type: 'binary'
        });
        //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        //wb.Sheets[Sheet名]获取第一个Sheet的数据
        // XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        // document.getElementById("showData").innerHTML = JSON.stringify( XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) );
        // var dataAll = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

       // for (var i=0;i<dataAll.length;i++){
       //     for (var key in dataAll[i]) {
       //         alert(dataAll[i][key]);
       //     }
       //     break;
       //     }
       //
       //  var sheet0=wb.Sheets[wb.SheetNames[0]];
       //
       //  var z;
       //  for (z in sheet0){
       //      if(z[1]=='2')
       //      break;
       //  }
        //使用webSQL实现
        // var database=window.openDatabase("database",'1.0',"data demo",1024*1024*300);
        // database.transaction(function (tx) {
        //
        //     createTable(tx,wb,tempName);
        // },error,success);
        // for (z in sheet0){
        //     document.getElementById("showData").append(sheet0[z].v+" ");
        // }
     //使用indexedDB实现
        createDatabases(wb,tempName,dataName);
    };
    reader.readAsBinaryString(f);
}

//创建数据表并导入数据
// function createTable(tx,wb,tempName) {
//     alert('DROP TABLE IF EXISTS '+' '+'hello');
//     tx.executeSql('DROP TABLE IF EXISTS '+' '+'');
//    tx.executeSql()
//     var sheet0=wb.Sheets[wb.SheetNames[0]];
//     var str1;
//     var column;
//     for (z in sheet0){
//         if (z[1]=='2')
//             break;
//         str1=sheet0[z].v+','
//     }
//     column=str1.substring(0,str1.length-1);
//     tx.executeSql('CREATE TABLE IF NOT EXISTS '+' '+tableName+' ('+column+')');
//     var dataAll = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
//     var dataTemp;
//     var dataItem;
//     for (var i=0;i<dataAll.length;i++){
//         dataTemp=null;
//         for (var key in dataAll[i]) {
//             //拼装数据
//             dataTemp=dataTemp+ dataAll[i][key]+',';
//         }
//         dataItem=dataTemp.substring(0,dataTemp.length-1);
//         //插入每行数据数据
//         tx.executeSql('INSERT INTO '+' '+tableName+' '+'VALUES'+' ('+dataItem +')');
//         }
//
// }
// function success(){
//     alert("导入数据成功！")
// }
//
// function error(tx,err) {
//     alert("导入数据失败!"+err+tx);
// }

//采用indexedDB
function createDatabases(wb,tempName,dataName) {
    var sheet0=wb.Sheets[wb.SheetNames[0]];
    var keypath=sheet0['A1'].v;
    var dataAll=XLSX.utils.sheet_to_json(sheet0);
    var db;

    var request=window.indexedDB.open(tempName);
    request.onerror=function (ev) {
        console.log('数据库打开报错');
    }
    request.onsuccess=function (ev) {
        // alert('已清除该模版的数据库，请重新导入');
        // indexedDB.deleteDatabase(tempName);
    }

        request.onupgradeneeded=function (ev) {
           db=ev.target.result;
            if (db.objectStoreNames.contains(dataName)) {
                db.deleteObjectStore(dataName);
                store = db.createObjectStore(dataName, {keyPath: keypath});
            }
            else {
                store=db.createObjectStore(dataName,{keyPath:keypath});
            }

            for(var i=0;i<dataAll.length;i++){
                store.add(dataAll[i]);
            }
            alert('导入成功！')

    }


}
