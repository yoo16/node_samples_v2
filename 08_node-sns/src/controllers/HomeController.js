export const index = async (req, res) => {
    if (req.session.authUser) {
        return res.redirect("/feed");
    }
    return res.redirect("/login");
};