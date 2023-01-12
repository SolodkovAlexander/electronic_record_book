import * as React from 'react';
import { Container } from 'react-bootstrap';
import { MemoryRouter, Routes, Route, BrowserRouter } from 'react-router-dom';
import { ExampleNavBar } from './components/ExampleNavBar';
import Professor from './models/Professor';
import { GroupsPage } from './pages/GroupsPage';
import LandingPage from './pages/LandingPage';
import { ProfessorsPage } from './pages/ProfessorsPage';
import { StudentsPage } from './pages/StudentsPage';
// import { Link } from "react-router-dom";
interface IProps {
}
interface IState {
}

class App extends React.Component<IProps, IState> {


  public componentDidMount() {

  }

  public render(): React.ReactNode {
    return (
      
      <BrowserRouter>
        <ExampleNavBar />
        <Container>
          {/* in react-route-dom v6 there is no Swoitch (like v5), now it's Routes */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/professors" element={<ProfessorsPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/student_group" element={<GroupsPage />} />
          </Routes>        
        </Container>
      </BrowserRouter>
    );
  }
}
export default App;