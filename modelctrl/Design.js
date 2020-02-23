const db = require("../connection/firebasecon");

getdesignbyprojectID = async(req, res, next) => {
    const projectid = req.params.projectid;
    if (!projectid) throw new Error('User ID or Project ID is blank');
    let design = [];
    let object = {};
    const ref = await db.collection('designbuilding').where("ProjectID", "==", projectid).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                design.push(object);
            });
            res.status(200).json(design);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
};

getdesignbyid = async(req, res, next) => {
    const designid = req.params.designid;
    if (!designid) throw new Error('User ID or Project ID is blank');
    //let design = [];
    let object = {};
    const ref = await db.collection('designbuilding').doc(designid).get()
        .then(function (doc) {
            if (doc.exists) {
                object = { id: doc.id, data: doc.data() }
                res.status(200).json(object);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
};

getalldesignbyprojectID = async(req, res, next) => {
    const userid = req.params.userid;
    const designid = req.params.designid;
    const projectid = req.params.projectid;
    if (!projectid || !userid || !designid) throw new Error('User ID, DesignID or Project ID is blank');
    let design = [];
    let object = {};
    const ref = await db.collection('designbuilding').where("ProjectID", "==", projectid).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                design.push(object);
            });
            res.status(200).json(design);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
};

getdesignbydatecreated = async(req, res, next) => {
    const userid = req.params.datetime;
    //const projectid = req.params.projectid;
    if (!userid) throw new Error('User ID or Project ID is blank');
    let object = {};
    const ref = await db.collection('designbuilding').where("DateCreated", "==", userid).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                if(doc.exists){
                    object = { id: doc.id, data: doc.data() };
                    res.status(200).json(object);
                }else{
                    res.status(400).json("No document found!");
                }
                
            });
            

        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
};

postdesign = async(req, res, next) => {
    try {
        const design = req.body;
        console.log(design);
        if (!design) throw new Error('Design is blank');
        const data = {
            DesignName: design.DesignName,
            TargetRating: design.TargetRating,
            CompletedBy: design.CompletedBy,
            DrawingSet: design.DrawingSet,
            Typology: design.Typology,
            FloorArea: Number(design.FloorArea),
            ProjectID: design.ProjectID,
            DateCreated: design.DateCreated,
            Climatetype: design.Climatetype,
            UserID: design.UserID,
            StreetName: design.StreetName,
            City: design.City,
            Postcode: design.Postcode,
            DateUpdate: design.DateUpdate
        };
        const ref = await db.collection('designbuilding').add(data);
        res.status(200).json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
};

updatedesign = async(req, res, next) => {
    try {
        const id = req.params.id;
        const design = req.body;
        if (!id) throw new Error('id is blank');
        if (!design) throw new Error('Text is blank');
        const data = {
            DesignName: design.DesignName,
            TargetRating: design.TargetRating,
            CompletedBy: design.CompletedBy,
            DrawingSet: design.DrawingSet,
            Typology: design.Typology,
            FloorArea: Number(design.FloorArea),
            ProjectID: design.ProjectID,
            DateCreated: design.DateCreated,
            Climatetype: design.Climatetype,
            UserID: design.UserID,
            StreetName: design.StreetName,
            City: design.City,
            Postcode: design.Postcode,
            DateUpdate: design.DateUpdate
        };
        const ref = await db.collection('designbuilding').doc(id).set(data, { merge: true });
        res.status(200).json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
};

deletedesign = async(req, res, next) => {
    try {

        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        await db.collection('designbuilding')
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
    getdesignbyprojectID,
    getdesignbyid,
    getdesignbydatecreated,
    getalldesignbyprojectID,
    postdesign,
    updatedesign,
    deletedesign
};

