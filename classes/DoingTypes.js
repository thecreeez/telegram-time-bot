module.exports = class DoingTypes {
  static REST = ["rest", "отдых", `rgb(211,250,72)`];
  static WORK = ["work", "работа", `rgb(138,3,34)`];
  static STUDY = ["study", "учеба", `rgb(81,3,138)`];
  static SLEEP = ["sleep", "сон", `rgb(35,128,235)`];
  static MOVING = ["moving", "передвижение", `rgb(65,235,35)`];
  static SELF_STUDY = ["self_study", "саморазвитие", `rgb(117,2,199)`];

  static getByText(text) {
    if (text === undefined) {
      return false;
    }

    for (let field in this) {
      if (this[field].indexOf(text.toLowerCase()) !== -1)
        return field;
    }

    return false;
  }

  static getAll() {
    let types = [];

    for (let field in this) {
      types.push([field, this[field]]);
    }

    return types;
  }
}