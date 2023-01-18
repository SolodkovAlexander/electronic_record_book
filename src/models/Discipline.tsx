export default class Discipline {
  name: string;
  description: string;


  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;

  }

  rowDataGetter = function (params: any) {
    return params.data;
  };
  // return model fields to render table
  static describe(): any {
    return [{ field: 'name', headerName: 'Наименование дисциплины' }, { field: 'description', headerName: 'Описание' }, { field: 'curator.last_name', headerName: 'Ответственный преподаватель' }];
  }
}
