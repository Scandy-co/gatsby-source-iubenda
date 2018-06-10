# gatsby-source-iubenda
gatsby source for iubenda legal docs

from scandy-web dir
```
npm install -g @babel/cli
git clone git@github.com:Scandy-co/gatsby-source-iubenda.git ./plugins/gatsby-source-iubenda/
cd plugins/gatsby-source-iubenda/
npm install
npx babel src --out-dir .
cd ../../
```

add to gatsby-config.js
```
{
      resolve: `gatsby-source-iubenda`,
      options: {
        documentIds: [
          `67915116`,
          `21906290`,
      ]
  }
},
```

`gatsby develop`

open http://localhost:8000/___graphql

```
{
  allIubendaDocument {
    edges{
      node{
        id
        title
				content
      }
    }
  }
}```

create a custom slug in your `gatsby-node.js` file using `_.kebabCase` or whatever... `content` goes into `dangerouslySetInnerHtml`
