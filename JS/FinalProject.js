/*Lexie Star
Final Project - JS
Checking Account*/

//------UNOPENED CHECKING ACCOUNT------
//declare global variables
var $btnCloseAccount = $("#btnCloseCheck");
var $checkingDate;
var $checkingDeposit;
var checkingTransactions = [];
var secondsPerYear = 365 * 24 * 60 * 60; //365 days/yr, 24 hrs/day, 60 mins/hr, 60 sec/min
var timerInterval;
var timer;
var timer2;
var $checkDepositAmount;
var $checkWithdrawAmount;
var previousBalance;
var newBalance;
var elapsedTime = 0;
console.log(elapsedTime);

//initally hide open account info
$("#openCheckingAcct").hide();
//initially hide close account button
$btnCloseAccount.hide();

//VALIDATE DATE TO OPEN ACCOUNT
$("#checkingDate").on("blur", function () {
  $checkingDate = $(this).val(); //store selected date
  if ($checkingDate) {
    //don't display warning
    $("#checkingWarn").text("");
  } else {
    //dispay warning message
    var checkDateWarn = "Must select a valid date";
    $("#checkingWarn").text(checkDateWarn);
  }
});

//VALIDATE INITIAL DEPOSIT AMOUNT
$("#checkingDeposit").on("blur", function () {
  $checkingDeposit = $("#checkingDeposit").val(); //store amount entered
  $checkingDeposit = Number($checkingDeposit); //convert from string to number
  if ($checkingDeposit > 0) {
    //don't display warning message
    $("#checkingWarn").text("");
  } else {
    //display warning message
    checkDepositWarn = "Deposit must be greater than $0";
    $("#checkingWarn").text(checkDepositWarn);
  }
});

//OPEN ACCOUNT BUTTON
$("#openCheckBtn").on("click", function () {
  //if validation checks pass
  if ($checkingDate && $checkingDeposit > 0) {
    $("#unopenedChecking").hide(); //hide unopened account info
    $("#openCheckingAcct").show(); //show opened account info
    $btnCloseAccount.show(); //show Close Account button

    //create initial transaction in table only if there are no transactions yet
    if (checkingTransactions.length === 0) {
      var openingCheckingTransaction = {
        Date: $checkingDate,
        Description: "Open Account",
        Amount: "$" + $checkingDeposit.toFixed(2), //2 decimal places
        Balance: "$" + $checkingDeposit.toFixed(2), //2 decimal places
      };
      checkingTransactions.push(openingCheckingTransaction); //add opening transaction to array
      makeCheckingRows(openingCheckingTransaction); //add opening transaction row to the table
      startInterestTimer(); //start interest payment timer
    }
  } else {
    var checkWarn = "Enter a valid deposit amount and date";
    $("#checkingWarn").text(checkWarn);
  }
});

//------OPENED CHECKING ACCOUNT------

//SET DEFAULT INTEREST RATE: 0.01
var $checkInterestRate = 0.01; //source of truth available to everyone
$("#CheckingInterestRate").val($checkInterestRate); //set textbox to initial interest rate when account is opened

//FUNCTION TO MAKE ROWS FOR TRANSACTION TABLE
function makeCheckingRows() {
  $("#checkingTBody").empty(); //clear table body before adding rows to avoid duplicates
  checkingTransactions.forEach(function (transaction) {
    var $checkingRow = $("<tr></tr>"); //create new row
    //append td elements to new row that contains all information about the transaction
    $checkingRow.append($("<td></td>").text(transaction.Date));
    $checkingRow.append($("<td></td>").text(transaction.Description));
    $checkingRow.append($("<td></td>").text(transaction.Amount));
    $checkingRow.append($("<td></td>").text(transaction.Balance));
    $("#checkingTBody").append($checkingRow);
  });
}

//FUNCTION TO START INTEREST PAYMENT TIMER
function startInterestTimer() {
  //calculate time until first interest payment (10 seconds)
  var timeUntilFirstInterestPayment = 10 * 1000; //convert milliseconds to seconds
  //start timer
  clearInterval(timer);
  timer = setInterval(addInterestPayment, timeUntilFirstInterestPayment);
  var timeUntilFirstInterestPayment = 1 * 1000; //convert milliseconds to seconds
  clearInterval(timer2);
  timer2 = setInterval(() => {
    //increment seconds if less than 10 seconds
    if (elapsedTime < 10) {
      elapsedTime++;
      console.log(elapsedTime);
      //otherwise resest seconds back to 1
    } else {
      elapsedTime = 1;
      console.log(elapsedTime);
    }
  }, timeUntilFirstInterestPayment);
}

