const db = require("../connection/firebasecon");

getfloormodelbyID = async(req, res, next) => {
    let designid = req.params.id;
    let floormodel = [];
    let object = {};
    const ref = await db.collection('floormodel').where("DesignID", "==", designid).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                floormodel.push(object);
            });
            res.status(200).json(floormodel);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
};

insertfloormodel = async(req, res, next) => {
    try {
        const floormodel = req.body;
        if (!floormodel) throw new Error('Text is blank');
        const data = {
            Floor: floormodel.Floor,
            ProjectID: floormodel.ProjectID,
            DesignID: floormodel.DesignID,
            UserID: floormodel.UserID,
            DateCreated: floormodel.DateCreated,
            DateModified: floormodel.DateModified
        };
        const ref = await db.collection('floormodel').add(data);
        res.status(200).json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
};

updatefloormodel = async(req, res, next) => {
    try {
        const id = req.params.id;
        const floormodel = req.body;
        if (!id) throw new Error('id is blank');
        if (!floormodel) throw new Error('Text is blank');
        const data = {
            Floor: floormodel.Floor,
            ProjectID: floormodel.ProjectID,
            DesignID: floormodel.DesignID,
            UserID: floormodel.UserID,
        };
        const ref = await db.collection('floormodel').doc(id).set(data, { merge: true });
        res.status(200).json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
};

deletefloormodel = async(req, res, next) => {
    try {

        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        await db.collection('floormodel')
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
    getfloormodelbyID,
    insertfloormodel,
    updatefloormodel,
    deletefloormodel
};