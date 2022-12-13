const { fetchTopics } = require("../models/models.js");


exports.GetTopics = (req, res, next) => {
    fetchTopics()
        .then((topics) => {
            res.status(200).send({ topics });
        })
      .catch(next)
}
