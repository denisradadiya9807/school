// const jwt = require('jsonwebtoken');
// const CryptoJS = require('crypto-js');
// var express = require('express');

// exports.generateAccessToken = (admin) => {
//     return jwt.sign(
//         { adminId: admin.adminId },

//         process.env.JWT_SECRET,

//     );
// };
// exports.authenticateToken = async (req, res, next) => {
//     const bearerHeader = req.headers['authorization'];
//     if (typeof bearerHeader !== 'undefined') {
//         const bearer = bearerHeader.split(' ');
//         const token = bearer[1];
//         jwt.verify(token, process.env.SECRET_KEY, (err, auth) => {
//             if (err) {
//                 return responseManager.unauthorisedRequest(res);
//             } else {
//                 req.token = auth;
//                 // console.log("Token received:", req.token);
//             }
//         });
//         next();
//     } else {
//         next();
//         // return responseManager.unauthorisedRequest(res);
//     }
// };
// exports.passwordDecryptor = async (passwordKeyDecrypt) => {
//     try {
//         var decLayer1 = CryptoJS.TripleDES.decrypt(passwordKeyDecrypt, process.env.PASSWORD_ENCRYPTION_SECRET);
//         var deciphertext1 = decLayer1.toString(CryptoJS.enc.Utf8);
//         var decLayer2 = CryptoJS.DES.decrypt(deciphertext1, process.env.PASSWORD_ENCRYPTION_SECRET);
//         var deciphertext2 = decLayer2.toString(CryptoJS.enc.Utf8);
//         var decLayer3 = CryptoJS.AES.decrypt(deciphertext2, process.env.PASSWORD_ENCRYPTION_SECRET);
//         var finalDecPassword = decLayer3.toString(CryptoJS.enc.Utf8);
//         return finalDecPassword;
//     } catch (err) {
//         throw err;
//     }
// };
// exports.passwordEncryptor = async (passwordKeyEncrypt) => {
//     try {
//         var encLayer1 = CryptoJS.AES.encrypt(passwordKeyEncrypt, process.env.PASSWORD_ENCRYPTION_SECRET).toString();
//         var encLayer2 = CryptoJS.DES.encrypt(encLayer1, process.env.PASSWORD_ENCRYPTION_SECRET).toString();
//         var finalEncPassword = CryptoJS.TripleDES.encrypt(encLayer2, process.env.PASSWORD_ENCRYPTION_SECRET).toString();
//         return finalEncPassword;
//     } catch (err) {
//         throw err;
//     }
// };
const jwt = require('jsonwebtoken');
var CryptoJS = require('crypto-js');
const express = require('express');
const responseManager = require('./response.manager');
// const SECRET_KEY = 'PRACTISE'
const JWT_SECRET = 'SCHOOLCAMPUS'
exports.validateToken = async (token) => {
    try {
        // Verify the token and decode it
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
        // Returns the decoded user data (e.g., adminId)
    } catch (error) {
        console.error("Token verification failed:", error);
        return null; // Return null if token is invalid or expired
    }
};
// exports.generateAccessToken = (admin) => {
//     if (!admin) {
//         throw new Error('Payload is required to generate a token.');
//     }
//     return jwt.sign(
//         { adminID: admin.adminID },

//         process.env.JWT_SECRET,

//     );
// };
exports.generateAccessToken = (admin) => {
    return jwt.sign(
        { adminId: admin.adminId },
        { database: admin.database },

        process.env.JWT_SECRET,

    );
};
exports.generateAccessToken = async (adminData) => {
    return jwt.sign(adminData, process.env.JWT_SECRET, {});
};
exports.authenticateToken = async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, auth) => {
            if (err) {
                // console.log("err->", err);
                return responseManager.unauthorisedRequest(res);
            } else {
                // console.log("auth->", auth);
                req.token = auth;
                // console.log("Token received:", req.token);
            }
        });
        next();
    } else {
        next();
        // return responseManager.unauthorisedRequest(res);
    }
};
// exports.authenticateToken = async (req, res, next) => {
//     const bearerHeader = req.headers['authorization'];

//     if (typeof bearerHeader !== 'undefined') {
//         const bearer = bearerHeader.split(' ');
//         const token = bearer[1];

//         jwt.verify(token, process.env.JWT_SECRET, (err, auth) => {
//             if (err) {
//                 return res.status(401).json({
//                     Message: "Unauthorized Request!",
//                     Data: 0,
//                     Status: 401,
//                     IsSuccess: false
//                 });
//             } else {
//                 req.token = auth;
//                 console.log("Token received:", req.token);
//                 next();
//             }
//         });
//     } else {
//         return res.status(401).json({
//             Message: "Token not provided!",
//             Data: 0,
//             Status: 401,
//             IsSuccess: false
//         });
//     }
// };
exports.passwordDecryptor = async (passwordKeyDecrypt) => {
    try {
        var decLayer1 = CryptoJS.TripleDES.decrypt(passwordKeyDecrypt, process.env.PASSWORD_ENCRYPTION_SECRET);
        var deciphertext1 = decLayer1.toString(CryptoJS.enc.Utf8);
        var decLayer2 = CryptoJS.DES.decrypt(deciphertext1, process.env.PASSWORD_ENCRYPTION_SECRET);
        var deciphertext2 = decLayer2.toString(CryptoJS.enc.Utf8);
        var decLayer3 = CryptoJS.AES.decrypt(deciphertext2, process.env.PASSWORD_ENCRYPTION_SECRET);
        var finalDecPassword = decLayer3.toString(CryptoJS.enc.Utf8);
        return finalDecPassword;
    } catch (err) {
        throw err;
    }
};
exports.passwordEncryptor = async (passwordKeyEncrypt) => {
    try {
        var encLayer1 = CryptoJS.AES.encrypt(passwordKeyEncrypt, process.env.PASSWORD_ENCRYPTION_SECRET).toString();
        var encLayer2 = CryptoJS.DES.encrypt(encLayer1, process.env.PASSWORD_ENCRYPTION_SECRET).toString();
        var finalEncPassword = CryptoJS.TripleDES.encrypt(encLayer2, process.env.PASSWORD_ENCRYPTION_SECRET).toString();
        return finalEncPassword;
    } catch (err) {
        throw err;
    }
};

