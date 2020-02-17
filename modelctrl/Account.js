const nodemailer = require("nodemailer");
var passencrypt = require("../service/passwordencrypt");
const db = require("../connection/firebasecon");

const passEncrypt = passencrypt.get("U2FsdGVkX19buDT5kgtzosFDVDFj/aeUuKUyJttjaPE=", "123456$#@$^@1ERF");

forgotPassword = async (req, res, next) => {
    let account = [];
    let object = {};
    let body = req.body;
    const ref = await db.collection('account').where("Email", "==", body.Email).get()
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
};

changeName = async (req, res, next) => {
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
        const ref = await db.collection('account').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
};

updateAccount = async (req, res, next) => {
    try {
        const id = req.params.id;
        const Password = req.body.Password;
        if (!id) throw new Error('id is blank');
        if (!Password) throw new Error('Password is blank');
        const data = {
            Password: Password
        };
        const ref = await db.collection('account').doc(id).set(data, { merge: true });
        res.json({
            id,
            data
        });
    } catch (e) {
        next(e);
    }
};

registerAccount = async(req, res, next) => {
    try {
        const account = req.body;
        if (!account) throw new Error('Account is blank');
        var accountcollect = db.collection('account');
        let query = await accountcollect.where("Email", "==", account.Email).limit(1).get().then(
            async(snapshot) => {
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
                    const ref = await db.collection('account').add(data);
                    res.status(200).json({
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
};

accountLogin = async(req, res, next) => {
    let email = req.body.Email;
    let accountobject = {};
    var accountRef = await db.collection('account');
    var query = accountRef.where('Email', '==', email).limit(1).get()
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
                res.status(200).json(accountobject);
            }


        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
}

module.exports = {
    forgotPassword,
    changeName,
    updateAccount,
    registerAccount,
    accountLogin
};