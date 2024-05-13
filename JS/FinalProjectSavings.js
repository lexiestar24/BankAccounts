/*Lexie Star
Final Project - JS
Savings Account*/

//------UNOPENED SAVINGS ACCOUNT------
//declare global variables
var $btnCloseAccount = $("#btnCloseSav");
var $savingsDate;
var $savingsDeposit;
var savingsTransactions = [];
var secondsPerYear = 365 * 24 * 60 * 60; //365 days/yr, 24 hrs/day, 60 mins/hr, 60 sec/min
var timerInterval;
var timer;
var timer2;
var $savDepositAmount;
var $savWithdrawAmount;
var previousBalance;
var newBalance;
var elapsedTime = 0;
console.log(elapsedTime);

//initally hide open account info
$("#opensavingsAcct").hide();
//initially hide close account button
$btnCloseAccount.hide();

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
    $btnCloseAccount.show(); //show Close Account button

    //create initial transaction in table only if there are no transactions yet
    if (savingsTransactions.length === 0) {
      var openingSavingsTransaction = {
        Date: $savingsDate,
        Description: "Open Account",
        Amount: "$" + $savingsDeposit.toFixed(2), //2 decimal places
        Balance: "$" + $savingsDeposit.toFixed(2), //2 decimal places
      };
      savingsTransactions.push(openingSavingsTransaction); //add opening transaction to array
      makeSavingsRows(openingSavingsTransaction); //add opening transaction row to the table
      startInterestTimer(); //start interest payment timer
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
    $savingsRow.append($("<td></td>").text(transaction.Date));
    $savingsRow.append($("<td></td>").text(transaction.Description));
    $savingsRow.append($("<td></td>").text(transaction.Amount));
    $savingsRow.append($("<td></td>").text(transaction.Balance));
    $("#savingsTBody").append($savingsRow);
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
  for (let i = savingsTransactions.length - 1; i >= 0; i--) {
    console.log(savingsTransactions[i].Description);
    if (
      savingsTransactions[i].Description ===
        "Interest Payment (" + $savInterestRate + "%)" ||
      savingsTransactions[i].Description === "Open Account"
    ) {
      console.log(savingsTransactions[i]);
      return savingsTransactions[i].Date;
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
  var previousTransaction = savingsTransactions[savingsTransactions.length - 1];
  //remove $ symbol from previousTransaction.Balance
  var balanceWithoutSymbol = previousTransaction.Balance.replace(
    "$",
    ""
  ).trim();
  previousBalance = parseFloat(balanceWithoutSymbol);
  return previousBalance;
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
  console.log($savInterestRate);
  interestAmount = previousBalance * $savInterestRate;
  newBalance = interestAmount + previousBalance;

  //create new interest payment transaction
  var interestPaymentTransaction = {
    Date: formatDate(nextInterestPaymentDate),
    Description: "Interest Payment (" + $savInterestRate + "%)",
    Amount: "$" + interestAmount.toFixed(2), //2 digits
    Balance: "$" + newBalance.toFixed(2), //2 digits
  };
  savingsTransactions.push(interestPaymentTransaction); //add interest transaction to array
  makeSavingsRows(); //update table with new row of interest payment transaction
  updateTimerInterval(); //update timer interval
}

//MAKE DEPOSITS
$("#btnSavingsDeposit").on("click", function () {
  $savDepositAmount = $("#savingsDepositText").val(); //get deposit amount input
  $savDepositAmount = Number($savDepositAmount); //convert from string to number
  if ($savDepositAmount > 0) {
    //don't display warning message
    $("#openedSavingsWarn").text("");

    //calculate new balance for deposits
    var previousBalance = trimCurrencyFromPreviousBalance();
    newBalance = previousBalance + $savDepositAmount;

    //calculate transaction date for deposits
    var depositTransactionDate = calculateDaysElapsed();

    //create new deposit transaction
    var depositTransaction = {
      Date: formatDate(depositTransactionDate), //use formatted simulated date
      Description: "Deposit",
      Amount: "$" + $savDepositAmount.toFixed(2), //2 digits
      Balance: "$" + newBalance.toFixed(2), //2 digits
    };
    savingsTransactions.push(depositTransaction); //add deposit transaction to array
    makeSavingsRows(); //update table with new row of deposit transaction
    $savDepositAmount = $("#savingsDepositText").val(""); //clear out deposit text box
  } else {
    //display warning message
    var savDepositMsg = "Deposit must be greater than 0";
    $("#openedSavingsWarn").text(savDepositMsg);
  }
});

// //MAKE WITHDRAWALS
// $("#btnCheckingWithdraw").on("click", function () {
//   $checkWithdrawAmount = $("#checkingWithdrawText").val(); //get withdrawal amount
//   $checkWithdrawAmount = Number($checkWithdrawAmount); //convert from string to number
//   var previousBalance = trimCurrencyFromPreviousBalance(); //get most recent account balance
//   if ($checkWithdrawAmount > 0) {
//     //don't display warning message
//     $("#openedCheckingWarn").text("");

//     //calcualte new balance for withdrawals
//     newBalance = previousBalance - $checkWithdrawAmount;

//     //calculate transaction date for withdrawals
//     var withdrawalTransactionDate = calculateDaysElapsed();

//     //create withdrawal transaction
//     var withdrawalTransaction = {
//       Date: formatDate(withdrawalTransactionDate),
//       Description: "Withdrawal",
//       Amount: "-$" + $checkWithdrawAmount.toFixed(2), //2 decimals
//       Balance: "$" + newBalance.toFixed(2), //2 decimals
//     };
//     savingsTransactions.push(withdrawalTransaction); //add withdraw transaction to array
//     makeSavingsRows(); //update table with new row of withdraw transaction
//     $checkWithdrawAmount = $("#checkingWithdrawText").val(""); //clear out withdraw text box
//   } else {
//     var checkWithdrawMsg = "Withdrawal must be less than current balance";
//     //display warning message
//     $("#openedCheckingWarn").text(checkWithdrawMsg);
//   }
// });

// //FUNCTION TO STOP INTEREST PAYMENT TIMER
// function stopInterestTimer() {
//   clearInterval(timer);
//   clearInterval(timer2);
// }

// //CLOSE ACCOUNT
// $("#btnCloseCheck").on("click", function () {
//   //stop timer
//   stopInterestTimer();
//   //hide input controls
//   $("#openCheckingControls").hide();
//   //calculate closed account withdrawal
//   var previousBalance = trimCurrencyFromPreviousBalance();
//   //calculate closed account date
//   var closeAccountTransactionDate = calculateDaysElapsed();
//   //create final withdrawal transaction
//   var closeAccountTransaction = {
//     Date: formatDate(closeAccountTransactionDate),
//     Description: "Account Closed",
//     Amount: "-$" + previousBalance.toFixed(2), //2 decimals
//     Balance: "$0.00",
//   };
//   savingsTransactions.push(closeAccountTransaction); //add withdraw transaction to array
//   makeSavingsRows(); //update table with new row of withdraw transaction
//   //display account closed message
//   var $checkingCloseMsg = $("#closeCheckingMsg");
//   var checkingClosedMsg = "Acccount closed";
//   $checkingCloseMsg.text(checkingClosedMsg);
//   $checkingCloseMsg.removeClass("hide");
//   //hide Close Account button
//   $btnCloseAccount.hide();
//   //make columns sortable
// });
