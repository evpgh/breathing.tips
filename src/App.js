import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Homepage } from './components/homepage/homepage.component';
import { Practice } from './components/practice/practice.component';
import { Switch, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path='/' component={Homepage} />
        <Route path='/practice/:tipId' component={Practice} />
      </Switch>
    </div>
  );
}

export default App;
