import * as React from 'react';
import { Container } from 'react-bootstrap';
import { MemoryRouter, Routes, Route, BrowserRouter } from 'react-router-dom';
import { ExampleNavBar } from './components/ExampleNavBar';
import Professor from './models/Professor';
import DisciplineCreate from './pages/Discipline/DisciplineCreate';
import DisciplineEdit from './pages/Discipline/DisciplineEdit';
import { DisciplinesPage } from './pages/Discipline/DisciplinesPage';
import GroupCreate from './pages/Groups/GroupsCreate';
import GroupEdit from './pages/Groups/GroupsEdit';
import { GroupsPage } from './pages/Groups/GroupsPage';
import LandingPage from './pages/LandingPage';
import ProfessorCreate from './pages/Professor/ProfessorCreate';
import ProfessorEdit from './pages/Professor/ProfessorEdit';
import { ProfessorsPage } from './pages/Professor/ProfessorsPage';
import StudentCreate from './pages/Student/StudentCreate';
import StudentEdit from './pages/Student/StudentEdit';
import { StudentsPage } from './pages/Student/StudentsPage';
import StudentGradeCreate from './pages/StudentGrade/StudentGradeCreate';
import StudentGradeEdit from './pages/StudentGrade/StudentGradeEdit';
import { StudentGradesPage } from './pages/StudentGrade/StudentGradesPage';
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
        <Container style={{ margin: '0 auto' }} >
          {/* in react-route-dom v6 there is no Swoitch (like v5), now it's Routes */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/professors" element={<ProfessorsPage />} />
            <Route path="/professor_create" element={<ProfessorCreate/>} />
            <Route path="/professor/:id" element={<ProfessorEdit/>} />
            
            <Route path="/disciplines" element={<DisciplinesPage />} />
            <Route path="/discipline/:id" element={<DisciplineEdit/>} />
            <Route path="/discipline_create" element={<DisciplineCreate/>} />

            <Route path="/student_grades" element={<StudentGradesPage />} />
            <Route path="/student_grade/:id" element={<StudentGradeEdit/>} />
            <Route path="/student_grade_create" element={<StudentGradeCreate/>} />

            <Route path="/students" element={<StudentsPage />} />
            <Route path="/student/:id" element={<StudentEdit/>} />
            <Route path="/student_create" element={<StudentCreate/>} />

            <Route path="/student_group" element={<GroupsPage />} />
            <Route path="/student_group_create" element={<GroupCreate />} />
            <Route path="/student_group/:id" element={<GroupEdit />} />
          </Routes>        
        </Container>
      </BrowserRouter>
    );
  }
}
export default App;