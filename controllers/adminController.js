'use strict';

const memberService = require("../services/memberService");

let membersList = (req, res) => {
    function respondWithError(error) {
        res.status(500).json({ error: error });
    }

    function respondWithSuccess(payload) {
        res.status(200).json(payload);
    }

    function preparePayload(members) {
        return { members: members };
    }

    return memberService.list()
        .then(preparePayload)
        .then(respondWithSuccess)
        .catch(respondWithError);
};

module.exports = {
    membersList: membersList
};
