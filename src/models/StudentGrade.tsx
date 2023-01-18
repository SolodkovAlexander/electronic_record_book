export default class StudentGrade {
  grade: string;
  grade_receipt_date: string;


  constructor(grade: string, grade_receipt_date: string) {
    this.grade = grade;
    this.grade_receipt_date = grade_receipt_date;

  }

  rowDataGetter = function (params: any) {
    return params.data;
  };
  // return model fields to render table
  static describe(): any {
    return [{ field: 'grade', headerName: 'Оценка' }, 
            { field: 'grade_receipt_date', headerName: 'Дата получения оценки' }, 
            { field: 'discipline.name', headerName: 'Дисциплина' },
            { field: 'student.last_name', headerName: 'Студент' },
            { field: 'test_type.name', headerName: 'Вид тестирования' }];
  }
}
