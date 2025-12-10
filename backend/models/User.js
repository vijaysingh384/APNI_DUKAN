// In-memory user storage (replace with database in production)
// This is a simple implementation for demo purposes

let users = [];

export class User {
  constructor({ email, password, name, role = 'customer', shopId = null }) {
    this.id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.email = email;
    this.password = password; // Will be hashed
    this.name = name;
    this.role = role; // 'customer' or 'shopkeeper'
    this.shopId = shopId;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static async findByEmail(email) {
    return users.find(u => u.email === email) || null;
  }

  static async findById(id) {
    return users.find(u => u.id === id) || null;
  }

  static async create(userData) {
    const user = new User(userData);
    users.push(user);
    return user;
  }

  static async update(id, updates) {
    const user = users.find(u => u.id === id);
    if (user) {
      Object.assign(user, updates);
      user.updatedAt = new Date().toISOString();
      return user;
    }
    return null;
  }

  static async delete(id) {
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users.splice(index, 1);
      return true;
    }
    return false;
  }

  // Remove password before sending to client
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

// Export users array for admin purposes (remove in production)
export { users };

