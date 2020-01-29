const db = require("../connection/firebasecon");
getdoorbyID = (req, res, next) => {
    let door = [];
    let object = {};
    let id = req.params.id;
    db.collection('door').where("DesignID", "==", id).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                door.push(object);
            });
            res.json(door);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
};

insertdoor = (req, res, next) => {
    try {
        const door = req.body;
        if (!door) throw new Error('Text is blank');
        const data = {
            DoorName: door.DoorName,
            ConstructionRValue: door.ConstructionRValue,
            Width: door.Width,
            Height: door.Height,
            Area: door.Area,
            DesignID: door.DesignID,
            ProjectID: door.ProjectID,
            UserID: door.UserID
        };
        const ref = db.collection('door').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
};

updatedoor = (req, res, next) => {
    try {
        const id = req.params.id;
        const door = req.body;
        if (!id) throw new Error('id is blank');
        if (!door) throw new Error('Text is blank');
        const data = {
            DoorName: door.DoorName,
            ConstructionRValue: door.ConstructionRValue,
            Width: door.Width,
            Height: door.Height,
            Area: door.Area,
            DesignID: door.DesignID,
            ProjectID: door.ProjectID,
            UserID: door.UserID
        };
        const ref = db.collection('door').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
};

deletedoor = (req, res, next) => {
    try {

        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        db.collection('door')
            .doc(Id)
            .delete();

        res.json({
            id: Id,
        })


    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    getdoorbyID,
    insertdoor,
    updatedoor,
    deletedoor
};