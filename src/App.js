import './App.css';
import MainPage from './layout/MainPage'
import ProfilePage from './layout/ProfilePage'
import { BrowserRouter, Route } from 'react-router-dom';
import "hover.css/css/hover-min.css";
import 'mdbreact/dist/css/mdb.css';
import "./style/css/_custom-style.css";
import "./style/scss/_custom-style.scss";

function App() {
  return (
    <div className="App" style={{overflow: "hidden"}}>
      <BrowserRouter>
        <Route exact path="/" component={MainPage}/>
        <Route path="/profile" component={ProfilePage}/>
      </BrowserRouter>
    </div>
  );
}

export default App;
