const db = require('../db/connection');

class Rating {
  static tableName = 'ratings';

//getting all ratings
  static async getAll(page = 1, limit = 10, filters = {}) {
    const query = db(this.tableName)
      .select(
        'ratings.id',
        'ratings.rating_value',
        'ratings.created_at',
        'ratings.updated_at',
        'users.name as user_name',
        'users.email as user_email',
        'stores.name as store_name'
      )
      .join('users', 'ratings.user_id', 'users.id')
      .join('stores', 'ratings.store_id', 'stores.id');

//applying filter
    if (filters.userId) {
      query.where('ratings.user_id', filters.userId);
    }
    if (filters.storeId) {
      query.where('ratings.store_id', filters.storeId);
    }
    if (filters.minRating) {
      query.where('ratings.rating_value', '>=', filters.minRating);
    }
    if (filters.maxRating) {
      query.where('ratings.rating_value', '<=', filters.maxRating);
    }

    const countQuery = db(this.tableName).count('id as count');
    
    if (filters.userId) {
      countQuery.where('user_id', filters.userId);
    }
    if (filters.storeId) {
      countQuery.where('store_id', filters.storeId);
    }
    if (filters.minRating) {
      countQuery.where('rating_value', '>=', filters.minRating);
    }
    if (filters.maxRating) {
      countQuery.where('rating_value', '<=', filters.maxRating);
    }
    
    const countResult = await countQuery.first();

    const offset = (page - 1) * limit;
    const ratings = await query.limit(limit).offset(offset);

    return {
      data: ratings,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.count),
        totalPages: Math.ceil(countResult.count / limit)
      }
    };
  }

  //getting rating by id
  static async getById(id) {
    return db(this.tableName)
      .select(
        'ratings.id',
        'ratings.rating_value',
        'ratings.created_at',
        'ratings.updated_at',
        'ratings.user_id',
        'ratings.store_id',
        'users.name as user_name',
        'stores.name as store_name'
      )
      .join('users', 'ratings.user_id', 'users.id')
      .join('stores', 'ratings.store_id', 'stores.id')
      .where('ratings.id', id)
      .first();
  }

  static async getByUserAndStore(userId, storeId) {
    return db(this.tableName)
      .where({
        user_id: userId,
        store_id: storeId
      })
      .first();
  }

  static _extractId(idResult) {
    if (typeof idResult === 'object' && idResult !== null) {
      return idResult.id;
    }
    return idResult;
  }

  static async create(ratingData) {
    const [idResult] = await db(this.tableName).insert(ratingData).returning('id');
    const id = this._extractId(idResult);
    return this.getById(id);
  }

  static async update(id, ratingData) {
    ratingData.updated_at = db.fn.now();
    await db(this.tableName).where({ id }).update(ratingData);
    return this.getById(id);
  }

  static async delete(id) {
    return db(this.tableName).where({ id }).del();
  }

  static async getTotalCount() {
    const result = await db(this.tableName).count('id as count').first();
    return parseInt(result.count);
  }

  static async upsert(userId, storeId, ratingValue) {
    const existing = await this.getByUserAndStore(userId, storeId);
    
    if (existing) {
      await db(this.tableName)
        .where({
          user_id: userId,
          store_id: storeId
        })
        .update({
          rating_value: ratingValue,
          updated_at: db.fn.now()
        });
      return this.getByUserAndStore(userId, storeId);
    } else {
      const [id] = await db(this.tableName)
        .insert({
          user_id: userId,
          store_id: storeId,
          rating_value: ratingValue
        })
        .returning('id');
      return this.getById(id);
    }
  }
}

module.exports = Rating;
