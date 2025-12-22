class InputField {
    constructor(id, regexRule = new RegExp(), moreRegexRules = [], currentValidation = true) 
    {
        this.id = id; // html-element's id
        this.element = document.getElementById(id); // retrieve element with id parameter 
        this.regexRule = regexRule; // regular expression
        this.moreRegexRules = [...moreRegexRules] // avoids shared references [regexRules[0], regexRules[1]..]
        this.currentValidation = currentValidation; // flag for latest validation status 
    }


    // Toggle element's boolean upon call
    flagValidation() {
        this.currentValidation = !this.currentValidation;
    }

    // Insert additional regular expressions per field
    addRegexRule(newRule) {
        this.moreRegexRules.push(newRule);
    }
    // Adds an error message as html element <p> in case of invalid inputs
    // boolean doErr enables error message handling
    checkField(message, doErr = true) {
        let value = this.element.value;
        // Ensure field is ready for correct error message
        if (doErr) this.clearDatedError(message);
        // Only add one error message per field
        if (this.currentValidation && !this.regexRule.test(value)) {
            if (doErr) {
                this.element.insertAdjacentHTML("afterend", `<p>${message}</p>`);
            }
            this.flagValidation();
        }

        else if (!this.currentValidation && this.regexRule.test(value)) {
            if (doErr) {
                let nextElement = this.element.nextElementSibling;
                // Ensure that next html element is not null and is a <p> element 
                if (nextElement && nextElement.tagName === "P") {
                    nextElement.remove();
                }
            }
            this.flagValidation();
        }
        return this.currentValidation;
    }

    // clear conflicting error messages and reset current validation
    clearDatedError(newMessage) {
        let nextElement = this.element.nextElementSibling;
        
        if (nextElement && nextElement.textContent !== newMessage) {
            nextElement.remove();
            this.currentValidation = true;
        }
    }

    // Message handler for custom validation.
    // Boolean decides whether to insert or remove message.
    handleErrorMessage(doInsert, message = "") {
        if (doInsert && this.currentValidation) {
            this.element.insertAdjacentHTML("afterend", `<p>${message}</p>`);
            this.flagValidation();
        }
        else if (!doInsert && !this.currentValidation) {
            let nextElement = this.element.nextElementSibling;
            // Ensure that next html element is not null and is a <p> element 
            if (nextElement && nextElement.tagName === "P") {
                nextElement.remove();
            }
            this.flagValidation();
        }     
    }

    styliseField(textElement, doShake = false) {
        // On empty fields
        if (!this.element.value && !doShake) {
            this.element.className = "defaultField";
            if (textElement) textElement.style.color = "rgb(243, 243, 243)";
        }
        else if (this.currentValidation) {
            this.element.className = "valid";
            if (textElement) textElement.style.color = "rgb(2, 203, 2)";
        }
        // Activates field animation acorrdingly
        else {
            this.element.className = doShake ? "invalid shaking" : "invalid";
            if (textElement) textElement.style.color  = "rgb(196, 0, 0)";
        }
    }
}

// Create references for html elements 
// Regular expression /^[A-Za-z]*$/ ensures fields may only contain letters. Empty strings are valid.
const nameFields = [new InputField("first-name", /^[A-Za-z]+$/), new InputField("last-name", /^[A-Za-z]+$/)]
// No custom reglur expression were used for email validaiton
const emailField = new InputField("email");

// Regular expression for phone number format or empty fields.
const phoneField = new InputField("phone", /^$|^0\d{9}$/);

const messageField = new InputField("message", /^.{20,}$/);

const formFields = [];
const submitButton = document.getElementById("mailtoform");

for (const field of nameFields) {
    // Ensure the element exists before adding event listener
    if (!field.element) {
        console.warn(`Element with id ${field.id} not found.`);
        continue;
    }
    // Add event listener for input validation on every change and on losing focus
    field.element.addEventListener("input", () => validateName(field));
    field.element.addEventListener("blur", () => validateName(field)); 
    formFields.push(field);
}

