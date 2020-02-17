const db = require("../connection/firebasecon");
getwallbyID = async(req, res, next) => {
    let projectid = req.params.id;
    let wall = [];
    let object = {};
    const ref = await db.collection('wall').where("DesignID", "==", projectid).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                wall.push(object);
            });
            res.json(wall);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
};

insertwall = async(req, res, next) => {
    try {
        const wall = req.body;
        if (!wall) throw new Error('Text is blank');
        const data = {
            WallName: wall.WallName,
            ConstructionRValue: wall.ConstructionRValue,
            Description: wall.Description,
            DesignID: wall.DesignID,
            ProjectID: wall.ProjectID,
            UserID: wall.UserID
        };
        const ref = await db.collection('wall').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
};

updatewall = async(req, res, next) => {
    try {
        const id = req.params.id;
        const wall = req.body;
        if (!id) throw new Error('id is blank');
        if (!wall) throw new Error('Text is blank');
        const data = {
            WallName: wall.WallName,
            ConstructionRValue: wall.ConstructionRValue,
            Description: wall.Description,
            DesignID: wall.DesignID,
            ProjectID: wall.ProjectID,
            UserID: wall.UserID
        };
        const ref = await db.collection('wall').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
};

deletewall = async(req, res, next) => {
    try {
        console.log(req.params.id);
        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        await db.collection('wall')
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
    getwallbyID,
    insertwall,
    updatewall,
    deletewall
};