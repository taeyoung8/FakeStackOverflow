import axios from 'axios';
export default function Navbar({user,welcome}) {
    function login(){
        welcome(null)
    }

    async function logout() {
        try {
          await axios.get('http://localhost:8000/logout',{withCredentials:true});
          welcome(null)
    
    
        } catch (error) {
          alert("Failed to sign out, make sure you are already signed in.")
        }
      }
    //   console.log(user)

    return (
        <div className="header">
        <button className="login_button" onClick={()=> user ? logout() : login()}>{user? "Logout" : "Login"}</button>
        <h1 className="title">Fake Stack Overflow</h1>
        <input type="text" className="search" placeholder="Search..."/>
        
    </div>
    );
  }