export const index = async (req, res) => {
    // return res.send("Hello Node SNS!");
    if (req.session.user) {
        // Redirect /feed
        return res.redirect("/feed");
    } else {
        // Redirect /login
        return res.redirect("/login");
    }
};