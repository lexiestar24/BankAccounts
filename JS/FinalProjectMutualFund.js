/*Lexie Star
Final Project - JS
Mutual Fund Account*/

//------UNOPENED MUTUAL FUND ACCOUNT------
//declare global variables
var $btnCloseMF = $("#btnCloseMF");
var $mutualFundDate;
var $mutualFundDeposit;
var mutualFundTransactions = [];
var secondsPerYear = 365 * 24 * 60 * 60; //365 days/yr, 24 hrs/day, 60 mins/hr, 60 sec/min
var mfTimer;
var mfTimer2;
var $mfDepositAmount;
var $mfWithdrawAmount;
var previousMFBalance;
var newMFBalance;
var mfElapsedTime = 0;
console.log(mfElapsedTime);

//initally hide open account info
$("#openMutualFundAcct").hide();
//initially hide close account button
$btnCloseMF.hide();

//VALIDATE DATE TO OPEN ACCOUNT
$("#mutualFundDate").on("blur", function () {
  $mutualFundDate = $(this).val(); //store selected date
  if ($mutualFundDate) {
    //don't display warning
    $("#mutualFundWarn").text("");
  } else {
    //dispay warning message
    var mfDateWarn = "Must select a valid date";
    $("#mutualFundWarn").text(mfDateWarn);
  }
});

//VALIDATE INITIAL DEPOSIT AMOUNT
$("#mutualFundDeposit").on("blur", function () {
  $mutualFundDeposit = $("#mutualFundDeposit").val(); //store amount entered
  $mutualFundDeposit = Number($mutualFundDeposit); //convert from string to number
  if ($mutualFundDeposit > 0) {
    //don't display warning message
    $("#mutualFundWarn").text("");
  } else {
    //display warning message
    mfDepositWarn = "Deposit must be greater than $0";
    $("#mutualFundWarn").text(mfDepositWarn);
  }
});

//OPEN ACCOUNT BUTTON
$("#btnOpenMF").on("click", function () {
  //if validation checks pass
  if ($mutualFundDate && $mutualFundDeposit > 0) {
    $("#unopenedMutualFund").hide(); //hide unopened account info
    $("#openMutualFundAcct").show(); //show opened account info
    $btnCloseMF.show(); //show Close Account button

    //create initial transaction in table only if there are no transactions yet
    if (mutualFundTransactions.length === 0) {
      var openingMutualFundTransaction = {
        mfDate: $mutualFundDate,
        mfDescription: "Open Account",
        mfAmount: "$" + $mutualFundDeposit.toFixed(2), //2 decimal places
        mfBalance: "$" + $mutualFundDeposit.toFixed(2), //2 decimal places
      };
      mutualFundTransactions.push(openingMutualFundTransaction); //add opening transaction to array
      makeMutualFundRows(openingMutualFundTransaction); //add opening transaction row to the table
      startMFInterestTimer(); //call function to start interest payment timer
    }
  } else {
    var mfWarn = "Enter a valid deposit amount and date";
    $("#mutualFundWarn").text(mfWarn);
  }
});

// //------OPENED MUTUAL FUND ACCOUNT------

//SET DEFAULT INTEREST RATE: 0.06
var $mfInterestRate = 0.06; //source of truth available to everyone
$("#MutualFundInterestRate").val($mfInterestRate); //set textbox to initial interest rate when account is opened

//FUNCTION TO MAKE ROWS FOR TRANSACTION TABLE
function makeMutualFundRows() {
  $("#mutualFundTBody").empty(); //clear table body before adding rows to avoid duplicates
  mutualFundTransactions.forEach(function (transaction) {
    var $mutualFundRow = $("<tr></tr>"); //create new row
    //append td elements to new row that contains all information about the transaction
    $mutualFundRow.append($("<td></td>").text(transaction.mfDate));
    $mutualFundRow.append($("<td></td>").text(transaction.mfDescription));
    $mutualFundRow.append($("<td></td>").text(transaction.mfAmount));
    $mutualFundRow.append($("<td></td>").text(transaction.mfBalance));
    $("#mutualFundTBody").append($mutualFundRow);
  });
}

//FUNCTION TO START INTEREST PAYMENT TIMER
function startMFInterestTimer() {
  //calculate time until first interest payment (10 seconds)
  var timeUntilFirstMutualFundInterestPayment = 10 * 1000; //convert milliseconds to seconds
  //start timer
  clearInterval(mfTimer);
  mfTimer = setInterval(
    addMFInterestPayment,
    timeUntilFirstMutualFundInterestPayment
  );
  var timeUntilFirstMutualFundInterestPayment = 1 * 1000; //convert milliseconds to seconds
  clearInterval(mfTimer2);
  mfTimer2 = setInterval(() => {
    //increment seconds if less than 10 seconds
    if (mfElapsedTime < 10) {
      mfElapsedTime++;
      console.log(mfElapsedTime);
      //otherwise resest seconds back to 1
    } else {
      mfElapsedTime = 1;
      console.log(mfElapsedTime);
    }
  }, timeUntilFirstMutualFundInterestPayment);
}

