const db = require("../connection/firebasecon");
getroofskylightmodelbyID = async(req, res, next) => {
    let projectid = req.params.id;
    let roofskylightmodel = [];
    let object = {};
    const ref = await db.collection('roofskylightmodel').where("DesignID", "==", projectid).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                roofskylightmodel.push(object);
            });
            res.status(200).json(roofskylightmodel);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
};

insertroofskylightmodel = async(req, res, next) => {
    try {
        const roofskylightmodel = req.body;
        if (!roofskylightmodel) throw new Error('Text is blank');
        const data = {
            Roof: roofskylightmodel.Roof,
            Skylight: roofskylightmodel.Skylight,
            ProjectID: roofskylightmodel.ProjectID,
            DesignID: roofskylightmodel.DesignID,
            UserID: roofskylightmodel.UserID,
            DateCreated: roofskylightmodel.DateCreated
        };
        const ref = await db.collection('roofskylightmodel').add(data);
        res.status(200).json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
};

updateroofskylightmodel = async(req, res, next) => {
    try {
        const id = req.params.id;
        const roofskylightmodel = req.body;
        if (!id) throw new Error('id is blank');
        if (!roofskylightmodel) throw new Error('Text is blank');
        const data = {
            Roof: roofskylightmodel.Roof,
            Skylight: roofskylightmodel.Skylight,
            ProjectID: roofskylightmodel.ProjectID,
            DesignID: roofskylightmodel.DesignID,
            UserID: roofskylightmodel.UserID
        };
        const ref = await db.collection('roofskylightmodel').doc(id).set(data, { merge: true });
        res.status(200).json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }

};

deleteroofskylightmodel = async(req, res, next) => {
    try {

        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        await db.collection('roofskylightmodel')
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
    getroofskylightmodelbyID,
    insertroofskylightmodel,
    updateroofskylightmodel,
    deleteroofskylightmodel
};