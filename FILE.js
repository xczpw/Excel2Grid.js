function FILE(fileID){
	var file = new Object();
	
	file.fileID=fileID;
	
	file.getData=function(){
		// Get The File From The Input
		var oFile = $('#'+this.fileID).prop('files')[0];//获取到文件列表
		// Create A File Reader HTML5
		var reader = new FileReader();
		reader.readAsArrayBuffer(oFile);
		// Ready The Event For When A File Gets Selected
		reader.onload = function(evt) {
			var data = evt.target.result;
			try{
				var arr = String.fromCharCode.apply(null, new Uint8Array(data));
				var xlsx = XLSX.read(btoa(arr), {type: 'base64'});
				var sheetName = xlsx.SheetNames[0];
				var file_data = XLSX.utils.sheet_to_row_object_array(xlsx.Sheets[sheetName], {header:1});
				file.data=file_data;
			}catch(e){ 
				alert(e.name + ": " + e.message);
				file.data=[];
			}
		}
	}
	file.getData();
		
	file.export=function(data,fileName,sheetName){
		var ws_name = sheetName;
		var wb = {SheetNames:[],Sheets:{}};
		var ws = XLSX.utils.aoa_to_sheet(data);
		/* add worksheet to workbook */
		wb.SheetNames.push(ws_name);
		wb.Sheets[ws_name] = ws;
		var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
		function s2ab(s) {
			var buf = new ArrayBuffer(s.length);
			var view = new Uint8Array(buf);
			for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
			return buf;
		}
		saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), fileName+'.xls');
	}
	
	return file;
}
