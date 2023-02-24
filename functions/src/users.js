import dbConnect from "./dbConnect.js";

export function signup(req, res) {
    const {email, password } = req.body;
    const newUser = {
        email: email.toLowerCase(), 
        password,
    }
    const db = dbConnect();
    db.collection('users').add(newUser)
        .then(doc => {
            res.status(201).send({ success: true, user: { email, uid: doc.id }})
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message })
        })
}

export function login(req, res) {
    const {email, password } = req.body;
    // const newUser = {
    //     email: email.toLowerCase(), 
    //     password: password,
    // }
    const db = dbConnect();
    db.collection('users')
        .where('email', '==', email.toLowerCase())
        .where('passowrd', '==', password)
        .get()
        .then(collection => {
            const users = collection.docs.map(doc => ({...doc.data(), userId: doc.id }))
            if(!users.length) {
                res.status(401).send({success: false, message: 'User not found'})
                return
            }
            let user = users[0]
            user.password = undefined 
            res.status(200).send(users)
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message })
        })
}