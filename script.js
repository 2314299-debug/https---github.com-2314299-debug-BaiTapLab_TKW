const display = document.getElementById('display');
const keys = document.querySelector('.calculator-keys');

const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

function updateDisplay() {
    let displayString = String(calculator.displayValue);
    if (displayString.includes('Infinity')) {
        display.textContent = 'Lỗi: Vô cực';
    } else if (displayString === 'NaN') {
        display.textContent = 'Lỗi: Không phải số';
    } else {
        display.textContent = displayString.length > 18
            ? parseFloat(displayString).toPrecision(15)
            : displayString;
    }
}

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;
    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    updateDisplay();
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        updateDisplay();
        return;
    }
    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
    updateDisplay();
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);
    if (!Number.isFinite(inputValue)) {
        calculator.displayValue = 'Lỗi phép toán';
        updateDisplay();
        return;
    }

    if (firstOperand === null) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);
        calculator.displayValue = String(result);
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
    updateDisplay();
}

const performCalculation = {
    '/': (a, b) => a / b,
    '*': (a, b) => a * b,
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '^': (a, b) => a ** b,
    '%': (a, b) => a % b,
};

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    updateDisplay();
}

keys.addEventListener('click', (event) => {
    const { target } = event;
    const action = target.dataset.action;
    const value = target.dataset.value;

    if (!target.matches('button')) return;

    if (value !== undefined) {
        inputDigit(value);
        return;
    }

    if (action === 'decimal') {
        inputDecimal('.');
        return;
    }

    if (action === 'clear') {
        resetCalculator();
        return;
    }

    if (action === 'calculate') {
        handleOperator(calculator.operator);
        calculator.waitingForSecondOperand = true;
        calculator.operator = null;
        return;
    }

    if (action) {
        handleOperator(action);
    }
});

updateDisplay();

