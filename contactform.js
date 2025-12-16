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
        // Only add one error message per field
        if (this.currentValidation && !this.regexRule.test(value)) {
            if (doErr) this.element.insertAdjacentHTML("afterend", `<p>${message}</p>`);
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
}

// Create references for html elements 
// Regular expression /^[A-Za-z]*$/ ensures fields may only contain letters. Empty strings are valid.
const nameFields = [new InputField("first-name", /^[A-Za-z]*$/), new InputField("last-name", /^[A-Za-z]*$/)]
// No custom reglur expression were used for email validaiton
const emailField = new InputField("email");

// Regular expression for phone number format or empty fields.
const phoneField = new InputField("phone", /^$|^0\d{9}$/);

const messageField = new InputField("message", /^.{20,}$/);

for (const field of nameFields) {
    // Ensure the element exists before adding event listener
    if (!field.element) {
        console.warn(`Element with id ${field.id} not found.`);
        continue;
    }
    // Add event listener for input validation on every change
    field.element.addEventListener("input", () => validateName(field));
}

// Fire event when field becomes out of focus
if (emailField.element) 
    emailField.element.addEventListener("blur", () => validateEmail(emailField));
else console.warn(`Element with id ${emailField.id} not found.`);

// Fire event when field becomes out of focus
if (phoneField.element)
    phoneField.element.addEventListener("blur", () => validatePhone(phoneField));
else console.warn(`Element with id ${emailField.id} not found.`);

// Fire event when on every change to the field
if (messageField.element)
    messageField.element.addEventListener("input", () => validateMessage(messageField));
else console.warn(`Element with id ${emailField.id} not found.`);

// Validation for both first and last name fields
function validateName(field) {
    field.checkField("Name must contain letters only");
}

function validateEmail(field) {
    // Clear error message if field is empty
    if (!field.element.value) field.handleErrorMessage(false);
    // Check validity using HTML built-in validation checker 
    else  field.handleErrorMessage(!field.element.checkValidity(), "Invalid email address");
}

// Phone number validation, accepts empty fields
function validatePhone(field) {
    field.checkField("Unsupported phone format");
}

// Message content validation, handles character counting
function validateMessage(field) {
    // Current message length
    let charCount = field.element.value.length;
    // Message counter text
    let counterMessage = field.element.nextElementSibling;
    // Update counter
    counterMessage.textContent = `${charCount}/20 characters`;
    // Validate field without handling user input error message
    field.checkField("",false);
}
