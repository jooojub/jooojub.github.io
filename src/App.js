import "./App.css";
import MainPage from "./layout/MainPage";
import ProfilePage from "./layout/ProfilePage";
import PostListPage from "./layout/PostListPage";
import PostPage from "./layout/PostPage";
import SearchPage from "./layout/SearchPage";
import ReactHelmet from "./components/ReactHelmet";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import "hover.css/css/hover-min.css";
import "mdbreact/dist/css/mdb.css";
import "./style/css/_custom-style.css";
import "./style/scss/_custom-style.scss";

function App() {
  return (
    <div className="App" style={{ overflow: "hidden" }}>
      <ReactHelmet
        title="jooojub - personal blog"
        url="https://jooojub.github.io/"
        image="https://jooojub.github.io/assets/images/avatars/toto.jpg"
        description="This is a personal blog where I study and write various things."
      />
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/profile" component={ProfilePage} />
          <Route exact path="/posts/:category" component={PostListPage} />
          <Route exact path="/post/:file" component={PostPage} />
          <Route exact path="/search/:keyword" component={SearchPage} />
          <Route exact path="*" component={MainPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
