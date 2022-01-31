const express = require('express'),
    Router = express.Router(),
    Password = require('../database/models/Password'),
    crypto = require('crypto'),
    publicKey = process.env.PUBLIC_KEY.replace(/\\n/g, '\n'),
    privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n')

Router.route('/')
    .get(async (_, res) => {
        try {
            const passwords = await Password.find().populate('service')
            var decryptedPasswords = []
            passwords.map(password => {
                const buffer = Buffer.from(password.value, "base64");
                const decrypted = crypto.privateDecrypt(privateKey, buffer).toString("utf8");
                password.value = decrypted
                decryptedPasswords.push(password)
            }) 
            return res.json(decryptedPasswords)
        } catch (err) {
            console.log(err)
            return res.json(err)
        }
    })
    .post(async (req, res) => {
        try {
            const { password } = req.body
            const { value } = password
            const existingPassword = await Password.findOne({ service: password.service})
            if(existingPassword) return res.json({ msg: 'Password already exists for that service' })
            const buffer = Buffer.from(value);
            const encrypted = crypto.publicEncrypt(publicKey, buffer).toString('base64');
            const newPassword = new Password({ ...password, value: encrypted })
            await newPassword.save()
            return res.json({ msg: 'Password successfully saved' })
        } catch (err) {
            console.log(err)
            return res.json(err)
        }
    })

Router.route('/:_id')
    .delete(async (req, res) => {
        try {
            await Password.findByIdAndRemove(req.params._id)
            return res.json({ msg: 'Password successfully deleted' })
        } catch (err) {
            
        }
    })

module.exports = Router