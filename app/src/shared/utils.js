function mapRowToItem(row) {
  if (!row) return null;

  return {
    id: row.id.toString(),
    name: row.name,
    description: row.description,
    createdAt: row.created_at?.toISOString(),
    updatedAt: row.updated_at?.toISOString()
  };
}

function mapRowsToItems(rows) {
  return rows.map(mapRowToItem);
}

function handleError(error, context = '') {
  console.error(`Error in ${context}:`, error);

  if (error.code === '23505') {
    throw new Error('Item already exists');
  }

  if (error.code === '23503') {
    throw new Error('Referenced item does not exist');
  }

  throw error;
}

function validateItemInput(name, description) {
  if (!name || name.trim().length === 0) {
    throw new Error('Name is required');
  }

  if (name.length > 100) {
    throw new Error('Name must be less than 100 characters');
  }

  if (description && description.length > 5000) {
    throw new Error('Description must be less than 5000 characters');
  }


  return true;
}

module.exports = {
  mapRowToItem,
  mapRowsToItems,
  handleError,
  validateItemInput
};