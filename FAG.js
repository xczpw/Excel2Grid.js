//FILE AND GRID
function FAG(GRID,FILE){
	var fag=new Object();
	fag.GRID=GRID;
	fag.FILE=FILE;
		
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
		var data=JSON.parse(JSON.stringify(this.FILE.data));
		data.splice(0,1); //删除表头
		var cn=this.GRID.col_vis.length;
		for(var i=0;i<data.length;i++){
			var dr=data[i];
			dr=dr.splice(0,cn); //截取需要的字段
			for(var j=0;j<cn;j++){
				if(dr[j]==null){dr[j]="";} //空值用""填充
			}		
			data[i]=dr;
		}
		return data;
	}
	
	fag.Content=FILE?fag.modifyFileData():[]; //独立存储一份内容，此内容可以来源于FILE，如无文件就为空数组
		
	fag.fillGrid=function(index_array){ //根据对应的index填充grid
		var data=JSON.parse(JSON.stringify(this.Content)); //得到数据的副本
		var rObjArr=[];
		for(var i=0;i<index_array.length;i++){
			rObjArr.push(data[index_array[i]-1]); //从原始数据中得到需要填充的数据
		}
		var grid=this.GRID;
		var rn=grid.row_num;		
		grid.setOnAddRow('close'); //关闭监听
		for(var i=rn;i<index_array.length;i++){		
			grid.addRow();//补足grid不足的行
		}
		grid.setOnDeleteRow('close');//关闭监听
		for(var i=rn;i>index_array.length;i--){
			grid.deleteRow(i);//删除grid多余的行
		}
		$.each(rObjArr, function( indexR, valueR ) { //赋值给grid
			$.each(valueR, function( indexC, valueC ) {
				grid.setValue(valueC, indexR+1, indexC+1);
			});
		});
		$(grid.find(".pmdynaform-grid-row").find(".index-row").find(".row").find(".rowIndex").find("span")).each(function(index,element){
			$(element).text(index_array[index]); //修改grid的index内容
		});	
	}
		
	fag.fillGrid_Range=function(startIndex,endIndex){
		var index_need=[];
		for(var i=Number(startIndex);i<=Number(endIndex);i++){
			index_need.push(i);
		}
		this.fillGrid(index_need);
	}
	
	fag.linkGridToContent=function(){
		var grid=this.GRID;
		grid.fun_c=fun_c;
		grid.fun_a=fun_a;
		grid.fun_d=fun_d;
		
		grid.refresh();
		
		function fun_c(row,col,val){
			var cindex=$(grid.find(".pmdynaform-grid-row").find(".index-row").find(".row").find(".rowIndex").find("span")[row-1]).text();
			fag.Content[cindex-1][col-1]=val; //在数据中进行修改
		}
		function fun_a(r,g,index){
			fag.Content.push(Array(grid.col_vis.length)); //在Content后追加一空记录
			$(grid.find(".pmdynaform-grid-row").find(".index-row").find(".row").find(".rowIndex").find("span")[index-1]).text(fag.Content.length); //修改增加行的index
			grid.setOnchange(fun_c);//重设change事件
		}
		function fun_d(r,g,index){
			var index_array={};
			$(grid.find(".pmdynaform-grid-row").find(".index-row").find(".row").find(".rowIndex").find("span")).each(function(i,element){
				index_array[Number(i)+1]=$(element).text();
			});
			var cindex = index_array[index]; //得到Content对应的index
			fag.Content.splice(Number(cindex)-1,1); //在Content删除对应项
			delete index_array[index];
			grid.setOnchange(fun_c);//重设change事件
		}
	}
	
	fag.checkContent=function(){ //按照grid要求检查Content的数据有效性
		var index_notCorrect=[];
		var grid=this.GRID;
		var rn=grid.row_num,cn=grid.col_vis.length;
		grid.setOnAddRow('close'); //关闭监听
		grid.addRow();//为验证有效性在最后增加一行
		for(var r=1;r<=this.Content.length;r++){
			for(var c=1;c<=cn;c++){ //只在grid能显示的范围内验证
				var v=this.Content[r-1][c-1];
				var ct=grid.col_vis[c-1]; //grid中column的真实位置(可能中间存在隐藏列)
				grid.setValue(v,rn+1,ct);
				
				if(showError(grid,rn+1,ct) || notFilled(v,grid,rn+1,ct) || NullWhenRequired(v,grid,ct)){
					index_notCorrect.push(r);
					break; //一行存在一处错误即记录
				}
				if(!v && grid.getValue(rn+1,c)!=""){grid.Content[r-1][c-1]=fag.getValue(rn+1,c);} //如果Content没有被赋值，则取默认值
			}
		}
		grid.setOnDeleteRow('close');//关闭监听
		grid.deleteRow(rn+1);//删除增加的那行
		return index_notCorrect;
	}
	
	function showError(grid,row,col){ //显示报错(validate处的正则表达式)
		return (grid.getControl(row,col).parent().find(".pmdynaform-message-error").length>0);
	}
	
	function notFilled(val,grid,row,col){ //内容未被正确赋值(值与sql的内容不同)
		return (val!="" && grid.getValue(row,col)=="");
	}
	
	function NullWhenRequired(val,grid,col){ //必填项为空
		var crs=grid.col_required;
		if(crs.indexOf(col)>0 && val==""){ //该字段必填但为空
			return true;
		}
		return false;
	}
	
	return fag;
}
