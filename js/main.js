"use strict";
// getInterrestRateNew();
// Входные данные
var month_rate, // Месячная ставка
  commission, // Комимссия
  commission_rate, // Коммиссионная ставка
  advance, // Авансная сумма
  advance_rate, // Авансная ставка
  interest_rate, // Процентная ставка
  month_rate, // Кредитный период (в месяцах)
  year_rate, // Кредитный период (в годах)
  credit, // Кредитная сумма
  cost, // Стоимость товара
  error; // Ошибка о неправельных данных

$("form #car-payment").on("input", function () {
  setAdvance();
  setCredit();
  checkSum();
  checkAdvance();
  setInterrestRate();
  setMonthPay();
  setСommission();
});
$("form .aun-class ").on("click", function () {
  setAdvance();
  setCredit();
  checkSum();
  checkAdvance();
  checkAdvanceAun();
  setInterrestRate();
  setMonthPay();
  setСommission();
});
$("form #prepaid-expense").on("input", function () {
  checkAdvancePositiv();
  checkSum();
  checkAdvance();
  setInterrestRate();
  setMonthPay();
  setСommission();
});

$("form #month-rate").on("input", function () {
  checkMonth();
  setInterrestRate();
  setMonthPay();
  setСommission();
});

$("form #credit-type").on("change", function () {
  setMonthPay();
});

// button heandler
$("form button").click(function () {
  setInterrestRate();
  setMonthPay();
  setСommission();
});

// Start execute
setMonthPay();
setСommission();

function setInterrestRate() {
  // Проверка на наличие ошибки
  error = $("form .error").text();

  if (error != "") {
    return false;
  }
  let interest_rate = getInterrestRateNew() * 100;

  interest_rate = roundPlus(interest_rate, 2);
  interest_rate = interest_rate + "%";

  $(".stavka span").html(interest_rate);
}

function setCredit() {
  advance = +$("#prepaid-expense").val().replace(/\s+/g, "");
  credit = +$("#car-payment").val().replace(/\s+/g, "") - advance;
  credit = Math.round(credit);
  var format = String(credit).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
  $("#credit-sum").val(format);
  // return 0
}

function checkAdvance() {
  if (document.getElementById("prepaid-expense").value !== "") {
    advance = +$("#prepaid-expense").val().replace(/\s+/g, "");
    credit = +$("#car-payment").val().replace(/\s+/g, "");

    // credit = (credit / 100) * 30;
    // 0.30 - 30%
    credit = credit * 0.3;

    // 1000 ⋅ 20 : 100 = 1000 ⋅ 0,20 = 200
    if (advance < credit) {
      $("form .error").text(
        "Мінімальна сума авансу має бути 30% від суми кредиту"
      );
    }
    // if (document.getElementById('#prepaid-expense').value !== ''){
    //   $("form .error").text("Мінімальна сума авансу становить 30% від суми кредиту");
    //
    // }
  }
}

function checkAdvanceAun() {
  advance = +$(".aun-class").val();
}

function setAdvance() {
  advance = +$("#prepaid-expense").val().replace(/\s+/g, "");
  cost = +$("#car-payment").val().replace(/\s+/g, "");

  if (advance < cost) {
    return 0;
  } else {
    advance = (cost / 100) * 10;
    advance = Math.round(advance);
    $("#prepaid-expense").val(advance);
  }
}

function checkAdvancePositiv() {
  advance = +$("#prepaid-expense").val().replace(/\s+/g, "");
  cost = +$("#car-payment").val().replace(/\s+/g, "");

  if (advance >= cost) {
    $("form .error").text(
      "Cума авансу повинна бути менша за вартість квартири"
    );
  } else {
    $("form .error").text("");
  }

  setCredit();
}

function checkMonth() {
  var month = $("#month-rate").val();

  if (month > 240) {
    $("form .error").text("Максимальний кредитний термін становить 240 місяці");
  } else if (month <= 1) {
    $("form .error").text("Кредитний термін повинен бути більший за 1 місяць");
  } else {
    $("form .error").text("");
  }
}

