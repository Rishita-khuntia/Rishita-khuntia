const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const { location, minPrice, maxPrice } = req.query;
    const filter = {};

    if (location) {
        filter.location = { $regex: location, $options: 'i' };
    }
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const allListings = await Listing.find(filter);
    res.render("listings/index.ejs", { 
        allListings,
        location,
        minPrice,
        maxPrice
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.show = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    const coords = listing.coordinates?.coordinates;
    res.render("listings/show.ejs", { 
        listing, 
        coords: coords?.length >= 2 ? { lat: coords[1], lng: coords[0] } : null 
    });
};

module.exports.create = async (req, res) => {
    try {
        let url = req.file.path;
        let filename = req.file.filename;

        const { latitude, longitude } = req.body.listing;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        if (latitude && longitude) {
            newListing.coordinates = {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            };
        }
        await newListing.save();
        req.flash("success", "New listing created!");
        res.redirect("/listings");
    } catch (err) {
        req.flash("error", "Failed to create listing!");
        res.redirect("/listings/new");
    }
};

module.exports.update = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }
    const { latitude, longitude } = req.body.listing;
    if (latitude && longitude) {
        listing.coordinates = {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
        };
    }
    await listing.save();
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
};

module.exports.destroy = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
};
