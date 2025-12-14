/**
 * Map database row to Item GraphQL type
 */
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

/**
 * Map multiple database rows to Items
 */
function mapRowsToItems(rows) {
  return rows.map(mapRowToItem);
}

/**
 * Error handler with logging
 */
function handleError(error, context = '') {
  console.error(`Error in ${context}:`, error);

  // You can add custom error handling here
  // For example, different responses for different error types
  if (error.code === '23505') {
    // Unique constraint violation
    throw new Error('Item already exists');
  }

  if (error.code === '23503') {
    // Foreign key violation
    throw new Error('Referenced item does not exist');
  }

  throw error;
}

/**
 * Validate input
 */
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