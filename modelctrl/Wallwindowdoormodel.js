const db = require("../connection/firebasecon");

getwallwindowdoormodelbyID = async(req, res, next) => {
    let designid = req.params.id;
    let wallwindowdoormodel = [];
    let object = {};
    const ref = await db.collection('wallwindowdoormodel').where("DesignID", "==", designid).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                wallwindowdoormodel.push(object);
            });
            res.json(wallwindowdoormodel);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
};

insertwallwindowdoormodel = async(req, res, next) => {
    try {
        const wallwindowdoormodel = req.body;
        if (!wallwindowdoormodel) throw new Error('Text is blank');
        const data = {
            Wall: wallwindowdoormodel.Wall,
            Window: wallwindowdoormodel.Window,
            Door: wallwindowdoormodel.Door,
            Orientation: wallwindowdoormodel.Orientation,
            ProjectID: wallwindowdoormodel.ProjectID,
            DesignID: wallwindowdoormodel.DesignID,
            UserID: wallwindowdoormodel.UserID,
            DateCreated: wallwindowdoormodel.DateCreated,
            DateModified: wallwindowdoormodel.DateModified
        };
        const ref = await db.collection('wallwindowdoormodel').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
};

updatewallwindowdoormodel = async(req, res, next) => {
    try {
        const id = req.params.id;
        const wallwindowdoormodel = req.body;
        if (!id) throw new Error('id is blank');
        if (!wallwindowdoormodel) throw new Error('Text is blank');
        const data = {
            Wall: wallwindowdoormodel.Wall,
            Window: wallwindowdoormodel.Window,
            Door: wallwindowdoormodel.Door,
            Orientation: wallwindowdoormodel.Orientation,
            ProjectID: wallwindowdoormodel.ProjectID,
            DesignID: wallwindowdoormodel.DesignID,
            UserID: wallwindowdoormodel.UserID
        };
        const ref = await db.collection('wallwindowdoormodel').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
};

deletewallwindowdoormodel = async(req, res, next) => {
    try {

        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        await db.collection('wallwindowdoormodel')
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
    getwallwindowdoormodelbyID,
    insertwallwindowdoormodel,
    updatewallwindowdoormodel,
    deletewallwindowdoormodel
};