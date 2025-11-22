const db = require('../db/connection');

class User {
  static tableName = 'users';

  static async getAll(page = 1, limit = 10, filters = {}) {
    const query = db(this.tableName)
      .select(
        'users.id',
        'users.name',
        'users.email',
        'users.address',
        'roles.name as role',
        // Subquery for average rating if user is a STORE_OWNER
        db.raw(`CASE 
          WHEN roles.name = 'STORE_OWNER' 
          THEN (
            SELECT COALESCE(AVG(r.rating_value), 0)
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.owner_id = users.id
          )
          ELSE NULL
        END as ranking`)
      )
      .join('roles', 'users.role_id', 'roles.id')
      .groupBy('users.id', 'roles.name');

    if (filters.name) {
      query.where('users.name', 'ilike', `%${filters.name}%`);
    }
    if (filters.email) {
      query.where('users.email', 'ilike', `%${filters.email}%`);
    }
    if (filters.address) {
      query.where('users.address', 'ilike', `%${filters.address}%`);
    }
    if (filters.role) {
      query.where('roles.name', filters.role);
    }

    const countQuery = db(this.tableName)
      .count('users.id as count')
      .join('roles', 'users.role_id', 'roles.id');

    if (filters.name) {
      countQuery.where('users.name', 'ilike', `%${filters.name}%`);
    }
    if (filters.email) {
      countQuery.where('users.email', 'ilike', `%${filters.email}%`);
    }
    if (filters.address) {
      countQuery.where('users.address', 'ilike', `%${filters.address}%`);
    }
    if (filters.role) {
      countQuery.where('roles.name', filters.role);
    }

    const offset = (page - 1) * limit;
    const users = await query.limit(limit).offset(offset);
    const total = await countQuery.first();

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

  static async getById(id) {
    const user = await db(this.tableName)
      .select(
        'users.id',
        'users.name',
        'users.email',
        'users.address',
        'roles.name as role'
      )
      .join('roles', 'users.role_id', 'roles.id')
      .where('users.id', id)
      .first();

    if (user && user.role === 'STORE_OWNER') {
      const storeRating = await db('stores')
        .select(db.raw('COALESCE(AVG(r.rating_value), 0) as average_rating'))
        .leftJoin('ratings as r', 'stores.id', 'r.store_id')
        .where('stores.owner_id', id)
        .first();

      user.rating = parseFloat(storeRating.average_rating).toFixed(1);
    }

    return user;
  }

  static async getByEmail(email) {
    return db(this.tableName)
      .select('users.*', 'roles.name as role')
      .join('roles', 'users.role_id', 'roles.id')
      .where('users.email', email)
      .first();
  }

  static _extractId(idResult) {
    if (typeof idResult === 'object' && idResult !== null) {
      return idResult.id;
    }
    return idResult;
  }

  static async create(userData) {
    const [idResult] = await db(this.tableName).insert(userData).returning('id');
    const id = this._extractId(idResult);
    return this.getById(id);
  }

  static async update(id, userData) {
    userData.updated_at = db.fn.now();
    await db(this.tableName).where({ id }).update(userData);
    return this.getById(id);
  }

  static async delete(id) {
    return db(this.tableName).where({ id }).del();
  }

  static async updatePassword(id, hashedPassword) {
    return db(this.tableName)
      .where({ id })
      .update({
        password: hashedPassword,
        updated_at: db.fn.now()
      });
  }

  static async getRoleIdByName(roleName) {
    const role = await db('roles').where('name', roleName).first();
    return role ? role.id : null;
  }
}

module.exports = User;
