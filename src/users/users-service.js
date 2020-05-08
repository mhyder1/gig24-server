const UsersService = {
    getAllUsers(knex){
        return knex
         .select('*')
         .from('users');
    },
    insertUser(knex, newUser){
        return knex
         .insert(newUser)
         .into('users')
         .returning('*')
         .then(rows => { return rows[0] });
    },
    getUserById(knex, userId){
        return knex
         .select('*')
         .from('users')
         .where('id', userId)
         .first(); //get user itself
    },
    deleteUser(knex, userId){
        return knex('users')
         .where('id', userId)
         .delete();
    },
    updateUser(knex, userId, updatedUser){
        console.log(userId,updatedUser)
        return knex('users')
         .where('id', userId)
         .update(updatedUser);
    }
  };
  
  module.exports = UsersService;












