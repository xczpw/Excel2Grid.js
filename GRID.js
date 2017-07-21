function GRID(gridID){
	var grid = $("#"+gridID);
	grid.info=grid.getInfo();	
	grid.row_num=grid.getNumberRows();
	grid.col_vis=getVisiableColumnIndex();
	grid.col_required=getRequiredColumns();
	grid.label=getLabelOfVisiableColumn();
	
	grid.fun_c=function(){};
	grid.fun_a=function(){};
	grid.fun_d=function(){};
		
	function getVisiableColumnIndex(){
		var cols=grid.find(".row.pmdynaform-grid-thead").find("div").not(".wildcard").not(".pmdynaform-grid-removerow-static");
		var col_vis_index=[];
		for(var i=1;i<=cols.length;i++){
			if($(cols[i-1]).is(":visible")){
				col_vis_index.push(i);
			}
		}
		return col_vis_index;
	}
	
	function getRequiredColumns(){
		var col_required=[];
		for(var i=1;i<=grid.col_vis.length;i++){
			var cv=grid.col_vis[i-1];
			if($(grid.find(".title-column")[cv-1]).parent().find("span.pmdynaform-field-required").length>0){
				col_required.push(i);
			}
		}
		return(col_required);
	}
	
	function getLabelOfVisiableColumn(){
		var Label=[];
		for(var i=0;i<grid.col_vis.length;i++){
			Label[i]=grid.getLabel(grid.col_vis[i]);
		}
		return Label;
	}
	
	grid.getData=function(){ //[Array(),Array(),Array()....]
		var data=[];
		var label=[];
		$.each(this.col_vis, function(index,colIndex){
			label.push(grid.getLabel(colIndex));
		});
		data.push(label); //标题行
		for(var i=1;i<=this.row_num;i++){
			var row_data=[];
			$.each(this.col_vis, function(index,colIndex){
				row_data.push(grid.getValue(i,colIndex).replace(/(^\s*)|(\s*$)/g,""));
			});
			data.push(row_data);
		}
		return(data);	
	}
	
	grid.clear=function(needEmpty){
		var rn=this.row_num;
		if(needEmpty){ //只删除空行
			while(rn>0){
				if(isEmptyRow(rn)){
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
	
	function isEmptyRow(rowID){
		$.each(this.col_vis, function(index,colIndex){
			if(this.getValue(rowID,colIndex)!=="") return false;
		});
		return true;
	}
	
	grid.setOnchange=function(fun){
		var rn=this.getNumberRows(),cn=getVisiableColumnIndex().length;		
		for(var r=1;r<=rn;r++){
			$.each(this.col_vis, function(index,colIndex){
				var gc=grid.getControl(r, colIndex);
				gc.attr({'row':r,'column':colIndex});
				gc.change(function(){
					var row=$(this).attr('row'),col=$(this).attr('column');
					var val=$(this).val();
					fun(row,col,val);
				});
			});
		}	
	}
	
	grid.setOnAddRow=function(status,fun){
		if(status==='close'){ //关闭监听
			this.onAddRow(function(){});
		}else{ //开启监听
			this.onAddRow(function(r, g, index){
				fun(r,g,index);
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

	grid.refresh=function(){ //建议不单独使用各个事件，而直接使用该函数
		this.row_num=this.getNumberRows();
		this.col_vis=getVisiableColumnIndex();
		this.col_required=getRequiredColumns();
		this.label=getLabelOfVisiableColumn();
		
		this.setOnchange(this.fun_c);
		this.setOnAddRow('open',this.fun_a);
		this.setOnDeleteRow('open',this.fun_d);
	}
		
	return grid;
}
