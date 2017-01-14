import db from '../db';

/**
 * A short written work typically less than a single paragraph in length.
 *
 * @member Note
 * @memberof db
 * @type {external:Model}
 */
db.Note = db.sequelize.define(
  'note',
  {
    id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    content: {
      type: db.Sequelize.STRING,
    },
  },
  { underscored: true },
);

export default db.Note;
