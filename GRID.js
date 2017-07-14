function GRID(gridID){
	var grid = $("#"+gridID);
	grid.info=grid.getInfo();	
	grid.row_num=grid.getNumberRows();
	grid.col_num=grid.find(".row.pmdynaform-grid-thead").find("div").not(".wildcard").not(".pmdynaform-grid-removerow-static").not(":hidden").length;
	
	grid.getData=function(){
		var data=[];
		var label=[];
		for(var i=1;i<=this.col_num;i++){
			label.push(this.getLabel(i));
		}
		data.push(label); //标题行
		for(var i=1;i<=this.row_num;i++){
			var row_data=[];
			for(var j=1;j<=this.col_num;j++){
				row_data.push(this.getValue(i,j).replace(/(^\s*)|(\s*$)/g,""));
			}
			data.push(row_data);
		}
		return(data);	
	}
	
	grid.clear=function(needEmpty){
		var rn=this.row_num;
		if(needEmpty){ //只删除空行
			while(rn>0){
				if(this.isEmptyRow(rn)){
					grid.deleteRow(rn);
				}
				rn--;
			}
		}else{
			while(rn>0){
				grid.deleteRow(rn);
				rn--;
			}
		}
	}
	
	grid.isEmptyRow=function(rowID){
		var cn = this.col_num;
		for(var i=1;i<=cn;i++){
			if(this.getValue(rowID,i)!=="")
				return false;
		}
		return true;
	}
	
	grid.setOnchange=function(fun){
		var rn=this.row_num,cn=this.col_num;
		for(var r=1;r<=rn;r++){
			for(var c=1;c<=cn;c++){
				var gc=this.getControl(r, c);
				gc.attr({'row':r,'column':c});
				gc.change(function(){
					var row=$(this).attr('row'),col=$(this).attr('column');
					var val=$(this).val();
					fun(row,col,val);
				});
			}	
		}	
	}
	
	grid.setOnAddRow=function(status,fun){
		if(status==='close'){ //关闭监听
			this.onAddRow(function(){});
		}else{ //开启监听
			this.onAddRow(function(r, g, index){
				fun(r,g,index);
				this.row_num++;
			});
		}
	}
	
	grid.setOnDeleteRow=function(status,fun){
		if(status==='close'){ //关闭监听
			this.onDeleteRow(function(){});
		}else{	 //开启监听
			this.onDeleteRow(function(r, g, index){
				fun(r, g, index);
			});
		}
	}
	
	this.onAddRow(function(){this.row_num++;});
	this.onDeleteRow(function(){this.row_num--;});
	
	return grid;
}