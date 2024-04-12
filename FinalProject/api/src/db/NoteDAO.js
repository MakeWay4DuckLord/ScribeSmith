const { getTagsByCampaignId } = require('./CampaignDAO');
const db = require('./DBConnection');
const Note = require('./models/Note');

// helpers

addTagsToNotes = (notes) => {
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
                    note.tags = tagsByNoteId[note.id] || [];
                });
                return notes;
            });
    } else {
        return notes;
    }
};

addSharesToNotes = (notes) => {
    if (notes.length > 0) {
        const noteIds = notes.map(note => note.id);
        return db.query('SELECT * FROM user INNER JOIN note_user ON user.usr_id = note_user.ntu_usr_id WHERE note_user.ntu_note_id IN (?);', [noteIds])
            .then(({ results }) => {
                const usersByNoteId = {};
                // grab all the tags and then sort them into the notes they belong to
                results.forEach(user => {
                    const noteId = user.ntu_note_id;
                    if (!usersByNoteId[noteId]) {
                        usersByNoteId[noteId] = [];
                    }
                    usersByNoteId[noteId].push(user.usr_id);
                });
                // assign tag arrays to notes
                notes.forEach(note => {
                    note.sharedWith = usersByNoteId[note.id] || [];
                });
                return notes;
            });
    } else {
        return notes;
    }
};

getOrInsertTagId = (tagText) => {
    console.log("trying to process tag", tagText);
    return new Promise((resolve, reject) => {
        db.query('SELECT tag_id FROM tag WHERE tag_text = ?', [tagText]).then(({ results }) => {
            if (results.length > 0) {
                console.log("tag id found", results[0].tag_id);
                resolve(results[0].tag_id);
            } else {
                db.query('INSERT INTO tag (tag_text) VALUES (?)', [tagText]).then(({ results }) => {
                    console.log("inserting tag");
                    resolve(results.insertId); // Return the id of the newly inserted tag
                });
            }
        })
    });
};

tagNote = (note, tagIds) => {
    const valuePairs = tagIds.map(tagId => [note.id, tagId]);
    console.log("inserting", valuePairs);
    return db.query('INSERT INTO note_tag (ntg_note_id, ntg_tag_id) VALUES ?', [valuePairs]).then(({results}) => {
        // TODO: err checking here
        return note;
    });
};

function getViewableNotesByCampaign(userId, campaignId) {
    let p = new Promise((resolve, reject) => {
        db.query('SELECT * FROM note LEFT JOIN note_user ON ntu_note_id=note_id WHERE note_campaign_id=? AND (note_owner_id=? OR ntu_usr_id=?) GROUP BY note_id;', [campaignId, userId, userId]).then(({ results }) => {
            resolve(results.map(note => new Note(note)));
        });
    });
    p = p.then(addTagsToNotes).then(addSharesToNotes);

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
    p = p.then(addTagsToNotes).then(addSharesToNotes);

    return p;
}

function createNote(note) {
    let p = new Promise((resolve, reject) => {
        db.query('INSERT INTO note (note_owner_id, note_campaign_id, note_title, note_text) VALUES (?, ?, ?, ?)',
            [note.ownerId, note.campaignId, note.title, note.content]).then(({ results }) => {

                note.id = results.insertId;

                // need to promise.all to make sure all tags are in the tags table
                const tagPromises = [];

                // for each tag
                note.tags.forEach(tag => {
                    // this array will resolve to an array of TAG IDs
                    tagPromises.push(getOrInsertTagId(tag));
                });

                Promise.all(tagPromises).then(tagIds => {
                    console.log("tag promises resolved, tag ids", tagIds);
                    tagNote(note, tagIds).then(note => {
                        resolve(note); // ????
                    });
                });

                // resolve(note);
            });
    });

    return p;
}

module.exports = {
    getViewableNotesByCampaign,
    getViewableNotesByAuthorByCampaign,
    createNote
};