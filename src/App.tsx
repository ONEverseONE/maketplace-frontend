import './App.css';
import './styles/font.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { HomePage } from './pages/home';
import { VoyagesMenu } from './components/voyages/voyagesMenu';
import { AsteroidMining } from './components/voyages/asteroidMining';
import { ResourceOne } from './components/voyages/resourceOne';

function App() {
  return (
    <div className="bg-gradient">
      <Router>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/voyages/resource-one" exact component={ResourceOne} />
          <Route
            path="/voyages/asteroid-mining"
            exact
            component={AsteroidMining}
          />
          <Route path="/voyages" exact component={VoyagesMenu} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
