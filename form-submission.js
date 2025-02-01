
$(document).ready(function () {
    /**
     * Handles the form submission event.
     */
    $('#contactForm').submit(function (event) {
        event.preventDefault(); // Prevent the default form submission

        let isValid = true;

        // Validate the name field
        const name = $('#name').val().trim();
        if (!name) {
            $('#name').addClass('is-invalid');
            isValid = false;
        } else {
            $('#name').removeClass('is-invalid');
        }

        // Validate the email field
        const email = $('#email').val().trim();
        if (!isValidEmail(email)) {
            $('#email').addClass('is-invalid');
            isValid = false;
        } else {
            $('#email').removeClass('is-invalid');
        }

        // Validate the message field
        const message = $('#message').val().trim();
        if (!message) {
            $('#message').addClass('is-invalid');
            isValid = false;
        } else {
            $('#message').removeClass('is-invalid');
        }

        // If the form is valid, do submission
        if (isValid) {
            const formData = {
                name: name,
                email: email,
                message: message
            };

            saveFormData(formData);

            // Reset the form
            $('#contactForm')[0].reset();
            $('#name').removeClass('is-invalid');
            $('#email').removeClass('is-invalid');
            $('#message').removeClass('is-invalid');

            // Clear any previous error messages and show a success message
            $('#formMessage').text('').removeClass('alert-danger'); // Clear error message first
            $('#formMessage').text('Thank you for your submission!').addClass('alert-success');
        } else {
            // Clear any previous success messages and show an error message
            $('#formMessage').text('').removeClass('alert-success'); // Clear success message first
            $('#formMessage').text('Please fill in all fields correctly.').addClass('alert-danger');
        }
    });

    /**
     * Checks if an email address is valid.
     *
     * @param {string} email - The email address to validate.
     * @returns {boolean} True if the email is valid, false otherwise.
     */
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Saves the form data to local storage with a limit.
     *
     * @param {object} formData - The form data to save.
     */
    function saveFormData(formData) {
        const MAX_ENTRIES = 10; // Maximum number of form entries to store

        // Gets existing data from local storage or initialize an empty array
        let savedData = JSON.parse(localStorage.getItem('formData')) || [];

        // Adds the new form data to array
        savedData.push(formData);

        // Remove oldest entries if the limit is exceeded
        if (savedData.length > MAX_ENTRIES) {
            savedData = savedData.slice(savedData.length - MAX_ENTRIES);
        }

        // Save the updated data back to the local storage
        localStorage.setItem('formData', JSON.stringify(savedData));

        // Log the saved data to the console for demonstration purposes
        console.log('Form data saved:', formData);
    }
});