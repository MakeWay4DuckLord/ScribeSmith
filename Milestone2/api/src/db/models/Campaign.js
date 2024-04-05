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
      if(data.cpn_user_ids) {
        this.userIds = JSON.parse(data.cpn_user_ids);
      }
      this.name = data.cpn_name;
      this.banner = data.cpn_banner;
      this.description = data.cpn_description;
      if(data.cpn_tags) {
        this.tags = JSON.parse(data.cpn_tags);
      }
      this.joinCode = data.cpn_join_code;
    }
  
  };