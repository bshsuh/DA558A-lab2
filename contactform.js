class InputField {
    constructor(id, regexRule, currentValidation = true) 
    {
        this.id = id;
        this.element = document.getElementById(id);
        this.regexRule = regexRule;
        this.regexRules = [regexRule];
        this.currentValidation = currentValidation;
    }

    getElement() {
        return this.element;
    }

    flagValidation() {
        this.currentValidation = !this.currentValidation;
    }

    addRegexRule(newRule) {
        this.regexRules.push(newRule);
    }

}

// Create references for first name and last name fields
// Regular expression /^[A-Za-z]*$/ ensures fields may only contain letters 
const textFields = [new InputField("first-name", /^[A-Za-z]*$/), new InputField("last-name", /^[A-Za-z]*$/)]
const emailField = document.getElementById("email");
const phoneField = document.getElementById("phone");
const messageField = document.getElementById("message");
const submitButton = document.getElementById("submit");
