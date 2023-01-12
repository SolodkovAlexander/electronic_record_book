export default class Student {
  first_name: string;
  last_name: string;
  other_name: string;
  
  constructor(first_name: string, last_name: string, other_name: string) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.other_name = other_name;
  }

  // return model fields to render table
  static describe(): any {
    return [{ field: 'last_name', headerName: 'Фамилия' },
    { field: 'first_name', headerName: 'Имя' },
    { field: 'other_name', headerName: 'Отчество' }];
  }
}
