import './App.css';
import LoginScreen from './screens/login'
import Cookies from 'universal-cookie'
import MainPage from './components/main'

function App() {
  const cookies = new Cookies();

  if (!cookies.get('token')) {
    return (
      <div className="App">
        <LoginScreen />
      </div>
    );
  }
  else {
    return (
      <div style={{marginTop: 200}} className="App">
        <MainPage />
      </div>
    )
  }
}

export default App;
