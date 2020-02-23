const db = require("../connection/firebasecon");
getskylightbyID = async(req, res, next) => {
    let skylight = [];
    let object = {};
    let id = req.params.id;
    const ref = await db.collection('skylight').where("DesignID", "==", id).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                skylight.push(object);
            });
            res.json(skylight);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
};

insertskylight = async(req, res, next) => {
    try {
        const skylight = req.body;
        if (!skylight) throw new Error('Text is blank');
        const data = {
            SkylightsName: skylight.SkylightsName,
            ConstructionRValue: skylight.ConstructionRValue,
            Width: skylight.Width,
            Length: skylight.Length,
            Area: skylight.Area,
            DesignID: skylight.DesignID,
            ProjectID: skylight.ProjectID,
            UserID: skylight.UserID,
            DateCreated: skylight.DateCreated
        };
        const ref = await db.collection('skylight').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
};

updateskylight = async(req, res, next) => {
    try {
        const id = req.params.id;
        const skylight = req.body;
        if (!id) throw new Error('id is blank');
        if (!skylight) throw new Error('Text is blank');
        const data = {
            SkylightsName: skylight.SkylightsName,
            ConstructionRValue: skylight.ConstructionRValue,
            Width: skylight.Width,
            Length: skylight.Length,
            Area: skylight.Area,
            DesignID: skylight.DesignID,
            ProjectID: skylight.ProjectID,
            UserID: skylight.UserID
        };
        const ref = await db.collection('skylight').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
};

deleteskylight = async(req, res, next) => {
    try {

        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        await db.collection('skylight')
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
    getskylightbyID,
    insertskylight,
    updateskylight,
    deleteskylight
};