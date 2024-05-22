import axios from 'axios';
export default function Register({changePage}) {

  function verifyAccount(){
    Array.from(document.getElementsByClassName("errorMessage")).forEach((element) =>{
      element.style.display = "none";
    })
    Array.from(document.getElementsByClassName("errorBorder")).forEach(id => {
      id.classList.remove("errorBorder");
    });
    const email = document.getElementById("registerEmail")
    const username = document.getElementById("registerUsername")
    const password = document.getElementById("registerPassword")
    const password2 = document.getElementById("registerPassword2")
    var notEmpty = true;
    if(email.value === "") {
      document.getElementById("errorEmailEmpty").style.display = "block";
      document.getElementById("registerEmail").classList.add("errorBorder")
      notEmpty = false;
    }
    if(username.value === "") {
      document.getElementById("errorUsernameEmpty").style.display = "block";
      document.getElementById("registerUsername").classList.add("errorBorder")
      notEmpty = false;
    }
    if(password.value === "") {
      document.getElementById("errorPasswordEmpty").style.display = "block";
      document.getElementById("registerPassword").classList.add("errorBorder")
      notEmpty = false;
    }
    if(password.value !== password2.value){
      document.getElementById("errorPasswordMismatch").style.display = "block";
      document.getElementById("registerPassword2").classList.add("errorBorder")
        //return something to indicate an error (like passwords dont match)
        notEmpty = false;
        return;
    }
    // if(notEmpty === false) {

    // }
    const requestBody = {
        email: email.value,
        username:username.value,
        password: password.value
      };
      // model.insertAnswer(qid,atxtb.value,user.value);
      // model.getQuestionById(qid).views-=1; //remove the new view coming from going back to answers page
      axios.post('http://localhost:8000/register', requestBody)
        .then(response => {
          changePage("Login")
          console.log("Registered Successfully")
          //add if else and route to login page
        })
        .catch(error => {
          //error
          console.error('Error:\n\n', error);
          if (error.response && error.response.status === 400) {
            const errors = error.response.data.errors;
            errors.forEach(err => {
              if (email.value !== "" && err === 'Invalid email format') {
                document.getElementById("errorEmailFormat").style.display = "block";
                document.getElementById("registerEmail").classList.add("errorBorder")
              } else if (err === 'Email already taken') {
                document.getElementById("errorEmailAlrExist").style.display = "block";
                document.getElementById("registerEmail").classList.add("errorBorder")
              } else if (err === 'Username already taken') {
                document.getElementById("errorUsername").style.display = "block";
                document.getElementById("registerUsername").classList.add("errorBorder")
              } else if (err === 'Password should not contain email or username') {
                document.getElementById("errorPasswordContain").style.display = "block";
                document.getElementById("registerPassword").classList.add("errorBorder")
              } else if (err === 'Password should not contain whitespaces') {
                document.getElementById("errorPasswordWS").style.display = "block";
                document.getElementById("registerPassword2").classList.add("errorBorder")
              }
            });
          }
        //   if (error.response && error.response.status === 401) {
        //     document.getElementById("errorEmailFormat").style.display = "block";
        //   }
        //   else if (error.response && error.response.status === 402) {
        //     document.getElementById("errorEmailAlrExist").style.display = "block";
        //   }
        //   else if (error.response && error.response.status === 403) {
        //     document.getElementById("errorUsername").style.display = "block";
        //   }
        //   else if (error.response && error.response.status === 404) {
        //     document.getElementById("errorPasswordInvalid").style.display = "block";
        //   }
        });
        if(notEmpty === false) return false;
    }

    return (
        <div className="registerPage">
        <label>Account name/email</label>
        <input type="text" id="registerEmail" placeholder="example@gmail.com"/>
        <span className="errorMessage" id="errorEmailAlrExist" style={{display: 'none'}}>The email you entered already exists.</span>
        <span className="errorMessage" id="errorEmailFormat" style={{display: 'none'}}>Invalid Email format.</span>
        <span className="errorMessage" id="errorEmailEmpty" style={{display: 'none'}}>Email field must not be empty.</span>

        <br/>
        <label>Account Username</label>
        <input type="text" id="registerUsername" placeholder="Username"/>
        <span className="errorMessage" id="errorUsername" style={{display: 'none'}}>The username you entered already exists.</span>
        <span className="errorMessage" id="errorUsernameEmpty" style={{display: 'none'}}>Username field must not be empty.</span>
        <br/>
        <label>Account Password</label>
        <input type="text" id="registerPassword" placeholder="Password"/>
        {/* Should we change the type to password? */}
        {/* <input type="password" id="registerPassword" placeholder="Password"/> */}
        <span className="errorMessage" id="errorPasswordContain" style={{display: 'none'}}>Password should not contain email or username.</span>
        <span className="errorMessage" id="errorPasswordEmpty" style={{display: 'none'}}>Password field must not be empty.</span>
        <span className="errorMessage" id="errorPasswordWS" style={{display: 'none'}}>Password should not contain whitespaces.</span>
        <br/>
        <label>Confirm Account Password</label>
        <input type="text" id="registerPassword2" placeholder="Password"/>
        <span className="errorMessage" id="errorPasswordMismatch" style={{display: 'none'}}>The passwords do not match.</span>
        <br/>
        <button onClick={() => verifyAccount()}>Create Account</button>
        <button onClick={() => changePage("Welcome")}>Go Back to Welcome Page</button>
    </div>
    );
  }
