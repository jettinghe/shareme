exports.init = function(noderplate) {
  var files    = {};
  var Analytic = noderplate.app.models.Analytic;

  files.getFile = function(req, res) {
    var options, fileModel;

    options = {
      room: req.params.room,
      filename: req.params.filename
    };

    req.core.files.getFile(options)
    .then(function(file) {
      fileModel = file;
      return noderplate.app.core.data.checkFileExists(file.path);
    })
    .then(function(exists) {
      if (exists) {
        Analytic.findOne({room: fileModel.room, filename: fileModel.filename}, function(err, analytic) {
          if (err) { throw err; }

          analytic.clicks = analytic.clicks + 1;
          analytic.save();
        });
        return res.download(fileModel.path);
      }
    })
    .fail(function(err) {
      return res.render('filenotfound', {});
    });
  };
  return files;
};