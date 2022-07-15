import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { AppHeader } from './cmps/AppHeader';
import { WeatherApp } from './pages/WeatherApp';
import { Favorites } from './pages/Favorites';
import { useDispatch } from 'react-redux';
import { loadFavorites } from './store/actions/favoriteActions';
import { getWeatherByLocation } from './store/actions/weatherActions';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch();
  dispatch(loadFavorites());
  dispatch(getWeatherByLocation());

  return (
    <Router>
      <div className="app">
        <AppHeader />
        <main className="main">
          <Switch>
            <Route path="/favorites" component={Favorites}></Route>
            <Route path="/:id" component={WeatherApp}></Route>
            <Route path="/" component={WeatherApp}></Route>
          </Switch>
        </main>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
