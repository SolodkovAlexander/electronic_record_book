import { Component, ChangeEvent } from "react";
import { Application } from "../../Application";
import { RequestHelper } from "../../helpers/RequestHelper";
// import TutorialDataService from "../services/tutorial.service";
import Group from '../../models/Group';

type Props = {};

type State = Group & {
  submitted: boolean
};

export default class GroupCreate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.saveTutorial = this.saveTutorial.bind(this);
    this.newGroup = this.newGroup.bind(this);

    this.state = {
      name: "",
      description: "",
      submitted: false
    };
  }

  onChangeName(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      name: e.target.value
    });
  }
  
  onChangeDescription(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
        description: e.target.value
    });
  }

  saveTutorial() {
    const data: Group = {
      name: this.state.name,
      description: this.state.name
    };

    Application.createTablesObjects({ Group: [{ "name": data.name, "description": data.description }] }).then(
       (response: any) => {
        this.setState({
          name: response.name,
          description: response.description,
          submitted: true
        });
        console.log(response.data);
       })
      .catch((e: Error) => {
        console.log(e);
      });     
  }

  newGroup() {
    this.setState({
      name: "",
      description: "",
      submitted: false
    });
  }

  render() {
    const { submitted, name, description} = this.state;

    return (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>Group added successfully!</h4>
            <button className="btn btn-success me-3" onClick={this.newGroup}>
              Add another
            </button>         
            <a className="btn btn-warning" role="button" href="/Groups">Back to Groups</a>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="name">Имя</label>
              <input
                type="text"
                className="form-control"
                id="name"
                required
                value={name}
                onChange={this.onChangeName}
                name="name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                required
                value={description}
                onChange={this.onChangeName}
                name="description"
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