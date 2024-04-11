const db = require('./DBConnection');
const Note = require('./models/Note');
const Tag = require('./models/Tag');


function getViewableNotesByCampaign(userId, campaignId) {
    let p = new Promise((resolve, reject) => {
        db.query('SELECT * FROM note LEFT JOIN note_user ON ntu_note_id=note_id WHERE note_campaign_id=? AND (note_owner_id=? OR ntu_usr_id=?) GROUP BY note_id;', [campaignId, userId, userId]).then(({ results }) => {
            resolve(results.map(note => new Note(note)));
        });
    });
    // TODO - is there a way to fix this to avoid duplicate code??????????????????
    p = p.then(notes => {
        if (notes.length > 0) {
            const noteIds = notes.map(note => note.id);
            return db.query('SELECT * FROM tag INNER JOIN note_tag ON tag.tag_id = note_tag.ntg_tag_id WHERE note_tag.ntg_note_id IN (?);', [noteIds])
                .then(({ results }) => {
                    const tagsByNoteId = {};
                    // grab all the tags and then sort them into the notes they belong to
                    results.forEach(tag => {
                        const noteId = tag.ntg_note_id;
                        if (!tagsByNoteId[noteId]) {
                            tagsByNoteId[noteId] = [];
                        }
                        tagsByNoteId[noteId].push(tag.tag_text);
                    });
                    // assign tag arrays to notes
                    notes.forEach(note => {
                        note.sharedWith = []; // TODO - TEMPORARY!!!!!!!!!!!!!!!!
                        note.tags = tagsByNoteId[note.id] || [];
                    });
                    return notes;
                });
        } else {
            return notes;
        }
    });

    return p;
}

function getViewableNotesByAuthorByCampaign(userId, authorId, campaignId) {
    let p = new Promise((resolve, reject) => {
        if (userId == authorId) {
            db.query('SELECT * FROM note WHERE note_campaign_id=? AND note_owner_id=?;', [campaignId, authorId]).then(({ results }) => {
                resolve(results.map(note => new Note(note)));
            });
        } else {
            // removed a GROUP BY note_id bc i don't think i need it
            return db.query('SELECT * FROM note JOIN note_user ON ntu_note_id=note_id WHERE note_campaign_id=? AND note_owner_id=? AND ntu_usr_id=?;', [campaignId, authorId, userId]).then(({ results }) => {
                resolve(results.map(note => new Note(note)));
            });
        }
    });
    p = p.then(notes => {
        if (notes.length > 0) {
            const noteIds = notes.map(note => note.id);
            return db.query('SELECT * FROM tag INNER JOIN note_tag ON tag.tag_id = note_tag.ntg_tag_id WHERE note_tag.ntg_note_id IN (?);', [noteIds])
                .then(({ results }) => {
                    const tagsByNoteId = {};
                    // grab all the tags and then sort them into the notes they belong to
                    results.forEach(tag => {
                        const noteId = tag.ntg_note_id;
                        if (!tagsByNoteId[noteId]) {
                            tagsByNoteId[noteId] = [];
                        }
                        tagsByNoteId[noteId].push(tag.tag_text);
                    });
                    // assign tag arrays to notes
                    notes.forEach(note => {
                        note.sharedWith = []; // TODO - TEMPORARY!!!!!!!!!!!!!!!!
                        note.tags = tagsByNoteId[note.id] || [];
                    });
                    return notes;
                });
        } else {
            return notes;
        }
    });

    return p;
}

module.exports = {
    getViewableNotesByCampaign,
    getViewableNotesByAuthorByCampaign
};