//FUNCTION TO GET MOST RECENT DATE OF INTEREST PAYMENTS (OR OPEN ACCOUNT DATE)
function getMostRecentInterestDateOrOpenDate() {
  for (let i = checkingTransactions.length - 1; i >= 0; i--) {
    console.log(checkingTransactions[i].Description);
    if (
      checkingTransactions[i].Description ===
        "Interest Payment (" + $checkInterestRate + "%)" ||
      checkingTransactions[i].Description === "Open Account"
    ) {
      console.log(checkingTransactions[i]);
      return checkingTransactions[i].Date;
    }
  }
}

//FUNCTION TO UPDATE TIMER INTERVAL
function updateTimerInterval() {
  clearInterval(timer);
  //set timer interval to trigger every 10 seconds
  timer = setInterval(addInterestPayment, 10 * 1000);
}

//FUNCTION TO FORMAT DATE
function formatDate(date) {
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString().padStart(2, "0"); //2 digits (if 1 digit, add 0 first)
  var day = date.getDate().toString().padStart(2, "0"); //add 1 so January is 1, not 0 (2 digits, add a 0 in front of 1-digit months)
  return year + "-" + month + "-" + day;
}

//FUNCTION TO CALCULATE DAYS ELAPSED
function calculateDaysElapsed() {
  //calculate simulated date based on time elapsed since last interest payment
  var lastInterestPaymentOrOpenAccount = getMostRecentInterestDateOrOpenDate();
  var daysElapsed = 365 * (elapsedTime / 10);
  console.log(daysElapsed);
  var nextTransactionDate = new Date(lastInterestPaymentOrOpenAccount);
  nextTransactionDate.setDate(nextTransactionDate.getDate() + daysElapsed);
  console.log(nextTransactionDate);
  return nextTransactionDate;
}

//FUNCTION TO TRIM $ OFF PREVIOUS TRANSACTION BALANCE
function trimCurrencyFromPreviousBalance() {
  var previousTransaction =
    checkingTransactions[checkingTransactions.length - 1];
  //remove $ symbol from previousTransaction.Balance
  var balanceWithoutSymbol = previousTransaction.Balance.replace(
    "$",
    ""
  ).trim();
  previousBalance = parseFloat(balanceWithoutSymbol);
  return previousBalance;
}

//FUNCTION TO GET INTEREST RATE
$("#CheckingInterestRate").on("change", function () {
  if ($("#CheckingInterestRate").val() > 0) {
    //update source of truth
    $checkInterestRate = $("#CheckingInterestRate").val();
  } else {
    //update source of truth to default value
    $checkInterestRate = 0.01;
    $("#CheckingInterestRate").val(0.01);
  }
});

//FUNCTION TO ADD NEW ROWS FOR INTEREST PAYMENTS
function addInterestPayment() {
  var lastInterestPaymentDate = new Date(getMostRecentInterestDateOrOpenDate());
  //calculate next interest payment date (10 seconds [1 year] from last interest payment)
  var nextInterestPaymentDate = new Date(lastInterestPaymentDate);
  nextInterestPaymentDate.setFullYear(
    nextInterestPaymentDate.getFullYear() + 1
  );
  nextInterestPaymentDate.setDate(nextInterestPaymentDate.getDate() + 1); //add one day to make full year

  //calculate interest amount and new balance
  var previousBalance = trimCurrencyFromPreviousBalance();
  console.log($checkInterestRate);
  interestAmount = previousBalance * $checkInterestRate;
  newBalance = interestAmount + previousBalance;

  //create new interest payment transaction
  var interestPaymentTransaction = {
    Date: formatDate(nextInterestPaymentDate),
    Description: "Interest Payment (" + $checkInterestRate + "%)",
    Amount: "$" + interestAmount.toFixed(2), //2 digits
    Balance: "$" + newBalance.toFixed(2), //2 digits
  };
  checkingTransactions.push(interestPaymentTransaction); //add interest transaction to array
  makeCheckingRows(); //update table with new row of interest payment transaction
  updateTimerInterval(); //update timer interval
}

//MAKE DEPOSITS
$("#btnCheckingDeposit").on("click", function () {
  $checkDepositAmount = $("#checkingDepositText").val(); //get deposit amount input
  $checkDepositAmount = Number($checkDepositAmount); //convert from string to number
  if ($checkDepositAmount > 0) {
    //don't display warning message
    $("#openedCheckingWarn").text("");

    //calculate new balance for deposits
    var previousBalance = trimCurrencyFromPreviousBalance();
    newBalance = previousBalance + $checkDepositAmount;

    //calculate transaction date for deposits
    var depositTransactionDate = calculateDaysElapsed();

    //create new deposit transaction
    var depositTransaction = {
      Date: formatDate(depositTransactionDate), //use formatted simulated date
      Description: "Deposit",
      Amount: "$" + $checkDepositAmount.toFixed(2), //2 digits
      Balance: "$" + newBalance.toFixed(2), //2 digits
    };
    checkingTransactions.push(depositTransaction); //add deposit transaction to array
    makeCheckingRows(); //update table with new row of deposit transaction
    $checkDepositAmount = $("#checkingDepositText").val(""); //clear out deposit text box
  } else {
    //display warning message
    var checkDepositMsg = "Deposit must be greater than 0";
    $("#openedCheckingWarn").text(checkDepositMsg);
  }
});

