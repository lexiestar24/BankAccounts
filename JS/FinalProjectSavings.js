/*Lexie Star
Final Project - JS
Savings Account*/

//------UNOPENED SAVINGS ACCOUNT------
//declare global variables
var $btnCloseSav = $("#btnCloseSav");
var $savingsDate;
var $savingsDeposit;
var savingsTransactions = [];
var secondsPerYear = 365 * 24 * 60 * 60; //365 days/yr, 24 hrs/day, 60 mins/hr, 60 sec/min
var savTimer;
var savTimer2;
var $savDepositAmount;
var $savWithdrawAmount;
var previousSavBalance;
var newSavBalance;
var savElapsedTime = 0;

//initally hide open account info
$("#opensavingsAcct").hide();
//initially hide close account button
$btnCloseSav.hide();

//VALIDATE DATE TO OPEN ACCOUNT
$("#savingsDate").on("blur", function () {
  $savingsDate = $(this).val(); //store selected date
  if ($savingsDate) {
    //don't display warning
    $("#savingsWarn").text("");
  } else {
    //dispay warning message
    var savDateWarn = "Must select a valid date";
    $("#savingsWarn").text(savDateWarn);
  }
});

//VALIDATE INITIAL DEPOSIT AMOUNT
$("#savingsDeposit").on("blur", function () {
  $savingsDeposit = $("#savingsDeposit").val(); //store amount entered
  $savingsDeposit = Number($savingsDeposit); //convert from string to number
  if ($savingsDeposit > 0) {
    //don't display warning message
    $("#savingsWarn").text("");
  } else {
    //display warning message
    savDepositWarn = "Deposit must be greater than $0";
    $("#savingsWarn").text(savDepositWarn);
  }
});

//OPEN ACCOUNT BUTTON
$("#btnOpenSav").on("click", function () {
  //if validation checks pass
  if ($savingsDate && $savingsDeposit > 0) {
    $("#unopenedSavings").hide(); //hide unopened account info
    $("#opensavingsAcct").show(); //show opened account info
    $btnCloseSav.show(); //show Close Account button

    //create initial transaction in table only if there are no transactions yet
    if (savingsTransactions.length === 0) {
      var openingSavingsTransaction = {
        savDate: $savingsDate,
        savDescription: "Open Account",
        savAmount: "$" + $savingsDeposit.toFixed(2), //2 decimal places
        savBalance: "$" + $savingsDeposit.toFixed(2), //2 decimal places
      };
      savingsTransactions.push(openingSavingsTransaction); //add opening transaction to array
      makeSavingsRows(openingSavingsTransaction); //add opening transaction row to the table
      startSavInterestTimer(); //call function to start interest payment timer
    }
  } else {
    var savWarn = "Enter a valid deposit amount and date";
    $("#savingsWarn").text(savWarn);
  }
});

//------OPENED SAVINGS ACCOUNT------

//SET DEFAULT INTEREST RATE: 0.03
var $savInterestRate = 0.03; //source of truth available to everyone
$("#SavingsInterestRate").val($savInterestRate); //set textbox to initial interest rate when account is opened

//FUNCTION TO MAKE ROWS FOR TRANSACTION TABLE
function makeSavingsRows() {
  $("#savingsTBody").empty(); //clear table body before adding rows to avoid duplicates
  savingsTransactions.forEach(function (transaction) {
    var $savingsRow = $("<tr></tr>"); //create new row
    //append td elements to new row that contains all information about the transaction
    $savingsRow.append($("<td></td>").text(transaction.savDate));
    $savingsRow.append($("<td></td>").text(transaction.savDescription));
    $savingsRow.append($("<td></td>").text(transaction.savAmount));
    $savingsRow.append($("<td></td>").text(transaction.savBalance));
    $("#savingsTBody").append($savingsRow);
  });
}

//FUNCTION TO START INTEREST PAYMENT TIMER
function startSavInterestTimer() {
  //calculate time until first interest payment (10 seconds)
  var timeUntilFirstSavingsInterestPayment = 10 * 1000; //convert milliseconds to seconds
  //start timer
  clearInterval(savTimer);
  savTimer = setInterval(
    addSavInterestPayment,
    timeUntilFirstSavingsInterestPayment
  );
  var timeUntilFirstSavingsInterestPayment = 1 * 1000; //convert milliseconds to seconds
  clearInterval(savTimer2);
  savTimer2 = setInterval(() => {
    //increment seconds if less than 10 seconds
    if (savElapsedTime < 10) {
      savElapsedTime++;
      //otherwise resest seconds back to 1
    } else {
      savElapsedTime = 1;
    }
  }, timeUntilFirstSavingsInterestPayment);
}

