import './App.css';
import MainPage from './layout/MainPage'
import "hover.css/css/hover-min.css";
import 'mdbreact/dist/css/mdb.css';
import "./style/css/_custom-style.css";
import "./style/scss/_custom-style.scss";

function App() {
  return (
    <div className="App" style={{overflow: "hidden"}}>
      <MainPage />
    </div>
  );
}

export default App;
