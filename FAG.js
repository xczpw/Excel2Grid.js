//FILE AND GRID
function FAG(GRID,FILE){
	var fag=new Object();
	fag.GRID=GRID;
	fag.FILE=FILE;
	fag.Content=FILE?JSON.parse(JSON.stringify(FILE.data)):[]; //独立存储一份内容，此内容可以来源于FILE，如无文件就为空数组
	
	fag.checkFILE=function(){ //检查导入的文件是否与grid匹配
		var waring_msg="";
		var grid=this.GRID,file_data=this.FILE.data;
		//检查表头
		var title_error=[];
		var title=file_data[0]; //表头
		for(var i=0;i<title.length;i++){
			if(title[i]!=grid.getLabel(i+1)){
				title_error.push(title[i]);
			}
		}
		if(title.length>0){
			waring_msg=waring_msg+"* The header "+ title_error.join(", ") + " can't match the label of the grid.\n(Be aware that the first row will be regarded as header and won't be imported.)\n";
		}
		//检查每行内容数量是否匹配
		var cn=grid.col_num;
		var row_dismatch=[];
		for(var i=1;i<file_data.length;i++){ //首行表头不用检查
			if(file_data[i].length!==cn){row_dismatch.push(i)};
		}
		if(row_dismatch.length>0){
			var t;
			if(row_dismatch.length>10){
				t=row_dismatch.splice(0,10); //取前10个
				t=t.join(", ")+" etc.";
			}else{
				t=row_dismatch.join(", ");
			}
			waring_msg=waring_msg+"* The number of items in row " + t +" can't match the grid.\n";
		}
		if(waring_msg===""){return true;}
		var msg="The file may be incorrect because the following mistakes have been found: \n" + waring_msg + "\nThey won't interrupt the process, but it's recommand that you check the file again.\nIf you can't ensure the format of the file, you can export a template by the 'EXPORT' button.\nDo you insist on import the file?";
		if(confirm(msg)){return true;}
		return(false);
	}
	
	//根据grid修剪file_data的数据长度，补足Null，删除多余项
	fag.modifyFileData=function(){
		var file_data=this.FILE.data;
		file_data.splice(0,1); //删除表头
		var data=JSON.parse(JSON.stringify(file_data));
		var cn=this.GRID.row_num;
		for(var i=0;i<data.length;i++){
			var dr=data[i];
			dr=dr.splice(0,cn); //截取需要的字段
			for(var j=0;j<dr.length;j++){
				if(dr[j]==null){dr[j]="";} //空值用""填充
			}		
			data[i]=dr;
		}
		return data;
	}
	
	fag.checkContent=function(){ //按照grid要求检查Content的数据有效性
		var index_notCorrect=[];
		var grid=this.GRID;
		var rn=grid.row_num,cn=grid.col_num;
		grid.setOnAddRow('close'); //关闭监听
		$("#"+gridID).addRow();//为验证有效性在最后增加一行
		grid.setOnAddRow('open',zpw()); //开启监听

		for(var r=1;r<=this.Content.length;r++){
			for(var c=1;c<=cn;c++){ //只在grid能显示的范围内验证
				var v=Content[r-1][c-1];
				grid.setValue(v,rn+1,c);
				var situation_1=(grid.getControl(rn+1,c).parent().find(".pmdynaform-message-error").length>0);//显示报错
				var situation_2=(v!="" && grid.getValue(rn+1,c)=="");//内容未被正确赋值
				if(situation_1||situation_2){
					index_notCorrect.push(r);
					break; //一行存在一处错误即记录
				}
				if(!v && grid.getValue(rn+1,c)!=""){Content[r-1][c-1]=grid.getValue(rn+1,c);} //如果Content没有被赋值，则取默认值（dropdown下会出现此问题）
			}
		}
		grid.setOnDeleteRow('close');//关闭监听
		grid.deleteRow(rn+1);//删除增加的那行
		grid_setOnDeleteRow('open',zpw());//开启监听
		return index_notCorrect;
	}
	
	
	
	return fag;
}
	

function fillGrid(index_array){ //根据对应的index填充grid
	var data=JSON.parse(JSON.stringify(Content)); //得到数据的副本
	var rObjArr=[];
	for(var i=0;i<index_array.length;i++){
		rObjArr.push(data[index_array[i]-1]); //从原始数据中得到需要填充的数据
	}
	var gridRowNum=$("#"+gridID).getNumberRows();  //
	grid_setOnAddRow(gridID,'close'); //关闭监听
	for(var i=gridRowNum;i<index_array.length;i++){		
		$("#"+gridID).addRow();//补足grid不足的行
	}
	grid_setOnAddRow(gridID,'open'); //开启监听
	grid_setOnDeleteRow(gridID,'close'); //关闭监听
	for(var i=gridRowNum;i>index_array.length;i--){
		$("#"+gridID).deleteRow(i);//删除grid多余的行
	}
	grid_setOnDeleteRow(gridID,'open'); //开启监听
	$.each(rObjArr, function( indexR, valueR ) { //赋值给grid
		$.each(valueR, function( indexC, valueC ) {
			$("#"+gridID).setValue(valueC, indexR+1, indexC+1);
		});
	});
	$($("#"+gridID).find(".pmdynaform-grid-row").find(".index-row").find(".row").find(".rowIndex").find("span")).each(function(index,element){
		$(element).text(index_array[index]); //修改grid的index内容
	});	
	
	//grid_changeToContent(gridID); //设置修改事件，修改的内容会保存
}

function fillGrid_Range(startIndex,endIndex){
	var index_need=[];
	for(var i=Number(startIndex);i<=Number(endIndex);i++){
		index_need.push(i);
	}
	fillGrid(index_need);
}