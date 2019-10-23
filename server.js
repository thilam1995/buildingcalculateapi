var express = require('express'); //import express 
var app = express();
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
//const serviceAccount = require('./serviceaccount/buildingschedulebackup-firebase-adminsdk-tr3vt-a54b70c6a9.json');
const serviceAccount = require('./serviceaccount/buidlingschedule-firebase-adminsdk-r6sso-dcad8f49a9.json');
const nodemailer = require("nodemailer");
var passencrypt = require("./service/passwordencrypt");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://buildingschedulebackup.firebaseio.com"
});

const db = admin.firestore();

const passEncrypt = passencrypt.get("U2FsdGVkX19buDT5kgtzosFDVDFj/aeUuKUyJttjaPE=", "123456$#@$^@1ERF");


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", 'X-Requested-With, Content-Type, X-Token-Auth, Authorization');
    next();
});

//to handle HTTP get request
app.get('/', function (req, res) {
    console.log("Get Request");
    res.send("Get Request");
});


//account section

app.post('/api/account/forgotpass', function (req, res) {
    let account = [];
    let object = {};
    let body = req.body;
    db.collection('account').where("Email", "==", body.Email).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                //account.push(object);
            });
            res.json(object);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});

app.put('/api/account/changename/:id', (req, res, next) => {
    try {
        const id = req.params.id;
        const first = req.body.FirstName;
        const last = req.body.LastName;
        if (!first) {
            throw new Error("First name is blank");
        }
        if (!last) {
            throw new Error("Last name is blank");
        }
        const data = {
            FirstName: first,
            LastName: last
        };
        const ref = db.collection('account').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.put('/api/account/:id', function (req, res, next) {
    try {
        const id = req.params.id;
        const Password = req.body.Password;
        if (!id) throw new Error('id is blank');
        if (!Password) throw new Error('Password is blank');
        const data = {
            Password: Password
        };
        const ref = db.collection('account').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
});



app.post('/api/account', function (req, res, next) {
    try {
        const account = req.body;
        if (!account) throw new Error('Account is blank');
        var accountcollect = db.collection('account');
        let query = accountcollect.where("Email", "==", account.Email).limit(1).get().then(
            (snapshot) => {
                if (!snapshot.empty) {
                    res.status(400).json("Sorry! The account is existed!");
                    return;
                } else {
                    const data = {
                        FirstName: account.FirstName,
                        LastName: account.LastName,
                        Email: account.Email,
                        Password: account.Password,
                    };
                    const ref = db.collection('account').add(data);
                    res.json({
                        id: ref.id,
                        data
                    });

                    const output = `
                    <h3>Confirmation Email</h3>
                    <p>Hi ${account.FirstName},</p>
                    <p>Thanks you for your register at Heat Loss Calculation App. We would like you to go the link below to start login.<p>
                    <p><a href="localhost:4200">Heat Loss App Link</a></p>
                    `;
                    let testAccount = nodemailer.createTestAccount();

                    // create reusable transporter object using the default SMTP transport
                    // const transporter = nodemailer.createTransport({
                    //     host: 'smtp.mailtrap.io',
                    //     port: 2525,
                    //     auth: {
                    //         user: '9bfda3ce27b2a1',
                    //         pass: '4eb463e1821ab3'
                    //     },
                    //     tls: {
                    //         rejectUnauthorized: false
                    //     }
                    // });

                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'thilam95foehn@gmail.com',
                            pass: passEncrypt
                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    });

                    // send mail with defined transport object
                    let info = transporter.sendMail({
                        from: '"Heatloss Cal No Reply" <thilam95foehn@gmail.com>', // sender address
                        to: account.Email, // list of receivers
                        subject: 'Hello ✔', // Subject line
                        text: 'Hello world?', // plain text body
                        html: output // html body
                    }, (err, info) => {
                        if (err) {
                            return console.error(err);
                        }
                        console.log('Message sent: %s', info.messageId);
                        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                        // Preview only available when sending through an Ethereal account
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                    });
                }
            }
        );

    } catch (e) {
        next(e);
    }
});

app.post('/api/login', function (req, res, next) {

    let email = req.body.Email;
    let accountobject = {};
    var citiesRef = db.collection('account');
    var query = citiesRef.where('Email', '==', email).limit(1).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                res.status(400).json("No Account avalaible.");
            } else {
                snapshot.forEach(doc => {
                    //console.log(doc.id, '=>', doc.data());
                    accountobject = { id: doc.id, data: doc.data() };
                    //account.push(accountobject);
                });
                res.json(accountobject);
            }


        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

app.delete('/api/account', function (req, res, next) {
    console.log("HTTP DELETE Request");
    res.send("HTTP DELETE Request");
});

//project section
app.get('/api/project/:id', function (req, res) {
    let project = [];
    let object = {};
    let projectdb = db.collection('projectbuilding');
    //console.log(req.params.id);
    projectdb.where("UserID", "==", req.params.id).get()
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
});

app.get('/api/projectid/:projectid', function (req, res, next) {

    try {
        let id = req.params.projectid;
        if (!id) throw new Error('id is blank');
        else {
            const project = db.collection('projectbuilding').doc(id).get();
            project.then(e => {
                res.json({
                    id: e.id,
                    data: e.data()
                });
            }).catch(e => {
                throw new Error('project does not exists');
            });

        }

    } catch (e) {
        next(e);
    }

});

app.put('/api/project/:id', function (req, res, next) {
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
        const ref = db.collection('projectbuilding').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.put('/api/project/updatedate/:id', function (req, res, next) {
    try {
        const id = req.params.id;
        const project = req.body;
        if (!id) throw new Error('id is blank');
        if (!project) throw new Error('Project is blank');
        const data = {
            DateModified: project.DateModified
        };
        const ref = db.collection('projectbuilding').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.post('/api/project', function (req, res, next) {
    try {
        const project = req.body;
        if (!project.ProjectName) throw new Error('Project Name is blank');
        const data = {
            ProjectName: project.ProjectName,
            DateCreated: project.DateCreated,
            DateModified: project.DateModified,
            UserID: project.UserID
        };
        const ref = db.collection('projectbuilding').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.delete('/api/project/:id', function (req, res, next) {
    try {

        const projectId = req.params.id;

        if (!projectId) throw new Error('id is blank');

        db.collection('projectbuilding')
            .doc(projectId)
            .delete();

        res.json({
            id: projectId,
        })


    } catch (error) {
        res.status(500).send(error);
    }
});

//design section
app.get('/api/design/:projectid', function (req, res) {
    //const userid = req.params.userid;
    const projectid = req.params.projectid;
    if (!projectid) throw new Error('User ID or Project ID is blank');
    let design = [];
    let object = {};
    db.collection('designbuilding').where("ProjectID", "==", projectid).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                design.push(object);
            });
            res.json(design);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});

app.get('/api/design/getdesign/:designid', function (req, res) {
    //const userid = req.params.userid;
    const designid = req.params.designid;
    if (!designid) throw new Error('User ID or Project ID is blank');
    //let design = [];
    let object = {};
    db.collection('designbuilding').doc(designid).get()
        .then(function (doc) {
            if (doc.exists) {
                object = { id: doc.id, data: doc.data() }
                res.json(object);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});

app.get('/api/design/:projectid/:userid/:designid', function (req, res) {
    const userid = req.params.userid;
    const designid = req.params.designid;
    const projectid = req.params.projectid;
    if (!projectid || !userid || !designid) throw new Error('User ID, DesignID or Project ID is blank');
    let design = [];
    let object = {};
    db.collection('designbuilding').where("ProjectID", "==", projectid).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                design.push(object);
            });
            res.json(design);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});

app.get('/api/design/last/:datetime', function (req, res) {
    const userid = req.params.datetime;
    //const projectid = req.params.projectid;
    if (!userid) throw new Error('User ID or Project ID is blank');
    let object = {};
    db.collection('designbuilding').where("DateCreated", "==", userid).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                if(doc.exists){
                    object = { id: doc.id, data: doc.data() };
                    res.json(object);
                }else{
                    res.status(400).json("No document found!");
                }
                
            });
            

        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});

app.put('/api/design/:id', function (req, res, next) {
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
            NumofHabitationroom: design.NumofHabitationroom,
            FloorArea: design.FloorArea,
            ProjectID: design.ProjectID,
            DateCreated: design.DateCreated,
            Climatetype: design.Climatetype,
            UserID: design.UserID,
            StreetName: design.StreetName,
            City: design.City,
            StateName: design.StateName,
            DateUpdate: design.DateUpdate
        };
        const ref = db.collection('designbuilding').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.post('/api/design', function (req, res, next) {
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
            NumofHabitationroom: design.NumofHabitationroom,
            FloorArea: design.FloorArea,
            ProjectID: design.ProjectID,
            DateCreated: design.DateCreated,
            Climatetype: design.Climatetype,
            UserID: design.UserID,
            StreetName: design.StreetName,
            City: design.City,
            StateName: design.StateName,
            DateUpdate: design.DateUpdate
        };
        const ref = db.collection('designbuilding').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.delete('/api/design/:id', function (req, res, next) {
    try {

        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        db.collection('designbuilding')
            .doc(Id)
            .delete();

        res.json({
            id: Id,
        })


    } catch (error) {
        res.status(500).send(error);
    }
});


// app.put('/api/targetrating', function (req, res, next) {
//     console.log("HTTP PUT Request");
//     res.send("HTTP PUT Request");
// });


// app.delete('/api/targetrating', function (req, res, next) {
//     console.log("HTTP DELETE Request");
//     res.send("HTTP DELETE Request");
// });

//location section

// app.put('/api/location', function (req, res, next) {
//     try {
//         const id = req.params.id;
//         const text = req.body.text;
//         if (!id) throw new Error('id is blank');
//         if (!text) throw new Error('Text is blank');
//         const data = { text };
//         const ref = db.collection('account').doc(id).set(data, { merge: true });
//         res.json({
//             id,
//             data
//         });
//     } catch(e) {
//         next(e);
//     }
// });





//wall
app.get('/api/wall/:id', function (req, res) {
    let projectid = req.params.id;
    let wall = [];
    let object = {};
    db.collection('wall').where("DesignID", "==", projectid).get()
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
});

app.put('/api/wall/:id', function (req, res, next) {
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
        const ref = db.collection('wall').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.post('/api/wall', function (req, res, next) {
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
        const ref = db.collection('wall').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.delete('/api/wall/:id', function (req, res, next) {
    try {
        console.log(req.params.id);
        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        db.collection('wall')
            .doc(Id)
            .delete();

        res.json({
            id: Id,
        })


    } catch (error) {
        res.status(500).send(error);
    }
});
//window
app.get('/api/window/:id', function (req, res) {
    let projectid = req.params.id;
    let window = [];
    let object = {};
    db.collection('window').where("DesignID", "==", projectid).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                window.push(object);
            });
            res.json(window);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});

app.put('/api/window/:id', function (req, res, next) {
    try {
        const id = req.params.id;
        const window = req.body;
        if (!id) throw new Error('id is blank');
        if (!window) throw new Error('Text is blank');
        const data = {
            WindowName: window.WindowName,
            ConstructionRValue: window.ConstructionRValue,
            Width: window.Width,
            Height: window.Height,
            OWA: window.OWA,
            Area: window.Area,
            ShadePercent: window.ShadePercent,
            DesignID: window.DesignID,
            ProjectID: window.ProjectID,
            UserID: window.UserID
        };
        const ref = db.collection('window').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.post('/api/window', function (req, res, next) {
    try {
        const window = req.body;
        if (!window) throw new Error('Text is blank');
        const data = {
            WindowName: window.WindowName,
            ConstructionRValue: window.ConstructionRValue,
            Width: window.Width,
            Height: window.Height,
            OWA: window.OWA,
            Area: window.Area,
            ShadePercent: window.ShadePercent,
            DesignID: window.DesignID,
            ProjectID: window.ProjectID,
            UserID: window.UserID
        };
        const ref = db.collection('window').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.delete('/api/window/:id', function (req, res, next) {
    try {

        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        db.collection('window')
            .doc(Id)
            .delete();

        res.json({
            id: Id,
        })


    } catch (error) {
        res.status(500).send(error);
    }
});

//door
app.get('/api/door/:id', function (req, res) {
    let door = [];
    let object = {};
    let id = req.params.id;
    db.collection('door').where("DesignID", "==", id).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                door.push(object);
            });
            res.json(door);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});

app.put('/api/door/:id', function (req, res, next) {
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
            UserID: door.UserID
        };
        const ref = db.collection('door').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.post('/api/door', function (req, res, next) {
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
            UserID: door.UserID
        };
        const ref = db.collection('door').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.delete('/api/door/:id', function (req, res, next) {
    try {

        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        db.collection('door')
            .doc(Id)
            .delete();

        res.json({
            id: Id,
        })


    } catch (error) {
        res.status(500).send(error);
    }
});

//roof
app.get('/api/roof/:id', function (req, res) {
    let roof = [];
    let object = {};
    let id = req.params.id;
    db.collection('roof').where("DesignID", "==", id).get()
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
});

app.put('/api/roof/:id', function (req, res, next) {
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
        const ref = db.collection('roof').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.post('/api/roof', function (req, res, next) {
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
        const ref = db.collection('roof').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.delete('/api/roof/:id', function (req, res, next) {
    try {

        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        db.collection('roof')
            .doc(Id)
            .delete();

        res.json({
            id: Id,
        })


    } catch (error) {
        res.status(500).send(error);
    }
});

//skylight
app.get('/api/skylight/:id', function (req, res) {
    let skylight = [];
    let object = {};
    let id = req.params.id;
    db.collection('skylight').where("DesignID", "==", id).get()
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
});

app.put('/api/skylight/:id', function (req, res, next) {
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
        const ref = db.collection('skylight').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.post('/api/skylight', function (req, res, next) {
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
            UserID: skylight.UserID
        };
        const ref = db.collection('skylight').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.delete('/api/skylight/:id', function (req, res, next) {
    try {

        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        db.collection('skylight')
            .doc(Id)
            .delete();

        res.json({
            id: Id,
        })


    } catch (error) {
        res.status(500).send(error);
    }
});

//floor
app.get('/api/floor/:id', function (req, res) {
    let projectid = req.params.id
    let floor = [];
    let object = {};
    db.collection('floor').where("DesignID", "==", projectid).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                floor.push(object);
            });
            res.json(floor);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});

app.put('/api/floor/:id', function (req, res, next) {
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
        const ref = db.collection('floor').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.post('/api/floor', function (req, res, next) {
    try {
        const floor = req.body;
        if (!floor) throw new Error('Text is blank');
        const data = {
            FloorName: floor.FloorName,
            ConstructionRValue: floor.ConstructionRValue,
            Description: floor.Description,
            DesignID: floor.DesignID,
            ProjectID: floor.ProjectID,
            UserID: floor.UserID
        };
        const ref = db.collection('floor').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.delete('/api/floor/:id', function (req, res, next) {
    try {

        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        db.collection('floor')
            .doc(Id)
            .delete();

        res.json({
            id: Id,
        })


    } catch (error) {
        res.status(500).send(error);
    }
});

//wallwindowdoormodel
app.get('/api/wallwindowdoormodel/:id', function (req, res) {
    let designid = req.params.id;
    let wallwindowdoormodel = [];
    let object = {};
    db.collection('wallwindowdoormodel').where("DesignID", "==", designid).get()
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
});

app.put('/api/wallwindowdoormodel/:id', function (req, res, next) {
    try {
        const id = req.params.id;
        const wallwindowdoormodel = req.body;
        if (!id) throw new Error('id is blank');
        if (!wallwindowdoormodel) throw new Error('Text is blank');
        const data = {
            Wall: wallwindowdoormodel.Wall,
            Window: wallwindowdoormodel.Window,
            Door: wallwindowdoormodel.Door,
            ProjectID: wallwindowdoormodel.ProjectID,
            DesignID: wallwindowdoormodel.DesignID,
            UserID: wallwindowdoormodel.UserID
        };
        const ref = db.collection('wallwindowdoormodel').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.post('/api/wallwindowdoormodel', function (req, res, next) {
    try {
        const wallwindowdoormodel = req.body;
        if (!wallwindowdoormodel) throw new Error('Text is blank');
        const data = {
            Wall: wallwindowdoormodel.Wall,
            Window: wallwindowdoormodel.Window,
            Door: wallwindowdoormodel.Door,
            ProjectID: wallwindowdoormodel.ProjectID,
            DesignID: wallwindowdoormodel.DesignID,
            UserID: wallwindowdoormodel.UserID
        };
        const ref = db.collection('wallwindowdoormodel').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.delete('/api/wallwindowdoormodel/:id', function (req, res, next) {
    try {

        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        db.collection('wallwindowdoormodel')
            .doc(Id)
            .delete();

        res.json({
            id: Id,
        })


    } catch (error) {
        res.status(500).send(error);
    }
});

//roofskylightmodel
app.get('/api/roofskylightmodel/:id', function (req, res) {
    let projectid = req.params.id;
    let roofskylightmodel = [];
    let object = {};
    db.collection('roofskylightmodel').where("DesignID", "==", projectid).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                roofskylightmodel.push(object);
            });
            res.json(roofskylightmodel);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});

app.put('/api/roofskylightmodel/:id', function (req, res, next) {
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
        const ref = db.collection('roofskylightmodel').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.post('/api/roofskylightmodel', function (req, res, next) {
    try {
        const roofskylightmodel = req.body;
        if (!roofskylightmodel) throw new Error('Text is blank');
        const data = {
            Roof: roofskylightmodel.Roof,
            Skylight: roofskylightmodel.Skylight,
            ProjectID: roofskylightmodel.ProjectID,
            DesignID: roofskylightmodel.DesignID,
            UserID: roofskylightmodel.UserID
        };
        const ref = db.collection('roofskylightmodel').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.delete('/api/roofskylightmodel/:id', function (req, res, next) {
    try {

        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        db.collection('roofskylightmodel')
            .doc(Id)
            .delete();

        res.json({
            id: Id,
        })


    } catch (error) {
        res.status(500).send(error);
    }
});

//floormodel
app.get('/api/floormodel/:id', function (req, res) {
    let designid = req.params.id;
    let floormodel = [];
    let object = {};
    db.collection('floormodel').where("DesignID", "==", designid).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                floormodel.push(object);
            });
            res.json(floormodel);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});

app.put('/api/floormodel/:id', function (req, res, next) {
    try {
        const id = req.params.id;
        const floormodel = req.body;
        if (!id) throw new Error('id is blank');
        if (!floormodel) throw new Error('Text is blank');
        const data = {
            Floor: floormodel.Floor,
            ProjectID: floormodel.ProjectID,
            DesignID: floormodel.DesignID,
            UserID: floormodel.UserID
        };
        const ref = db.collection('floormodel').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.post('/api/floormodel', function (req, res, next) {
    try {
        const floormodel = req.body;
        if (!floormodel) throw new Error('Text is blank');
        const data = {
            Floor: floormodel.Floor,
            ProjectID: floormodel.ProjectID,
            DesignID: floormodel.DesignID,
            UserID: floormodel.UserID
        };
        const ref = db.collection('floormodel').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch (e) {
        next(e);
    }
});

app.delete('/api/floormodel/:id', function (req, res, next) {
    try {

        const Id = req.params.id;

        if (!Id) throw new Error('id is blank');

        db.collection('floormodel')
            .doc(Id)
            .delete();

        res.json({
            id: Id,
        })


    } catch (error) {
        res.status(500).send(error);
    }
});


//start server on port: 8080
var server = app.listen(8080, function () {

    var host = server.address().address;
    var host1 = server.address();
    console.log(host1);
    var port = server.address().port;

    console.log("server listening at http://%s:%s", host, port);
});

module.exports = app;