Next.js is the [React framework for the web](https://vercel.com/solutions/nextjs), enabling you to create full-stack web applications. Built on top of React, it powers some of the [largest ecommerce sites](https://vercel.com/customers/industries/ecommerce) in the world, like Walmart, Target, Ebay, Nike, Doordash, and is even used in parts of Amazon.com.

Shopify is a popular ecommerce platform that allows you to easily set up and manage an online store, including features such as inventory management, payment processing, and shipping integrations. It also offers a wide range of customizable themes and a robust API that allows developers to customize the functionality of the store.

Using Next.js with Shopify allows you to take advantage of the best tools for both the frontend application and backend ecommerce platform. This guide will show you how to create a Next.js application using the Shopify GraphQL API.

If you’re looking for a completed template of using Next.js and Shopify, you can explore [Next.js Commerce](https://nextjs.org/commerce). For example, here’s a [demo store](https://demo.vercel.store/) built with Next.js headless and using the Shopify GraphQL API. This powerful demo includes support for React Server Components and the latest features of the Next.js App Router.

## [Shopify Storefront GraphQL API](#shopify-storefront-graphql-api)

Shopify's Storefront GraphQL API allows developers to access and manipulate the data on a Shopify store using GraphQL queries. This allows developers to retrieve data such as products, collections, and customer information, as well as create and update data such as customer addresses and cart information. The Storefront GraphQL API also allows for real-time updates, which means that any changes made to the data will be immediately reflected in the front-end of the store.

Using the Storefront GraphQL API has many benefits, including improved performance and flexibility when building custom ecommerce experiences. With GraphQL, developers only need to request the specific data they need, which reduces the amount of data transferred and improves page load times. This allows for building faster, more responsive and dynamic ecommerce experiences. Additionally, it allows for more flexibility in the design and functionality of the front-end of the store, and can be easily integrated with and tool, like Next.js.

## [Getting started with Shopify](#getting-started-with-shopify)

To get started using Shopify and create your first storefront, you can:

1.  Create a [Shopify partner account](https://accounts.shopify.com/signup). The Shopify Partner Program is free to join and lets you experiment with the Shopify platform through unlimited test stores.
2.  Create a [Shopify development store](https://shopify.dev/apps/tools/development-stores).
3.  Generate a Storefront API access token to authenticate your API requests and start querying the store data using GraphQL.
4.  Create a [new Shopify app](https://shopify.dev/apps/getting-started/create). Check "Allow this app to access your storefront data using using the Storefront API".

After adding some products or other data into your new store, you should now be ready to retrieve this data from the Storefront GraphQL API.

## [Setting up your Next.js application](#setting-up-your-next.js-application)

Now that your store is configured, lets fetch data from Shopify using the GraphQL API. First, let’s clone a new Next.js application, pre-configured with Tailwind CSS for styling.

```
1npx create-next-app@latest --tailwind shopify-nextjs2cd shopify-nextjs
```

Next, add your generated Shopify access token as well as the domain for your store to an `.env.local` file in your newly created application:

```
1SHOPIFY_STOREFRONT_ACCESS_TOKEN='your-token'2SHOPIFY_STORE_DOMAIN='your-store.myshopify.com'
```

Then, you can start your application with `npm install && npm run dev`. Your project should now be running on `http://localhost:3000`.

## [Using the GraphQL API with Next.js](#using-the-graphql-api-with-next.js)

Next.js is designed to integrate with any data source of your choice. Shopify’s GraphQL API allows you to both query and mutate data from inside your store. For example:

```
1export async function shopifyFetch({ query, variables }) {2  const endpoint = process.env.SHOPIFY_STORE_DOMAIN;3  const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;4
5  try {6    const result = await fetch(endpoint, {7      method: 'POST',8      headers: {9        'Content-Type': 'application/json',10        'X-Shopify-Storefront-Access-Token': key11      },12      body: { query, variables } && JSON.stringify({ query, variables })13    });14
15    return {16      status: result.status,17      body: await result.json()18    };19  } catch (error) {20    console.error('Error:', error);21    return {22      status: 500,23      error: 'Error receiving data'24    };25  }26}
```

This code allows you to `fetch` data on the server from your Shopify storefront. The Environment Variables added to `.env.local` earlier are able to be securely used with the `fetch` call. This allows you to use sensitive values you don’t want to commit to git (e.g. `SHOPIFY_STOREFRONT_ACCESS_TOKEN`).

Finally, you can now write GraphQL queries or mutations to fetch your data:

```
1export async function getAllProducts() {2  return shopifyFetch({3    query: `{4        products(sortKey: TITLE, first: 100) {5          edges{6            node {7              id8              title9              description10            }11          }12        }13      }`14  });15}
```

## [Deploying to Vercel](#deploying-to-vercel)

Now that you have your Next.js application fetching data from Shopify, you can easily deploy to Vercel to get your site online. You can either use the Vercel CLI of the git integrations to deploy your code. Let’s use the git integration.

1.  Push your code to your git repository (e.g. GitHub, GitLab, or BitBucket).
2.  [Import your project](https://vercel.com/new) into Vercel.
3.  Vercel will detect that you are using Next.js and will enable the correct settings for your deployment.
4.  Add your Environment Variables from your `.env.local` file during the deployment process.
5.  Your application is now deployed!

## [Summary](#summary)

In summary, by using Next.js and Shopify together, you can benefit from:

*   Next.js provides server-side rendering, automatic code splitting, and other performance enhancements which can improve the speed and user experience of your Shopify store.
*   Next.js allows for easy integration with the Shopify Storefront API, enabling dynamic and personalized experiences for your customers.
*   React, which is used in Next.js, allows for building reusable and maintainable components, making it easier to build and update your store's layout and functionality.
*   Next.js allows for more flexibility and control over the design and development of your store, and can also be easily integrated with other tools and technologies such as Gatsby, or GraphQL.