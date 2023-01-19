import React, { useEffect, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap'
import Select, { OnChangeValue } from 'react-select';
import { Application } from '../../Application';
import { RequestHelper } from '../../helpers/RequestHelper';


// define your option type
type MyOption = { label: string, value: string }

export default function StudentGradeCreate() {
    const [grade, setGrade] = useState('');
    const [gradeReceiptDate, setGradeReceiptDate] = useState('');

    // to check that data was submitted and show notice
    const [submitted, setSubmitted] = useState(false);

    // data for select
    const [disciplines, setDisciplines] = useState([{ label: 'none', value: 'none' }]);
    const [students, setStudents] = useState([{ label: 'none', value: 'none' }]);
    const [testTypes, setTestTypes] = useState([{ label: 'none', value: 'none' }]);

    // data for grade select, yes grade is string, but i will select it to prevent user's imnput variations
    const [grades, setGrades] = useState([{ label: 'none', value: 'none' }]);

    // id's of selected values to put them in tables (make relations)
    const [disciplineId, setDisciplineId] = useState('');
    const [studentId, setStudentId] = useState('');
    const [testTypeId, setTestTypeId] = useState('');

    // grade select is disabled until test_type not selected
    const [isGradeSelectDisabled, setIsGradeSelectDisabled] = useState(true);

    // test_type select handler
    const handleTestTypeOption = (selection: MyOption | null) => {
        if (selection) {
            console.log(selection.value);
            setTestTypeId(selection.value);

            // make custom options array to prevent user's input varioation of grade value 
            let a: any[] = [];
            switch (selection.label) {
                case 'Экзамен':
                    a = [{ label: 'Отл', value: 'Отл' }, { label: 'Хор', value: 'Хор' }, { label: 'Удовл', value: 'Удовл' }, { label: 'Неуд', value: 'Неуд' }];
                    break;

                case 'Зачет':
                    a = [{ label: 'Зачтено', value: 'Зачтено' }, { label: 'Не зачтено', value: 'Не зачтено' }];
                    break;

                case 'Практика':
                    a = [{ label: 'Сдана', value: 'Сдана' }, { label: 'Не сдана', value: 'Не сдана' }];
                    break;

                case 'Практика (с оценкой)':
                    a = [{ label: 'Отл', value: 'Отл' }, { label: 'Хор', value: 'Хор' }, { label: 'Удовл', value: 'Удовл' }, { label: 'Неуд', value: 'Неуд' }];
                    break;

                default:
                    break;
            }
            setGrades(a);
            // enable grade select component
            setIsGradeSelectDisabled(false);

        }
    };

    const handleGradeOption = (selection: MyOption | null) => {
        if (selection) {
            console.log(selection.value);
            setGrade(selection.value);
        }
    };

    const handleStudentOption = (selection: MyOption | null) => {
        if (selection) {
            console.log(selection.value);
            setStudentId(selection.value);
        }
    };

    const handleDisciplineOption = (selection: MyOption | null) => {
        if (selection) {
            console.log(selection.value);
            setDisciplineId(selection.value);
        }
    };

    // useEffect to async call for data
    // here we will collect data from api to construct options for select (dropdowns)
    useEffect(() => {
        async function getDisciplinesAsync() {
            const result = await RequestHelper.getTableDataWithRelations('discipline', 'curator');
            console.log('Disciplines are');
            console.log(result);
            let a: any[] = [];
            result.forEach((res: { name: any; objectId: any; curator: { last_name: any; first_name: any; other_name: any; } }) => {
                // combine last_name, first_name and other_name to show short form (i.e. Brown D.E.)
                let professorShortName: string = res.curator ? (' - ' + res.curator.last_name + (res.curator.first_name ? ' ' + res.curator.first_name.charAt(0).concat('.') + (res.curator.other_name ? res.curator.other_name.charAt(0).concat('.') : '') : '')) : '';
                // combine discipline name and professor's name short form
                let disciplineName: string = res.name + professorShortName;
                a.push({ label: disciplineName, value: res.objectId });
            });
            console.log(a);
            setDisciplines(a);
        }
        // get data from student table
        async function getStudentsAsync() {
            const result = await RequestHelper.getTableData('student');
            let a: any[] = [];
            result.forEach((res: { last_name: any; first_name: any; other_name: any; objectId: any; }) => {
                // get student full name short form (i.e. Brown D.E.)
                let shortName: string = res.last_name + (res.first_name ? ' ' + res.first_name.charAt(0).concat('.') + (res.other_name ? res.other_name.charAt(0).concat('.') : '') : '');

                a.push({ label: shortName, value: res.objectId });
            });
            console.log(a);
            setStudents(a);
        }
        // get data from test_type table
        async function getTestTypesAsync() {
            const result = await RequestHelper.getTableData('test_type');
            let a: any[] = [];
            result.forEach((res: { name: any; objectId: any; }) => {
                a.push({ label: res.name, value: res.objectId });
            });
            console.log(a);
            setTestTypes(a);
        }
        getDisciplinesAsync();
        getStudentsAsync();
        getTestTypesAsync();
    }, []);


    const newStudentGrade = () => {
        setGrade("");
        // TODO: here must be some data format (in create may use as is, but in edit it will be something else..)
        setGradeReceiptDate("");
        // set submit with false and show user form
        setSubmitted(false);
    }

    const postData = () => {
        // set submit with true and show user some notice
        setSubmitted(true);
        // save rec_id to use it when save relations
        let recId: string = '';
        //save main object (student_grade)
        Application.createTablesObjects({ student_grade: [{ "grade": grade, "grade_receipt_date": gradeReceiptDate }] }).then(
            (response: any) => {
                setSubmitted(true);
                console.log(response);
                // get record_id
                recId = response.student_grade[0];
                console.log(recId);

                let url: string = 'student_grade/' + recId.toString() + '/student';
                console.log(url);
                Application.createTablesObjectsRelations({ [url]: studentId }).then(
                    (response: any) => {
                        console.log(response);
                    })
                    .catch((e: Error) => {
                        console.log(e);
                    });

                url = 'student_grade/' + recId.toString() + '/test_type';
                console.log(url);
                Application.createTablesObjectsRelations({ [url]: testTypeId }).then(
                    (response: any) => {
                        console.log(response);
                    })
                    .catch((e: Error) => {
                        console.log(e);
                    });

                url = 'student_grade/' + recId.toString() + '/discipline';
                console.log(url);
                Application.createTablesObjectsRelations({ [url]: disciplineId }).then(
                    (response: any) => {
                        console.log(response);
                    })
                    .catch((e: Error) => {
                        console.log(e);
                    });
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }
    return (
        <div className="submit-form" style={{ margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
            {submitted ? (
                <div>
                    <h4>Student Grade added successfully!</h4>
                    <button className="btn btn-success me-3" onClick={newStudentGrade}>
                        Add another
                    </button>
                    <a className="btn btn-warning" role="button" href="/student_grades">Back to Student Grades</a>
                </div>
            ) : (
                <Card className='mt-5' style={{ width: '40rem' }} >
                    <Card.Header>Add new StudentGrade</Card.Header>
                    <Card.Body>
                        <div>
                            <div className="row">
                                <div className="col-6">
                                    <label htmlFor="student">ФИО студента</label>
                                    <Select id="student" options={students} onChange={handleStudentOption} placeholder="Выберите студента" />
                                </div>
                                <div className="col-6">
                                    <label htmlFor="discipline">Дисциплина</label>
                                    <Select id="discipline" options={disciplines} onChange={handleDisciplineOption} placeholder="Выберите дисциплину" />
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-6">
                                    <label htmlFor="test_type">Вид тестирования</label>
                                    <Select id="test_type" options={testTypes} onChange={handleTestTypeOption} placeholder="Выберите вид тестирования" />
                                </div>
                                <div className="form-group col-6">
                                    <label htmlFor="grade">Оценка</label>
                                    <Select id="grade" options={grades} onChange={handleGradeOption} placeholder="Выберите оценку" isDisabled={isGradeSelectDisabled} />
                                </div>

                            </div>

                            <div className="row mt-2 d-flex justify-content-end">
                                <div className="form-group col-6">
                                    <label htmlFor="grade_receipt_date">Дата получения оценки</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="grade_receipt_date"
                                        required
                                        value={gradeReceiptDate}
                                        onChange={(e) => setGradeReceiptDate(e.target.value)}
                                        name="grade_receipt_date"
                                    />
                                </div>
                            </div>


                            <div className=' d-flex justify-content-center'>
                                <button onClick={postData} className="btn btn-success mt-3">
                                    Save
                                </button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            )}
        </div>
    )
}
