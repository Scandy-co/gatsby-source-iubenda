const axios = require("axios");

const forEach = require("lodash/forEach");

const crypto = require("crypto");

exports.sourceNodes = async ({
  boundActionCreators,
  createNodeId
}, {
  documentIds
}) => {
  const {
    createNode
  } = boundActionCreators; // Create nodes here, generally by downloading data
  // from a remote API.

  const getTitle = content => {
    let reg = new RegExp(`<h1>[^]*<\/h1>`); // grab the first h1, the doc title...

    let titleWithTags = content.match(reg)[0];
    let titleWithoutTags = titleWithTags.replace(/<\/?[^>]+(>|$)/g, ""); // remove "of"?
    // titleWithoutTags = titleWithoutTags.replace(' of', '')

    return titleWithoutTags;
  }; // Helper function that processes a photo to match Gatsby's node structure


  const processData = doc => {
    const nodeId = createNodeId(`iubenda-doc-${doc.id}`);
    const nodeContent = JSON.stringify(doc);
    const nodeContentDigest = crypto.createHash("md5").update(nodeContent).digest("hex");
    const nodeData = Object.assign({}, doc, {
      id: nodeId,
      title: getTitle(doc.content),
      parent: null,
      children: [],
      internal: {
        type: `IubendaDocument`,
        content: nodeContent,
        contentDigest: nodeContentDigest
      }
    });
    return nodeData;
  };

  console.log("Fetching document(s) from iubenda");
  return Promise.all(documentIds.map(async id => {
    const result = await axios.get(`https://www.iubenda.com/api/privacy-policy/${id}/no-markup`);
    let {
      data
    } = result;
    const nodeData = processData({
      id,
      content: data.content
    });
    return createNode(nodeData);
  }));
};