const express = require("express");
const self = {};

const ROLE = ["admin", "developer", "provider"];
const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_key";

self.ROLE = ROLE;
self.payload = null;

self.authenticate = (role, message = "Unauthorized") => {
    return (req, res, next) => {
        const token = req.header("x-auth-token");
        if (!token) {
            return res.status(401).send("Unauthorized");
        }
        try {
            self.payload = jwt.verify(token, JWT_KEY);
        } catch (error) {
            return res.status(401).send("Unauthorized");
        }
        if (role.includes("all") || role.includes(self.ROLE[self.payload.role])) {
            next();
        } else {
            return res.status(401).send(message);
        }
    };
};

module.exports = self;