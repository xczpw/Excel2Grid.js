# Excel2Grid.js

The project originally aims to strengthen the grid control of *ProcessMaker*.<br>
Re-developing the solution of [SheetJS](https://sheetjs.com/), we provide some more convenient functions to control Excel files (**.xls/.xlsx**) by **pure JS**.

## Background
Allowing users to fill form by files can improve their experience and decrease the risks of data validation. <br>
*For example, ProcessMaker allows users to submit the structural data by a grid, but they must fill the cells one by one. If they want to submit a order with 1000+ items, they will be exhausted before achieve it, without consideration about the breakdown of the web page.*<br><bsr>
Resticted by Javascript, Excel files are alaways transformed to server, resolved by server and reloaded by front, which consumes lots of resouces of server and network, as well as confuses developers.<br>
Thanks to [SheetJS](https://sheetjs.com/), resolving Excel file by pure JS is feasible.<br>
Thus, we propose the project to resolve Excel files by pure JS.
Besides, we enhance the function of *ProcessMaker's* grid control by adding the **Data Binding**.

## Usage
There are three JS functions:
+ **FILE.js** -- provide functions to import or export Excel files.
+ **GRID.js** -- enhance the function of ProcessMaker's grid control.
+ **FAG.js** -- provide a method to operate the FILE and GRID jointly.

If you just need resolve files rather than fill grid of *ProcessMaker*, only **FILE.js** needs to be imported. BUT *xlsx.js, jszip.js, Blob.js and FileSaver.js (necessary when exporting the file)* must be imported before.<br>
**GRID.js** and **FAG.js** are avaliable only when you use *ProcessMaker*.