function checkSum() {
  credit = +$("#credit-sum").val().replace(/\s+/g, "");
  cost = +$("#car-payment").val().replace(/\s+/g, "");
  advance = +$("#prepaid-expense").val().replace(/\s+/g, "");

  // Проверка на максимальную суму кредита
  if ($("form .error").text() != "") {
    return 0;
  } else if (credit > 1500000) {
    $("form .error").html(
      "Сума кредиту більша за 1 500 000 грн,</br> погоджується в індивідуальному порядку!"
    );
  } else if (cost <= 0) {
    $("form .error").html("Вартість квартири повинна бути більша за 0 грн.");
  } else {
    $("form .error").text("");
  }
}

// function getClassicMonthPay() {
//   interest_rate = getInterrestRate();

//   // if (interest_rate == 0.0001) {
//   //   let month_pay = getClassicMonthPay();
//   //   return month_pay;
//   // }

//   cost = +$("#car-payment")
//     .val()
//     .replace(/\s+/g, "");
//   advance = +$("#prepaid-expense")
//     .val()
//     .replace(/\s+/g, "");
//   credit = +$("#car-payment")
//     .val()
//     .replace(/\s+/g, "") - advance;
//   month_rate = +$("#month-rate").val();

//   let max_pay = (credit * interest_rate) / 12 + (credit / month_rate);
//   let min_pay = ((credit / month_rate) * interest_rate) / 12 + (credit / month_rate);

//   let month_pay = (max_pay + min_pay) / 2;

//   max_pay = Math.round(max_pay) + 'грн.';
//   min_pay = Math.round(min_pay) + 'грн.';

//   $("#min-pay").html(min_pay);
//   $("#max-pay").html(max_pay);

//   return month_pay;
// }

function getAnnuityMonthPay() {
  interest_rate = getInterrestRate();
  advance = +$("#prepaid-expense").val().replace(/\s+/g, "");
  credit = +$("#car-payment").val().replace(/\s+/g, "") - advance;
  month_rate = +$("#month-rate").val();
  let base = 1 + interest_rate / 12;
  let exp = month_rate;
  let pow = Math.pow(base, exp);

  let annuity_rate = ((interest_rate / 12) * pow) / (pow - 1);

  let month_pay = annuity_rate * credit;

  let pay = Math.round(month_pay) + " грн.";

  $("#min-pay").html(pay);
  $("#max-pay").html(pay);

  return month_pay;
}

// Подсчет платежа по Аннуитету
function setMonthPay() {
  let credit_type = $("#credit-type").val();

  // Проверка на наличие ошибки
  error = $("form .error").text();

  if (error != "") {
    return false;
  }

  // console.log("NEW");
  // Подсчет платежа

  // Проверка типа кредита
  // if (credit_type === 'Ануїтет') {
  //   var month_pay = getAnnuityMonthPay();
  // } else {
  //   var month_pay = getClassicMonthPay();
  // }

  var month_pay = getInterrestRateNew();
  let month_pay_percentage = month_pay / (150000 / 100) / 100;
  var formatMonth_pay = String(month_pay).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');



  $(".circle-1").circleProgress({
    value: month_pay_percentage,
  });

  $(".circle-1").on("circle-animation-progress", function (event, progress) {
    $(this)
      .find("span.number")
      .html(formatMonth_pay  + "</br><i>грн.</i>");
  });

  var twoYearCredit = getYourSecondYear();
  var twoYearCreditRound = Math.round(twoYearCredit);
  var formatTwoYearCredit = String(twoYearCreditRound).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');


  $(".circle-3").circleProgress({
    value: month_pay_percentage,
  });

  $(".circle-3").on("circle-animation-progress", function (event, progress) {
    $(this)
        .find("span.number")
        .html(formatTwoYearCredit  + "</br><i>грн.</i>");
  });

  var month_rate3 = +$("#month-rate").val();


  if(month_rate3 >= 13  ){
    $(".cir3").css("display",  "block");
    $(".percent-block.pc").css("height",  "1050px");
  } else removeCir3();

}


function removeCir3() {
  $(".cir3").css("display",  "none");
  $(".percent-block.pc").css("height",  "750px");
  console.log('removeCir3')

}

