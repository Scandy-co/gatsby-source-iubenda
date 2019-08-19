const axios = require("axios");
const forEach = require("lodash/forEach");
const crypto = require("crypto");

exports.sourceNodes = async ({ actions, createNodeId }, { documentIds }) => {
  const { createNode } = actions; // Create nodes here, generally by downloading data
  // from a remote API.

  const getTitle = (content, tag = "h1") => {
    let reg = new RegExp(`<${tag}>[^]*<\/${tag}>`);
    // grab the first h1, the doc title...
    let titleWithTags = content.match(reg)[0];
    let titleWithoutTags = titleWithTags.replace(/<\/?[^>]+(>|$)/g, "");
    // remove "of"?
    // titleWithoutTags = titleWithoutTags.replace(' of', '')

    return titleWithoutTags;
  };
  // Helper function that processes a photo to match Gatsby's node structure
  const processData = doc => {
    const nodeId = createNodeId(`iubenda-doc-${doc.id}`);
    const nodeContent = JSON.stringify(doc);
    const nodeContentDigest = crypto
      .createHash("md5")
      .update(nodeContent)
      .digest("hex");

    const nodeData = Object.assign({}, doc, {
      id: nodeId,
      parent: null,
      children: [],
      content: nodeContent,
      internal: {
        type: `IubendaDocument`,
        contentDigest: nodeContentDigest
      }
    });
    return nodeData;
  };
  console.log("Fetching document(s) from iubenda");
  return Promise.all(
    documentIds.map(async id => {
      const privacyPolicy = await axios.get(
        `https://www.iubenda.com/api/privacy-policy/${id}/no-markup`
      );

      const cookiePolicy = await axios.get(
        `https://www.iubenda.com/api/privacy-policy/${id}/cookie-policy/no-markup`
      );

      let {
        data: { content: privacyContent }
      } = privacyPolicy;

      let {
        data: { content: cookieContent }
      } = cookiePolicy;

      const nodeData = processData({
        id,
        privacyPolicy: {
          title: getTitle(privacyContent, "h1"),
          content: privacyContent
        },
        cookiePolicy: {
          title: getTitle(cookieContent, "h2"),
          content: cookieContent
        }
      });
      return createNode(nodeData);
    })
  );
};
