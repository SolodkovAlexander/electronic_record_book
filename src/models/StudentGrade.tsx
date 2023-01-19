import moment from "moment";

export default class StudentGrade {
  grade: string;
  grade_receipt_date: Date;


  constructor(grade: string, grade_receipt_date: string) {
    this.grade = grade;
    this.grade_receipt_date = new Date(grade_receipt_date);

  }

  rowDataGetter = function (params: any) {
    return params.data;
  };
  // return model fields to render table
  static describe(): any {
    return [{ field: 'grade', headerName: 'Оценка', width: 110, wrapHeaderText: true, autoHeaderHeight: true}, 
            { field: 'grade_receipt_date', 
              headerName: 'Дата получения оценки', 
              cellRenderer: (data: any) => {
                return moment(data.value).format('DD.MM.YYYY');                
              },
              width: 110,
              wrapHeaderText: true, 
              autoHeaderHeight: true
            }, 
            { field: 'discipline.name', 
              headerName: 'Дисциплина', 
              width: 180, 
              wrapHeaderText: true, 
              autoHeaderHeight: true },
            { field: 'student.last_name', 
              headerName: 'Студент', 
              cellRenderer: (data: any) => {
                // get student full name short form (i.e. Brown D.E.)
                return data.data.student.last_name + (data.data.student.first_name ? ' ' + data.data.student.first_name.charAt(0).concat('.') + (data.data.student.other_name ? data.data.student.other_name.charAt(0).concat('.') : '') : '');
              },
              width: 150, 
              wrapHeaderText: true, 
              autoHeaderHeight: true },
            { field: 'test_type.name', headerName: 'Вид тестирования', width: 185, wrapHeaderText: true, autoHeaderHeight: true, wrapText: true, autoHeight: true }];
  }
}
