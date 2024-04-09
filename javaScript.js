let val;
let numbers;
let symbols;
let key;
let impKey;
let len;
const sym = /[\+\-\*\/\(\)\^\%]/;
const preVal = /[\+\-\*\/\(\)\^\%\.]/;
const num = /^[0-9]*$/;
const regex = /^[0-9+\-*^/().%]*$/;

// key press function
const keypress = (k, event = undefined) => {
  const input = document.getElementById("en");
  len = input.value.length;
  key = k;

  impKey = !["Enter", "Backspace", "ArrowLeft", "ArrowRight"].includes(key);
  if (
    ((!regex.test(key) || len > 18) && impKey) ||
    (input.value[input.selectionStart - 1] === "/" && key === "0") ||
    (len === 0 && /[\+\*\/\)\^\.\%]/.test(key)) ||
    (input.value[input.selectionStart - 1]?.match(preVal) &&
      key.match(preVal)) ||
    (input.value.length > 2 &&
      numbers?.length > 0 &&
      numbers[numbers?.length - 1]?.slice("").includes(".") &&
      key === ".")
  ) {
    event?.preventDefault();
  } else {
    if (event === undefined && key != "Enter") {
      input.value += key;

      len = input.value.length;
    }
    val = input.value;
    numbers = val.split(sym).filter((n) => Number(n));
    symbols = val.split("").filter((x) => x.match(sym));

    if (key === "Enter") {
      res();
    }
  }
};

// del
const del = () => {
  const input = document.getElementById("en");
  const start = input.selectionStart;
  const end = input.selectionEnd;

  if (start === 0 && end === 0 && len > 0) {
    input.value = input.value.slice(0, len - 1);
    len = input.value.length;
    return;
  }
  input.value = input.value.slice(0, start - 1) + input.value.slice(end);
  input.selectionStart = input.selectionEnd = start - 1;
  len = input.value.length;
};

// clear function
const clr = () => {
  const input = document.getElementById("en");
  input.value = "";
  len = 0;
  numbers = [];
  symbols = [];
};

// result function
const res = () => {
  const input = document.getElementById("en");
  const operations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
    "%": (a, b) => a % b,
    "^": (a, b) => a ** b,
  };

  val[0] === "-" ? ((numbers[0] = "-" + numbers[0]), symbols) : "";
  /[\+\*\^\(\-]/.test(val[len - 1]) && symbols.pop();

  const check = symbols.includes("/");

  
  let n = [];
  const pir = ["/", "*"];
  if (val.length > 4 && !(symbols[0] === "/" && val.length === 5)) {
    for (let i = 0; i < pir.length; i++) {
      for (let x = 0; x < symbols.length; x++) {
        if (symbols[x] === pir[i]) {
          if (x + 2 <= numbers.length) {
            n = numbers?.slice(x, x + 2);
            numbers = [
              ...numbers.slice(0, x),
              operations[pir[i]](n[0], n[1]),
              ...numbers.slice(x + 2),
            ];
            symbols = [...symbols.slice(0, x), ...symbols.slice(x + 1)];
            x -= 1;
          }
        }
      }
    }
  }

    val[0] === "-" && symbols.shift();
    let result = Number(numbers[0]);
  if (numbers.length >= 2 && symbols.length >= 1) {
    for (let i = 0; i < symbols.length; i++) {
      result = operations[symbols[i]](result, Number(numbers[i + 1]));
    }
  }
    input.value = check ? result.toFixed(4) : result.toFixed(2);
    numbers = [check ? result.toFixed(4) : result.toFixed(2)];
    symbols = [];
};

// key press event
document.addEventListener("keydown", function (event) {
  keypress(event.key, event);
});
