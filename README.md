# gatsby-source-iubenda
Source plugin for pulling in Iubenda documents at buildtime for Gatsby.

## Install
```npm install gatsby-source-iubenda --save```

## How to use
In your `gatsby-config.js`, add the Iubenda document IDs to option array, where documentId is https://www.iubenda.com/privacy-policy/[DOCUMENT_ID]

```
plugins: [
  {
    resolve: `gatsby-source-iubenda`,
    options: {
        documentIds: [
          `[DOCUMENT_ID]`,
          `[DOCUMENT_ID2]`,
        ]
    }
  }
]
```