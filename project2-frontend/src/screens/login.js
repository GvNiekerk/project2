import { Component } from "react";
import Cookies from 'universal-cookie'

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = { email: '', password: ''}

        this.handleChange = this.handleChange.bind(this);
        this.RequestLogin = this.RequestLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleChange(event){
        switch (event.target.name) {
            case 'email':
                this.setState({ email: event.target.value })
                break;
            case 'password':
                this.setState({ password: event.target.value })
                break;
        }
    }

    RequestLogin(event) {
        event.preventDefault();

        var req = {
            email: this.state.email,
            password: this.state.password
        }

        var headers = new Headers();
        headers.append('Content-Type', 'application/json')

        fetch("/user/login", {
            method: "post",
            headers: headers,
            body: JSON.stringify(req),
        }).then((response) => {
            if (response.ok) {
                const cookies = new Cookies();
                cookies.set('token', response.headers.get('auth-token'), { path: "/" })
                window.location.reload();
            }
            else{
                alert("Invalid Login")
            }
        })
    }
    
    handleRegister(event) {
        event.preventDefault();

        var req = {
            email: this.state.email,
            password: this.state.password
        }

        var headers = new Headers();
        headers.append('Content-Type', 'application/json')

        fetch("/user/register", {
            method: "post",
            headers: headers,
            body: JSON.stringify(req),
        }).then((response) => {
            if (response.ok) {
                const cookies = new Cookies();
                cookies.set('token', response.headers.get('auth-token'), { path: "/" })
                window.location.reload();
            }
            else{
                alert("Invalid Login")
            }
        })
    }

    render() {
        return (
            <div style={{marginTop: 200}}>
                <h1>Project 2</h1>
                    <input onChange={this.handleChange} name="email" className="whiteInput" placeholder="email" />
                    <br />
                    <input onChange={this.handleChange} name="password" className="whiteInput" placeholder="password" type="password" />
                    <br />
                    <button onClick={this.RequestLogin} className="greenBtn" type="submit">Login</button>
                    <button onClick={this.handleRegister} className="blueBtn" type="submit">Register</button>
            </div>
        );
    };
}

export default Login;