//FUNCTION TO GET MOST RECENT DATE OF INTEREST PAYMENTS (OR OPEN ACCOUNT DATE)
function getMostRecentSavInterestDateOrOpenDate() {
  for (let i = savingsTransactions.length - 1; i >= 0; i--) {
    if (
      savingsTransactions[i].savDescription ===
        "Interest Payment (" + $savInterestRate + "%)" ||
      savingsTransactions[i].savDescription === "Open Account"
    ) {
      return savingsTransactions[i].savDate;
    }
  }
}

//FUNCTION TO UPDATE TIMER INTERVAL
function updateSavingsTimerInterval() {
  clearInterval(savTimer);
  //set timer interval to trigger every 10 seconds
  savTimer = setInterval(addSavInterestPayment, 10 * 1000);
}

//FUNCTION TO FORMAT DATE
function formatDate(date) {
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString().padStart(2, "0"); //2 digits (if 1 digit, add 0 first)
  var day = date.getDate().toString().padStart(2, "0"); //add 1 so January is 1, not 0 (2 digits, add a 0 in front of 1-digit months)
  return year + "-" + month + "-" + day;
}

//FUNCTION TO CALCULATE DAYS ELAPSED
function calculateSavDaysElapsed() {
  //calculate simulated date based on time elapsed since last interest payment
  var lastSavInterestPaymentOrOpenAccount =
    getMostRecentSavInterestDateOrOpenDate();
  var savDaysElapsed = 365 * (savElapsedTime / 10);
  var nextSavTransactionDate = new Date(lastSavInterestPaymentOrOpenAccount);
  nextSavTransactionDate.setDate(
    nextSavTransactionDate.getDate() + savDaysElapsed
  );
  return nextSavTransactionDate;
}

//FUNCTION TO TRIM $ OFF PREVIOUS TRANSACTION BALANCE
function trimCurrencyFrompreviousSavBalance() {
  var previousTransaction = savingsTransactions[savingsTransactions.length - 1];
  //remove $ symbol from previousTransaction.savBalance
  var balanceWithoutSymbol = previousTransaction.savBalance
    .replace("$", "")
    .trim();
  previousSavBalance = parseFloat(balanceWithoutSymbol);
  return previousSavBalance;
}

//FUNCTION TO GET INTEREST RATE
$("#SavingsInterestRate").on("change", function () {
  if ($("#SavingsInterestRate").val() > 0) {
    //update source of truth
    $savInterestRate = $("#SavingsInterestRate").val();
  } else {
    //update source of truth to default value
    $savInterestRate = 0.03;
    $("#SavingsInterestRate").val(0.03);
  }
});

//FUNCTION TO ADD NEW ROWS FOR INTEREST PAYMENTS
function addSavInterestPayment() {
  var lastInterestPaymentDate = new Date(
    getMostRecentSavInterestDateOrOpenDate()
  );
  //calculate next interest payment date (10 seconds [1 year] from last interest payment)
  var nextSavInterestPaymentDate = new Date(lastInterestPaymentDate);
  nextSavInterestPaymentDate.setFullYear(
    nextSavInterestPaymentDate.getFullYear() + 1
  );
  nextSavInterestPaymentDate.setDate(nextSavInterestPaymentDate.getDate() + 1); //add one day to make full year
  //calculate interest amount and new balance
  var previousSavBalance = trimCurrencyFrompreviousSavBalance();
  SavInterestAmount = previousSavBalance * $savInterestRate;
  newSavBalance = SavInterestAmount + previousSavBalance;
  //create new interest payment transaction
  var savInterestPaymentTransaction = {
    savDate: formatDate(nextSavInterestPaymentDate),
    savDescription: "Interest Payment (" + $savInterestRate + "%)",
    savAmount: "$" + SavInterestAmount.toFixed(2), //2 digits
    savBalance: "$" + newSavBalance.toFixed(2), //2 digits
  };
  savingsTransactions.push(savInterestPaymentTransaction); //add interest transaction to array
  makeSavingsRows(); //update table with new row of interest payment transaction
  updateSavingsTimerInterval(); //update timer interval
}

