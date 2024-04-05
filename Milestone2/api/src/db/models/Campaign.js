module.exports = class Campaign {
    id = null;
    ownerId = null;
    userIds = null;
    name = null;
    banner = null;
    description = null;
    tags = null;
    joinCode = null;
  
    constructor(data) {
      this.id = data.cpn_id;
      this.ownerId = data.cpn_owner_id;
      // this.userIds = []; // need to be retrieved from join table
      this.name = data.cpn_name;
      this.banner = data.cpn_banner;
      this.description = data.cpn_description;
      // this.tags = []; // join table
      this.joinCode = data.cpn_join_code;
    }
  
  };