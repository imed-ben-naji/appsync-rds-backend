const { getDbConnection } = require('../shared/db');
const { mapRowToItem, mapRowsToItems, handleError } = require('../shared/utils');

exports.handler = async (event) => {
  console.log('Query event:', JSON.stringify(event, null, 2));

  try {
    const client = await getDbConnection();
    const field = event.info.fieldName;

    if (field === "listItems") {
      const res = await client.query(
        "SELECT * FROM items ORDER BY created_at DESC"
      );
      return mapRowsToItems(res.rows);
    }

    if (field === "getItem") {
      const { id } = event.arguments;

      if (!id || isNaN(id)) {
        throw new Error('Invalid item ID');
      }

      const res = await client.query(
        "SELECT * FROM items WHERE id = $1",
        [id]
      );

      return mapRowToItem(res.rows[0]);
    }

    throw new Error(`Unknown query field: ${field}`);

  } catch (error) {
    handleError(error, `Query ${event.info.fieldName}`);
  }
};