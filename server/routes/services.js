const express = require('express'),
    Router = express.Router(),
    Service = require('../database/models/Service')

Router.route('/')
    .get(async (_, res) => {
        try {
            const services = await Service.find()
            return res.json(services)
        } catch (err) {
            return res.json(err)
        }
    })
    .post(async (req, res) => {
        try {
            const { service } = req.body
            const existingService = await Service.findOne({ name: service.name })
            if(existingService) return res.json({ msg: 'Service already created' })
            const newService = new Service(service)
            await newService.save()
            return res.json({ msg: 'Service successfully added' })
        } catch (err) {
            return res.json(err)
        }
    })

module.exports = Router