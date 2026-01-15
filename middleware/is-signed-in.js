const isSignedIn = (req, res, next) => {
    if (req.session.user) return next()
        // if user does not exist send them to sign in page (they are not signed in)
        res.redirect('/auth/sign-in')
};

module.exports = isSignedIn