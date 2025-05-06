
module.exports = (err, req, res, next) => {
    console.error(err.stack);
  
    if (res.headersSent) return next(err);
  
    let status = 500;
    let message = 'Server error';
  
    res.status(status).json({ error: message });
};