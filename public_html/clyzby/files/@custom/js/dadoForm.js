// initialize the materialize select elements
let selectInstance;
$(document).ready(function () {
  let elems = $('#drink-dropdown');
  selectInstance = M.FormSelect.init(elems, {});
});


let d = new Date();
let n = d.getDay();
let h = d.getHours();
let daysOpen = [1, 2, 3, 4, 5]; // mon - fri
let hoursOpen = [11, 15];       // 11am - 3pm

let closedEnabled = true;

if (closedEnabled) {
  if (!daysOpen.includes(n) || h < hoursOpen[0] || h > hoursOpen[1]) {
    let closedMsg = '';

    if (!daysOpen.includes(n)) {
      closedMsg = "We are closed for the weekend.";
    } else if (h < hoursOpen[0]) {
      closedMsg = "We are not open yet.";
    } else if (h > hoursOpen[1]) {
      closedMsg = "We are closed for the day.";
    }

    // disable all form fields so they can't order if we are closed
    $("form#dado-lunch-order-form input, form#dado-lunch-order-form button").each(function () {
      this.disabled = true;
    });

    // show that we are closed

    $("form#dado-lunch-order-form button").html("Closed");
    $(".closed").removeClass("hide");
    $("#closed-message").html(closedMsg);
    $("fieldset").each(function () {
      $(this).addClass("closed-color");
    });
  }
}

// add up the price
$("form#dado-lunch-order-form input, #drink-dropdown").change(function (e) {
  updateTotal(e);
});


// loop through the specials and disable them for each of the days that they are not available
let specials = $(".daily-special");
specials.each(function () {
  let dayOfWeek = Number(this.getAttribute("data-day-num"));
  if (n !== dayOfWeek) {
    let availabilityEl = $($(this).find(".availability ")[0]);
    availabilityEl.removeClass("hide");

    let inputs = $(this).find("input");
    inputs.each(function () {
      this.disabled = true;
    });
  }
});


// open up the restaurant against our will
$("#dado-opener").click(function () {

  // todo figure out why we can disable the material select, but not re-enable it
  $("form#dado-lunch-order-form input, form#dado-lunch-order-form button").each(function () {
    this.disabled = false;
  });

  $(".availability").each(function () {
    $(this).addClass("hide");
  });

  $("form#dado-lunch-order-form button").html("Place Order");
  $(".closed").addClass("hide");

  $("fieldset").each(function () {
    $(this).removeClass("closed-color");
  })
});


function updateTotal(e) {
  let input = $("form#dado-lunch-order-form input");
  let total = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i].checked) {
      total += parseFloat(input[i].getAttribute('data-price'));
    }
  }

  let selectVal
  if (e.target === $("select#drink-dropdown")[0]) {
    selectVal = e.target.value;
  } else {
    selectVal = selectInstance[0].input.value;
  }
  if (selectVal === "Bubble Tea") {
    total += 1.50;
  }

  let subtotal = total;
  let mealTax = .0625;
  let tax = subtotal * mealTax;

  total += tax;

  console.log(total);
  $("#form-cart-total").val(total.toFixed(2));
  $("#cart-total").html(total.toFixed(2));

  $("#form-cart-subtotal").val(subtotal.toFixed(2));
  $("#cart-subtotal").html(subtotal.toFixed(2));

  $("#form-cart-tax").val(tax.toFixed(2));
  $("#cart-tax").html(tax.toFixed(2));
}