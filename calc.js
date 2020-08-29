window.addEventListener('DOMContentLoaded', () => {
    const signs = [
        'C', 'MR', 'MC', 'M',
        '7', '8', '9', '/',
        '4', '5', '6', '*',
        '1', '2', '3', '-',
        '.', '0', 'CE', '+', '='
    ];
    const container = document.createElement('div');
    const result = document.createElement('output');

    container.classList.add('container');
    document.body.prepend(container);
    result.classList.add('output');
    container.append(result);
    const div = document.createElement('div');
    div.classList.add('signs');
    container.append(div);

    signs.forEach((element) => {
        const btn = document.createElement('button');
        btn.classList.add('button');
        btn.value = element;
        btn.innerHTML = element;
        div.insertAdjacentElement('beforeend', btn);
    });

    div.querySelector('button[value="C"]').classList.add('btnCancel');
    div.querySelector('button[value="="]').classList.add('btnEqual');
    div.querySelector('button[value="M"]').classList.add('btnMemory');

    function calculate(str) {
        const MULT = /\d+\.?\d*\*\d+\.?\d*/;
        const DIVID = /\d+\.?\d*\/\d+\.?\d*/;
        const ADD = /\d+\.?\d*\+\d+\.?\d*/;
        const MIN = /\d+\.?\d*\-\d+\.?\d*/;

        // Find multiplication
        while (str.match(MULT)) {
            str = str.replace(MULT, str.match(MULT)[0].split('*').reduce((a, b) => parseFloat(a) * parseFloat(b)));
        }

        // Find division
        while (str.match(DIVID)) {
            str = str.replace(DIVID, str.match(DIVID)[0].split('/').reduce((a, b) => parseFloat(a) / parseFloat(b)));
        }

        // Find substraction
        while (str.match(MIN)) {

            if (str.match(/\+\-|\-\+|\-\-/)) {
                str = str.replace(/\+\-|\-\+|\-\-/, '-');
            }

            if (str.match(/^\+\d/)) {
                str = str.replace(/^\+/, '');
            }

            if (str.match(/^\-\d+/)) {
                str = str.match(/[\-\+]\d+\.?\d{0,}/g).sort((a, b) => b - a).join('');
            }

            if (str.match(/^\-\d+/)) {
                str = str.match(/\-\d+\.?\d{0,}/g).reduce((a, b) => parseFloat(a) + parseFloat(b));
                return str;
            }

            str = str.replace(MIN, str.match(MIN)[0].split('-').reduce((a, b) => parseFloat(a) - parseFloat(b)));
        }

        if (str.match(/\+\-|\-\+|\-\-/)) {
            str = str.replace(/\+\-|\-\+|\-\-/, '-');
        }

        if (str.match(/^\+\d/)) {
            str = str.replace(/^\+/, '');
        }

        if (str.match(/^\-\d+/)) {
            str = str.match(/[\-\+]\d+\.?\d{0,}/g).sort((a, b) => b - a).join('');
        }

        // Find addition
        while (str.match(ADD)) {
            str = str.replace(ADD, str.match(ADD)[0].split('+').reduce((a, b) => parseFloat(a) + parseFloat(b)));
        }

        return str;
    }

    container.addEventListener('click', (event) => {
        const el = event.target;

        if (el.tagName != 'OUTPUT' && el.tagName != 'DIV') {

            if (el.value == 'C') {
                result.textContent = '';
                return;
            }

            if (el.value == 'CE') {
                result.textContent = result.textContent.slice(0, -1);
                return;
            }

            if (el.value == 'M') {
                sessionStorage.setItem('result', result.textContent);
                result.classList.add('memory');
                result.textContent = '';
                return;
            }

            if (el.value == 'MC') {
                sessionStorage.removeItem('result');
                result.classList.remove('memory');
                return;
            }

            if (el.value == 'MR') {
                result.textContent = sessionStorage.getItem('result');
                return;
            }

            if (el.value == '=') {
                result.textContent = calculate(result.textContent);
                return;
            }

            if (result.textContent.match(/[\*\/\-+]{2,}|^[\*\/]|[\*\/]{2,}$/)) {
                let oldValue = result.textContent;
                let newValue = 'Bad input';
                result.textContent = newValue;
                setTimeout(() => {
                    result.textContent = oldValue;
                }, 1500);
            }

            result.textContent += el.value;
        }
    });

    container.addEventListener('mousedown', (event) => {
        const el = event.target;
        if (el.tagName != 'OUTPUT' && el.tagName != 'DIV') {
            el.classList.add('clicked');
        }
    });

    container.addEventListener('mouseup', (event) => {
        const el = event.target;
        if (el.tagName != 'OUTPUT' && el.tagName != 'DIV') {
            el.classList.remove('clicked');
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key.match(/[0-9\/*\-+]/)) {
            result.textContent += event.key;
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key.match(/Backspace|Delete/)) {
            result.textContent = result.textContent.slice(0, -1);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key.match(/Enter/)) {
            result.textContent = calculate(result.textContent);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key.match(/F5/)) {
            sessionStorage.removeItem('result');
            result.classList.remove('memory');
        }
    });

    window.onbeforeunload = function () {
        sessionStorage.removeItem('result');
        result.classList.remove('memory');
    };
});