//MAKE DEPOSITS
$("#btnSavingsDeposit").on("click", function () {
  $savDepositAmount = $("#savingsDepositText").val(); //get deposit amount input
  $savDepositAmount = Number($savDepositAmount); //convert from string to number
  if ($savDepositAmount > 0) {
    //don't display warning message
    $("#openedSavingsWarn").text("");
    //calculate new balance for deposits
    var previousSavBalance = trimCurrencyFrompreviousSavBalance();
    newSavBalance = previousSavBalance + $savDepositAmount;
    //calculate transaction date for deposits
    var savDepositTransactionDate = calculateSavDaysElapsed();
    //create new deposit transaction
    var savDepositTransaction = {
      savDate: formatDate(savDepositTransactionDate), //use formatted simulated date
      savDescription: "Deposit",
      savAmount: "$" + $savDepositAmount.toFixed(2), //2 digits
      savBalance: "$" + newSavBalance.toFixed(2), //2 digits
    };
    savingsTransactions.push(savDepositTransaction); //add deposit transaction to array
    makeSavingsRows(); //update table with new row of deposit transaction
    $savDepositAmount = $("#savingsDepositText").val(""); //clear out deposit text box
  } else {
    //display warning message
    var savDepositMsg = "Deposit must be greater than 0";
    $("#openedSavingsWarn").text(savDepositMsg);
  }
});

//MAKE WITHDRAWALS
$("#btnSavingsWithdraw").on("click", function () {
  $savWithdrawAmount = $("#SavingsWithdrawText").val(); //get withdrawal amount
  $savWithdrawAmount = Number($savWithdrawAmount); //convert from string to number
  var previousSavBalance = trimCurrencyFrompreviousSavBalance(); //get most recent account balance
  if ($savWithdrawAmount <= previousSavBalance && $savWithdrawAmount > 0) {
    //don't display warning message
    $("#openedSavingsWarn").text("");
    //calculate new balance for withdrawals
    newSavBalance = previousSavBalance - $savWithdrawAmount;
    //calculate transaction date for withdrawals
    var withdrawalTransactionDate = calculateSavDaysElapsed();
    //create withdrawal transaction
    var withdrawalTransaction = {
      savDate: formatDate(withdrawalTransactionDate),
      savDescription: "Withdrawal",
      savAmount: "-$" + $savWithdrawAmount.toFixed(2), //2 decimals
      savBalance: "$" + newSavBalance.toFixed(2), //2 decimals
    };
    savingsTransactions.push(withdrawalTransaction); //add withdraw transaction to array
    makeSavingsRows(); //update table with new row of withdraw transaction
    $savWithdrawAmount = $("#SavingsWithdrawText").val(""); //clear out withdraw text box
  } else {
    var savWithdrawMsg =
      "Withdrawal must be less than current balance and greater than 0";
    //display warning message
    $("#openedSavingsWarn").text(savWithdrawMsg);
  }
});

//FUNCTION TO STOP INTEREST PAYMENT TIMER
function stopSavInterestTimer() {
  clearInterval(savTimer);
  clearInterval(savTimer2);
}

//CLOSE SAVINGS ACCOUNT
$("#btnCloseSav").on("click", function () {
  //stop timer
  stopSavInterestTimer();
  //hide input controls
  $("#openSavingsControls").hide();
  //calculate closed account withdrawal
  var previousSavBalance = trimCurrencyFrompreviousSavBalance();
  //calculate closed account date
  var closeSavingsAccountTransactionDate = calculateSavDaysElapsed();
  //create final withdrawal transaction
  var closeSavingsAccountTransaction = {
    savDate: formatDate(closeSavingsAccountTransactionDate),
    savDescription: "Account Closed",
    savAmount: "-$" + previousSavBalance.toFixed(2), //2 decimals
    savBalance: "$0.00",
  };
  savingsTransactions.push(closeSavingsAccountTransaction); //add withdraw transaction to array
  makeSavingsRows(); //update table with new row of withdraw transaction
  //display account closed message
  var $savingsCloseMsg = $("#closeSavingsMsg");
  var savingsClosedMsg = "Acccount closed";
  $savingsCloseMsg.text(savingsClosedMsg);
  $savingsCloseMsg.removeClass("hide");
  //hide Close Account button
  $btnCloseSav.hide();
  // Add column header effects to all column headers
  const table = document.getElementById("savingsTable"); //get table element
  const columnHeaders = table.querySelectorAll("th"); //get table headers
  columnHeaders.forEach(function (header) {
    header.classList.add("columnHover");
  });
});
