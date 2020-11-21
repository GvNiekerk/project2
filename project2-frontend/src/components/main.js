import { Component } from "react";
import Cookies from 'universal-cookie'

function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }


class Main extends Component {

    constructor(props) {
        super(props);

        var fileData = {
            _id: "",
            name: "",
            meta: {
                email: false,
                id: false,
                mobile: false
            }
        }

        this.state = { value: '', fileFound: false, fileData: fileData }

        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value })
    }

    handleCheck(event) {

        var newFileData = this.state.fileData;

        switch (event.target.name) {
            case 'email':
                newFileData.meta.email = event.target.checked;
                break;
            case 'id':
                newFileData.meta.id = event.target.checked;
                break;
            case 'mobile':
                newFileData.meta.mobile = event.target.checked;
                break;
        }

        this.setState({ fileData: newFileData })
    }

    handleBack(event) {
        this.setState({ fileFound: false })
    }

    handleLogout(event) {
        const cookies = new Cookies();
        cookies.remove('token', { path: '/' });
        window.location.reload();
    }

    handleUpdate(event) {
        event.preventDefault();

        var req = {
            id: this.state.fileData._id,
            fileName: this.state.fileData.name,
            meta: {
                email: this.state.fileData.meta.email,
                mobile: this.state.fileData.meta.mobile,
                id: this.state.fileData.meta.id
            }
        }

        const cookies = new Cookies();
        var headers = new Headers();
        headers.append('Content-Type', 'application/json')
        headers.append('auth-token', cookies.get('token'))

        fetch("/meta/updateData", {
            method: "post",
            headers: headers,
            body: JSON.stringify(req),
        }).then((response) => {
            if (response.ok) {
                response.json().then(json => {

                    if (json.status === "Failed") {
                        alert("Could not find document");
                        return;
                    }

                    var fileData = {
                        _id: json.data._id,
                        name: json.data.fileName,
                        meta: {
                            email: json.data.meta.email,
                            id: json.data.meta.id,
                            mobile: json.data.meta.mobile
                        }
                    }

                    console.log(fileData);

                    this.setState({ fileFound: true, fileData: fileData });
                })
            }
        })
    }

    UploadFile(filename, base64) {
        var req = {
            fileName: filename,
            base64: base64
        }

        const cookies = new Cookies();
        var headers = new Headers();
        headers.append('Content-Type', 'application/json')
        headers.append('auth-token', cookies.get('token'))

        fetch("/file/upload", {
            method: "post",
            headers: headers,
            body: JSON.stringify(req),
        }).then((response) => {
            if (response.ok) {
                response.json().then(json => {

                    if (json.status === "Failed") {
                        alert("Could not find document");
                        return;
                    }

                    var fileData = {
                        _id: json.metaData._id,
                        name: json.metaData.fileName,
                        meta: {
                            email: json.metaData.meta.email,
                            id: json.metaData.meta.id,
                            mobile: json.metaData.meta.mobile
                        }
                    }

                    console.log(fileData);

                    this.setState({ fileFound: true, fileData: fileData });
                })
            }
        })
    }


    handleUpload(event) {
        event.preventDefault();

        let file = event.target.files[0]
        getBase64(file).then((base) => {
            this.UploadFile(file.name, base.split(',')[1])
        });
    }

    handleSearch(event) {
        var req = {
            fileName: this.state.value
        }

        const cookies = new Cookies();
        var headers = new Headers();
        headers.append('Content-Type', 'application/json')
        headers.append('auth-token', cookies.get('token'))

        fetch("/meta/getdata", {
            method: "post",
            headers: headers,
            body: JSON.stringify(req),
        }).then((response) => {
            if (response.ok) {
                response.json().then(json => {

                    if (json.status === "Failed") {
                        alert("Could not find document");
                        return;
                    }

                    var fileData = {
                        _id: json.data._id,
                        name: json.data.fileName,
                        meta: {
                            email: json.data.meta.email,
                            id: json.data.meta.id,
                            mobile: json.data.meta.mobile
                        }
                    }

                    console.log(fileData);

                    this.setState({ fileFound: true, fileData: fileData });
                })
            }
        })
    }

    render() {
        if (this.state.fileFound) {
            return (
                <div style={{ borderRadius: 8, backgroundColor: "white", width: 400, boxShadow: "6px 6px #e5e5e5", margin: "auto", padding: "10px 30px" }}>
                    <h1>{this.state.fileData.name}</h1>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <p for="email" >Email</p>
                        <input onChange={this.handleCheck} className="check" name="email" type="checkbox" defaultChecked={this.state.fileData.meta.email} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <p for="id">ID Number</p>
                        <input onChange={this.handleCheck} className="check" name="id" type="checkbox" defaultChecked={this.state.fileData.meta.id} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <p for="mobile">Mobile</p>
                        <input onChange={this.handleCheck} className="check" name="mobile" type="checkbox" defaultChecked={this.state.fileData.meta.mobile} />
                    </div>
                    <button onClick={this.handleBack} className="redBtn">Back</button>
                    <button onClick={this.handleUpdate} className="blueBtn">Update</button>
                </div>
            )
        }
        else {
            return (
                <div>
                    <h1>Project 2</h1>
                    <input className="whiteInput" type="text" value={this.state.value} onChange={this.handleChange} />
                    <button className="greenBtn" onClick={this.handleSearch}>Search</button>
                    <br />
                    <p>or upload new file</p>
                    <input onChange={this.handleUpload} className="whiteInput" type="file" />
                    <br />
                    <button className="redBtn" onClick={this.handleLogout}>Logout</button>
                </div>
            )
        }
    }
}

export default Main;