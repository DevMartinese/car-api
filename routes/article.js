'use strict'

const express = require('express');
const ArticleController = require('../controllers/article');

const router = express.Router();

//Configuración del Middleware
const multiparty = require('connect-multiparty');
const md_upload = multiparty({uploadDir: './upload/articles'});

//Rutas
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image/:id', md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);


module.exports = router;
