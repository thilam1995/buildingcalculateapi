const db = require("../connection/firebasecon");
getProjectbyuserid = async(req, res, next) => {
    let project = [];
    let object = {};
    let projectdb = db.collection('projectbuilding');
    //console.log(req.params.id);
    const ref = await projectdb.where("UserID", "==", req.params.id).get()
        .then((snapshot) => {
            // if (snapshot.empty) {
            //     console.log('No matching documents.');
            //     return;
            // }
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                project.push(object);
            });
            res.json(project);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
};

getProjectbyid = async(req, res, next) => {
    try {
        let id = req.params.projectid;
        if (!id) throw new Error('id is blank');
        else {
            const project = await db.collection('projectbuilding').doc(id).get()
            .then(e => {
                res.status(200).json({
                    id: e.id,
                    data: e.data()
                });
            }).catch(e => {
                res.status(400).send(e);
                throw new Error('project does not exists');
            });

        }

    } catch (e) {
        next(e);
    }
};

insertproject = async(req, res, next) => {
    try {
        const project = req.body;
        if (!project.ProjectName) throw new Error('Project Name is blank');
        const data = {
            ProjectName: project.ProjectName,
            DateCreated: project.DateCreated,
            DateModified: project.DateModified,
            UserID: project.UserID
        };
        const ref = await db.collection('projectbuilding').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
};

updateProject = async(req, res, next) => {
    try {
        const id = req.params.id;
        const project = req.body;
        if (!id) throw new Error('id is blank');
        if (!project) throw new Error('Project is blank');
        const data = {
            ProjectName: project.ProjectName,
            DateCreated: project.DateCreated,
            DateModified: project.DateModified
        };
        const ref = await db.collection('projectbuilding').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
};

deleteproject = async(req, res, next) => {
    try {

        const projectId = req.params.id;

        if (!projectId) throw new Error('id is blank');

        await db.collection('projectbuilding')
            .doc(projectId)
            .delete();

        res.json({
            id: projectId,
        })


    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    getProjectbyuserid,
    getProjectbyid,
    updateProject,
    deleteproject,
    insertproject
}