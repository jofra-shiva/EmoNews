import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { loadModels } from './helpers/faceApi';
import { createFaLibrary } from './helpers/icons';
import { SpeedInsights } from "@vercel/speed-insights/dist/react/index.js";

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './components/Login';
import Register from './components/Register';

// Dashboard Pages
import OverviewPage from './pages/OverviewPage';
import AllArticlesPage from './pages/AllArticlesPage';
import AddArticlePage from './pages/AddArticlePage';
import Camera from './components/Camera/Camera';
import Cameratamil from './components/Cameratamil/Cameratamil';

// Global Styles
import './styles/theme.css';
import './index.css';

createFaLibrary();
loadModels();

// Wrapper that applies DashboardLayout to a page component
const DashboardRoute = ({ path, exact, component: Component, photoMode }) => (
  <ProtectedRoute
    path={path}
    exact={exact}
    component={() => (
      <DashboardLayout>
        {Component ? <Component photoMode={photoMode} /> : null}
      </DashboardLayout>
    )}
  />
);

function App() {
  return (
    <Router>
      <>
        <SpeedInsights />
        <Switch>
          {/* Auth Routes */}
          <Route exact path="/" component={Login} />
          <Route path="/register" component={Register} />

          {/* Dashboard Routes — all wrapped in DashboardLayout */}
          <DashboardRoute exact path="/overview" component={OverviewPage} />
          <DashboardRoute exact path="/articles" component={AllArticlesPage} />
          <DashboardRoute exact path="/add-article" component={AddArticlePage} />
          <DashboardRoute exact path="/scanner" component={Camera} photoMode={false} />
          <DashboardRoute exact path="/scanner-tamil" component={Cameratamil} photoMode={false} />

          {/* Legacy redirects — preserve old links */}
          <ProtectedRoute path="/dashboard" component={() => <Redirect to="/scanner" />} />
          <ProtectedRoute path="/tamil" component={() => <Redirect to="/scanner-tamil" />} />

          {/* Default redirect after login */}
          <ProtectedRoute path="*" component={() => <Redirect to="/overview" />} />
        </Switch>
      </>
    </Router>
  );
}

export default App;