function setСommission() {
  error = $("form .error").text();

  if (error != "") {
    return false;
  }

  advance = +$("#prepaid-expense").val().replace(/\s+/g, "");
  credit = +$("#car-payment").val().replace(/\s+/g, "") - advance;

  // Устанавливаем значение комиссии в зависимости от длительности кредита
  // if (month_rate > 1 && month_rate <= 12 && advance_rate < 50) {
  //
  //   commission_rate = 0.0229;
  // } else if (month_rate > 1 && month_rate <= 12 && advance_rate >= 50) {
  //
  //     commission_rate = 0.0269;
  // } else if (month_rate > 13 && month_rate <= 24 && advance_rate < 50) {
  //
  //   commission_rate = 0.0159;
  // } else if (month_rate > 13 && month_rate <= 24 && advance_rate >= 50 ) {
  //
  //     commission_rate = 0.0279;
  // }else if (month_rate > 25 && month_rate <= 36) {
  //
  //   commission_rate = 0.0099;
  // } else if (month_rate > 37 && month_rate <= 84) {
  //
  //   commission_rate = 0;
  // } else {
  //   $("form .error").text("Термін кредитування становить від 1-го до 240 місяці! ");
  // }
  // фиксированную сумма к комиссии всегда
  //   var fixedSumma = Number("750");
  // commission = (credit * commission_rate) + fixedSumma;
  // let commission_percentage = commission / (45500 / 100) / 100;
  // var commission_percentage = 11111111;
  // var commission = 22;
  // var progress = 2;

  let creditSumma2 = +$("#credit-sum").val().replace(/\s+/g, "");
  // Переказ/видача коштів з поточного рахунку споживача за тарифним планом "Приватний", % від суми переказу (суми кредиту)
  var privateCost = creditSumma2 * (0.99 / 100);

  // Відкриття поточного рахунку, грн.
  var commission2 = 100 + privateCost;
  if (commission2 >= 400) {
    commission2 = 400;
  }


  var creditSumma099 = creditSumma2 * (0.99 / 100);
  var creditSumma07 = creditSumma2 * (0.7 / 100);

  var trr = 0.99 / 100;
  // var bankVutratu = creditSumma2 * (0.99 / 100) + creditSumma2 * (0.7 / 100) + 100;
  var bankVutratu = creditSumma2 * (0.99 / 100) + 100;
  // var bankVutratu = 100;
  var RoundBankVutratu = Math.round(bankVutratu);

  var formatBankVutratu = String(RoundBankVutratu).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');

  $(".circle-2").circleProgress({
    value: 1,
  });

  $(".circle-2").on("circle-animation-progress", function (event, progress) {
    $(this)
      .find("span.number")
      .html(formatBankVutratu  + "</br><i>грн.</i>");
  });
}


function getInterrestRateNew() {
  var select = $(".aun-class").val();
  // if (select === "1") {

    //загальна сумма кредиту
    var creditSumma = +$("#credit-sum").val().replace(/\s+/g, "");

    // загальний термін кредитування
    var month_rate2 = +$("#month-rate").val();

    var fixedPercent88 = 8.8 / 100;
    var countMonth = Number(12);

    var summCredit = creditSumma / month_rate2;

    var persetStavkaTopDrob =  creditSumma * fixedPercent88;
    var persetStavkaBottomDrob =  persetStavkaTopDrob / countMonth;

    var bodyPersentStavka = summCredit + persetStavkaBottomDrob;
    var bodyPersentStavkaRound = Math.round(bodyPersentStavka);

    var myP = document.getElementById("clasic");
    var myP2 = document.getElementById("clasic2");

    // myP.innerHTML = "на перший рік кредитування";
    // myP2.innerHTML = "на перший рік кредитування";



  // }

  // if (select === "2") {
  //
  //
  //
  // }
  // if (select == 1) {
  //   return bodyPersentStavka;
  // } else return grece;

  return bodyPersentStavkaRound;

}