//MAKE WITHDRAWALS
$("#btnCheckingWithdraw").on("click", function () {
  $checkWithdrawAmount = $("#checkingWithdrawText").val(); //get withdrawal amount
  $checkWithdrawAmount = Number($checkWithdrawAmount); //convert from string to number
  var previousBalance = trimCurrencyFromPreviousBalance(); //get most recent account balance
  if ($checkWithdrawAmount > 0) {
    //don't display warning message
    $("#openedCheckingWarn").text("");

    //calcualte new balance for withdrawals
    newBalance = previousBalance - $checkWithdrawAmount;

    //calculate transaction date for withdrawals
    var withdrawalTransactionDate = calculateDaysElapsed();

    //create withdrawal transaction
    var withdrawalTransaction = {
      Date: formatDate(withdrawalTransactionDate),
      Description: "Withdrawal",
      Amount: "-$" + $checkWithdrawAmount.toFixed(2), //2 decimals
      Balance: "$" + newBalance.toFixed(2), //2 decimals
    };
    checkingTransactions.push(withdrawalTransaction); //add withdraw transaction to array
    makeCheckingRows(); //update table with new row of withdraw transaction
    $checkWithdrawAmount = $("#checkingWithdrawText").val(""); //clear out withdraw text box
  } else {
    var checkWithdrawMsg = "Withdrawal must be less than current balance";
    //display warning message
    $("#openedCheckingWarn").text(checkWithdrawMsg);
  }
});

//FUNCTION TO STOP INTEREST PAYMENT TIMER
function stopInterestTimer() {
  clearInterval(timer);
  clearInterval(timer2);
}

//CLOSE ACCOUNT
$("#btnCloseCheck").on("click", function () {
  //stop timer
  stopInterestTimer();
  //hide input controls
  $("#openCheckingControls").hide();
  //calculate closed account withdrawal
  var previousBalance = trimCurrencyFromPreviousBalance();
  //calculate closed account date
  var closeAccountTransactionDate = calculateDaysElapsed();
  //create final withdrawal transaction
  var closeAccountTransaction = {
    Date: formatDate(closeAccountTransactionDate),
    Description: "Account Closed",
    Amount: "-$" + previousBalance.toFixed(2), //2 decimals
    Balance: "$0.00",
  };
  checkingTransactions.push(closeAccountTransaction); //add withdraw transaction to array
  makeCheckingRows(); //update table with new row of withdraw transaction
  //display account closed message
  var $checkingCloseMsg = $("#closeCheckingMsg");
  var checkingClosedMsg = "Acccount closed";
  $checkingCloseMsg.text(checkingClosedMsg);
  $checkingCloseMsg.removeClass("hide");
  //hide Close Account button
  $btnCloseAccount.hide();
  //make columns sortable
});

// //ARRARY TO SORT TABLE COLUMNS
// var compare = {
//   //sort date
//   Date: function (a, b) {
//     a = new Date(a);
//     b = new Date(b);
//     return a - b;
//   },
//   Description: function (a, b) {
//     //sort description alphabetically
//     if (a < b) {
//       return -1;
//     } else {
//       return a > b ? 1 : 0; //return 1
//     } //or return 0 if they're the same
//   },
//   Amount: function (a, b) {
//     //sort dollar amount as numbers (remove $ and -$)
//     a = parseFloat(a.innerHtml.split("$")[1].replace(/,/g, ""));
//     a = parseFloat(a.innerHtml.split("-$")[1].replace(/,/g, ""));
//     b = parseFloat(b.innerHtml.split("$")[1].replace(/,/g, ""));
//     b = parseFloat(b.innerHtml.split("-$")[1].replace(/,/g, ""));
//   },
//   Balance: function (a, b) {
//     //sort dollar amount as numbers (remove $ and -$)
//     a = parseFloat(a.innerHtml.split("$")[1].replace(/,/g, ""));
//     a = parseFloat(a.innerHtml.split("-$")[1].replace(/,/g, ""));
//     b = parseFloat(b.innerHtml.split("$")[1].replace(/,/g, ""));
//     b = parseFloat(b.innerHtml.split("-$")[1].replace(/,/g, ""));
//   },
// };

//FUNCTION TO MAKE TABLE SORTABLE
// var sortedArray = checkingTransactions.sort(function (a, b) {
//   return compare.Date(a.Date, b.Date); //sort array based on Date property
// });

// $("#checkingTable").each(function () {
//   var $checkingTable = $(this);
//   var $tbody = $checkingTable.find("tbody");
//   var $controls = $checkingTable.find("th");
//   var rows = $tbody.find("tr").toArray();
// });