//FUNCTION TO GET MOST RECENT DATE OF INTEREST PAYMENTS (OR OPEN ACCOUNT DATE)
function getMostRecentMFInterestDateOrOpenDate() {
  for (let i = mutualFundTransactions.length - 1; i >= 0; i--) {
    console.log(mutualFundTransactions[i].mfDescription);
    if (
      mutualFundTransactions[i].mfDescription ===
        "Interest Payment (" + $mfInterestRate + "%)" ||
      mutualFundTransactions[i].mfDescription === "Open Account"
    ) {
      console.log(mutualFundTransactions[i]);
      return mutualFundTransactions[i].mfDate;
    }
  }
}

//FUNCTION TO UPDATE TIMER INTERVAL
function updateMutualFundTimerInterval() {
  clearInterval(mfTimer);
  //set timer interval to trigger every 10 seconds
  mfTimer = setInterval(addMFInterestPayment, 10 * 1000);
}

//FUNCTION TO FORMAT DATE
function formatDate(date) {
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString().padStart(2, "0"); //2 digits (if 1 digit, add 0 first)
  var day = date.getDate().toString().padStart(2, "0"); //add 1 so January is 1, not 0 (2 digits, add a 0 in front of 1-digit months)
  return year + "-" + month + "-" + day;
}

//FUNCTION TO CALCULATE DAYS ELAPSED
function calculateMFDaysElapsed() {
  //calculate simulated date based on time elapsed since last interest payment
  var lastMFInterestPaymentOrOpenAccount =
    getMostRecentMFInterestDateOrOpenDate();
  var mfDaysElapsed = 365 * (mfElapsedTime / 10);
  console.log(mfDaysElapsed);
  var nextMFTransactionDate = new Date(lastMFInterestPaymentOrOpenAccount);
  nextMFTransactionDate.setDate(
    nextMFTransactionDate.getDate() + mfDaysElapsed
  );
  console.log(nextMFTransactionDate);
  return nextMFTransactionDate;
}

//FUNCTION TO TRIM $ OFF PREVIOUS TRANSACTION BALANCE
function trimCurrencyFrompreviousMFBalance() {
  var previousTransaction =
    mutualFundTransactions[mutualFundTransactions.length - 1];
  //remove $ symbol from previousTransaction.mfBalance
  var balanceWithoutSymbol = previousTransaction.mfBalance
    .replace("$", "")
    .trim();
  previousMFBalance = parseFloat(balanceWithoutSymbol);
  return previousMFBalance;
}

//FUNCTION TO GET INTEREST RATE
$("#MutualFundInterestRate").on("change", function () {
  if ($("#MutualFundInterestRate").val() > 0) {
    //update source of truth
    $mfInterestRate = $("#MutualFundInterestRate").val();
  } else {
    //update source of truth to default value
    $mfInterestRate = 0.06;
    $("#MutualFundInterestRate").val(0.06);
  }
});

//FUNCTION TO ADD NEW ROWS FOR INTEREST PAYMENTS
function addMFInterestPayment() {
  var lastInterestPaymentDate = new Date(
    getMostRecentMFInterestDateOrOpenDate()
  );
  //calculate next interest payment date (10 seconds [1 year] from last interest payment)
  var nextMFInterestPaymentDate = new Date(lastInterestPaymentDate);
  nextMFInterestPaymentDate.setFullYear(
    nextMFInterestPaymentDate.getFullYear() + 1
  );
  nextMFInterestPaymentDate.setDate(nextMFInterestPaymentDate.getDate() + 1); //add one day to make full year
  //calculate interest amount and new balance
  var previousMFBalance = trimCurrencyFrompreviousMFBalance();
  console.log($mfInterestRate);
  mfInterestAmount = previousMFBalance * $mfInterestRate;
  newMFBalance = mfInterestAmount + previousMFBalance;
  //create new interest payment transaction
  var mfInterestPaymentTransaction = {
    mfDate: formatDate(nextMFInterestPaymentDate),
    mfDescription: "Interest Payment (" + $mfInterestRate + "%)",
    mfAmount: "$" + mfInterestAmount.toFixed(2), //2 digits
    mfBalance: "$" + newMFBalance.toFixed(2), //2 digits
  };
  mutualFundTransactions.push(mfInterestPaymentTransaction); //add interest transaction to array
  makeMutualFundRows(); //update table with new row of interest payment transaction
  updateMutualFundTimerInterval(); //update timer interval
}