// Ваш місячний платіж з другого року
function getYourSecondYear() {
  var creditSumma2 = +$("#credit-sum").val().replace(/\s+/g, "");

  var month_rate3 = +$("#month-rate").val();

  var fixedPercent882 = 8.8 / 100;
  var countMonth2 = Number(12);


  var summCredit2 = creditSumma2 / month_rate3;
  var persetStavkaTopDrob2 =  creditSumma2 * fixedPercent882;

  var persetStavkaBottomDrob2 =  persetStavkaTopDrob2 / countMonth2;
  var bodyPersentStavka2 = summCredit2 + persetStavkaBottomDrob2;

  var summYear = bodyPersentStavka2 * 12;
  // 1) залишок по кредиту
  var summCreditYearDrob = (creditSumma2/month_rate3) * 12;
  var summCreditYear = creditSumma2 - summCreditYearDrob;

  // можна знайти тут!
  // https://bank.gov.ua/statistic/sector-financial/data-sector-financial
  // -> А потом выбрать: Український індекс ставок за депозитами фізичних осіб - UIRD (за даними агентства "Thomson Reuters")
  // обрати останній день попереднього місяця за 12 місяців
  // cьогодні 03.11.2020 отже я беру 30.10.2020 значення 8.60% в процентах

  var uird12m = 8.60 / 100;

  // платіж по тілу
  var paymentBody = uird12m + (5 / 100);

  // платіж по процентах (залишок заборгованості * платіж по тілу)
  var debtBalance = (summCreditYear * paymentBody)/12;

  // var grece =  paymentBody + debtBalance + summCredit2;
  var grece =  debtBalance + summCredit2;

  var myP = document.getElementById("clasic");
  var myP2 = document.getElementById("clasic2");

  // myP.innerHTML = "на другий рік кредитування ";
  // myP2.innerHTML = "на другий рік кредитування ";

  return grece;
}


function getInterrestRate() {
  // Матрица подсчетов
  // let matrix = {
  //   '1-12 месяцев': {
  //     'Аванс 10%': 0.0539,
  //     'Аванс 20%': 0.0479,
  //     'Аванс 30%': 0.0379,
  //     'Аванс 40%': 0.0249,
  //     'Аванс 50%': 0.0001,
  //     'Аванс 60%': 0.0001,
  //   },
  //   '13-24 месяцев': {
  //     'Аванс 10%': 0.0859,
  //     'Аванс 20%': 0.0769,
  //     'Аванс 30%': 0.0699,
  //     'Аванс 40%': 0.0569,
  //     'Аванс 50%': 0.0399,
  //     'Аванс 60%': 0.0001,
  //   },
  //   '25-36 месяцев': {
  //     'Аванс 10%': 0.0989,
  //     'Аванс 20%': 0.0909,
  //     'Аванс 30%': 0.0829,
  //     'Аванс 40%': 0.0719,
  //     'Аванс 50%': 0.0549,
  //     'Аванс 60%': 0.0309,
  //   },
  //   '37-48 месяцев': {
  //     'Аванс 10%': 0.1099,
  //     'Аванс 20%': 0.1029,
  //     'Аванс 30%': 0.0959,
  //     'Аванс 40%': 0.0849,
  //     'Аванс 50%': 0.0699,
  //     'Аванс 60%': 0.0479,
  //   },
  //   '49-60 месяцев': {
  //     'Аванс 10%': 0.1129,
  //     'Аванс 20%': 0.1069,
  //     'Аванс 30%': 0.0989,
  //     'Аванс 40%': 0.0889,
  //     'Аванс 50%': 0.0739,
  //     'Аванс 60%': 0.0539,
  //
  //   },
  //   '61-72 месяцев': {
  //     'Аванс 10%': 0.1149,
  //     'Аванс 20%': 0.1089,
  //     'Аванс 30%': 0.1029,
  //     'Аванс 40%': 0.0929,
  //     'Аванс 50%': 0.0799,
  //     'Аванс 60%': 0.0599,
  //   },
  //   '73-84 месяцев': {
  //     'Аванс 10%': 0.1179,
  //     'Аванс 20%': 0.1129,
  //     'Аванс 30%': 0.1059,
  //     'Аванс 40%': 0.0959,
  //     'Аванс 50%': 0.0839,
  //     'Аванс 60%': 0.0639,
  //   },
  // };

  // Получим нужные поля
  // month_rate = +$("#month-rate").val();
  // advance = +$("#prepaid-expense")
  //   .val()
  //   .replace(/\s+/g, "");
  // cost = +$("#car-payment")
  //   .val()
  //   .replace(/\s+/g, "");
  // advance_rate = advance / (cost / 100);
  //
  //
  // let matrix_param_1;
  // let matrix_param_2;

  // Установим первый параметр матрици
  // if (month_rate > 1 && month_rate <= 12) {
  //   matrix_param_1 = '1-12 месяцев';
  // } else if (month_rate >= 13 && month_rate <= 24) {
  //   matrix_param_1 = '13-24 месяцев';
  // } else if (month_rate >= 25 && month_rate <= 36) {
  //   matrix_param_1 = '25-36 месяцев';
  // } else if (month_rate >= 37 && month_rate <= 48) {
  //   matrix_param_1 = '37-48 месяцев';
  // } else if (month_rate >= 49 && month_rate <= 60) {
  //   matrix_param_1 = '49-60 месяцев';
  // } else if (month_rate >= 61 && month_rate <= 72) {
  //   matrix_param_1 = '61-72 месяцев';
  // } else if (month_rate >= 73 && month_rate <= 84) {
  //   matrix_param_1 = '73-84 месяцев';
  // }

  // Установим второй параметр матрици
  // if (advance_rate >= 60) {
  //   matrix_param_2 = 'Аванс 60%';
  // } else if (advance_rate >= 50) {
  //   matrix_param_2 = 'Аванс 50%';
  // } else if (advance_rate >= 40) {
  //   matrix_param_2 = 'Аванс 40%';
  // } else if (advance_rate >= 30) {
  //   matrix_param_2 = 'Аванс 30%';
  // } else if (advance_rate >= 20) {
  //   matrix_param_2 = 'Аванс 20%';
  // } else if (advance_rate >= 10) {
  //   matrix_param_2 = 'Аванс 10%';
  // }

  // Получим процентную ставку
  // interest_rate = matrix[matrix_param_1][matrix_param_2];

  return interest_rate;
}

