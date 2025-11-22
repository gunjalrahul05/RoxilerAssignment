const db = require('../db/connection');

class Store {
  static tableName = 'stores';

  static async getAll(page = 1, limit = 10, filters = {}, userId = null) {
    const query = db(this.tableName)
      .select(
        'stores.id',
        'stores.name',
        'stores.email',
        'stores.address',
        db.raw('COALESCE(AVG(r.rating_value), 0) as average_rating'),
        db.raw('COUNT(DISTINCT r.id) as rating_count')
      )
      .leftJoin('ratings as r', 'stores.id', 'r.store_id')
      .groupBy('stores.id');

    if (filters.name) {
      query.where('stores.name', 'ilike', `%${filters.name}%`);
    }
    if (filters.email) {
      query.where('stores.email', 'ilike', `%${filters.email}%`);
    }
    if (filters.address) {
      query.where('stores.address', 'ilike', `%${filters.address}%`);
    }

    const countQuery = db(this.tableName).count('id as count').first();
    
    if (filters.name) {
      countQuery.where('name', 'ilike', `%${filters.name}%`);
    }
    if (filters.email) {
      countQuery.where('email', 'ilike', `%${filters.email}%`);
    }
    if (filters.address) {
      countQuery.where('address', 'ilike', `%${filters.address}%`);
    }

    const offset = (page - 1) * limit;
    const stores = await query.limit(limit).offset(offset);
    const total = await countQuery;

    if (userId) {
      const storeIds = stores.map(store => store.id);
      
      if (storeIds.length > 0) {
        const userRatings = await db('ratings')
          .select('store_id', 'rating_value')
          .whereIn('store_id', storeIds)
          .where('user_id', userId);
  
        stores.forEach(store => {
          const userRating = userRatings.find(r => r.store_id === store.id);
          store.user_rating = userRating ? userRating.rating_value : null;
          store.average_rating = parseFloat(store.average_rating).toFixed(1);
        });
      }
    } else {
      stores.forEach(store => {
        store.average_rating = parseFloat(store.average_rating).toFixed(1);
      });
    }

    return {
      data: stores,
      pagination: {
        page,
        limit,
        total: parseInt(total.count),
        totalPages: Math.ceil(total.count / limit)
      }
    };
  }

  static async getById(id, userId = null) {
    const store = await db(this.tableName)
      .select(
        'stores.id',
        'stores.name',
        'stores.email',
        'stores.address',
        'stores.owner_id',
        db.raw('COALESCE(AVG(r.rating_value), 0) as average_rating'),
        db.raw('COUNT(DISTINCT r.id) as rating_count')
      )
      .leftJoin('ratings as r', 'stores.id', 'r.store_id')
      .where('stores.id', id)
      .groupBy('stores.id')
      .first();

    if (!store) return null;
    
    store.average_rating = parseFloat(store.average_rating).toFixed(1);
    
    if (userId) {
      const userRating = await db('ratings')
        .select('rating_value')
        .where('store_id', id)
        .where('user_id', userId)
        .first();
      
      store.user_rating = userRating ? userRating.rating_value : null;
    }

    return store;
  }

  static _extractId(idResult) {
    if (typeof idResult === 'object' && idResult !== null) {
      return idResult.id;
    }
    return idResult;
  }

  static async create(storeData) {
    const [idResult] = await db(this.tableName).insert(storeData).returning('id');
    const id = this._extractId(idResult);
    return this.getById(id);
  }

  static async update(id, storeData) {
    storeData.updated_at = db.fn.now();
    await db(this.tableName).where({ id }).update(storeData);
    return this.getById(id);
  }

  static async delete(id) {
    return db(this.tableName).where({ id }).del();
  }

  static async getByOwnerId(ownerId) {
    return db(this.tableName)
      .select(
        'stores.id',
        'stores.name',
        'stores.email',
        'stores.address',
        db.raw('COALESCE(AVG(r.rating_value), 0) as average_rating'),
        db.raw('COUNT(DISTINCT r.id) as rating_count')
      )
      .leftJoin('ratings as r', 'stores.id', 'r.store_id')
      .where('stores.owner_id', ownerId)
      .groupBy('stores.id')
      .first();
  }

  static async getStoreRaters(storeId, page = 1, limit = 10) {
    const query = db('ratings as r')
      .select(
        'u.id',
        'u.name',
        'u.email',
        'u.address',
        'r.rating_value',
        'r.created_at',
        'r.updated_at'
      )
      .join('users as u', 'r.user_id', 'u.id')
      .where('r.store_id', storeId);

    const countQuery = db('ratings')
      .count('id as count')
      .where('store_id', storeId)
      .first();

    const offset = (page - 1) * limit;
    const users = await query.limit(limit).offset(offset);
    const total = await countQuery;

    return {
      data: users,
      pagination: {
        page,
        limit,
        total: parseInt(total.count),
        totalPages: Math.ceil(total.count / limit)
      }
    };
  }
}

module.exports = Store;
