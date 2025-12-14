const { getDbConnection, ensureTableExists } = require('../shared/db');
const { mapRowToItem, handleError, validateItemInput } = require('../shared/utils');

exports.handler = async (event) => {
  console.log('Mutation event:', JSON.stringify(event, null, 2));

  try {
    const client = await getDbConnection();
    const field = event.info.fieldName;

    // Ensure table exists (only needed on first run)
    await ensureTableExists(client);

    if (field === "createItem") {
      const { name, description } = event.arguments;

      // Validate input
      validateItemInput(name, description);

      const res = await client.query(
        "INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *",
        [name.trim(), description?.trim() || null]
      );

      return mapRowToItem(res.rows[0]);
    }

    if (field === "updateItem") {
      const { id, name, description } = event.arguments;

      // Validate ID
      if (!id || isNaN(id)) {
        throw new Error('Invalid item ID');
      }

      // Validate input if provided
      if (name !== undefined) {
        validateItemInput(name, description);
      }

      const res = await client.query(
        `UPDATE items 
         SET name = COALESCE($1, name), 
             description = COALESCE($2, description), 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $3 
         RETURNING *`,
        [name?.trim(), description?.trim(), id]
      );

      if (res.rows.length === 0) {
        throw new Error(`Item with id ${id} not found`);
      }

      return mapRowToItem(res.rows[0]);
    }

    if (field === "deleteItem") {
      const { id } = event.arguments;

      // Validate ID
      if (!id || isNaN(id)) {
        throw new Error('Invalid item ID');
      }

      const res = await client.query(
        "DELETE FROM items WHERE id = $1 RETURNING id",
        [id]
      );

      if (res.rows.length === 0) {
        throw new Error(`Item with id ${id} not found`);
      }

      return true;
    }

    throw new Error(`Unknown mutation field: ${field}`);

  } catch (error) {
    handleError(error, `Mutation ${event.info.fieldName}`);
  }
};
