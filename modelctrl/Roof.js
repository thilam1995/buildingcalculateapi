const db = require("../connection/firebasecon");
getroofbyID = async(req, res, next) => {
    let roof = [];
    let object = {};
    let id = req.params.id;
    const ref = await db.collection('roof').where("DesignID", "==", id).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                roof.push(object);
            });
            res.json(roof);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
};

insertroof = async(req, res, next) => {
    try {
        const roof = req.body;
        if (!roof) throw new Error('Text is blank');
        const data = {
            RoofName: roof.RoofName,
            ConstructionRValue: roof.ConstructionRValue,
            Description: roof.Description,
            DesignID: roof.DesignID,
            ProjectID: roof.ProjectID,
            UserID: roof.UserID
        };
        const ref = await db.collection('roof').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
};

updateroof = async(req, res, next) => {
    try {
        const id = req.params.id;
        const roof = req.body;
        if (!id) throw new Error('id is blank');
        if (!roof) throw new Error('Text is blank');
        const data = {
            RoofName: roof.RoofName,
            ConstructionRValue: roof.ConstructionRValue,
            Description: roof.Description,
            DesignID: roof.DesignID,
            ProjectID: roof.ProjectID,
            UserID: roof.UserID
        };
        const ref = await db.collection('roof').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
};

deleteroof = async(req, res, next) => {
    try {

        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        await db.collection('roof')
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
    getroofbyID,
    insertroof,
    updateroof,
    deleteroof
};