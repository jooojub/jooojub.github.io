import './App.css';
import MainPage from './layout/MainPage'
import "hover.css/css/hover-min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import "./style/css/_custom-style.css";

function App() {
  return (
    <div className="App" style={{overflow: "hidden"}}>
      <MainPage />
    </div>
  );
}

export default App;
