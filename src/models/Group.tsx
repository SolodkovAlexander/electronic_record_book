export default class Group {
  name: string;
  description: string;
  

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    
  }

  // return model fields to render table
  static describe(): any {
    return [{ field: 'name', headerName: 'Наименование' }, {field: 'description', headerName: 'Описание' } ];
  }
}
