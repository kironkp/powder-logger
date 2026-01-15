const express = require('express')
const router = express.Router()

const User = require('../models/user.js')

// INDEX PAGE
router.get('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
    
        res.render('rideReports/index.ejs', {
            rideReports: currentUser.rideReports
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

// NEW FORM
router.get('/new', (req, res) => {
    res.render('rideReports/new.ejs')
})

router.post('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        currentUser.rideReports.push(req.body)
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/rideReports`)
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

// SHOW RIDE REPORT ROUTE

router.get('/:rideReportId', async (req, res) => {
  try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Find the ride report by the rideReportId supplied from req.params
    const rideReport = currentUser.rideReports.id(req.params.rideReportId);
    // Render the show view, passing the ride reports data in the context object
    res.render('rideReports/show.ejs', {
      rideReport: rideReport,
    });
  } catch (err) {
    // If any errors, log them and redirect back home
    console.log(err);
    res.redirect('/');
  }
});

// DELETE ROUTE

router.delete('/:rideReportId', async (req, res) => {
  try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Use the Mongoose .deleteOne() method to delete
    // a ride report using the id supplied from req.params
    currentUser.rideReports.id(req.params.rideReportId).deleteOne();
    // Save changes to the user
    await currentUser.save();
    // Redirect back to the rideReports index view
    res.redirect(`/users/${currentUser._id}/rideReports`);
  } catch (err) {
    // If any errors, log them and redirect back home
    console.log(err);
    res.redirect('/');
  }
});


// EDIT ROUTE
router.get('/:rideReportId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const rideReport = currentUser.rideReports.id(req.params.rideReportId);
    res.render('rideReports/edit.ejs', {
      rideReport: rideReport,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// UPDATE ROUTE (Needed after EDIT)

router.put('/:rideReportId', async (req, res) => {
try {
  // Find the user from req.session
  const currentUser = await User.findById(req.session.user._id);
  // Find the current ride report from the id supplied by req.params
  const rideReport = currentUser.rideReports.id(req.params.rideReportId);
  // Use the Mongoose .set() method
  // this method updates the current ride report to reflect the new form
  // data on `req.body`
  rideReport.set(req.body);
  // Save the current user
  await currentUser.save();
  // Redirect back to the show view of the current ride report
  res.redirect(
    `/users/${currentUser._id}/rideReports/${req.params.rideReportId}`
  );
} catch (err) {
    console.log(error);
    res.redirect('/');
}

});

module.exports = router;

