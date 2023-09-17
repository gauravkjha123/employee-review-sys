const flashMiddleware=(req,res,next)=>{
    res.locals.error_msg=req.flash('error_msg')
    res.locals.success_msg=req.flash('success_msg')
    next()
}

export default flashMiddleware;