// Fire event when field becomes out of focus
if (emailField.element) {
    emailField.element.addEventListener("blur", () => validateEmail(emailField));
    formFields.push(emailField);
}
else console.warn(`Element with id ${emailField.id} not found.`);

// Fire event when field becomes out of focus
if (phoneField.element) {
    phoneField.element.addEventListener("blur", () => validatePhone(phoneField));
    formFields.push(phoneField);
}
   
else console.warn(`Element with id ${emailField.id} not found.`);

// Fire event when on every change to the field and on losing focus
if (messageField.element) {
    messageField.element.addEventListener("input", () => validateMessage(messageField));
    messageField.element.addEventListener("blur", () => validateMessage(messageField));
    formFields.push(messageField);
}
else console.warn(`Element with id ${emailField.id} not found.`);

if (submitButton)
    submitButton.addEventListener("submit", (e) => validateForm(submitButton, e));
else console.warn(`Element with id ${emailField.id} not found.`);

// Validation for both first and last name fields
function validateName(field) {
    // Reset validation on empty fields
    if (!field.element.value) {
        field.clearDatedError("");
        field.styliseField();
        return false;
    }
    isValid = field.checkField("Name must contain letters only");
    field.styliseField(field.element.nextElementSibling);
    return isValid;
}

function validateEmail(field, isSubmitting = false) {
    // Prevent throwing error if field is empty and the form is not being submitted
    if (!isSubmitting && !field.element.value) {
        field.clearDatedError("");
        field.styliseField();
        return false;
    }
    // Check validity using HTML built-in validation checker 
    isValid = field.element.checkValidity();
    field.handleErrorMessage(!isValid, "Invalid email address");
    field.styliseField(field.element.nextElementSibling);
    return isValid;
}

// Phone number validation, accepts empty fields
function validatePhone(field) {
    isValid = field.checkField("Unsupported phone format");
    field.styliseField(field.element.nextElementSibling);
    return isValid;
}

// Message content validation, handles character counting and explains field requirement conditionally
function validateMessage(field, isSubmitting = false) {
    isValid = field.checkField("", false);
    // Current message length
    let charCount = field.element.value.length;
    // Message counter text
    let counterMessage = field.element.nextElementSibling;
    
    if (isSubmitting && !isValid) {
        counterMessage.textContent = `Message must contain at least 20 characters, not ${charCount}`;
        field.styliseField(counterMessage, true);
    }
    else {
        counterMessage.textContent = `${charCount}/20 characters`;
        field.styliseField(counterMessage);
    }
    return isValid;
}

// Fields that already have an ongoing error messages will not be affected by this
function validateForm(form,e) {
    e.preventDefault();

    isReady = true;

    for (const field of formFields) {
        // Different email and message validation due to special validation
        if (field.id == "email") {
            if (!validateEmail(field, true)) isReady = false;
            field.styliseField(field.element.nextElementSibling, true);
        }
        else if (field.id == "message") {if (!validateMessage(field, true)) isReady = false;}

        // Skip checking if field is currently flagged invalid
        else if (!field.currentValidation || !field.checkField("Required field is empty")) {
            field.styliseField(field.element.nextElementSibling, true);
            isReady = false;       
        }
    }

    // Check form's readiness for submittion
    if (isReady) {
        document.getElementById("invalid-submission-message").hidden = true;
        document.getElementById("valid-submission-message").hidden = false;
        document.getElementById("submit").disabled = true;
        // Activate a timed confimation if submission was successful 
        new Promise(resolve => setTimeout(resolve, 3000))
        .then(() => {
            document.getElementById("reset").click();
            document.getElementById("submit").disabled = false;
            document.getElementById("valid-submission-message").hidden = true;
        })
        .catch(error => {
            alert("Something went wrong while clearing the form");
            console.error(error);
            document.getElementById("submit").disabled = false;
            document.getElementById("valid-submission-message").hidden = true;
        });
        
    }
    else {
        document.getElementById("valid-submission-message").hidden = true;
        document.getElementById("invalid-submission-message").hidden = false;
    }
}
