import axios from 'axios';
export default function Login({changeWindow, changePage}) {

    function verifyAccount(){
        Array.from(document.getElementsByClassName("errorMessage")).forEach((element) =>{
          element.style.display = "none";
        })
        Array.from(document.getElementsByClassName("errorBorder")).forEach(id => {
          id.classList.remove("errorBorder");
        });
        const email = document.getElementById("loginEmail")
        const password = document.getElementById("loginPassword")
        if (email.value === "") {
          document.getElementById("errorLogin").style.display = "block";
          // Idk why this isn't working,
        }
        if (password.value === "") {
          document.getElementById("errorLogin").style.display = "block";
          // document.getElementById("loginPassword").classList.add("errorBorder");
        }

        const requestBody = {
            email: email.value,
            password: password.value
          };
          // model.insertAnswer(qid,atxtb.value,user.value);
          // model.getQuestionById(qid).views-=1; //remove the new view coming from going back to answers page
          axios.post('http://localhost:8000/login', requestBody,{ withCredentials: true })
            .then(response => {
              changeWindow(response.data)
              console.log("Login Successfully")
            })
            .catch(error => {
              //error
              console.error('Error:\n\n', error);
              document.getElementById("errorLogin").style.display = "block";
            });
    }

    return (
        <div className="loginPage">
        <label>Account name/email</label>
        <input type="text" id="loginEmail" placeholder="example@gmail.com"/>
        <br/>
        <label>Account Password</label>
        {/* <input type="text" id="loginPassword" placeholder="Password"/> */}
        <input type="password" id="loginPassword" placeholder="Password"/>
        <br/>
        <span className="errorMessage" id="errorLogin" style={{display: 'none'}}>Invalid username or password</span>
        <button onClick={() => verifyAccount()}>Login</button>
        {/* Is this a right way to continue as a guest user? */}
        <button onClick={() => changeWindow(null)}>Continue As a Guest User</button>
        {/*  */}
        {/* Idk how to go back */}
        <button onClick={() => changePage("Welcome")}>Go Back to Welcome Page</button>
    </div>
    );
  }
