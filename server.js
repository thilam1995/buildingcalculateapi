var express = require('express'); //import express 
var app = express();
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceaccount/buidlingschedule-firebase-adminsdk-r6sso-dcad8f49a9.json');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://apitest-10c95.firebaseio.com"
});

const db = admin.firestore();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

//to handle HTTP get request
app.get('/', function (req, res) {
    console.log("Get Request");
    res.send("Get Request");
});


//account section

app.get('/api/account', function (req, res) {
    let account = [];
    let object = {};
    db.collection('account').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                account.push(object);
            });
            res.json(account);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});

app.put('/api/account', function (req, res, next) {
    try {
        const id = req.params.id;
        const text = req.body.text;
        if (!id) throw new Error('id is blank');
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref = db.collection('account').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.post('/api/account', function (req, res, next) {
    try {
        const text = req.body.text;
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref = db.collection('account').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.delete('/api/account', function (req, res, next) {
    console.log("HTTP DELETE Request");
    res.send("HTTP DELETE Request");
});

//project section
app.get('/api/project', function (req, res) {
    let project = [];
    let object = {};
    db.collection('projectbuilding').get()
        .then((snapshot) => {
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

app.put('/api/project', function (req, res, next) {
    try {
        const id = req.params.id;
        const text = req.body.text;
        if (!id) throw new Error('id is blank');
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref = db.collection('projectbuilding').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.post('/api/project', function (req, res, next) {
    try {
        const text = req.body.text;
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref =  db.collection('projectbuilding').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.delete('/api/project', function (req, res, next) {
    console.log("HTTP DELETE Request");
    res.send("HTTP DELETE Request");
});

//design section
app.get('/api/design', function (req, res) {
    let design = [];
    let object = {};
    db.collection('designbuilding').get()
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

app.put('/api/design', function (req, res, next) {
    try {
        const id = req.params.id;
        const text = req.body.text;
        if (!id) throw new Error('id is blank');
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref = db.collection('designbuilding').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.post('/api/design', function (req, res, next) {
    try {
        const text = req.body.text;
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref =  db.collection('designbuilding').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.delete('/api/design', function (req, res, next) {
    console.log("HTTP DELETE Request");
    res.send("HTTP DELETE Request");
});

//target rating
app.get('/api/targetrating', function (req, res) {
    let targetrating = [];
    let object = {};
    db.collection('targetrating').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                targetrating.push(object);
            });
            res.json(targetrating);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});

app.put('/api/targetrating', function (req, res, next) {
    console.log("HTTP PUT Request");
    res.send("HTTP PUT Request");
});

app.post('/api/targetrating', function (req, res, next) {
    try {
        const text = req.body.text;
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref =  db.collection('targetrating').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.delete('/api/targetrating', function (req, res, next) {
    console.log("HTTP DELETE Request");
    res.send("HTTP DELETE Request");
});

//location section
app.get('/api/location', function (req, res) {
    let location = [];
    let object = {};
    db.collection('location').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                object = { id: doc.id, data: doc.data() }
                location.push(object);
            });
            res.json(location);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});

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

app.post('/api/location', function (req, res, next) {
    try {
        const text = req.body.text;
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref =  db.collection('location').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.delete('/api/location', function (req, res, next) {
    console.log("HTTP DELETE Request");
    res.send("HTTP DELETE Request");
});


//wall
app.get('/api/wall', function (req, res) {
    let wall = [];
    let object = {};
    db.collection('wall').get()
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

app.put('/api/wall', function (req, res, next) {
    try {
        const id = req.params.id;
        const text = req.body.text;
        if (!id) throw new Error('id is blank');
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref = db.collection('wall').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.post('/api/wall', function (req, res, next) {
    try {
        const text = req.body.text;
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref =  db.collection('wall').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.delete('/api/wall', function (req, res, next) {
    console.log("HTTP DELETE Request");
    res.send("HTTP DELETE Request");
});
//window
app.get('/api/window', function (req, res) {
    let window = [];
    let object = {};
    db.collection('window').get()
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

app.put('/api/window', function (req, res, next) {
    try {
        const id = req.params.id;
        const text = req.body.text;
        if (!id) throw new Error('id is blank');
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref = db.collection('window').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.post('/api/window', function (req, res, next) {
    try {
        const text = req.body.text;
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref =  db.collection('window').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.delete('/api/window', function (req, res, next) {
    console.log("HTTP DELETE Request");
    res.send("HTTP DELETE Request");
});

//door
app.get('/api/door', function (req, res) {
    let door = [];
    let object = {};
    db.collection('door').get()
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

app.put('/api/door', function (req, res, next) {
    try {
        const id = req.params.id;
        const text = req.body.text;
        if (!id) throw new Error('id is blank');
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref = db.collection('door').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.post('/api/door', function (req, res, next) {
    try {
        const text = req.body.text;
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref =  db.collection('door').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.delete('/api/door', function (req, res, next) {
    console.log("HTTP DELETE Request");
    res.send("HTTP DELETE Request");
});

//roof
app.get('/api/roof', function (req, res) {
    let roof = [];
    let object = {};
    db.collection('roof').get()
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

app.put('/api/roof', function (req, res, next) {
    try {
        const id = req.params.id;
        const text = req.body.text;
        if (!id) throw new Error('id is blank');
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref = db.collection('roof').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.post('/api/roof', function (req, res, next) {
    try {
        const text = req.body.text;
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref =  db.collection('roof').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.delete('/api/roof', function (req, res, next) {
    console.log("HTTP DELETE Request");
    res.send("HTTP DELETE Request");
});

//skylight
app.get('/api/skylight', function (req, res) {
    let skylight = [];
    let object = {};
    db.collection('skylight').get()
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

app.put('/api/skylight', function (req, res, next) {
    try {
        const id = req.params.id;
        const text = req.body.text;
        if (!id) throw new Error('id is blank');
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref = db.collection('skylight').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.post('/api/skylight', function (req, res, next) {
    try {
        const text = req.body.text;
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref =  db.collection('skylight').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.delete('/api/skylight', function (req, res, next) {
    console.log("HTTP DELETE Request");
    res.send("HTTP DELETE Request");
});

//floor
app.get('/api/floor', function (req, res) {
    let floor = [];
    let object = {};
    db.collection('floor').get()
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

app.put('/api/floor', function (req, res, next) {
    try {
        const id = req.params.id;
        const text = req.body.text;
        if (!id) throw new Error('id is blank');
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref = db.collection('floor').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.post('/api/floor', function (req, res, next) {
    try {
        const text = req.body.text;
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref =  db.collection('floor').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.delete('/api/floor', function (req, res, next) {
    console.log("HTTP DELETE Request");
    res.send("HTTP DELETE Request");
});

//wallwindowdoormodel
app.get('/api/wallwindowdoormodel', function (req, res) {
    let wallwindowdoormodel = [];
    let object = {};
    db.collection('wallwindowdoormodel').get()
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

app.put('/api/wallwindowdoormodel', function (req, res, next) {
    try {
        const id = req.params.id;
        const text = req.body.text;
        if (!id) throw new Error('id is blank');
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref = db.collection('wallwindowdoormodel').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.post('/api/wallwindowdoormodel', function (req, res, next) {
    try {
        const text = req.body.text;
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref =  db.collection('wallwindowdoormodel').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.delete('/api/wallwindowdoormodel', function (req, res, next) {
    console.log("HTTP DELETE Request");
    res.send("HTTP DELETE Request");
});

//roofskylightmodel
app.get('/api/roofskylightmodel', function (req, res) {
    let roofskylightmodel = [];
    let object = {};
    db.collection('account').get()
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

app.put('/api/roofskylightmodel', function (req, res, next) {
    try {
        const id = req.params.id;
        const text = req.body.text;
        if (!id) throw new Error('id is blank');
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref = db.collection('roofskylightmodel').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.post('/api/roofskylightmodel', function (req, res, next) {
    try {
        const text = req.body.text;
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref =  db.collection('roofskylightmodel').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.delete('/api/roofskylightmodel', function (req, res, next) {
    console.log("HTTP DELETE Request");
    res.send("HTTP DELETE Request");
});

//floormodel
app.get('/api/floormodel', function (req, res) {
    let floormodel = [];
    let object = {};
    db.collection('floormodel').get()
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

app.put('/api/floormodel', function (req, res, next) {
    try {
        const id = req.params.id;
        const text = req.body.text;
        if (!id) throw new Error('id is blank');
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref = db.collection('floormodel').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.post('/api/floormodel', function (req, res, next) {
    try {
        const text = req.body.text;
        if (!text) throw new Error('Text is blank');
        const data = { text };
        const ref =  db.collection('floormodel').add(data);
        res.json({
            id: ref.id,
            data
        });
    } catch(e) {
        next(e);
    }
});

app.delete('/api/floormodel', function (req, res, next) {
    console.log("HTTP DELETE Request");
    res.send("HTTP DELETE Request");
});


//start server on port: 8080
var server = app.listen(8080, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("server listening at http://%s:%s", host, port);
});

module.exports = app;