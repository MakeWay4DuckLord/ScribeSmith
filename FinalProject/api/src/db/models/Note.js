module.exports = class Note {
    id = null;
    userId = null;
    campaignId = null;
    title = null;
    content = null;
    tags = null;
    sharedWith = null;
  
    constructor(data) {
      this.id = data.note_id;
      this.userId = data.note_owner_id;
      this.campaignId = data.note_campaign_id;
      this.title = data.note_title;
      this.content = data.note_text;
      // this.tags = [];
      // this.sharedWith = [];
    }
  
  };