const db = require("../connection/firebasecon");
getfloorbyID = async(req, res, next) => {
    let projectid = req.params.id
    let floor = [];
    let object = {};
    const ref = await db.collection('floor').where("DesignID", "==", projectid).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                floor.push(object);
            });
            res.status(200).json(floor);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
};

insertfloor = async(req, res, next) => {
    try {
        const floor = req.body;
        if (!floor) throw new Error('Text is blank');
        const data = {
            FloorName: floor.FloorName,
            ConstructionRValue: floor.ConstructionRValue,
            Description: floor.Description,
            DesignID: floor.DesignID,
            ProjectID: floor.ProjectID,
            UserID: floor.UserID,
            DateCreated: floor.DateCreated,
            DateModified: floor.DateModified
        };
        const ref = await db.collection('floor').add(data);
        res.status(200).json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
};

updatefloor = async(req, res, next) => {
    try {
        const id = req.params.id;
        const floor = req.body;
        if (!id) throw new Error('id is blank');
        if (!floor) throw new Error('Text is blank');
        const data = {
            FloorName: floor.FloorName,
            ConstructionRValue: floor.ConstructionRValue,
            Description: floor.Description,
            DesignID: floor.DesignID,
            ProjectID: floor.ProjectID,
            UserID: floor.UserID
        };
        const ref = await db.collection('floor').doc(id).set(data, { merge: true });
        res.status(200).json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
};

deletefloor = async(req, res, next) => {
    try {

        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        await db.collection('floor')
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
    getfloorbyID,
    insertfloor,
    updatefloor,
    deletefloor
};