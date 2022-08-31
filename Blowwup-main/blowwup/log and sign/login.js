// const loginForm = document.querySelector('.loginForm');

// const loginInput = document.querySelector('.loginForm input');

// loginForm.addEventListener('submit', e=> {


//     e.preventDefault();

//     loginInput.value.trim();

//     loginForm.reset();

//     console.log(loginInput.value);
// });


class login{
    constructor(form, fields) {
        this.form = form;
        this.fields = fields;
        this.validateonSubmit();
    }

    valiadteonSubmit() {
        let self = this;

        this.form.addeventListener("submit" , (e) => {

            e.preventDefault();
            self.fields.forEach((field) => {

                const input = document.querySelector(`#${field}`);

                console.log(input.value);

            });


        });
    }
}



const form = document.querySelector('.loginForm');

if(form) {
    const fields = ["username" , "password"];

    const validator = new login(form, fields);
}