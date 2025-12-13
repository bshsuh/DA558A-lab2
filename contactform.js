class InputField {
    constructor(id, regexRule, currentValidation = true) 
    {
        this.id = id; // html-element's id
        this.element = document.getElementById(id); // retrieve element with id parameter 
        this.regexRule = regexRule; // regular expression
        this.regexRules = [regexRule]; // array of regular expressions
        this.currentValidation = currentValidation; // flag for latest validation status 
    }

    getElement() {
        return this.element;
    }

    // Toggle element's boolean upon call
    flagValidation() {
        this.currentValidation = !this.currentValidation;
    }

    // Insert additional regular expressions per field
    addRegexRule(newRule) {
        this.regexRules.push(newRule);
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
}

// Create references for first name and last name fields
// Regular expression /^[A-Za-z]*$/ ensures fields may only contain letters. Empty strings are valid.
const textFields = [new InputField("first-name", /^[A-Za-z]*$/), new InputField("last-name", /^[A-Za-z]*$/)]

for (const field of textFields) {
    // Ensure the element exists before adding event listener
    if (!field.getElement()) 
    {
        console.warn(`Element with id ${field.id} not found.`);
        continue;
    }
    // Add event listener for input validation
    field.getElement().addEventListener("input", () => validateName(field));
}

// Validation for both first and last name fields
function validateName(field) {
    field.checkField("Name must contain letters only.");
}

