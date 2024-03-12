module.exports = class DoingTypes {
  static REST = ["rest", "отдых"];
  static WORK = ["work", "работа"];
  static STUDY = ["study", "учеба"];
  static SLEEP = ["sleep", "сон"];
  static MOVING = ["moving", "передвижение"];
  static SELF_STUDY = ["self_study", "саморазвитие"];

  static getByText(text) {
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