// Отправка формы
var contactFormEl = $(".contact-form");
var contactFormStatusEl = contactFormEl.find(".contacts-form__status-message");
var emailInputEl = contactFormEl.find("[name = email]");
var phoneInputEl = contactFormEl.find("[name = phone]");
var validatedFields = { email: true, phone: true };
var mandatoryFields = ["name", "phone"];

contactFormEl.submit(function (e) {
  e.preventDefault();
  var inputsFilled = mandatoryInputsFilled();
  if (inputsFilled && !contactFormHasError()) {
    $.post("mail.php", {
      name: contactFormEl.find("[name = name]").val(),
      email: contactFormEl.find("[name = email]").val(),
      tel: contactFormEl.find("[name = phone]").val(),
      message: contactFormEl.find("[name = comments]").val(),
    })
      .done(function () {
        contactFormStatusEl.text(
          "Дякуємо за заявку. Ми зв'яжемося з Вами найближчим часом."
        );
        contactFormStatusEl.css("display", "block");
        contactFormStatusEl.css("color", "#7aba41");
      })
      .fail(function () {
        contactFormStatusEl.text("Виникла помилка, спробуйте пізніше");
        contactFormStatusEl.css("display", "block");
        contactFormStatusEl.css("color", "red");
      })
      .always(function () {
        contactFormEl.find("input").each(function () {
          $(this).val("");
        });
      });
  } else if (!inputsFilled) {
    contactFormStatusEl.text("Обов'язкові поля мають бути заповнені");
    contactFormStatusEl.css("display", "block");
    contactFormStatusEl.css("color", "red");
  } else {
    contactFormStatusEl.css("display", "none");
  }
});

