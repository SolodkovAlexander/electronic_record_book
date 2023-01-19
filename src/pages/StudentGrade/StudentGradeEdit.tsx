import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import Select, { OnChangeValue } from 'react-select';
import { Application } from '../../Application';
import { RequestHelper } from '../../helpers/RequestHelper';

// define your option type
type MyOption = { label: string, value: string }

export default function StudentGradeEdit() {
    const { id } = useParams();

    const [grade, setGrade] = useState('');
    const [grade_receipt_date, setGradeReceiptDate] = useState(moment(new Date().toString()).format('yyyy-MM-DD'));
    const [submitted, setSubmitted] = useState(false);
    // useState for tracking data after render
    const [disciplines, setDisciplines] = useState([{ label: 'none', value: 'none' }]);
    const [students, setStudents] = useState([{ label: 'none', value: 'none' }]);
    const [test_types, setTestTypes] = useState([{ label: 'none', value: 'none' }]);

    const [grades, setGrades] = useState([{ label: 'none', value: 'none' }]);

    const [disciplineId, setDisciplineId] = useState('');
    const [studentId, setStudentId] = useState('');
    const [testTypeId, setTestTypeId] = useState('');

    const [oldDisciplineId, setOldDisciplineId] = useState('');
    const [oldStudentId, setOldStudentId] = useState('');
    const [oldTestTypeId, setOldTestTypeId] = useState('');

    const handleTestTypeOption = (selection: MyOption | null) => {
        if (selection) {
            console.log(selection.value);
            setTestTypeId(selection.value);

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
    useEffect(() => {
        async function getDisciplinesAsync() {
            const result = await RequestHelper.getTableDataWithRelations('discipline', 'curator');
            console.log('Disciplines are');
            console.log(result);
            let a: any[] = [];
            result.forEach((res: { name: any; objectId: any; curator: { last_name: any; first_name: any; other_name: any; } }) => {
                let professorShortName: string = res.curator ? (' - ' + res.curator.last_name + (res.curator.first_name ? ' ' + res.curator.first_name.charAt(0).concat('.') + (res.curator.other_name ? res.curator.other_name.charAt(0).concat('.') : '') : '')) : '';
                let disciplineName: string = res.name + professorShortName;
                a.push({ label: disciplineName, value: res.objectId });
            });
            console.log(a);
            setDisciplines(a);
            // console.log(result);
            // console.log(professors);
        }
        async function getStudentsAsync() {
            const result = await RequestHelper.getTableData('student');
            let a: any[] = [];
            result.forEach((res: { last_name: any; first_name: any; other_name: any; objectId: any; }) => {
                let shortName: string = res.last_name + (res.first_name ? ' ' + res.first_name.charAt(0).concat('.') + (res.other_name ? res.other_name.charAt(0).concat('.') : '') : '');

                a.push({ label: shortName, value: res.objectId });
            });
            console.log(a);
            setStudents(a);
            // console.log(result);
            // console.log(professors);
        }
        async function getTestTypesAsync() {
            const result = await RequestHelper.getTableData('test_type');
            let a: any[] = [];
            result.forEach((res: { name: any; objectId: any; }) => {
                a.push({ label: res.name, value: res.objectId });
            });
            console.log(a);
            setTestTypes(a);
            // console.log(result);
            // console.log(professors);
        }
        getDisciplinesAsync();
        getStudentsAsync();
        getTestTypesAsync();
    }, []);


    useEffect(() => {
        if (id) {
            getStudentGrade(id);
        }
    }, [id]);

    const getStudentGrade = (id: string) => {
        async function getCurrentStudentGradeAsync() {
            const result = await RequestHelper.getTableDataObjectWithRelations(id, 'student_grade', 'student,test_type,discipline');

            if (result) {
                setGrade(result.grade);
                setGradeReceiptDate(moment(new Date(result.grade_receipt_date).toString()).format('yyy-MM-DD'));

                if (result.discipline) {
                    setDisciplineId(result.discipline.objectId);
                    setOldDisciplineId(disciplineId);
                }
                if (result.student) {
                    setStudentId(result.student.objectId);
                    setOldStudentId(studentId);
                }
                if (result.test_type) {
                    setTestTypeId(result.test_type.objectId);
                    setOldTestTypeId(testTypeId);

                    let a: any[] = [];
                    switch (result.test_type.name) {
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
                }
            }
        }
        getCurrentStudentGradeAsync();
    };


    const updateData = () => {
        setSubmitted(true);

        if (id) {
            Application.updateTableObjectByObjectId('student_grade', id.toString(), { "grade": grade, "grade_receipt_date": grade_receipt_date }, false).then(
                (response: any) => {
                    setSubmitted(true);
                    console.log(response);
                    // rec_id = response.student_group[0];
                    // console.log(rec_id);

                    let url : string = 'student_grade/' + id.toString() + '/discipline';
                    console.log(url);

                    console.log('remove old relation discipline');
                    Application.deleteTablesObjectsRelations({ [url]: oldDisciplineId }).then(
                        (response: any) => {
                            console.log(response);
                        })
                        .catch((e: Error) => {
                            console.log(e);
                        });
                    console.log('add new relation');
                    Application.createTablesObjectsRelations({ [url]: disciplineId }).then(
                        (response: any) => {
                            console.log(response);
                        })
                        .catch((e: Error) => {
                            console.log(e);
                        });
                
                    url = 'student_grade/' + id.toString() + '/student';

                    console.log('remove old relation discipline');
                    Application.deleteTablesObjectsRelations({ [url]: oldStudentId }).then(
                        (response: any) => {
                            console.log(response);
                        })
                        .catch((e: Error) => {
                            console.log(e);
                        });
                    console.log('add new relation');
                    Application.createTablesObjectsRelations({ [url]: studentId }).then(
                        (response: any) => {
                            console.log(response);
                        })
                        .catch((e: Error) => {
                            console.log(e);
                        });

                    url = 'student_grade/' + id.toString() + '/test_type';
                    console.log('remove old relation discipline');
                    Application.deleteTablesObjectsRelations({ [url]: oldTestTypeId }).then(
                        (response: any) => {
                            console.log(response);
                        })
                        .catch((e: Error) => {
                            console.log(e);
                        });
                    console.log('add new relation');
                    Application.createTablesObjectsRelations({ [url]: testTypeId }).then(
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
    };
    return (
        <div className="submit-form" style={{ margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
            {submitted ? (
                <div>
                    <h4>Student's grade updated successfully!</h4>
                    <a className="btn btn-warning" role="button" href="/student_grades">Back to student's grades</a>
                </div>
            ) : (
                <Card className='mt-5' style={{ width: '40rem' }} >
                    <Card.Header>Edit student's grade</Card.Header>
                    <Card.Body>

                        <div>
                        <div className="row">
                                <div className="col-6">
                                    <label htmlFor="student">ФИО студента</label>
                                    <Select id="student" options={students} onChange={handleStudentOption} value={students[students.findIndex(x => x.value === studentId)]} placeholder="Выберите студента" />
                                </div>
                                <div className="col-6">
                                    <label htmlFor="discipline">Дисциплина</label>
                                    <Select id="discipline" options={disciplines} onChange={handleDisciplineOption} value={disciplines[disciplines.findIndex(x => x.value === disciplineId)]} placeholder="Выберите дисциплину" />
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-6">
                                    <label htmlFor="test_type">Вид тестирования</label>
                                    <Select id="test_type" options={test_types} onChange={handleTestTypeOption} value={test_types[test_types.findIndex(x => x.value === testTypeId)]} placeholder="Выберите вид тестирования" />
                                </div>
                                <div className="form-group col-6">
                                    <label htmlFor="grade">Оценка</label>
                                    <Select id="grade" options={grades} onChange={handleGradeOption} value={grades[grades.findIndex(x => x.value === grade)]} placeholder="Выберите оценку" />
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
                                        value={grade_receipt_date}
                                        onChange={(e) => {setGradeReceiptDate(moment(new Date(e.target.value).toString()).format('yyyy-MM-DD')); console.log(e.target.value);}}
                                        name="grade_receipt_date"
                                    />
                                </div>
                            </div>

                            <div className=' d-flex justify-content-center'>
                                <button onClick={updateData} className="btn btn-success mt-3">
                                    Update
                                </button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            )}
        </div>
    )
}