//MAKE DEPOSITS
$("#btnMutualFundDeposit").on("click", function () {
  $mfDepositAmount = $("#mutualFundDepositText").val(); //get deposit amount input
  $mfDepositAmount = Number($mfDepositAmount); //convert from string to number
  if ($mfDepositAmount > 0) {
    //don't display warning message
    $("#openedMutualFundWarn").text("");
    //calculate new balance for deposits
    var previousMFBalance = trimCurrencyFrompreviousMFBalance();
    newMFBalance = previousMFBalance + $mfDepositAmount;
    //calculate transaction date for deposits
    var mfDepositTransactionDate = calculateMFDaysElapsed();
    //create new deposit transaction
    var mfDepositTransaction = {
      mfDate: formatDate(mfDepositTransactionDate), //use formatted simulated date
      mfDescription: "Deposit",
      mfAmount: "$" + $mfDepositAmount.toFixed(2), //2 digits
      mfBalance: "$" + newMFBalance.toFixed(2), //2 digits
    };
    mutualFundTransactions.push(mfDepositTransaction); //add deposit transaction to array
    makeMutualFundRows(); //update table with new row of deposit transaction
    $mfDepositAmount = $("#mutualFundDepositText").val(""); //clear out deposit text box
  } else {
    //display warning message
    var mfDepositMsg = "Deposit must be greater than 0";
    $("#openedMutualFundWarn").text(mfDepositMsg);
  }
});

//MAKE WITHDRAWALS
$("#btnMutualFundWithdraw").on("click", function () {
  $mfWithdrawAmount = $("#mutualFundWithdrawText").val(); //get withdrawal amount
  $mfWithdrawAmount = Number($mfWithdrawAmount); //convert from string to number
  var previousMFBalance = trimCurrencyFrompreviousMFBalance(); //get most recent account balance
  if ($mfWithdrawAmount <= previousMFBalance && $mfWithdrawAmount !== 0) {
    //don't display warning message
    $("#openedMutualFundWarn").text("");
    //calculate new balance for withdrawals
    newMFBalance = previousMFBalance - $mfWithdrawAmount;
    //calculate transaction date for withdrawals
    var withdrawalTransactionDate = calculateMFDaysElapsed();
    //create withdrawal transaction
    var withdrawalTransaction = {
      mfDate: formatDate(withdrawalTransactionDate),
      mfDescription: "Withdrawal",
      mfAmount: "-$" + $mfWithdrawAmount.toFixed(2), //2 decimals
      mfBalance: "$" + newMFBalance.toFixed(2), //2 decimals
    };
    mutualFundTransactions.push(withdrawalTransaction); //add withdraw transaction to array
    makeMutualFundRows(); //update table with new row of withdraw transaction
    $mfWithdrawAmount = $("#mutualFundWithdrawText").val(""); //clear out withdraw text box
  } else {
    var mfWithdrawMsg =
      "Withdrawal must be less than current balance and greater than 0";
    //display warning message
    $("#openedMutualFundWarn").text(mfWithdrawMsg);
  }
});

//FUNCTION TO STOP INTEREST PAYMENT TIMER
function stopMFInterestTimer() {
  clearInterval(mfTimer);
  clearInterval(mfTimer2);
}

//CLOSE MUTUAL FUND ACCOUNT
$("#btnCloseMF").on("click", function () {
  //stop timer
  stopMFInterestTimer();
  //hide input controls
  $("#openMutualFundControls").hide();
  //calculate closed account withdrawal
  var previousMFBalance = trimCurrencyFrompreviousMFBalance();
  //calculate closed account date
  var closeMutualFundAccountTransactionDate = calculateMFDaysElapsed();
  //create final withdrawal transaction
  var closeMutualFundAccountTransaction = {
    mfDate: formatDate(closeMutualFundAccountTransactionDate),
    mfDescription: "Account Closed",
    mfAmount: "-$" + previousMFBalance.toFixed(2), //2 decimals
    mfBalance: "$0.00",
  };
  mutualFundTransactions.push(closeMutualFundAccountTransaction); //add withdraw transaction to array
  makeMutualFundRows(); //update table with new row of withdraw transaction
  //display account closed message
  var $mutualFundCloseMsg = $("#closeMutualFundMsg");
  var mutualFundClosedMsg = "Acccount closed";
  $mutualFundCloseMsg.text(mutualFundClosedMsg);
  $mutualFundCloseMsg.removeClass("hide");
  //hide Close Account button
  $btnCloseMF.hide();
  //make columns sortable
});