emailInputEl.on("input", function () {
  var inputIsValid = validateContactFormInput(
    emailInputEl.val(),
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  handleInputChange(emailInputEl, inputIsValid);
});

phoneInputEl.on("input", function () {
  var inputIsValid = validatePhone(phoneInputEl.val());
  handleInputChange(phoneInputEl, inputIsValid);
});

function handleInputChange(el, isValid) {
  var inputType = el.attr("name");
  if (isValid || el.val() === "") {
    validatedFields[inputType] = true;
    el.next().css("display", "none");
  } else {
    validatedFields[inputType] = false;
    el.next().css("display", "block");
  }
  if (mandatoryInputsFilled()) contactFormStatusEl.css("display", "none");
}

// Проверка полей

function contactFormHasError() {
  return Object.values(validatedFields).includes(false);
}

function validateContactFormInput(val, regex) {
  return regex.test(val);
}

function validatePhone(telNumber) {
  return (
    (telNumber.match("^\\+[\\(\\-]?(\\d[\\(\\)\\-]?){11}\\d$") ||
      telNumber.match("^\\(?(\\d[\\-\\(\\)]?){9}\\d$")) &&
    telNumber.match("[\\+]?\\d*(\\(\\d{3}\\))?\\d*\\-?\\d*\\-?\\d*\\d$")
  );
}

function checkContactFormInputs() {
  return (
    validateContactFormInput(
      emailInputEl.val(),
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) && validatePhone(phoneInputEl.val())
  );
}

function mandatoryInputsFilled() {
  var result = true;
  mandatoryFields.forEach((inputType) => {
    if (contactFormEl.find(`input[name=${inputType}]`).val() === "")
      result = false;
  });
  return result;
}

function checkCurr(d) {
  if (window.event) {
    if (event.keyCode == 37 || event.keyCode == 39) return;
  }
  // d.value = d.value.replace(/\D/g, "");
  d.value = d.value.replace(/\D/g, "");
  console.log(d.value)
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
    return false;
  return true;
}

// Функция для округления знаков после запятой

function roundPlus(x, n) {
  //x - число, n - количество знаков
  if (isNaN(x) || isNaN(n)) return false;
  var m = Math.pow(10, n);
  return Math.round(x * m) / m;
}

function triadVartist() {
  credit = +$("#car-payment").val().replace(/\s+/g, "") ;
  var format = String(credit).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');

  $("#car-payment").val(format);
}

function triadAvans() {
  var credit2 = +$("#prepaid-expense").val().replace(/\s+/g, "") ;
  var format2 = String(credit2).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');

  $("#prepaid-expense").val(format2);
}



// document.getElementById('car-payment').addEventListener('input', e => {
//   document.getElementById('result').textContent = e.currentTarget.value.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g,'$1 ');
// });
//
// document.getElementById('prepaid-expense').addEventListener('input', e => {
//   document.getElementById('result-avans').textContent = e.currentTarget.value.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g,'$1 ');
// });

// function green() {
//   console.log("111");
//   var green = 12;
//   var month = [
//     'june', 'july', 'april'
//   ];
//   console.log(month.indexOf( 'june' ));
//   if(green){}
// }
// green();

// счетчик
var number = document.querySelector('.number12'),
    numberTop = number.getBoundingClientRect().top,
    start = +number.innerHTML, end = +number.dataset.max;

window.addEventListener('scroll', function onScroll() {
  if(window.pageYOffset > numberTop - window.innerHeight / 1.1) {
    this.removeEventListener('scroll', onScroll);
    var interval = setInterval(function() {
      number.innerHTML = ++start;
      if(start == end) {
        clearInterval(interval);
      }
    }, 200);
  }
});
var number1 = document.querySelector('.number13'),
    numberTop1 = number1.getBoundingClientRect().top,
    start1 = +number1.innerHTML, end1 = +number1.dataset.max;

window.addEventListener('scroll', function onScroll() {
  if(window.pageYOffset > numberTop1 - window.innerHeight / 1.1) {
    this.removeEventListener('scroll', onScroll);
    var interval1 = setInterval(function() {
      number1.innerHTML = ++start1;
      if(start1 == end1) {
        clearInterval(interval1);
      }
    }, 200);
  }
});
var number2 = document.querySelector('.number14'),
    numberTop2 = number2.getBoundingClientRect().top,
    start2 = +number2.innerHTML, end2 = +number2.dataset.max;

window.addEventListener('scroll', function onScroll() {
  if(window.pageYOffset > numberTop2 - window.innerHeight / 1.1) {
    this.removeEventListener('scroll', onScroll);
    var interval2 = setInterval(function() {
      number2.innerHTML = ++start2;
      if(start2 == end2) {
        clearInterval(interval2);
      }
    }, 200);
  }
});
var number3 = document.querySelector('.number15'),
    numberTop3 = number3.getBoundingClientRect().top,
    start3 = +number3.innerHTML, end3 = +number3.dataset.max;

window.addEventListener('scroll', function onScroll() {
  if(window.pageYOffset > numberTop3 - window.innerHeight / 1.1) {
    this.removeEventListener('scroll', onScroll);
    var interval3 = setInterval(function() {
      number3.innerHTML = ++start3;
      if(start3 == end3) {
        clearInterval(interval3);
      }
    }, 200);
  }
});
//  end счетчик


//
// var block1 = document.querySelector('.text-icon-title');
//
// block1.addEventListener('mouseenter', function () {
//   $(".icons-container__description").fadeIn();
// });
// block1.addEventListener('mouseleave', function () {
//   $(".icons-container__description").fadeOut()
// });
//
// var block2 = document.querySelector('.text-icon-title1');
//
// block2.addEventListener('mouseenter', function () {
//   $(".icons-container__description1").fadeIn();
// });
// block2.addEventListener('mouseleave', function () {
//   $(".icons-container__description1").fadeOut()
// });