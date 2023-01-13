import { Component, ChangeEvent } from "react";
import { Application } from "../../Application";
import { RequestHelper } from "../../helpers/RequestHelper";
// import TutorialDataService from "../services/tutorial.service";
import Professor from '../../models/Professor';

type Props = {};

type State = Professor & {
  submitted: boolean
};

export default class ProfessorCreate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeOtherName = this.onChangeOtherName.bind(this);
    this.onChangeAcademicDegree = this.onChangeAcademicDegree.bind(this);
    this.saveTutorial = this.saveTutorial.bind(this);
    this.newProfessor = this.newProfessor.bind(this);

    this.state = {
      first_name: "",
      last_name: "",
      other_name: "",
      academic_degree: "",
      submitted: false
    };
  }

  onChangeLastName(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      last_name: e.target.value
    });
  }

  onChangeFirstName(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      first_name: e.target.value
    });
  }

  onChangeOtherName(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      other_name: e.target.value
    });
  }
  onChangeAcademicDegree(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      academic_degree: e.target.value
    });
  }
  

  saveTutorial() {
    const data: Professor = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      other_name: this.state.other_name,
      academic_degree: this.state.academic_degree
    };

    Application.createTablesObjects({ professor: [{ "first_name": data.first_name, "last_name": data.last_name, "other_name": data.other_name, "academic_degree": data.academic_degree }] }).then(
       (response: any) => {
        this.setState({
          first_name: response.first_name,
          last_name: response.last_name,
          other_name: response.other_name,
          academic_degree: response.academic_degree,
          submitted: true
        });
        console.log(response.data);
       })
      .catch((e: Error) => {
        console.log(e);
      });     
  }

  newProfessor() {
    this.setState({
      first_name: "",
      last_name: "",
      other_name: "",
      academic_degree: "",
      submitted: false
    });
  }

  render() {
    const { submitted, first_name, last_name, other_name, academic_degree } = this.state;

    return (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>Professor added successfully!</h4>
            <button className="btn btn-success me-3" onClick={this.newProfessor}>
              Add another
            </button>         
            <a className="btn btn-warning" role="button" href="/professors">Back to professors</a>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="firstName">Имя</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                required
                value={first_name}
                onChange={this.onChangeFirstName}
                name="firstName"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Фамилия</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                required
                value={last_name}
                onChange={this.onChangeLastName}
                name="lastName"
              />
            </div>

              <div className="form-group">
                <label htmlFor="otherName">Отчество</label>
                <input
                  type="text"
                  className="form-control"
                  id="otherName"
                  required
                  value={other_name}
                  onChange={this.onChangeOtherName}
                  name="otherName"
                />
              </div>

              <div className="form-group">
                <label htmlFor="academiDegree">Звание/Ученая степень</label>
                <input
                  type="text"
                  className="form-control"
                  id="academicDegree"
                  required
                  value={academic_degree}
                  onChange={this.onChangeAcademicDegree}
                  name="academicDegree"
                />
              </div>
            <button onClick={this.saveTutorial} className="btn btn-success mt-3">
              Save
            </button>
          </div>
        )}
      </div>
    );
  }
}