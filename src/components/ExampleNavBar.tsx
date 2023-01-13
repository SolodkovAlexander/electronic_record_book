import { FC } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


export const ExampleNavBar: FC = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container >
        <Navbar.Brand href="/">Electronic Record Book App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">
              Home
            </Nav.Link>
            {/* <Nav.Link href="#link">Link</Nav.Link> */}
            <NavDropdown title="Tables" id="basic-nav-dropdown">
              <NavDropdown.Item href="/professors">Professors</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/students">Students</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/student_group">Groups</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

// export default ExampleNavBar;