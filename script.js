export function validate(form = document.querySelector('form')){

    const formElements = form.querySelectorAll(':required');
    const submit = form.querySelector('[type="submit"]');

    /* Selects event*/

    $('.form-group__select select').on('select2:close', function()
    {
        checkValidation({el: this});
    });

    /* Events */

    if (submit) {
        submit.addEventListener('click', function (e) {
            if (submit.classList.contains('disabled')) {
                e.preventDefault();
                checkValidation();
                getFirstError().scrollIntoView({behavior: 'smooth'});
            }
        });
    }

    if (form) {
        form.addEventListener('focus', focusEvent, true);
        form.addEventListener('blur', blurEvent, true);
    }

    function focusEvent({target}) {
        if (!isInput(target)) {
            return;
        }

        if (target.closest('[data-field]').classList.contains('errorBlock')) {
            removeError(target);
        }
    }

    function blurEvent({target}) {
        if (!isInput(target)) {
            return;
        }
        return checkValidation({el: target});
    }

    /* Submit */

    function submitDisabled() {
        submit.classList.add('disabled');
    }

    function submitUnDisabled() {
        submit.classList.remove('disabled');
    }

    /* Validation */

    function checkValidation(settings = {}) {
        const el = settings.el ? [settings.el] : formElements;

        el.forEach(item => {
            if (item.validationMessage != '' && item.disabled != true) {
                createError(item);
            } else removeError(item);
        });
    }

    /* Error actions */

    function createError(input) {

        input.closest('[data-field]').classList.add('errorBlock');

        const errorMessage = getErrorMessage(input);

        if (!errorMessage || !errorMessage.classList.contains('errorMessage')) {
            let error = document.createElement('div');
            error.textContent = input.validationMessage;
            error.classList.add('errorMessage');
            input.closest('[data-field]').append(error);
        }
    }

    function removeError(input) {

        const errorMessage = getErrorMessage(input);

        if (errorMessage && errorMessage.classList.contains('errorMessage')) {
            //this.input.classList.remove('errorInput');
            input.closest('[data-field]').classList.remove('errorBlock');
            getErrorMessage(input).remove();
        }
        if (checkErrors()) submitUnDisabled();
    }

    /* Others */

    function isInput(target) {
        return target.tagName === 'INPUT' || target.tagName === 'SELECT' ? target : void 0;
    }

    function getErrorMessage(el) {
        const parentBlock = el.closest('[data-field]');
        return parentBlock.querySelector('.errorMessage');
    }

    function checkErrors() {
        let res = true;
        formElements.forEach(item => {
            if (item.validationMessage != '' && item.disabled != true) res = false;
        });
        return res;
    }

    function getFirstError() {
        return form.querySelector('.errorBlock');
    }

    submitDisabled();
}

