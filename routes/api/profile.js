import express from "express";
const router = express.Router();
import mongoose from "mongoose";
import passport from "passport";
import Profile from "../../models/Profile.js";
import validateProfile from "../../validation/profile.js";
import validateExperience from "../../validation/experience.js";
import validateEducation from "../../validation/education.js";
import User from "../../models/User.js";

/*
  @route GET api/profile/test
  @desc Tests profile route
  @access Public
*/
router.get("/test", (_req, res) => res.json({ message: "Profile Works" }));

/*
  @route GET api/profile
  @desc Get current users profile
  @access Private
*/
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "No profile found for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

/*
  @route GET api/profile/all
  @desc Get all profiles
  @access Public
*/
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = "No profiles found";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch((err) => res.status(404).json({ profile: "No profiles found" }));
});

/*
  @route GET api/profile/handle/:handle
  @desc Get profile by handle
  @access Public
*/
router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "No profile found for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) => res.status(404).json(err));
});

/*
  @route GET api/profile/user/:user_id
  @desc Get profile by user's Id
  @access Public
*/
router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "No profile found for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) =>
      res.status(404).json({ profile: "No profile found for this user" })
    );
});

/*
  @route POST api/profile
  @desc Create user profile or Update it
  @access Private
*/
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfile(req.body);

    if (!isValid) {
      // Return error messages with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;

    req.body.handle ? (profileFields.handle = req.body.handle) : null;

    req.body.company ? (profileFields.company = req.body.company) : null;

    req.body.website ? (profileFields.website = req.body.website) : null;

    req.body.location ? (profileFields.location = req.body.location) : null;

    req.body.bio ? (profileFields.bio = req.body.bio) : null;

    req.body.status ? (profileFields.status = req.body.status) : null;

    req.body.githubusername
      ? (profileFields.githubusername = req.body.githubusername)
      : null;

    // Split skills into array
    typeof req.body.skills !== "undefined"
      ? (profileFields.skills = req.body.skills.split(","))
      : null;

    // Social
    profileFields.social = {};

    req.body.youtube ? (profileFields.social.youtube = req.body.youtube) : null;

    req.body.twitter ? (profileFields.social.twitter = req.body.twitter) : null;

    req.body.facebook
      ? (profileFields.social.facebook = req.body.facebook)
      : null;

    req.body.linkedin
      ? (profileFields.social.linkedin = req.body.linkedin)
      : null;

    req.body.instagram
      ? (profileFields.social.instagram = req.body.instagram)
      : null;

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        // Profile exists therefore update existing profile
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then((profile) => res.json(profile));
      } else {
        // Profile does not exist therefore create a new profile

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then((profile) => {
          if (profile) {
            errors.handle = "Handle already exists";
            res.status(400).json(errors);
          }

          // Save the new Profile
          new Profile(profileFields)
            .save()
            .then((profile) => res.json(profile));
        });
      }
    });
  }
);

/*
  @route POST api/profile/experience
  @desc Add experience to profile
  @access Private
*/
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperience(req.body);

    if (!isValid) {
      // Return error messages with 400 status

      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      // Add to experience array
      profile.experience.unshift(newExp);
      profile.save().then((profile) => res.json(profile));
    });
  }
);

/*
  @route POST api/profile/education
  @desc Add education to profile
  @access Private
*/
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducation(req.body);

    if (!isValid) {
      // Return error messages with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newEducation = {
        institution: req.body.institution,
        degree: req.body.degree,
        fieldOfStudy: req.body.fieldOfStudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      // Add to experience array
      profile.education.unshift(newEducation);
      profile.save().then((profile) => res.json(profile));
    });
  }
);

/*
  @route DELETE api/profile/experience/:exp_id
  @desc Delete experience im profile
  @access Private
*/
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {

    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Get index to start the delete process
        const removeIndex = profile.experience
          .map((item) => item.id)
          .indexOf(req.params.exp_id);

        // Splice out of array
        profile.experience.splice(removeIndex, 1);

        // Save
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);

/*
  @route DELETE api/profile/education/:edu_id
  @desc Delete education in profile
  @access Private
*/
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Get index to start the delete process
        const removeIndex = profile.education
          .map((item) => item.id)
          .indexOf(req.params.edu_id);

        // Splice out of array
        profile.education.splice(removeIndex, 1);

        // Save
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);

/*
  @route DELETE api/profile
  @desc Delete user and profile
  @access Private
*/

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

export default router;
