module.exports = class User {
    userId = null;
    first_name = null;
    last_name = null;
    email = null;
    password = null;
    salt = null;
    icon = null;
  
    constructor(data) {
      this.userId = data.usr_id;
      this.first_name = data.usr_first_name;
      this.last_name = data.usr_last_name;
      this.email = data.usr_email;
      this.password = data.usr_password;
      this.salt = data.usr_salt;
      this.icon = data.usr_icon;
    }
  
  };