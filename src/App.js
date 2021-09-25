import './App.css';
import MainPage from './layout/MainPage'
import ProfilePage from './layout/ProfilePage'
import PostListPage from './layout/PostListPage'
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
        <Route exact path="/profile" component={ProfilePage}/>
        <Route exact path="/posts/:category" component={PostListPage}/>
      </BrowserRouter>
    </div>
  );
}

export default App;
