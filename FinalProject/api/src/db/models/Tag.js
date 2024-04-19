module.exports = class Tag {
    id = null;
    text = null;
  
    constructor(data) {
      this.id = data.tag_id;
      this.text = data.tag_text;
    }
  
  };