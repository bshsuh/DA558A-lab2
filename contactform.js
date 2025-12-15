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
    checkField(message) {
        let value = this.element.value;
        // Only add one error message per field
        if (this.currentValidation && !this.regexRule.test(value)) {
            this.element.insertAdjacentHTML("afterend", `<p>${message}</p>`);
            this.flagValidation();
        }

        else if (!this.currentValidation && this.regexRule.test(value)) {
            let nextElement = this.element.nextElementSibling;
            // Ensure that next html element is not null and is a <p> element 
            if (nextElement && nextElement.tagName === "P") {
                nextElement.remove();
            }
            this.flagValidation();
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
}

// Create references for html elements 
// Regular expression /^[A-Za-z]*$/ ensures fields may only contain letters. Empty strings are valid.
const nameFields = [new InputField("first-name", /^[A-Za-z]*$/), new InputField("last-name", /^[A-Za-z]*$/)]
// No custom reglur expression were used for email validaiton
const emailField = new InputField("email");

for (const field of nameFields) {
    // Ensure the element exists before adding event listener
    if (!field.element) {
        console.warn(`Element with id ${field.id} not found.`);
        continue;
    }
    // Add event listener for input validation
    field.element.addEventListener("input", () => validateName(field));
}

// Listen when field becomes out of focus
if (emailField.element) 
    emailField.element.addEventListener("blur", () => validateEmail(emailField));
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
