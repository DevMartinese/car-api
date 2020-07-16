"use strict";

const validator = require("validator");
const fs = require("fs");
const path = require("path");

const Article = require("../models/article");

const controller = {
  //Guardado de cada articulo que se ingresa a la BBDD
  save: (req, res) => {
    //Recoger parametros por el metodo POST
    var params = req.body;
    //Validar Datos
    try {
      var validate_brand = !validator.isEmpty(params.brand);
      var validate_model = !validator.isEmpty(params.model);
      var validate_category = !validator.isEmpty(params.category);
      var validate_price = !validator.isEmpty(params.price);
      var validate_year = !validator.isEmpty(params.year);
    } catch (err) {
      return res.status(200).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }

    if (
      validate_brand &&
      validate_model &&
      validate_category &&
      validate_price &&
      validate_year
    ) {
      //Crear objeto a guardar
      var article = new Article();
      //Asignar valores
      article.brand = params.brand;
      article.model = params.model;
      article.category = params.category;
      article.price = params.price;
      article.year = params.year;
      article.image = null;
      //Guardar el articulo
      article.save((err, articleStored) => {
        if (err) {
          return res.status(404).send({
            status: "error",
            message: "No se guardo nada",
          });
        }
        return res.status(200).send({
          article: articleStored,
        });
      });
    } else {
      return res.status(200).send({
        status: "error",
        message: "Los datos son incorrectos",
      });
    }
  },

  getArticles: (req, res) => {
    var last = req.params.last;

    if (last || last != undefined) {
      Article.find({}).limit(5);
    }

    //Find
    Article.find({})
      .sort("_id")
      .exec((err, articles) => {
        if (err || !articles) {
          return res.status(500).send({
            status: "error",
            message: "No se encuentran los datos",
          });
        }

        return res.status(200).send({
          articles,
        });
      });
  },

  getArticle: (req, res) => {
    //Se recoge el ID por la URL
    var articleId = req.params.id;

    //Comprobar que existe el articulo via ID
    if (!articleId || articleId == null) {
      return res.status(404).send({
        status: "error",
        message: "No se encuentra el articulo",
      });
    }

    //Buscar el articulo
    Article.findById(articleId, (err, article) => {
      if (err || !article) {
        return res.status(404).send({
          status: "error",
          message: "No existe el articulo",
        });
      }

      return res.status(200).send({
        status: "success",
        article,
      });
    });
  },

  update: (req, res) => {
    //Se recoge el ID por la URL
    var articleId = req.params.id;

    //Recoger datos que llegan por el metodo PUT
    var params = req.body;

    //Validar datos
    try {
      var validate_brand = !validator.isEmpty(params.brand);
      var validate_model = !validator.isEmpty(params.model);
      var validate_category = !validator.isEmpty(params.category);
      var validate_price = !validator.isEmpty(params.price);
      var validate_year = !validator.isEmpty(params.year);
    } catch (err) {
      return res.status(404).send({
        status: "error",
        message: "No existe el articulo",
      });
    }

    if (
      validate_brand &&
      validate_model &&
      validate_category &&
      validate_price &&
      validate_year
    ) {
      //Find and Update
      Article.findOneAndUpdate(
        { _id: articleId },
        params,
        { new: true },
        (err, articleUpdated) => {
          if (err || !articleUpdated) {
            return res.status(500).send({
              status: "error",
              message: "Error al actualizar el articulo",
            });
          }

          return res.status(200).send({
            status: "success",
            article: articleUpdated,
          });
        }
      );
    } else {
      return res.status(404).send({
        status: "error",
        message: "La validacion no es correcta",
      });
    }
  },

  delete: (req, res) => {
    //Recoger ID por la URL
    var articleId = req.params.id;

    //Find and Delete
    Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
      if (err || !articleRemoved) {
        return res.status(404).send({
          message: "Error al borrar, o probablemente no exista el articulo",
        });
      }

      return res.status(200).send({
        status: "success",
        article: articleRemoved,
      });
    });
  },

  upload: (req, res) => {
    //Configurar modulo del connect multiparty

    //Recoger fichero de la peticion
    var file_name = "Imagen no subida";

    if (!req.files) {
      return res.status(200).send({
        status: "error",
        message: file_name,
      });
    }

    //Conseguir nombre y extension del archivo
    var file_path = req.files.file0.path;
    var file_split = file_path.split("\\");

    //Nombre del archivo
    var file_name = file_split[2];

    //Extension del archivo
    var extension_split = file_name.split("\.");
    var file_ext = extension_split[1];

    //Comprobar si la extension es valida, si no es una imagen se borra
    if (
      file_ext != 'png' &&
      file_ext != 'jpg' &&
      file_ext != 'jpeg' &&
      file_ext != 'gif'
    ) {
      //Si la condición anterior se cumple, entonces se borrara el archivo
      fs.unlink(file_path, (err) => {
        return res.status(200).send({
          status: "error",
          message: "La extension de la imagen no es valida",
        });
      });
    } else {
      //Si toda es valido, sacar el ID por la URL
      var articleId = req.params.id;

      //Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
      Article.findOneAndUpdate({ _id: articleId}, {image: file_name}, {new: true}, (err, articleUpdated) => {
           
        if(err || !articleUpdated){
            return res.status(200).send({
              status: "error",
              message: 'Error al guardar la imagen de articulo'
          });  
        }
        
        return res.status(200).send({
              status: "success",
              article: articleUpdated
           });  
      })
    }
  },

  getImage: (req, res) => {
     var file = req.params.image;
     var path_file = `./upload/articles/${file}`;

     fs.exists(path_file, (exists) => {
         if (exists) {
              return res.sendFile(path.resolve(path_file));
         } else {
              return res.status(404).send({
                status:'error',
                message: 'La imagen no existe'
              })
         }
     })
  },

  search: (req, res) => {
    //Sacar el parametro search 
    var searchString = req.params.search;
    
    //Find or
    Article.find({ "$or" : [
      { "brand": { "$regex": searchString, "$options": "i" } },
      { "model": { "$regex": searchString, "$options": "i" } },
      { "category" : { "$regex": searchString, "$options": "i" } }
    ]})
    .exec((err, articles) => {

      if(err){
         return res.status(500).send({
           status:"error",
           message: "Error en la peticion"
         })
      }

      if (!articles) {
        return res.status(404).send({
          status:"error",
          message: "Error, no hay articulo"
        })
      }

      return res.status(200).send({
           status:"success",
           articles
      })

    })

  }

};

module.exports = controller;
