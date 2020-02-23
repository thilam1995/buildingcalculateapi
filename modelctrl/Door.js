const db = require("../connection/firebasecon");
getdoorbyID = async(req, res, next) => {
    let door = [];
    let object = {};
    let id = req.params.id;
    const ref = await db.collection('door').where("DesignID", "==", id).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                door.push(object);
            });
            res.status(200).json(door);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
};

insertdoor = async(req, res, next) => {
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
            UserID: door.UserID,
            DateCreated: door.DateCreated,
            DateModified: door.DateModified
        };
        const ref = await db.collection('door').add(data);
        res.status(200).json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
};

updatedoor = async(req, res, next) => {
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
            UserID: door.UserID,

        };
        const ref = await db.collection('door').doc(id).set(data, { merge: true });
        res.status(200).json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
};

deletedoor = async(req, res, next) => {
    try {

        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        await db.collection('door')
            .doc(Id)
            .delete();

        res.status(200).json({
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