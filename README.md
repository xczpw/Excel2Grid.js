# Excel2Grid.js

The project originally aims to improve the grid control's function for *ProcessMaker*.
With it, Excel file (**.xls/.xlsx**) can be resolved by **pure JS** directly.

## Background
Allowing users to fill form by files can improve their experience and decrease the risks of data validation. <br>
*For example, ProcessMaker allows users to submit the structural data by a grid, but they must fill the cells one by one. If they want to submit a order with 1000+ items, they will be exhausted before achieve it, without consideration of breakdown of the web page.*<br><bsr>
Resticted by Javascript, Excel files are alaways transformed to server, resolved by server and reloaded by front, which consumes lots of resouces of server and network, as well as confuses developers.<br>
Thans to [SheetJS](https://sheetjs.com/), resolving Excel file by pure JS is feasible.<br>
**This project re-develops the solution of [SheetJS](https://sheetjs.com/), and provide some more convenient functions to control Excel files by pure JS.**
