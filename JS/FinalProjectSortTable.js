/*Lexie Star
Final Project - JS
Table Sorting Function*/

//array to store sorting order for each column
let sortOrder = [];

//FUNCTION TO SORT TABLE BASED ON COLUMN INDEX
function sortTable(columnIndex, tableName) {
  const table = document.getElementById(tableName); //get table element
  const rows = table.rows; //get all rows in table
  let switching = true; //control sorting loop
  let shouldSwitch, i; //indicate if switch should occur

  //remove 'columnClicked' class from all column headers to start
  const columnHeaders = table.querySelectorAll("th");
  columnHeaders.forEach(function (header) {
    header.classList.remove("columnClicked");
  });

  // Add 'columnHover' class to all column headers
  columnHeaders.forEach(function (header) {
    header.classList.add("columnHover");
  });

  //add 'columnClicked' class to clicked column header
  table
    .querySelector("th:nth-child(" + (columnIndex + 1) + ")")
    .classList.add("columnClicked");

  //check current sorting order for column
  if (
    sortOrder[columnIndex] === "asc" ||
    sortOrder[columnIndex] === undefined
  ) {
    sortOrder[columnIndex] = "desc";
  } else {
    sortOrder[columnIndex] = "asc";
  }
  //sorting loop
  while (switching) {
    switching = false; //reset switching
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false; //reset switching
      //get cell values for comparison
      let x = rows[i]
        .getElementsByTagName("td")
        [columnIndex].textContent.toLowerCase();
      let y = rows[i + 1]
        .getElementsByTagName("td")
        [columnIndex].textContent.toLowerCase();
      //compare values based on sorting order
      if (columnIndex === 3 || columnIndex === 2) {
        x = parseFloat(x.replace("$", ""));
        y = parseFloat(y.replace("$", ""));
      }
      if (sortOrder[columnIndex] === "asc") {
        if (x > y) {
          shouldSwitch = true;
          break;
        }
      } else {
        if (x < y) {
          shouldSwitch = true;
          break;
        }
      }
    }
    //do switch if required
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}
